import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import BaseFormComponent from 'percy-web/components/forms/base';
import UsageNotificationSettingsValidations from '../../validations/usage-notification-settings';

export default BaseFormComponent.extend({
  _setting: readOnly('setting'),

  model: computed('_setting', function () {
    if (this._setting) {
      return this._setting;
    } else {
      return this.store.createRecord('usageNotificationSetting', {
        organization: this.organization,
        isEnabled: false,
      });
    }
  }),

  actions: {
    customSave() {
      const changeset = this.changeset;
      changeset.set('emails', changeset.get('displayEmails'));
      changeset.set('thresholds', {'snapshot-count': changeset.get('displayThresholds')});
      this.send('save');
    },
  },
  validator: UsageNotificationSettingsValidations,
});
