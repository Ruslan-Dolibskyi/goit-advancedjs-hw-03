import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const breedSelect = document.getElementById('breed-select');
  const loader = document.getElementById('loader');
  const error = document.getElementById('error');
  const catInfo = document.getElementById('cat-info');

  const showLoader = () => (loader.style.display = 'block');
  const hideLoader = () => (loader.style.display = 'none');
  const showError = message => {
    error.textContent = message;
    error.style.display = 'block';
  };
  const hideError = () => (error.style.display = 'none');

  const loadBreeds = async () => {
    try {
      showLoader();
      hideError();
      const breeds = await fetchBreeds();
      breedSelect.innerHTML = breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('');
      new SlimSelect({ select: '#breed-select' });
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoader();
      breedSelect.style.display = 'none';
    }
  };

  const loadCatInfo = async breedId => {
    try {
      showLoader();
      hideError();
      catInfo.style.display = 'none';
      const cat = await fetchCatByBreed(breedId);
      catInfo.innerHTML = `
        <div class="cat-image">
          <img src="${cat.url}" alt="${cat.breeds[0].name}">
        </div>
        <div class="cat-details">
          <h2>${cat.breeds[0].name}</h2>
          <p>${cat.breeds[0].description}</p>
          <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
        </div>
`;

      catInfo.style.display = 'flex';
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoader();
    }
  };

  breedSelect.addEventListener('change', e => {
    const breedId = e.target.value;
    if (breedId) {
      loadCatInfo(breedId);
    }
  });

  await loadBreeds();
});
