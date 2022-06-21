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
}
