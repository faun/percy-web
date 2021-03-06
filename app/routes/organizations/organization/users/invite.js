import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';

// Remove @classic when we can refactor away from mixins
@classic
export default class InviteRoute extends Route.extend(AuthenticatedRouteMixin) {
  model() {
    const organization = this.modelFor('organizations.organization');
    const invites = this.store.query('invite', {organization});

    return hash({
      organization,
      invites,
    });
  }

  setupController(controller, model) {
    controller.setProperties({
      organization: model.organization,
      invites: model.invites,
    });
  }
}
