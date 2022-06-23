/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const TVmazeURL = 'https://api.tvmaze.com/search/shows?q=girls';
const requestedURL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Gk2LHbamyoGODOj6Ra8F/likes/';

const resultElement = () => document.querySelector('.shows');

const generateShows = async () => {
  const request = new Request(TVmazeURL);
  const response = await fetch(request);
  const result = await response.json();
  return result;
};

const renderShow = async () => {
  const shows = await generateShows();
  const resultList = resultElement();
  const myLikes = await getLikes();
  shows.forEach((result) => {
    const element = document.createElement('div');
    const likeObject = myLikes
      .filter((like) => typeof like.item_id === 'string')
      .filter((like) => like.item_id === `${result.show.id}`)[0];
    element.classList.add('card');
    element.style.width = '20rem';
    element.innerHTML = `
      <img src="${result.show.image.original}" class="card-img-top w-100" alt="Image of the show">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h5 class="card-title">${result.show.name}</h5>
          <i class="bi bi-suit-heart like-button" id="${result.show.id}"></i>
        </div>
        <div class="d-flex justify-content-end d-like" id="${result.show.id + 1}">
          <span>${likeObject ? likeObject.likes : 0} Likes</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-modal-id="${result.show.id}" data-bs-target="#exampleModal${result.show.id}" >
          Comments
        </button>
        `;
    resultList.appendChild(element);
  });
};

const sendLikes = async (showID) => {
  const data = {
    method: 'POST',
    body: JSON.stringify({
      item_id: showID,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  };
  const response = await fetch(requestedURL, data);
  return response;
};

const getLikes = async () => {
  const request = new Request(requestedURL);

  const response = await fetch(request);
  const result = await response.json();

  return result;
};

const displayLikes = () => {
  const likeButtons = document.querySelectorAll('.like-button');

  likeButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const currentBtnId = btn.getAttribute('id');
      await sendLikes(currentBtnId);
      const btnParent = btn.parentElement;
      const likeEment = btnParent.nextElementSibling.firstElementChild;
      const likes = await getLikes();
      const like = likes
        .filter((like) => typeof like.item_id === 'string')
        .filter((like) => like.item_id === currentBtnId)[0];
      likeEment.textContent = `${like.likes} Likes`;
    });
  });
};

export {
  renderShow,
  displayLikes,
  resultElement,
  generateShows,
};