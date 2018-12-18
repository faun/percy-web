import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make, makeList} from 'ember-data-factory-guy';
import ProjectContainer from 'percy-web/tests/pages/components/project-container';
import sinon from 'sinon';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {merge} from '@ember/polyfills';
import {selectChoose} from 'ember-power-select/test-support/helpers';

const INFINITY_MODEL_STUB = {
  reachedInfinity: true,
  on: () => {},
  off: () => {},
};

describe('Integration: ProjectContainer', function() {
  setupRenderingTest('project-container', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    ProjectContainer.setContext(this);
  });

  describe('without a repo', function() {
    beforeEach(async function() {
      const project = make('project');
      const builds = makeList('build', 1, {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows no logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(project.get('isRepoConnected')).to.equal(false);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with an empty repo source', function() {
    beforeEach(async function() {
      const project = make('project', 'withRepo');
      const builds = makeList('build', 1, 'withRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows no logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(false);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a github repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubRepo');
      const builds = makeList('build', 1, 'withGithubRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(true);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(true);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        true,
      );
      expect(
        ProjectContainer.repoLinked.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(false);
    });
  });

  describe('with a github enterprise repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubEnterpriseRepo');
      const builds = makeList('build', 1, 'withGithubEnterpriseRepo', 'hasPullRequest', {
        buildNumber: 1,
      });
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(true);
      expect(project.get('isGithubRepoFamily')).to.equal(true);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(
        ProjectContainer.repoLinked.githubLogo.isVisible,
        'github logo is not visible',
      ).to.equal(true);
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a gitlab repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGitlabRepo');
      const builds = makeList('build', 1, 'withGitlabRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the gitlab logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(false);
      expect(project.get('isGitlabRepo')).to.equal(true);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(
        ProjectContainer.repoLinked.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(true);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
    });
  });

  describe('when user is not member of org', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubRepo');
      const builds = makeList('build', 1);
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        toggleSidebar=stub
        isUserMember=false
      }}`);
    });

    it('displays notice that build is public', async function() {
      expect(ProjectContainer.isPublicProjectNoticeVisible).to.equal(true);
      await percySnapshot(this.test);
    });
  });

  describe('when a project is public', function() {
    beforeEach(function() {
      const project = make('project', 'public');
      const builds = makeList('build', 1);
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const stub = sinon.stub();
      this.setProperties({
        project,
        stub,
        infinityBuilds,
      });
    });

    it('shows public globe icon in header', async function() {
      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        toggleSidebar=stub
      }}`);

      expect(ProjectContainer.isPublicProjectIconVisible).to.equal(true);
    });
  });

  describe('branch filter with github repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubRepo');
      const branch1Builds = makeList('build', 4, 'finished', {branch: 'branch-1'});
      const branch2Builds = makeList('build', 5, 'finished', {branch: 'branch-2'});
      const branch3Builds = makeList('build', 6, 'finished', {branch: 'branch-3'});
      const allBuilds = branch1Builds.concat(branch2Builds).concat(branch3Builds);
      const infinityBuilds = merge(allBuilds, INFINITY_MODEL_STUB);
      infinityBuilds.reachedInfinity = false;
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, isSidebarVisible, toggleSidebar, stub});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('filters branches by selected branch', async function() {
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(true);

      await selectChoose('', 'branch-1');
      await percySnapshot(this.test);
      expect(ProjectContainer.builds().count).to.equal(4);
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(false);

      await selectChoose('', 'All branches');
      expect(ProjectContainer.builds().count).to.equal(15);
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(true);
    });
  });

  describe('branch filter without github repo', function() {
    beforeEach(async function() {
      const project = make('project');
      const branch1Builds = makeList('build', 4, 'finished', {branch: 'branch-1'});
      const branch2Builds = makeList('build', 5, 'finished', {branch: 'branch-2'});
      const branch3Builds = makeList('build', 6, 'finished', {branch: 'branch-3'});
      const allBuilds = branch1Builds.concat(branch2Builds).concat(branch3Builds);
      const infinityBuilds = merge(allBuilds, INFINITY_MODEL_STUB);
      infinityBuilds.reachedInfinity = false;
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, isSidebarVisible, toggleSidebar, stub});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('filters branches by selected branch', async function() {
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(true);

      await selectChoose('', 'branch-1');
      await percySnapshot(this.test);
      expect(ProjectContainer.builds().count).to.equal(4);
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(false);

      await selectChoose('', 'All branches');
      expect(ProjectContainer.builds().count).to.equal(15);
      expect(ProjectContainer.infinityLoader.isPresent).to.equal(true);
    });
  });

  describe('branch filter on a project with only 1 branch', function() {
    beforeEach(async function() {
      const project = make('project');
      const branch1Builds = makeList('build', 4, 'finished', {branch: 'branch-1'});
      const infinityBuilds = merge(branch1Builds, INFINITY_MODEL_STUB);
      infinityBuilds.reachedInfinity = true;
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, isSidebarVisible, toggleSidebar, stub});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('does not show the branch filter', async function() {
      expect(ProjectContainer.isBranchSelectorVisible).to.equal(false);
      await percySnapshot(this.test);
    });
  });
});
