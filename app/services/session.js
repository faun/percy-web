import {inject as service} from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';
import {resolve, reject} from 'rsvp';
import {Promise as EmberPromise} from 'rsvp';
import localStorageProxy from 'percy-web/lib/localstorage';
import utils from 'percy-web/lib/utils';
import AdminMode from 'percy-web/lib/admin-mode';
import {get, set} from '@ember/object';

export default class _SessionService extends SessionService {
  @service
  store;

  @service
  analytics;

  @service
  raven;

  @service
  launchDarkly;

  @service
  websocket;

  // set by load method
  currentUser = null;

  async loadCurrentUser() {
    if (this.isAuthenticated) {
      return await this._loadAndSetCurrentUser();
    } else {
      return this._trySilentAuth();
    }
  }

  async _trySilentAuth() {
    // If we are not authenticated according to the FE, we try to fetch the user from the API.
    // If we find one, but the ember-simple-auth session is not informed,
    // silently authenticate the user so we're all the way logged in.
    try {
      // Get the user from the API
      const user = await this.forceReloadUser();
      // If there is a user but we're not authenticated, try silent auth
      if (user && !this.isAuthenticated) {
        try {
          return await this.authenticate('authenticator:auth0-silent-auth');
        } catch (e) {
          this.raven.captureException(e, {tags: {auth: true}});

          // If there's a problem with silent auth, log us all the way out.
          this.invalidateAndLogout();
        }
      }
    } catch (e) {
      this.raven.captureException(e, {tags: {auth: true}});

      // If there's a problem with getting the user (most likely a 403
      // if there is no logged in user) return a resolved promise.
      // This needs to return a resolved promise because beforeModel in
      // ember-simple-auth application route mixin needs a resolved promise.
      return resolve();
    }
  }

  async _loadAndSetCurrentUser() {
    return (
      this.forceReloadUser()
        .then(async user => {
          set(this, 'currentUser', user);
          await this._setupThirdPartyUserContexts(user);
        })
        // This catch will be triggered if the queryRecord or set currentUser
        // fails. If we don't have a user, the site will be very broken
        // so kick them out.
        .catch(e => {
          this.raven.captureException(e, {tags: {auth: true}});

          this.invalidateAndLogout();
          reject(e);
        })
    );
  }

  invalidateAndLogout() {
    this.invalidate().then(() => {
      this._clearThirdPartyUserContext();
      utils.replaceWindowLocation('/api/auth/logout');
    });
  }

  async forceReloadUser({include = ''} = {}) {
    if (include) {
      // If there are includes, use the include param
      return await this.store.queryRecord('user', {include});
    } else {
      // If there are no includes specified, do not send any include param.
      // The empty include param dangles and makes mirage sad.
      return await this.store.queryRecord('user', {});
    }
  }

  _setupThirdPartyUserContexts(user) {
    if (!user) {
      return;
    }
    // Always resolve this successfully, even if it errors.
    // The user should be able to access the site even if third party services fail.
    return new EmberPromise(async (resolve /*reject*/) => {
      try {
        this._setupSentry(user);
        this._setupAnalytics(user);
        this._setupIntercom(user);
        await this._setupLaunchDarkly(user);
        return resolve();
      } catch (e) {
        this.raven.captureException(e, {tags: {auth: true}});

        return resolve();
      }
    });
  }

  _clearThirdPartyUserContext() {
    this._clearSentry();
    this._clearAnalytics();
    this._clearIntercom();
    this._clearWebsockets();
    AdminMode.clear();
  }

  _setupSentry(user) {
    if (get(this, 'raven.isRavenUsable')) {
      this.raven.callRaven('setUserContext', {id: user.get('id')});
    }
  }

  _clearSentry() {
    if (get(this, 'raven.isRavenUsable')) {
      this.raven.callRaven('setUserContext');
    }
  }

  _setupAnalytics(user) {
    this.analytics.identifyUser(user);
  }

  _clearAnalytics() {
    this.analytics.invalidate();
    localStorageProxy.removeKeysWithString('amplitude');
  }

  _clearWebsockets() {
    this.websocket.disconnect();
  }

  _setupIntercom(user) {
    if (window.Intercom) {
      window.Intercom('update', {
        user_id: user.get('id'),
        user_hash: user.get('userHash'),
        name: user.get('name'),
        email: user.get('email'),
        created_at: user.get('createdAt').getTime() / 1000,
      });
    }
  }

  _clearIntercom() {
    if (window.Intercom) {
      window.Intercom('shutdown');
    }
    localStorageProxy.removeKeysWithString('intercom');
  }

  async _setupLaunchDarkly(user) {
    const organizations = await user.get('organizations');
    const launchDarklyUser = {
      key: user.get('userHash'),
      name: user.get('name'),
      custom: {
        organizations: organizations.mapBy('id'),
      },
    };
    return this.launchDarkly.identify(launchDarklyUser);
  }
}
