import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import UsageNotificationSettingForm from 'percy-web/tests/pages/components/forms/usage-notification-setting'; // eslint-disable-line
import BillingSection from 'percy-web/tests/pages/components/organizations/billing-section';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {percySnapshot} from 'ember-percy';

describe('Integration: BillingSection', function() {
  setupRenderingTest('billing-section', {
    integration: true,
  });

  let organization;

  beforeEach(function() {
    setupFactoryGuy(this);
    BillingSection.setContext(this);
  });

  describe('when currentUser is an Admin', function() {
    beforeEach(async function() {
      organization = make('organization', 'withPaidPlan');
      this.set('organization', organization);

      // To prevent an API call and setup for admin tests:
      organization.set('currentUserIsAdmin', true);
    });

    it('renders the admin view', async function() {
      await this.render(hbs`{{organizations/billing-section
        organization=organization}}`);

      expect(BillingSection.memberView.isVisible).to.equal(false);
      expect(BillingSection.adminView.isVisible).to.equal(true);

      await percySnapshot(this.test);
    });

    describe('billing card updater', function() {
      it('does not display card updater when plan is free', async function() {
        organization.set('subscription', make('subscription', 'withFreePlan'));
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.billingCardUpdater.isCardUpdaterVisible).to.equal(false);
      });

      it('does not display card updater when plan is trial', async function() {
        organization.set('subscription', make('subscription', 'withTrialPlan'));
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.billingCardUpdater.isCardUpdaterVisible).to.equal(false);
      });

      it('does not display card updater when plan is sponsored', async function() {
        organization.set('subscription', make('subscription', 'withSponsoredPlan'));
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.billingCardUpdater.isCardUpdaterVisible).to.equal(false);
      });

      it('displays card updater when plan is not free or trial', async function() {
        organization.set('subscription', make('subscription', 'withPaidPlan'));
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.billingCardUpdater.isCardUpdaterVisible).to.equal(true);
      });
    });

    describe('shouldDisplayUsageStatus', function() {
      async function _expectDoesNotDisplayWithPlan(context, orgTraits) {
        const organization = make(...['organization'].concat(orgTraits));
        // To prevent an API call and setup for admin tests:
        organization.set('currentUserIsAdmin', true);

        context.set('organization', organization);
        await context.render(hbs`{{organizations/billing-section
          organization=organization}}`);
        expect(BillingSection.isUsageStatsVisible).to.equal(false);
      }

      it('does not display when billing is locked', async function() {
        await _expectDoesNotDisplayWithPlan(this, ['withGithubMarketplacePlan']);
      });

      it('does not display when subscription is custom with no amount', async function() {
        await _expectDoesNotDisplayWithPlan(this, ['withEnterprisePlan']);
      });

      it('does not display when subscription is trial', async function() {
        await _expectDoesNotDisplayWithPlan(this, ['withTrialPlan']);
      });

      it('does not display when subscription is free', async function() {
        await _expectDoesNotDisplayWithPlan(this, ['withFreePlan']);
      });

      it('does display when subscription is paid and not locked', async function() {
        const organization = make('organization', 'withPaidPlan');
        organization.set('currentUserIsAdmin', true);
        this.set('organization', organization);
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.isUsageStatsVisible).to.equal(true);
      });

      it('does display when subscription is custom with amount', async function() {
        const organization = make('organization', 'withLegacyPlan');
        organization.set('currentUserIsAdmin', true);
        this.set('organization', organization);
        await this.render(hbs`{{organizations/billing-section
          organization=organization}}`);

        expect(BillingSection.isUsageStatsVisible).to.equal(true);
      });
    });
  });

  describe('when currentUser is a Member', function() {
    beforeEach(async function() {
      organization = make('organization', 'withPaidPlan');
      this.set('organization', organization);

      // To prevent an API call and setup for non-admin tests:
      organization.set('currentUserIsAdmin', false);
    });

    it('renders the member view', async function() {
      await this.render(hbs`{{organizations/billing-section
        organization=organization
       }}`);

      expect(BillingSection.memberView.isVisible).to.equal(true);
      expect(BillingSection.adminView.isVisible).to.equal(false);

      await percySnapshot(this.test);
    });
  });
});
