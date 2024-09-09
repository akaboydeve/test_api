// Define the API URL (Flask server on localhost:5000)
const apiUrl = 'http://127.0.0.1:5000/api'; 

// Send GET request to the Flask API
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the response as JSON
  })
  .then(data => {
    console.log(data); // Print the response from the Python Flask server
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
