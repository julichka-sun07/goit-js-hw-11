// import { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import throttle from 'lodash.throttle';
// import { fetchImages } from './fetch.js';
// import { createImagesMarkup } from './creatmarkup.js';

// const formEl = document.getElementById('search-form');
// const galleryEl = document.querySelector('.gallery');
// const spinnerEl = document.getElementById('loading');

// let searchQuery = '';
// const per_page = 40;
// let markup = '';
// let totalHits = 0;
// let gallery;

// const options = {
//   q: searchQuery,
//   page: 0,
//   per_page: per_page,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
// };

// formEl.addEventListener('submit', onFormSubmit);

// function onFormSubmit(event) {
//   event.preventDefault();
//   galleryEl.innerHTML = '';
//   options.page = 0;
//   searchQuery = formEl.elements[0].value.trim();
//   if (searchQuery) {
//     spinnerEl.classList.add('visible');
//     handleFetchRequest(searchQuery);
//     addInfiniteScroll();
//   } else {
//     Notify.failure('Search query is empty');
//     return;
//   }
//   formEl.reset();
// }

// function handleFetchRequest(searchQuery) {
//   options.page = +1;
//   options.q = searchQuery;

//   fetchImages(options)
//     .then(images => {
//       if (images.hits.length === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         totalHits = images.totalHits;
//         markup = createImagesMarkup(images);
//         renderImages(markup);

//         gallery = new SimpleLightbox('a', {
//           showCounter: false,
//           captions: true,
//           captionsData: 'alt',
//           captionClass: 'captions-style',
//         }).refresh();
//       }
//     })
//     .catch(error => Notify.failure(error));
// }

// function onLoadMore() {
//   if (Math.ceil(totalHits / per_page) > options.page) {
//     options.page += 1;
//     options.q = searchQuery;
//     fetchImages(options)
//       .then(images => {
//         markup = createImagesMarkup(images);
//         renderImages(markup);
//         gallery.refresh();
//         smoothScrolling();
//       })
//       .catch(error => {
//         Notify.warning(error.response.data);
//       });
//   } else {
//     options.page = 0;
//     removeInfiniteScroll();
//     Notify.warning(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// }

// function renderImages(markup) {
//   galleryEl.insertAdjacentHTML('beforeend', markup);
//   spinnerEl.classList.remove('visible');
// }

// function smoothScrolling() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();
//   window.scrollBy({ top: cardHeight * 3, behavior: 'smooth' });
// }

// // INFINITE SCROLL
// let throttledHandleInfiniteScroll = null;

// function addInfiniteScroll() {
//   removeInfiniteScroll();
//   throttledHandleInfiniteScroll = throttle(handleInfiniteScroll, 500);
//   window.addEventListener('scroll', throttledHandleInfiniteScroll);
// }

// function removeInfiniteScroll() {
//   window.removeEventListener('scroll', throttledHandleInfiniteScroll);
// }

// function handleInfiniteScroll() {
//   const endOfPage =
//     window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

//   if (endOfPage) {
//     onLoadMore();
//   }
// }


// let buttonscroltop = document.getElementById('btnTop');
// window.onscroll = function () {
//   scrollFunction();
// };

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     buttonscroltop.style.display = 'block';
//     buttonscroltop.addEventListener('click', topFunction);
//   } else {
//     buttonscroltop.style.display = 'none';
//     buttonscroltop.removeEventListener('click', topFunction);
//   }
// }

// function topFunction() {
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }


import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { fetchImages } from './fetch.js';
import { createImagesMarkup } from './creatmarkup.js';

const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const spinnerEl = document.getElementById('loading');

let searchQuery = '';
const per_page = 40;
let markup = '';
let totalHits = 0;
let gallery;

const options = {
  q: searchQuery,
  page: 0,
  per_page: per_page,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

formEl.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  options.page = 0;
  searchQuery = formEl.elements[0].value.trim();
  if (searchQuery) {
    spinnerEl.classList.add('visible');
    await handleFetchRequest(searchQuery);
    addInfiniteScroll();
  } else {
    Notify.failure('Search query is empty');
    return;
  }
  formEl.reset();
}

async function handleFetchRequest(searchQuery) {
  options.page = 1;
  options.q = searchQuery;

  try {
    const images = await fetchImages(options);
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      totalHits = images.totalHits;
      markup = createImagesMarkup(images);
      renderImages(markup);

      gallery = new SimpleLightbox('a', {
        showCounter: false,
        captions: true,
        captionsData: 'alt',
        captionClass: 'captions-style',
      }).refresh();
    }
  } catch (error) {
    Notify.failure(error);
  }
}

async function onLoadMore() {
  if (Math.ceil(totalHits / per_page) > options.page) {
    options.page += 1;
    options.q = searchQuery;
    try {
      const images = await fetchImages(options);
      markup = createImagesMarkup(images);
      renderImages(markup);
      gallery.refresh();
      smoothScrolling();
    } catch (error) {
      Notify.warning(error.response.data);
    }
  } else {
    options.page = 0;
    removeInfiniteScroll();
    Notify.warning("We're sorry, but you've reached the end of search results.");
  }
}

function renderImages(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
  spinnerEl.classList.remove('visible');
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({ top: cardHeight * 3, behavior: 'smooth' });
}

// INFINITE SCROLL
let throttledHandleInfiniteScroll = null;

function addInfiniteScroll() {
  removeInfiniteScroll();
  throttledHandleInfiniteScroll = throttle(handleInfiniteScroll, 500);
  window.addEventListener('scroll', throttledHandleInfiniteScroll);
}

function removeInfiniteScroll() {
  window.removeEventListener('scroll', throttledHandleInfiniteScroll);
}

async function handleInfiniteScroll() {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage) {
    await onLoadMore();
  }
}
    
    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        buttonscroltop.style.display = 'block';
        buttonscroltop.addEventListener('click', topFunction);
      } else {
        buttonscroltop.style.display = 'none';
        buttonscroltop.removeEventListener('click', topFunction);
      }
    }
    
    function topFunction() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }