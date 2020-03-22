var distToBottom, data, dataObj;
var page = 1;
var pollingForData = false;
var xhr = new XMLHttpRequest();
var contentContainer = document.getElementsByClassName('content-container')[0];
var loadingContainer = document.getElementsByClassName('loading-container')[0];

function getDistFromBottom() {
  var scrollPosition = window.pageYOffset;
  var windowSize = window.innerHeight;
  var bodyHeight = document.body.offsetHeight;
  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
}

function createPost(index) {
  var postElement = document.createElement('article')

  var title = document.createElement('h3');
  title.appendChild(document.createTextNode(index.toString()));
  title.classList.add('title');

  var desc = document.createElement('div');
  desc.innerHTML = "text " + index.toString();
  desc.classList.add('content');

  var hrElem = document.createElement('hr');
  hrElem.classList.add('separator');

  postElement.appendChild(title);
  postElement.appendChild(desc);
  // postElement.appendChild(hrElem);

  return postElement;
}

function loadContent(page, pageSize) {
  console.log('----------------------------- loadContent', page, pageSize);
  pollingForData = false;
  var start = (page - 1) * pageSize;
  var stop = start + pageSize;
  for (var index = start; index <= stop; index++) {
    contentContainer.appendChild(createPost(index));
  }
}

xhr.onload = function() {
  if (xhr.status === 200) {

    pollingForData = false;
    data = xhr.responseText
    dataObj = JSON.parse(data);

    // for iterating through the data
    // Using a ForEach

    dataObj.posts.forEach(function(post, index) {

      var postElement = document.createElement('article')

      var title = document.createElement('h3');
      title.appendChild(document.createTextNode(post.title));
      title.classList.add('title');

      var img = document.createElement('img');
      img.src = post.featured_image.source;
      img.classList.add('feat');

      var author = document.createElement('p');
      author.appendChild(document.createTextNode(post.author));
      author.classList.add('author');

      // since the text already comes out as this
      var desc = document.createElement('div');
      desc.innerHTML = post.content;
      desc.classList.add('content');

      var hrElem = document.createElement('hr');
      hrElem.classList.add('separator');

      postElement.appendChild(title);
      // postElement.appendChild(img);
      // postElement.appendChild(desc);
      postElement.appendChild(hrElem);

      contentContainer.appendChild(postElement);
    })

    //     // Using a For Loop
    //     for(var i = 0; i <= dataObj.posts.length; i++ ) {
    //       console.log('data ', i);      
    //     }

    // removing the spinner
    // loadingContainer.classList.remove('no-content');

  }
};

// xhr.open('GET', 'https://www.techinasia.com/wp-json/techinasia/2.0/posts?page=1&per_page=25', true);
// xhr.send();

pollingForData = false;
loadContent(1, 25);

document.addEventListener('scroll', function() {
  distToBottom = getDistFromBottom();
  console.log('scrolling', getDistFromBottom());
  console.log('pollingForData', pollingForData);

  if (!pollingForData && distToBottom > 0 && distToBottom <= 400) {
    pollingForData = true;
    loadingContainer.classList.add('no-content');

    page++;
    loadContent(page, 10);
    // xhr.open('GET', 'https://www.techinasia.com/wp-json/techinasia/2.0/posts?page='+page+'&per_page=25', true);
    // xhr.send();

  }
});