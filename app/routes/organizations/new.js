import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';
import {hash} from 'rsvp';
import {computed} from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),
  launchDarkly: service(),
  queryParams: {
    githubMarketplacePlanId: {as: 'marketplace_listing_plan_id', replace: true},
  },

  model() {
    const organization = this.store.createRecord('organization', {
      billingProvider: this.get('_billingProvider'),
      billingProviderData: this.get('_billingProviderData'),
    });
    const identities = this.get('session.currentUser.identities');
    const organizationsForUser = this.store.query('organization', {
      user: this.get('session.currentUser'),
    });
    return hash({
      organization,
      organizationsForUser,
      identities,
    });
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      newOrganization: resolvedModel.organization,
      organizationsForUser: resolvedModel.organizationsForUser,
      identities: resolvedModel.identities,
    });
  },

  githubMarketplacePlanId: null,

  _billingProvider: computed('marketplaceListingPlanId', function() {
    let marketplaceListingPlanId = this.get('marketplaceListingPlanId');
    if (marketplaceListingPlanId) {
      return 'github_marketplace';
    }
  }),

  _billingProviderData: computed('marketplaceListingPlanId', function() {
    let marketplaceListingPlanId = this.get('marketplaceListingPlanId');
    if (marketplaceListingPlanId) {
      return JSON.stringify({
        marketplace_listing_plan_id: parseInt(marketplaceListingPlanId),
      });
    }
  }),

  actions: {
    organizationCreated(organization, options) {
      const {isDemoRequest} = options;
      const orgSlug = organization.get('slug');
      const isNewDemoFeatureOn = this.get('launchDarkly').variation('new-demo-project');
      if (isDemoRequest && isNewDemoFeatureOn) {
        this.transitionTo('organizations.organization.projects.new-demo', orgSlug);
      } else {
        this.transitionTo('organizations.organization.index', orgSlug);
      }
    },
  },
});
