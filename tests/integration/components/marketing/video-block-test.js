import VideoBlock from 'percy-web/tests/pages/components/marketing/video-block';
import hbs from 'htmlbars-inline-precompile';
import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import percySnapshot from '@percy/ember';
import {render, find} from '@ember/test-helpers';

describe('Integration: Marketing/VideoBlock', function () {
  setupRenderingTest('marketing/video-block', {
    integration: true,
  });

  const videoBlock = {
    isImagePresent: true,
    isImageRightAligned: false,
    isImageCentered: true,
    imageUrl: '/images/test/westworld-logo.png',
    imageDescription: 'Westworld Logo',
    header: 'This is the header',
    subheader: 'This is the subheader. It is longer and more full of stuff.',
    videoEmbedUrl: 'https://www.youtube.com/embed/1Sr_h9_3MI0',
  };

  beforeEach(function () {
    this.set('videoBlock', videoBlock);
  });

  it('opens a modal when the image is clicked', async function () {
    await render(hbs`<Marketing::VideoBlock @block={{videoBlock}} />`);

    // then click the image
    await VideoBlock.clickImage();

    // then check that the modal is present
    expect(await find(VideoBlock.modalScope)).to.exist;

    await percySnapshot(this.test.fullTitle(), {
      percyCSS: '.ytp-title-beacon { display: none; }',
    });
  });
});
