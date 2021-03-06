import RepoSelector from 'percy-web/tests/pages/components/repo-selector';
import {setupRenderingTest} from 'ember-mocha';
import {it, describe, beforeEach} from 'mocha';
import {make, makeList} from 'ember-data-factory-guy';
import percySnapshot from '@percy/ember';
import {clickTrigger} from 'ember-power-select/test-support/helpers';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import repoRefreshServiceStub from 'percy-web/tests/helpers/mock-repo-refresh-service';
import moment from 'moment';
import {render} from '@ember/test-helpers';

describe('Integration: RepoSelectorComponent', function () {
  setupRenderingTest('repo-selector', {
    integration: true,
  });

  beforeEach(async function () {
    setupFactoryGuy(this);
  });

  // Something about ember-power-select is not tearing down the component correctly if it is
  // still open when the test ends. Addding `clickTrigger` to the end of each test seems to fix
  // this problem.

  describe('with a github integration', function () {
    beforeEach(async function () {
      const project = make('project');
      const organization = make('organization', 'withGithubIntegration', 'withGithubRepos');
      project.set('organization', organization);

      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      await render(hbs`<RepoSelector @project={{project}} />`);
    });

    it('renders powerselect closed', async function () {
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(false);

      await percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', async function () {
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.groups.objectAt(0).name).to.eq('GitHub');

      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab integration', function () {
    beforeEach(async function () {
      const project = make('project');
      const organization = make('organization', 'withGitlabIntegration', 'withGitlabRepos');
      project.set('organization', organization);

      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      await render(hbs`<RepoSelector @project={{project}} />`);
    });

    it('renders powerselect closed', async function () {
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(false);

      await percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', async function () {
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.groups.objectAt(0).name).to.eq('GitLab');

      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab self-hosted integration', function () {
    beforeEach(async function () {
      const project = make('project');
      const organization = make(
        'organization',
        'withGitlabSelfHostedIntegration',
        'withGitlabSelfHostedRepos',
      );
      project.set('organization', organization);

      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      await render(hbs`<RepoSelector @project={{project}} />`);
    });

    it('renders powerselect closed', async function () {
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(false);

      await percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', async function () {
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.groups.objectAt(0).name).to.eq('GitLab Self-Managed');

      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a github enterprise integration', function () {
    beforeEach(async function () {
      const project = make('project');
      const organization = make(
        'organization',
        'withGithubEnterpriseIntegration',
        'withGithubEnterpriseRepos',
      );
      project.set('organization', organization);
      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      await render(hbs`<RepoSelector @project={{project}} />`);
    });

    it('renders powerselect closed', async function () {
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(false);

      await percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', async function () {
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.groups.objectAt(0).name).to.eq('GitHub Enterprise');

      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with multiple integrations', function () {
    beforeEach(async function () {
      const project = make('project');
      const organization = make('organization', 'withMultipleIntegrations');
      project.set('organization', organization);
      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      await render(hbs`<RepoSelector @project={{project}} />`);
    });

    it('renders powerselect closed', async function () {
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(false);

      await percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', async function () {
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.groups.objectAt(0).name).to.eq('GitHub');
      expect(RepoSelector.dropdown.groups.objectAt(1).name).to.eq('GitLab');
      expect(RepoSelector.dropdown.groups.objectAt(2).name).to.eq('GitLab Self-Managed');
      expect(RepoSelector.dropdown.groups.objectAt(3).name).to.eq('GitHub Enterprise');
      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with stale repos', function () {
    let project;
    let organization;
    let oldRepos;
    let oldUpdatedAt;
    beforeEach(async function () {
      project = make('project');
      organization = make('organization', 'withMultipleIntegrations', 'withStaleRepoData');

      project.set('organization', organization);
      this.setProperties({project});
    });

    it('shows that the repos are out of date', async function () {
      oldRepos = organization.get('repos');
      oldUpdatedAt = organization.get('lastSyncedAt');
      repoRefreshServiceStub(this, oldRepos, oldUpdatedAt);
      await render(hbs`<RepoSelector @project={{project}} />`);
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.repoFreshness.message).to.eq('Last updated: 20 minutes ago');
      await percySnapshot(this.test.fullTitle());
    });

    it('refreshes the repo collection', async function () {
      const expectedRepoCount = 10;
      const newRepos = makeList('repo', expectedRepoCount, 'githubEnterprise');
      const newUpdatedAt = moment().subtract(1, 'minutes');
      repoRefreshServiceStub(this, newRepos, newUpdatedAt);
      await render(hbs`<RepoSelector @project={{project}} />`);
      await clickTrigger();
      expect(RepoSelector.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoSelector.dropdown.options.count).to.eq(expectedRepoCount);
      expect(RepoSelector.repoFreshness.message).to.eq('Last updated: a minute ago');
      await percySnapshot(this.test.fullTitle());
    });
  });
});
