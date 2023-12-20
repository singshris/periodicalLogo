const slider = document.getElementById("yearSlider");
const label = document.querySelector("label");
const canvas = document.querySelector(".logoCanvas");
const moveButton = document.getElementById("moveBtn");
const chaos = document.getElementById("chaosBtn");
const heading = document.querySelector("h1");
let year;
let myData;
let logos = ["A", "S", "T", "R", "O", "N", "O", "M", "Y"];
const palette = ["#CA3ED6", "#4D3DD7", "#ED6345", "#60A561"];
let apiUrl;
let xPos, yPos, alt;
let planetName;
let positionsArray = [];
let isAnimationRunning = false; // Variable to track animation state

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
      xPos = Math.round(data.data.table.rows[i].cells[0].position.equatorial.rightAscension.hours);
      yPos = Math.round(data.data.table.rows[i].cells[0].position.equatorial.declination.degrees);
      planetName = data.data.table.rows[i].cells[0].id;
      alt = Math.floor(Math.abs((data.data.table.rows[i].cells[0].position.horizonal.altitude.degrees)));
      positionsArray.push({ xPos, yPos, alt, planetName });
    }

    positionsArray.sort((a, b) => a.xPos - b.xPos);
    canvas.innerHTML = '';

    for (let i = 0; i < logos.length; i++) {
      let x = positionsArray[i].xPos;
      let y = positionsArray[i].yPos;
      let moveY = positionsArray[i].alt;
      let planet = positionsArray[i].planetName;
      console.log(moveY);
      let logo = logos[i];
      let minLatitudeDifference = (canvas.clientHeight - 20) / (positionsArray.length - 1);

      let newxPos = map(x, 0, 24, Math.floor(canvas.clientWidth/20), Math.floor(canvas.clientWidth/3));
      newxPos += i * minLatitudeDifference;
      let newSize = map(moveY, 0, 30, 20, 120);
      let newyPos = map(y, -24, 24, canvas.clientHeight / 2 - 120, canvas.clientHeight / 2 + 120);

      let dataElem = document.createElement("DIV");
      dataElem.classList.add("star");
      dataElem.innerHTML = logo;
      dataElem.style.left = Math.floor(newxPos) + "px";
      dataElem.style.top = Math.abs(newyPos) + "px";
      dataElem.style.animation = `floatAnimation-${i} 2s 1 alternate `; // Unique animation name for each element

      dataElem.addEventListener("mouseenter", () =>{
        let planetInfo = document.createElement("P");
        planetInfo.innerHTML = planet.toUpperCase() + " was at " + "<br>" + x + " Right Ascension "  + "<br>" + "and " + y + " Declination";
        dataElem.style.color = "#fedd39";
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
      let currentIndex; 


      moveButton.addEventListener("click", () => {
        // Toggle the animation state
        isAnimationRunning = !isAnimationRunning;
      
        if (isAnimationRunning) {
          // Start the animation
          animationName = "floatAnimation";
          moveButton.innerHTML = "Stop Animation"; // Optionally update the button text
        } else {
          // Stop the animation
          animationName = null;
          moveButton.innerHTML = "Start Animation"; // Optionally update the button text
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
                skewX(150deg);
             50%{
                transform: translateX(0);
                transform: translateY(0);
                skew(0deg, 0deg);
             }
              }
              100% {
                  transform: translateX(${newSize}px);
                  transform: translateY(${newSize}px);
                  skewY(-150deg);
              }
            }
          `);
        }
      });


      chaos.addEventListener("click", () => {
        dataElem.style.left = `Math.floor(${Math.random() * canvas.clientWidth})px`;
        dataElem.style.top = `Math.abs(${Math.random() * canvas.clientHeight})px`;
        dataElem.style.transform = `rotate(${Math.random() * newSize}deg)`;
        dataElem.style.fontSize = newSize + "px";
        dataElem.style.color = palette[Math.floor(Math.random()*palette.length)];
        // dataElem.style.transform = "skewX(20deg)"
    })


      canvas.appendChild(heading);
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


  
function colorChange() {
    const dataElems = document.getElementsByClassName("star");
    const canvas = document.querySelector(".logoCanvas"); // Assuming canvas is a variable in your code
    const modeButton = document.getElementById("colorBtn"); // Assuming colorBtn is an ID in your HTML
    modeButton.addEventListener("click", () => {
        console.log("button is clicked");
        for (const dataElem of dataElems) {
            if (canvas === "#191516") {
              dataElem.style.color = "#191516";
              canvas.style.background = "#FFFBF2";
              modeButton.innerHTML = "Light Mode";
            } else if (canvas === "#191516") {
              dataElem.style.color = "#191516";
              canvas.style.background = "#FFFBF2"; // Change to the desired background color
              modeButton.innerHTML = "Dark Mode";
            }
          }
    })
   
  }
  