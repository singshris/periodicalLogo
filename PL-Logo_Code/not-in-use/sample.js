let planetaryData;
// const authString = 'Basic' + btoa(`9856edcd-6dbd-4fea-98a1-6d48cabaf291:007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b`);
const authString = btoa(`9856edcd-6dbd-4fea-98a1-6d48cabaf291:007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b`);
function setup() {
  createCanvas(400, 400);
  // Make an API request with headers to get planetary data
  const apiUrl = 'https://api.astronomyapi.com/api/v2/bodies/positions?longitude=84.39733&latitude=38.775867&from=2020-12-20T09:00:00.000-05:00&to=2020-12-23T09:00:00.000-05:00'+ authString;
  const options = {
    headers: {
      'Authorization': 'Parameter ' + authString
    }
  };
  loadJSON(apiUrl, gotData);
  console.log(apiUrl);
}

function gotData(data) {
  // Handle the API response data
  planetaryData = data;
  // Now you can work with the planetary data in your p5.js sketch
}

function draw() {
  background(220);
  if (planetaryData) {
    // Display the planetary data on the canvas
    textSize(16);
    fill(0);
    text('Planetary Data:', 10, 30);
    let y = 60;
    for (const planet of planetaryData) {
      text(planet.name + ': ' + planet.position, 10, y);
      y += 20;
    }
  }
}
