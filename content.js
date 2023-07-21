// Define the icon SVG as a constant
const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
  <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
</svg>`;

// Define a function that waits for an element to appear in the DOM
const waitForElm = (container, selector) => {
  return new Promise((resolve) => {
    // If the element already exists in the DOM, resolve the promise immediately
    if (container.querySelector(selector)) {
      return resolve(container.querySelector(selector));
    }

    // Otherwise, create a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver(() => {
      // If the element appears in the DOM, resolve the promise and disconnect the observer
      if (container.querySelector(selector)) {
        resolve(container.querySelector(selector));
        observer.disconnect();
      }
    });

    // Start observing the DOM for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  });
};

// Define a function that extracts the video ID the attrribute of the HTML element
const getVideoId = () => {
  let videoId = document
    .querySelector('html')
    .getAttribute('it-pathname')
    .replace('/shorts/', '');
  return videoId;
};

// Create a button element and add an event listener to open the video in a new tab
const button = document.createElement('div');
button.className =
  'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button';
button.innerHTML = icon;
button.onclick = () => {
  window.open('https://www.youtube.com/watch?v=' + getVideoId(), '_blank');
};

// Define a function that inserts the button into the YouTube sidebar
const createButton = () => {
  // Wait for the active video element to appear in the DOM
  waitForElm(document, 'ytd-reel-video-renderer[is-active]').then((ytshort) => {
    // Wait for the actions element to appear in the sidebar
    waitForElm(ytshort, '#actions').then((sidebar) => {
      // Insert the button as the first child of the actions element
      sidebar.insertBefore(button, sidebar.firstChild);
    });
  });
};

// Create a mutation observer that watches for changes to the DOM and calls createButton() when necessary
const scrollObserver = new MutationObserver(() => {
  document
    .querySelector('html')
    .getAttribute('it-pathname')
    .startsWith('/shorts')
    ? createButton()
    : null;
});

scrollObserver.observe(document.querySelector('html[it-pathname]'), {
  childList: false,
  subtree: false,
  attributes: true,
});
