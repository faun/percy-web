/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import percySnapshot from 'percy-web/tests/helpers/percy-snapshot';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {resolve, defer} from 'rsvp';
import SnapshotApprovalButton from 'percy-web/tests/pages/components/snapshot-approval-button';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {render} from '@ember/test-helpers';
import stubService from 'percy-web/tests/helpers/stub-service-integration';

describe('Integration: SnapshotApprovalButton', function () {
  setupRenderingTest('snapshot-approval-button', {
    integration: true,
  });

  function stubCreateReview(context, stub) {
    const service = context.owner.lookup('service:reviews');
    service.set('createReview', {perform: stub});
  }

  let snapshot;
  let createReviewStub;

  beforeEach(function () {
    setupFactoryGuy(this);
    createReviewStub = sinon.stub().returns(resolve('resolve'));
    stubService(this, 'reviews', 'reviews', {
      createReview: {perform: createReviewStub},
    });

    snapshot = make('snapshot', 'withTwoBrowsers');
    const activeBrowser = make('browser');
    const hasDiffsInBrowser = true;
    this.setProperties({snapshot, activeBrowser, hasDiffsInBrowser});
  });

  //eslint-disable-next-line
  it('displays correctly when snapshot is not approved and has diffs in active browser', async function() {
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @activeBrowser={{activeBrowser}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);
    await percySnapshot(this.test, {darkMode: true});
  });

  //eslint-disable-next-line
  it('displays correctly when snapshot is not approved does not have diffs in active browser ', async function() {
    this.set('hasDiffsInBrowser', false);
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @activeBrowser={{activeBrowser}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);

    await percySnapshot(this.test, {darkMode: true});
  });

  it('displays correctly when snapshot is approved', async function () {
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @activeBrowser={{activeBrowser}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);
    this.set('snapshot.reviewState', 'approved');
    await percySnapshot(this.test, {darkMode: true});
  });

  it('calls createReview with correct args when clicked', async function () {
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);
    await SnapshotApprovalButton.clickButton();

    expect(createReviewStub).to.have.been.calledWith({
      snapshots: [snapshot],
      build: snapshot.build,
    });
  });

  it('displays correctly when in loading state ', async function () {
    const deferred = defer();
    const createReviewStub = sinon.stub().returns(deferred.promise);
    stubCreateReview(this, createReviewStub);
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);
    await SnapshotApprovalButton.clickButton();

    await percySnapshot(this.test, {darkMode: true});
  });

  it('is enabled when isDisabled is false', async function () {
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @activeBrowser={{activeBrowser}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
      @isDisabled={{false}}
    />`);
    expect(SnapshotApprovalButton.isDisabled).to.equal(false);
    await SnapshotApprovalButton.clickButton();
    expect(createReviewStub).to.have.been.calledWith({
      snapshots: [snapshot],
      build: snapshot.build,
    });
  });

  it('is disabled when isDisabled is true', async function () {
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @activeBrowser={{activeBrowser}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
      @isDisabled={{true}}
    />`);
    expect(SnapshotApprovalButton.isDisabled).to.equal(true);
    await SnapshotApprovalButton.clickButton();
    expect(createReviewStub).to.not.have.been.called;
  });

  it('shows approvalBadge when createReview returns true', async function () {
    this.set('createReview', sinon.stub().returns(resolve(true)));
    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);

    await SnapshotApprovalButton.clickButton();
    expect(SnapshotApprovalButton.isApproved).to.equal(true);
  });

  it('does not show approval badge when createReview returns false', async function () {
    const createReviewStub = sinon.stub().returns(resolve(false));
    stubCreateReview(this, createReviewStub);

    await render(hbs`<SnapshotApprovalButton
      @snapshot={{snapshot}}
      @hasDiffsInBrowser={{hasDiffsInBrowser}}
    />`);
    await SnapshotApprovalButton.clickButton();
    expect(SnapshotApprovalButton.isApproved).to.equal(false);
  });
});
