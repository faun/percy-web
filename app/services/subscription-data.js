/* eslint ember/avoid-leaking-state-in-ember-objects: 0 */
import Service from '@ember/service';

export default Service.extend({
  PLAN_IDS: ['free', 'v3-small', 'v3-medium', 'v3-large'],
  UPGRADEABLE_PLAN_IDS: [
    'free',
    'v2-medium-trial',
    'v3-small',
    'v3-medium',
    'v3-large',
    'v2a-small',
    'v2a-medium',
    'v2a-large',
    'v2-small',
    'v2-medium',
    'v2-large',
    'v1-small',
    'v1-medium',
    'v1-pro',
    'medium',
    'large',
  ],
  PLANS: [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      numDiffs: 5000,
      numTeamMembersTitle: '10 team members',
      historyLimitTitle: '30 day history',
    },
    {
      id: 'v3-small',
      name: 'Essential',
      monthlyPrice: 29,
      numDiffs: 10000,
      extraDiffPrice: 0.006,
      numTeamMembersTitle: '10 team members',
      historyLimitTitle: '1 year history',
    },
    {
      id: 'v3-medium',
      name: 'Professional',
      monthlyPrice: 349,
      numDiffs: 80000,
      extraDiffPrice: 0.006,
      numTeamMembersTitle: '15 team members',
      historyLimitTitle: '1 year history',
    },
    {
      id: 'v3-large',
      name: 'Business',
      monthlyPrice: 849,
      numDiffs: 200000,
      extraDiffPrice: 0.006,
      numTeamMembersTitle: '20 team members',
      historyLimitTitle: '1 year history',
    },
  ],
});
