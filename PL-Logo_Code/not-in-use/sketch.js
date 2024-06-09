let astro;
let logo = ["A", "S", "T", "R", "O", "N", "O", "M", "Y"];
let font;
const authString = btoa(`applicationId:applicationSecret`);


function preload(){
    astro = loadJSON("data.json");
    font = loadFont('Alti.otf');
}



function setup(){

createCanvas(1200,800);
angleMode(DEGREES);
strokeWeight(1);
stroke(255);
textAlign(CENTER);
textFont(font);
// loadJSON("https://api.le-systeme-solaire.net/rest/bodies/", gotData);
astro.stars.sort((a, b) => a.dec - b.dec);
console.log(astro.stars);
}


// function gotData(data){
// pos = data;
// console.log(pos);
// }

//RA IS THE LONGITUDE
//DEC IS THE LATITUDE

function draw(){


background(0);
fill(255);
textSize(100);
let minLatitudeDifference = (height - 50) / (astro.stars.length - 1);

    for(let i=0; i<astro.stars.length; i++){
        rotDegree = map(astro.stars[i].alt, 0, 8, -5, 5);
        xPos = map(astro.stars[i].dec, 9, 90, 100, width-200);
        yPos = map(astro.stars[i].ra, 2, 20, 100, height-400);
        xPos += i * minLatitudeDifference;
        // linexPos = map(astro.stars[i+1].dec, 9, 90, 100, width-200);
        // lineyPos = map(astro.stars[i+1].ra, 2, 20, 300, height-400);

    // Add a floating effect using the sin function
    let xOff = frameCount *0.005; // Adjust the speed of movement
    let yOff = frameCount *0.005; // Adjust the speed of movement
  
    let x = map(noise(xOff), 0, 1, 2, 100);
    let y = map(noise(yOff), 0, 1, 2, 100);
        push();
        translate(xPos, yPos);
        // rotate(rotDegree);
        text(logo[i], 0+x, 0+y);
        fill(0);
        // ellipse(0,0,100,100);
        pop()
 
        // line(xPos, yPos, linexPos, lineyPos);

    }


}




//9856edcd-6dbd-4fea-98a1-6d48cabaf291 application ID
//Application secret 
//007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b
//007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b