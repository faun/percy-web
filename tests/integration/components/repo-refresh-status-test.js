import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import {getRootElement, render} from '@ember/test-helpers';

describe('Integration: RepoRefreshStatus', function () {
  setupRenderingTest('repo-refresh-status', {
    integration: true,
  });

  it('renders correctly when the repo is refreshing', async function () {
    this.set('isRepoRefreshInProgress', true);

    await render(hbs`<RepoRefreshStatus @isRepoRefreshInProgress={{isRepoRefreshInProgress}} />`);
    expect(getRootElement().innerText).to.include('Checking repo status...');
  });

  it('renders correctly without a date', async function () {
    this.set('isRepoRefreshInProgress', false);

    await render(hbs`<RepoRefreshStatus @isRepoRefreshInProgress={{isRepoRefreshInProgress}} />`);
    expect(getRootElement().innerText).to.include('Never updated');
  });

  it('renders correctly with a date', async function () {
    const twoMinutesAgo = moment().subtract('2', 'minutes');
    this.set('lastSyncedAt', twoMinutesAgo);
    await render(hbs`<RepoRefreshStatus @lastSyncedAt={{lastSyncedAt}} />`);
    expect(getRootElement().innerText).to.include('Last updated: 2 minutes ago');
  });
});
