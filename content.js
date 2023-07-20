const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>`;

const waitForElm = (container, selector, disconnect) => {
  return new Promise((resolve) => {
    if (container.querySelector(selector)) {
      return resolve(container.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (container.querySelector(selector)) {
        resolve(container.querySelector(selector));
        if (disconnect) observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  });
};

const getVideoId = (url) => {
  let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/;
  return regex.exec(url)[3];
};

const scrollObserver = new MutationObserver(() => {
  createButton();
});

const button = document.createElement('div');
button.className =
  'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button';
button.innerHTML = icon;
button.onclick = () => {
  window.open(
    'https://www.youtube.com/watch?v=' + getVideoId(window.location.href),
    '_blank'
  );
};

const createButton = () => {
  waitForElm(document, 'ytd-reel-video-renderer[is-active]', true).then(
    (video) => {
      console.log('video');
      waitForElm(video, '#actions', true).then((actions) => {
        actions.insertBefore(button, actions.firstChild);
      });
    }
  );
};

scrollObserver.observe(document.querySelector('html'), {
  childList: false,
  subtree: false,
  attributes: true,
});

createButton();
