import  { resultElement, generateShows } from './renderDOM.js' 

const commentsURL = (id = 0) => {
    if(id === 0){
     return `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Gk2LHbamyoGODOj6Ra8F/comments`;
    } else {
       return `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Gk2LHbamyoGODOj6Ra8F/comments?item_id=${id}`;
    }
}

const commentCard = (commentObj) => {
    const element = `
    <li>
      <span class="comment-date">${commentObj.creation_date} ${commentObj.username}: ${commentObj.comment} </span>
     
    </li>`;
    document.querySelector('.comments-container').insertAdjacentHTML('beforeend', element)
  }
  
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
        <div>
          <h5>
            Comments <span class='comment-count'></span>
          </h5>
          <ul class="comments-container">
  
          </ul>
        </div>
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
      console.log(show.show.id)
      insertModal(show);
    //   
      getComment(show.show.id)
      .then((comments) => {
         console.log(comments);
         comments.forEach(element => {
            commentCard(element)
         });
      })
      .catch((error) => console.log(error))

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
  

const getComment = async (id) => {
    const url = commentsURL(id);
    const response = await fetch(url);
    return response.json();
}


export { addEventToCommentBtn };