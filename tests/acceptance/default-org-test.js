import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import localStorageProxy from 'percy-web/lib/localstorage';
import SetupLocalStorageSandbox from 'percy-web/tests/helpers/setup-localstorage-sandbox';
import {visit, currentRouteName, currentURL} from '@ember/test-helpers';

describe('Acceptance: Default org', function () {
  describe('when user is not logged in', function () {
    setupAcceptance({authenticate: false});

    setupSession(function () {
      stubLockModal(this.owner);
      this.loginUser = false;
    });

    it('redirects to login', async function () {
      await visit('/default-org');
      expect(currentRouteName()).to.equal('login');
    });
  });

  describe('when user is logged in', function () {
    setupAcceptance();
    SetupLocalStorageSandbox();

    describe('when user has organizations without projects', function () {
      let organization;
      let otherOrganization;

      setupSession(function (server) {
        const user = server.create('user');
        organization = server.create('organization');
        otherOrganization = server.create('organization');
        server.create('organizationUser', {organization, user});
        server.create('organizationUser', {organization: otherOrganization, user});
      });

      it('redirects to new project screen', async function () {
        localStorageProxy.set('lastOrganizationSlug', otherOrganization.slug);
        await visit('/default-org');
        expect(currentRouteName()).to.equal('organizations.organization.projects.new');
        expect(currentURL()).to.include(organization.slug);
      });
    });

    describe('when user has organizations with projects', function () {
      let organization;
      let otherOrganization;

      setupSession(function (server) {
        const user = server.create('user');
        organization = server.create('organization');
        otherOrganization = server.create('organization');
        server.create('project', {organization});
        server.create('organizationUser', {organization, user});
        server.create('organizationUser', {organization: otherOrganization, user});
      });

      it('redirects to org project listing', async function () {
        localStorageProxy.set('lastOrganizationSlug', otherOrganization.slug);
        await visit('/default-org');
        expect(currentRouteName()).to.equal('organization.index');
        expect(currentURL()).to.include(organization.slug);
      });
    });

    describe('when user does not have organizations', function () {
      setupSession(function (server) {
        server.create('user');
      });

      it('redirects to organizations.new', async function () {
        await visit('/default-org');
        expect(currentRouteName()).to.equal('organizations.new');
      });
    });
  });
});
