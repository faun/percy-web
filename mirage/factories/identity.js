import {Factory, trait} from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  uid(i) {
    return `${i}2456`;
  },

  githubIdentity: trait({
    provider: 'github',
  }),

  auth0Identity: trait({
    provider: 'auth0',
  }),

  oktaIdentity: trait({
    provider: `samlp|okta-${faker.lorem.slug()}`,
    uid() {
      return faker.internet.email();
    },
  }),
});
