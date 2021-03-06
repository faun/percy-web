import {computed} from '@ember/object';
import BaseFormComponent from './base';
import {inject as service} from '@ember/service';

export default BaseFormComponent.extend({
  organization: null,
  classes: null,
  router: service(),
  store: service(),

  classNames: ['FormsOrganizationInvite', 'Form'],
  classNameBindings: ['classes'],

  // Due to how invites work, we need to reset the model manually after each submission so
  // that we don't get stuck trying to update an old model (which is just a dumb response wrapper).
  newModel() {
    return this.store.createRecord('invite', {
      emails: '',
      role: null,
      organization: this.organization,
    });
  },
  model: computed('organization', 'store', function () {
    return this.newModel();
  }),
  validator: null,
  actions: {
    resetSaveButton() {
      this.set('isSaveSuccessful', null);
    },
    saving(promise) {
      this._super(...arguments);

      this.set('errorMessage', null);
      promise.then(
        () => {
          this.store.query('invite', {organization: this.organization});
          this.router.transitionTo(
            'organizations.organization.users',
            this.get('organization.slug'),
          );
        },
        errors => {
          this.set('errorMessage', errors.errors[0].detail);
        },
      );
    },
  },
});
