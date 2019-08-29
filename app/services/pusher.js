import Service, {inject as service} from '@ember/service';
import {alias} from '@ember/object/computed';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import config from '../config/environment';
import utils from 'percy-web/lib/utils';
import Pusher from 'pusher-js';

export default Service.extend({
  store: service(),
  session: service(),
  currentUser: alias('session.currentUser'),
  flashMessages: service(),

  subscribeToUser(user) {
    if (this.hasSubscribedToUser) {
      return;
    }

    this.subscribe(`private-user-${user.id}`, 'userNotification', notification => {
      run.scheduleOnce('afterRender', this, this._flashNotify, notification);
    });
    this.subscribe('everyone', 'objectUpdated', data => {
      run.scheduleOnce('afterRender', this, this._pushPayload, data);
    });

    this.set('hasSubscribedToUser', true);
  },

  subscribeToOrganization(organization) {
    this.subscribe(`private-organization-${organization.id}`, 'objectUpdated', data => {
      return run.scheduleOnce('afterRender', this, this._pushPayload, data);
    });
  },

  subscribe(channelName, event, callback) {
    const channel = this._client.subscribe(channelName);
    channel.bind(event, callback);
  },

  _pushPayload(data) {
    this.store.pushPayload(data);
  },

  _flashNotify(notification) {
    this.flashMessages.info(notification.message);
  },

  _client: computed({
    get() {
      const cookieValue = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
      const csrfToken = decodeURIComponent(cookieValue[1]);
      return new Pusher(config.PUSHER_APP_KEY, {
        cluster: config.PUSHER_APP_CLUSTER,
        authEndpoint: utils.buildApiUrl('websocketsAuth'),
        auth: {
          headers: {'X-CSRF-Token': csrfToken},
        },
      });
    },
    set(key, value) {
      //TODO: assert only in tests
      return value;
    },
  }),
});
