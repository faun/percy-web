import {computed} from '@ember/object';
import {alias, bool, and, equal, not, or, gt} from '@ember/object/computed';
import DS from 'ember-data';
import moment from 'moment';
import {countDiffsWithSnapshotsPerBrowser} from 'percy-web/lib/filtered-comparisons';

export const BUILD_APPROVED_STATE = 'approved';
export const BUILD_UNREVIEWED_STATE = 'unreviewed';
export const BUILD_REJECTED_STATE = 'changes_requested';

export const BUILD_REVIEW_STATE_REASONS = {
  UNREVIEWED: 'unreviewed_snapshots',
  ALL_SNAPSHOTS_APPROVED: 'all_snapshots_approved',
  ALL_SNAPSHOTS_APPROVED_PREVIOUSLY: 'all_snapshots_approved_previously',
  NO_DIFFS: 'no_diffs',
  AUTO_APPROVED_BRANCH: 'auto_approved_branch',
  SNAPSHOT_REJECTED: 'changes_requested_snapshot',
  SNAPSHOT_REJECTED_PREVIOUSLY: 'changes_requested_snapshot_previously',
};

export const BUILD_STATES = {
  FINISHED: 'finished',
  PENDING: 'pending',
  PROCESSING: 'processing',
  FAILED: 'failed',
  EXPIRED: 'expired',
};

export const INFINITY_SCROLL_LIMIT = 50;

const APPROVED_LABEL = 'Approved';
const AUTO_APPROVED_BRANCH_LABEL = 'Auto-approved';
const EXPIRED_LABEL = 'Expired';
const FAILED_LABEL = 'Failed';
const NO_DIFFS_LABEL = 'No changes';
const PENDING_LABEL = 'Receiving';
const PROCESSING_LABEL = 'Processing';
const UNREVIEWED_LABEL = 'Unreviewed';
const REJECTED_LABEL = 'Changes requested';

