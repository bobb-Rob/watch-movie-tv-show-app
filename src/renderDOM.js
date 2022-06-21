/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

export default async () => {
  const url = 'https://api.tvmaze.com/search/shows?q=girls';
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderResult(data);
      document.querySelector('.errorMessage').innerHTML = '';
      return data;
    })
    .catch((e) => {
      document.querySelector('.errorMessage').innerHTML = `<span class="text-danger">${e}No such show available</span>`;
      renderResult([]);
    });
};

function renderResult(results) {
  const resultList = document.querySelector('.shows');
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
        <a class="nav-link" href="#">Movies(${results.length})<span class="sr-only">(current)</span></a>
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
    // Inserting tv shows
    results.forEach((result) => {
      // const like = mylikes;
      // console.log(like);
      // .filter((like) => typeof like.item_id === 'string')
      // .filter((like) => like.item_id === `${result.show.id}`)[0];
      const element = document.createElement('div');
      element.classList.add('card');
      element.style.width = '20rem';
      element.innerHTML = `
      <img src="${result.show.image.original}" class="card-img-top w-100" alt="Image of the show">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h5 class="card-title">${result.show.name}</h5>
          <i class="bi bi-suit-heart like" id="${result.show.id}">id: ${result.show.id}</i>
        </div>
        <div class="d-flex justify-content-end">
          <span class="text-dark d-like">${0} likes</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${result.show.id}" >
          Comments
        </button>`;
        resultList.appendChild(element);
  });
}
