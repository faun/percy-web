import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';
import utils from 'percy-web/lib/utils';
import {ALL_PROJECTS_ID} from 'percy-web/models/slack-integration-config';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  flashMessages: service(),

  model(params) {
    const organization = this.modelFor('organizations.organization');
    const slackIntegration = this.store.peekRecord('slackIntegration', params.slack_integration_id);

    let slackIntegrationConfig;
    if (params.slack_integration_config_id == 'new') {
      slackIntegrationConfig = this.store.createRecord('slackIntegrationConfig', {
        slackIntegration: slackIntegration,
        projectId: ALL_PROJECTS_ID,
        notificationTypes: ['finished_unreviewed_snapshots'], // set defaults
      });
    } else {
      slackIntegrationConfig = this.store.peekRecord(
        'slackIntegrationConfig',
        params.slack_integration_config_id,
      );
    }

    return hash({
      organization,
      slackIntegrationConfig,
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      organization: model.organization,
      isAdmin: model.organization.currentUserIsAdmin,
      slackIntegrationConfig: model.slackIntegrationConfig,
    });
  },

  actions: {
    deleteSlackIntegrationConfig(slackIntegrationConfig) {
      const slackIntegration = slackIntegrationConfig.get('slackIntegration');
      const confirmationMessage = `Are you sure you want remove this project from your ${
        slackIntegration.channelName
      } Slack integration?`;
      if (!utils.confirmMessage(confirmationMessage)) {
        return;
      }
      slackIntegrationConfig
        .destroyRecord()
        .then(() => {
          this.get('flashMessages').success(
            `Successfully removed project configuration from your ${
              slackIntegration.channelName
            } Slack integration`,
          );
          this.transitionTo(
            'organizations.organization.integrations.slack',
            slackIntegration.get('organization.slug'),
          );
        })
        .catch(() => {
          this.get('flashMessages').danger(
            'There was a problem deleting this integration.' +
              ' Please try again or contact customer support.',
          );
        });
    },
  },
});