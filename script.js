const slider = document.getElementById("yearSlider");
const label = document.querySelector("label");
const canvas = document.querySelector(".logoCanvas");
const moveButton = document.getElementById("moveBtn");
const chaos = document.getElementById("chaosBtn");
const heading = document.querySelector("h1");
const bgBody = document.querySelector("body");
const randomPos = Math.floor(Math.random() * -1200);
let year;
let myData;
let logos = ["A", "S", "T", "R", "O", "N", "O", "M", "Y"];
const palette = ["#CA3ED6", "#4D3DD7", "#ED6345", "#60A561"];
let apiUrl;
let xPos, yPos, alt;
let planetName;
let positionsArray = [];
let isAnimationRunning = false; // Variable to track animation state
const maxDistance = 300 + "px";


year = slider.value;
slider.addEventListener("input", () => {
  year = slider.value;
  label.innerHTML = slider.value;
  heading.innerHTML = slider.value;
  apiUrl = `https://api.astronomyapi.com/api/v2/bodies/positions?latitude=43.0750&longitude=-87.8829&elevation=332&from_date=${year}-01-14&to_date=${year}-01-14&time=12%3A20%3A51`;
});

const authString = btoa(`9856edcd-6dbd-4fea-98a1-6d48cabaf291:007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b`);
const headers = new Headers({
  'Authorization': `Basic ${authString}`
});

async function fetchData() {
  try {
    let response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers
    });

    let data = await response.json();
    myData = data.data.table.rows;
  
    for (let i = 0; i < myData.length; i++) {
      // Skip rows in the 2nd and 4th positions
      if (i === 1 || i === 4) {
        continue;
      }
      xPos = Math.round(myData[i].cells[0].position.equatorial.rightAscension.hours);
      yPos = Math.round(Math.abs(myData[i].cells[0].position.equatorial.declination.degrees));
      planetName = data.data.table.rows[i].cells[0].id;
      alt = Math.floor(Math.abs((data.data.table.rows[i].cells[0].position.horizonal.altitude.degrees)));
      positionsArray.push({ xPos, yPos, alt, planetName });
    }
    console.log(positionsArray);

    positionsArray.sort((a, b) => a.xPos - b.xPos);
    canvas.innerHTML = '';
 
    for (let i = 0; i < logos.length; i++) {
      let x = positionsArray[i].xPos;
      let y = positionsArray[i].yPos;
      let z = positionsArray[i].alt;
      let planet = positionsArray[i].planetName;
      let logo = logos[i];

      let minLatitudeDifference = (canvas.clientHeight-20) / (positionsArray.length - 1);
      let newxPos = map(x, 0, 24, 150, Math.floor(canvas.clientWidth)-150);
      newxPos += i * minLatitudeDifference;
      let newyPos = map(y, 0, 24, Math.floor(canvas.clientHeight)/2-150, Math.floor(canvas.clientHeight)/2+150);
      // let newzPos = map(z, 0, 30, -500, 100);
      let newSize = map(z, 0, 30, 2, 7);
      console.log(x, y, z, planet);

      let dataElem = document.createElement("DIV");
      dataElem.classList.add("star");
      dataElem.innerHTML = logo;
      dataElem.style.left = newxPos + "px";
      dataElem.style.top = newyPos + "px";
      let opacityAmount = map(z, 0, 30, 0, 1);
      dataElem.style.opacity = opacityAmount;
      // dataElem.style.transform = `translate3d(${newxPos}px, ${Math.abs(newyPos)}px, ${newzPos}px)`;
      dataElem.style.fontSize = `${newSize}rem`;
      dataElem.style.animation = `floatAnimation-${i} 1s 1 alternate `; // Unique animation name for each element

      dataElem.addEventListener("mouseenter", () =>{
        let planetInfo = document.createElement('p');
        planetInfo.innerHTML = planet.toUpperCase() + "<br>" + x + " Right Ascension "  + "<br>" +  -y + " Declination";
        // dataElem.style.color = "#E5FF61";
        dataElem.innerHTML = `<img id="planetImg" src="planets/${planet}.png" alt="${planet} image" style="width: 1px; height: auto;">`;

        const img = document.getElementById('planetImg');
       
 
        img.onload = function() {
        const originalWidth = img.naturalWidth;
        img.style.width = originalWidth * 0.4 + 'px';
        img.style.height = 'auto';
        };

        dataElem.style.cursor = "pointer";
        dataElem.appendChild(planetInfo);
      })

      dataElem.addEventListener("mouseleave", () =>{
        dataElem.innerHTML = logo;
        dataElem.style.color = "#FFFBF2";
      })

      // Append the style tag with unique keyframes for each element
      document.styleSheets[0].insertRule(`
        @keyframes floatAnimation-${i} {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `);

      let animationName; // Variable to store the animation name

      moveButton.addEventListener("click", () => {
        // Toggle the animation state
        isAnimationRunning = !isAnimationRunning;
      
        if (isAnimationRunning) {
          // Start the animation
          animationName = "floatAnimation";
          moveButton.innerHTML = "Static"; // Optionally update the button text
        } else {
          // Stop the animation
          animationName = null;
          moveButton.innerHTML = "Float"; // Optionally update the button text
        }
      
        // Apply the animation to all star elements
        const starElements = document.querySelectorAll(".star");
        starElements.forEach((element, index) => {
          element.style.animation = `${animationName} 1.5s infinite alternate`;
          currentIndex = index;
        });
      
        if (isAnimationRunning) {
          // Insert a single keyframes rule for all star elements
          document.styleSheets[0].insertRule(`
            @keyframes floatAnimation {
              0% {
                transform: translateX(-${newSize}px);
                transform: translateY(-${newSize}px);
             50%{
                transform: translateX(0);
                transform: translateY(0);
             }
              }
              100% {
                  transform: translateX(${newSize}px);
                  transform: translateY(${newSize}px);
              }
            }
          `);
        }
      });

      let isImageSet = false;
      chaos.addEventListener("click", () => {
        if (!isImageSet) {
          bgBody.style.background = `url('space.jpg')`;
          bgBody.style.backgroundSize = "cover";
          canvas.style.background = "none";
          chaos.innerHTML = "Not In Space";
        } else {
          // Change to background color (modify the color as needed)
          bgBody.style.background = "#191516";
          chaos.innerHTML = "In Space";
        }
        isImageSet = !isImageSet;
    })
    canvas.appendChild(dataElem);
    }
    positionsArray = [];
  } catch (error) {
    console.error('Error:', error);
  }
}

function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

  
const extractZValueFromTransform = (transformValue) => {
  const matrix = transformValue.match(/matrix.*\((.+)\)/);
  if (matrix) {
    const values = matrix[1].split(", ");
    if (values.length === 16) {
      // For matrix3d
      return parseFloat(values[14]);
    } else if (values.length === 6) {
      // For matrix (2D transform), z value is 0
      return 0;
    }
  }
  return null;
};

