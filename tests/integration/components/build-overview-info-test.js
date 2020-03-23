/* jshint expr:true */
import {setupRenderingTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import percySnapshot from 'percy-web/tests/helpers/percy-snapshot';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {render} from '@ember/test-helpers';

describe('Integration: BuildOverviewInfoComponent', function () {
  setupRenderingTest('build-overview-info', {
    integration: true,
  });

  beforeEach(function () {
    setupFactoryGuy(this);
  });

  let states = [
    ['withRepo', 'hasPullRequest'],
    ['withRepo', 'hasPullRequestWithoutTitle'],
    ['withRepo'],
    [],
  ];

  states.forEach(state => {
    let testTitle = state.join(' ');

    it(`renders in state: ${testTitle}`, async function () {
      let build = make.apply(this, ['build'].concat(state));
      this.set('build', build);

      await render(hbs`<BuildOverviewInfo @build={{build}} @isBuildApprovable={{true}} />`);
      await percySnapshot(this.test, {darkMode: true});
    });
  });
});