export default DS.Model.extend({
  project: DS.belongsTo('project', {async: false}),
  repo: DS.belongsTo('repo', {async: false}),
  partial: DS.attr('boolean'),

  // Check isRepoLinked before accessing repo.
  isRepoLinked: bool('repo'),

  isPullRequestPresent: and('isRepoLinked', 'isPullRequest'),
  repoSource: alias('repo.source'),
  isGithubRepo: alias('repo.isGithubRepo'),
  isGithubRepoFamily: alias('repo.isGithubRepoFamily'),
  isGithubEnterpriseRepo: alias('repo.isGithubEnterpriseRepo'),
  isGitlabRepo: alias('repo.isGitlabRepo'),

  buildNumber: DS.attr('number'),
  buildTitle: computed('buildNumber', function() {
    return `Build #${this.buildNumber}`;
  }),
  branch: DS.attr(),
  browsers: DS.hasMany('browser', {async: false}),
  hasMultipleBrowsers: gt('browsers.length', 1),

  removedSnapshots: DS.hasMany('snapshot', {async: true, inverse: null}),

  // Processing state.
  state: DS.attr(),
  isPending: equal('state', BUILD_STATES.PENDING),
  isProcessing: equal('state', BUILD_STATES.PROCESSING),
  isFinished: equal('state', BUILD_STATES.FINISHED),
  isFailed: equal('state', BUILD_STATES.FAILED),
  isExpired: equal('state', BUILD_STATES.EXPIRED),
  failureReason: DS.attr(),
  failureReasonHumanized: computed('failureReason', function() {
    let failureReason = this.failureReason;
    if (failureReason === 'missing_resources') {
      return 'Missing resources';
    } else if (failureReason === 'no_snapshots') {
      return 'No snapshots';
    } else if (failureReason === 'render_timeout') {
      return 'Timed out';
    }
  }),

  // failureDetails will be a POJO of form `{something: [strings, strings, etc]}` and therefore
  // will not be able to trigger computed property recomputes
  failureDetails: DS.attr(),

  isRunning: or('isPending', 'isProcessing'),

  // Review state, aggregated across all reviews. This will only be set for finished builds.
  reviewState: DS.attr(),
  isUnreviewed: equal('reviewState', BUILD_UNREVIEWED_STATE),
  isApproved: equal('reviewState', BUILD_APPROVED_STATE),
  isRejected: equal('reviewState', BUILD_REJECTED_STATE),
  isUnapproved: or('isUnreviewed', 'isRejected'),

  // reviewStateReason provides disambiguation for how reviewState was set, such as when a
  // build was approved automatically by the system when there are no diffs vs. when it is
  // approved by user review.
  //
  // reviewState --> reviewStateReason
  // - 'unreviewed' --> 'unreviewed_snapshots': Not all snapshots have been reviewed.
  // - 'approved' --> 'all_snapshots_approved': All snapshots were approved by user review.
  // - 'approved' --> 'all_snapshots_approved_previously': All snapshots were automatically approved
  //   because a user had previously approved the same snapshots in this branch.
  // - 'approved' --> 'no_diffs': All snapshots were automatically approved because there were no
  //    visual differences when compared with the baseline.
  // - 'approved' --> 'auto_approved_branch': Automatically approved based on branch name
  // - 'changes_requested' --> changes_requested_snapshot: snapshot(s) rejected by user
  //    in this build
  // - 'changes_requested' --> changes_requested_snapshot_previously: snapshot(s) rejected
  //    in previous build
  reviewStateReason: DS.attr(),

  // Aggregate numbers for snapshots and comparisons. These will only be set for finished builds.
  // Each snapshot is a top-level UI state that may encompass multiple comparisons.
  // Each comparison represents a single individual rendering at a width and browser.
  totalSnapshots: DS.attr('number'),
  totalSnapshotsUnreviewed: DS.attr('number'),
  totalSnapshotsRequestingChanges: DS.attr('number'),

  totalComparisons: DS.attr('number'),
  totalComparisonsFinished: DS.attr('number'),
  totalComparisonsDiff: DS.attr('number'),
  totalOpenComments: DS.attr('number'),
  buildCompletionPercent: computed(
    'totalComparisons',
    'totalComparisonsFinished',
    'isProcessing',
    function() {
      const totalComparisons = this.totalComparisons || 0;

      // Make sure that if totalComparisons returns 0 that we're not dividing against it
      if (!this.isProcessing || totalComparisons === 0) {
        return 0;
      }

      const totalComparisonsFinished = this.totalComparisonsFinished || 0;
      return (totalComparisonsFinished / totalComparisons) * 100;
    },
  ),
  hasDiffs: computed('totalComparisonsDiff', 'isFinished', function() {
    // Only have the chance to return true if the build is finished.
    if (!this.isFinished) {
      return false;
    }

    return this.totalComparisonsDiff > 0;
  }),

  buildStatusLabel: computed('state', 'reviewState', function() {
    if (this.isPending) {
      return PENDING_LABEL;
    } else if (this.isProcessing) {
      return PROCESSING_LABEL;
    } else if (this.isFinished) {
      if (this.isApproved) {
        if (this.reviewStateReason === 'no_diffs') {
          return NO_DIFFS_LABEL;
        } else if (this.reviewStateReason === 'auto_approved_branch') {
          return AUTO_APPROVED_BRANCH_LABEL;
        } else {
          return APPROVED_LABEL;
        }
      } else if (this.get('isUnreviewed')) {
        return UNREVIEWED_LABEL;
      } else if (this.get('isRejected')) {
        return REJECTED_LABEL;
      }
    } else if (this.isFailed) {
      return FAILED_LABEL;
    } else if (this.isExpired) {
      return EXPIRED_LABEL;
    }
  }),

  commit: DS.belongsTo('commit', {async: false}), // Might be null.
  baseBuild: DS.belongsTo('build', {async: false, inverse: null}),
  snapshots: DS.hasMany('snapshot', {async: true}),

  comparisons: computed('snapshots', function() {
    return this.snapshots.reduce((acc, snapshot) => {
      return acc.concat(snapshot.get('comparisons').toArray());
    }, []);
  }),

  hasNoDiffs: not('hasDiffs'),
  commitHtmlUrl: DS.attr(),
  branchHtmlUrl: DS.attr(),
  isPullRequest: DS.attr('boolean'),
  pullRequestNumber: DS.attr('number'),
  pullRequestHtmlUrl: DS.attr(),
  pullRequestTitle: DS.attr(),
  pullRequestLabel: computed('repo.source', function() {
    if (this.get('repo.isGitlabRepoFamily')) {
      return 'Merge Request';
    } else {
      return 'Pull Request';
    }
  }),

  finishedAt: DS.attr('date'),
  approvedAt: DS.attr('date'),
  approvedBy: DS.belongsTo('user', {async: false}),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  userAgent: DS.attr(),

  duration: computed('finishedAt', 'createdAt', function() {
    var finished = this.finishedAt;
    if (!finished) {
      finished = moment();
    }
    var started = this.createdAt;
    var milliseconds = moment(finished).diff(started);
    return moment.duration(milliseconds);
  }),

  // Convenience methods for accessing common methods in templates.
  durationHours: computed('duration', function() {
    return this.duration.hours();
  }),
  durationMinutes: computed('duration', function() {
    return this.duration.minutes();
  }),
  durationSeconds: computed('duration', function() {
    return this.duration.seconds();
  }),

  reloadAll() {
    return this.store.findRecord('build', this.id, {reload: true});
  },

  browsersUpgraded: computed('browsers.[]', 'baseBuild.browsers.[]', function() {
    const headBuildBrowsers = this.browsers || [];
    const baseBuildBrowsers = this.get('baseBuild.browsers') || [];
    const browsersUpgraded = [];
    headBuildBrowsers.forEach(headBrowser => {
      baseBuildBrowsers.forEach(baseBrowser => {
        // Only count a browser as "upgraded" if the same family existed in the base build,
        // so that we don't accidentally include browsers that were added.
        if (baseBrowser.browserFamily == headBrowser.browserFamily && baseBrowser !== headBrowser) {
          browsersUpgraded.push(headBrowser);
        }
      });
    });
    return browsersUpgraded;
  }),

  loadedSnapshots: computed('snapshots.@each.build', function() {
    // Get snapshots without making new request
    return this.store.peekAll('snapshot').filterBy('build.id', this.id);
  }),

  // Returns Ember Object with a property for each browser for the build,
  // where the value is an array of snapshots that have diffs for that browser.
  // It is an ember object rather than a POJO so computed properties can observe it, and for ease
  // of use in templates.
  unapprovedSnapshotsWithDiffForBrowsers: computed(
    'loadedSnapshots.@each.{isUnreviewed,isUnchanged}',
    'browsers.[]',
    function() {
      const loadedSnapshotsForBuild = this.loadedSnapshots;
      const unreviewedSnapshotsWithDiffs = loadedSnapshotsForBuild.reduce((acc, snapshot) => {
        if (snapshot.get('isUnreviewed') && !snapshot.get('isUnchanged')) {
          acc.push(snapshot);
        }
        return acc;
      }, []);
      return countDiffsWithSnapshotsPerBrowser(unreviewedSnapshotsWithDiffs, this.browsers);
    },
  ),
});
