import axios from 'axios';
import { Notify } from 'notiflix';

const API_KEY = 'ТУТ ПОТРІБНО СВІЙ КЛЮЧ З САЙТУ PIXABAY';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(options) {
  let parameters = new URLSearchParams(options);
  const images = await axios.get(`${URL}?key=${API_KEY}&${parameters}`);

  if (parameters.page === 1 && images.data.totalHits != 0) {
    Notify.success(`Hooray! We found ${totalHits} images!`);
  }

  return images.data;
}