/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const TVmazeURL = 'https://api.tvmaze.com/search/shows?q=girls';
const requestedURL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Gk2LHbamyoGODOj6Ra8F/likes/';

const resultElement = () => document.querySelector('.shows');

const renderNavbar = async () => {
  const shows = await generateShows();
  const resultList = resultElement();
  resultList.innerHTML = '';
  // Creating navigation bar
  const navBar = `
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">TVShows logo</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#">Movies(${shows.length})<span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">TV shows</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Films</a>
        </li>
      </ul>
    </div>
</nav> `;
  resultList.insertAdjacentHTML('beforebegin', navBar);
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

const generateShows = async () => {
  const request = new Request(TVmazeURL);

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

const insertModal = ({ show }) => {
  const resultList = resultElement();
  const markUp = `
  <div class="app-modal" tabindex="-1" aria-hidden="true">
  <div class="app-modal-content shadow p-3 mb-5 bg-body rounded border border-secondary">
      <div class="app-modal-head">
          <img src="${show.image.original}" class="comment-image" alt="Image of the show">
          <div class="show-title">
              <h5>${show.name}</h5>
              <p>${show.summary}</p>
          </div>
          <button type="button" class="btn-close comment-close" data-comment-close='close'></button>
      </div>
      <ul class="show-description">
          <li >Language: ${show.language}</li>
          <li >Run time: ${show.runtime}</li>
          <li >Premiered: ${show.premiered}</li>
          <li ><a href="${show.url}" class="card-link">Watch Here</a></li>
      </ul>      
  </div> 
</div>`;

  resultList.insertAdjacentHTML('beforebegin', markUp);
};

const addEventToCommentBtn = async () => {
  const shows = await generateShows();
  const showEl = resultElement();
  showEl.addEventListener('click', (e) => {
    const targetEl = e.target;
    const recipientId = targetEl.getAttribute('data-modal-id');

    // FInd the right show and insert modal with data
    const show = shows.find((item) => item.show.id === Number(recipientId));
    insertModal(show);

    // Display pop up modal
    const appModal = document.querySelector('.app-modal');

    appModal.classList.add('appear');
    // Add close event to close icon
    const closeIcon = document.querySelector('.comment-close');
    closeIcon.addEventListener('click', () => {
      appModal.remove();
    });
  });
};

export {
  renderNavbar, renderShow, displayLikes, addEventToCommentBtn,
};