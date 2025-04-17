// DOM Elements
const fetchBtn = document.getElementById('fetchBtn');
const xhrBtn = document.getElementById('xhrBtn');
const postForm = document.getElementById('postForm');
const putForm = document.getElementById('putForm');
const output = document.getElementById('output');

let postsStorage = JSON.parse(localStorage.getItem('postsStorage')) || [];

function displayOutput(data) {
  output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function displayError(message) {
  output.innerHTML = `<p style="color: #ff5e5e;">Error: ${message}</p>`;
}

// Store Post in Local Storage
function storePost(post) {
  const index = postsStorage.findIndex(p => p.id === post.id);
  if (index !== -1) {
    postsStorage[index] = post; // update existing
  } else {
    postsStorage.push(post); // add new
  }
  localStorage.setItem('postsStorage', JSON.stringify(postsStorage));
  displayStoredPosts();
}

// Show all stored posts below the output
function displayStoredPosts() {
  const storageDiv = document.getElementById('storedPosts');
  if (!storageDiv) return;

  storageDiv.innerHTML = `
    <h2>🗂️ Stored Posts</h2>
    ${postsStorage.map(post => `
      <div class="output-section">
        <strong>ID:</strong> ${post.id}<br>
        <strong>Title:</strong> ${post.title}<br>
        <strong>Body:</strong> ${post.body}
      </div>
    `).join('')}
  `;
}

// Task 1: GET with fetch()
fetchBtn.addEventListener('click', () => {
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      displayOutput(data);
      storePost(data);
    })
    .catch(error => displayError(error.message));
});

// Task 2: GET with XHR
xhrBtn.addEventListener('click', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        displayOutput(data);
        storePost(data);
      } catch (err) {
        displayError("Failed to parse JSON from XHR.");
      }
    } else {
      displayError(`XHR failed with status ${xhr.status}`);
    }
  };

  xhr.onerror = () => displayError("XHR Network Error.");
  xhr.send();
});

// Task 3: POST
postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();

  if (!title || !body) {
    displayError("Please enter a title and body.");
    return;
  }

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, userId: 1 })
  })
    .then(res => {
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      displayOutput(data);
      storePost(data);
    })
    .catch(err => displayError(err.message));
});

// Task 4: PUT
putForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('updateId').value.trim());
  const title = document.getElementById('updateTitle').value.trim();
  const body = document.getElementById('updateBody').value.trim();

  if (!id || !title || !body) {
    displayError("Please fill in all fields for PUT request.");
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('PUT', `https://jsonplaceholder.typicode.com/posts/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        displayOutput(response);
        storePost(response);
      } catch (error) {
        displayError("Failed to parse PUT response.");
      }
    } else {
      displayError(`PUT failed with status ${xhr.status}`);
    }
  };

  xhr.onerror = () => displayError("Network Error during PUT request.");

  xhr.send(JSON.stringify({ id, title, body, userId: 1 }));
});

// On page load, show stored posts
window.addEventListener('DOMContentLoaded', displayStoredPosts);