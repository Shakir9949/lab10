// Elements
const fetchBtn = document.getElementById('fetchBtn');
const xhrBtn = document.getElementById('xhrBtn');
const output = document.getElementById('output');
const postForm = document.getElementById('postForm');
const putForm = document.getElementById('putForm');

// Helper
function displayOutput(content) {
  output.innerHTML = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
}

function displayError(error) {
  output.innerHTML = `<p style="color:red;"><strong>Error:</strong> ${error}</p>`;
}

// Task 1: Fetch GET
fetchBtn.addEventListener('click', () => {
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => displayOutput(data))
    .catch(err => displayError(`Fetch failed: ${err.message}`));
});

// Task 2: XHR GET
xhrBtn.addEventListener('click', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
  xhr.onload = () => {
    if (xhr.status === 200) {
      displayOutput(JSON.parse(xhr.responseText));
    } else {
      displayError(`XHR failed with status ${xhr.status}`);
    }
  };
  xhr.onerror = () => displayError('Network Error with XHR');
  xhr.send();
});

// Task 3: POST
postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('postTitle').value;
  const body = document.getElementById('postBody').value;

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => displayOutput(data))
    .catch(err => displayError(`POST failed: ${err.message}`));
});

// Task 4: PUT (Update a post using XMLHttpRequest)
putForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const id = document.getElementById('updateId').value.trim();
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
        } catch (error) {
          displayError("Failed to parse PUT response.");
        }
      } else {
        displayError(`PUT failed with status ${xhr.status}`);
      }
    };
  
    xhr.onerror = () => {
      displayError("Network Error during PUT request.");
    };
  
    xhr.send(JSON.stringify({
      id: Number(id), // Ensure the ID is a number
      title,
      body,
      userId: 1 // JSONPlaceholder expects this even if you’re updating
    }));
  });
  