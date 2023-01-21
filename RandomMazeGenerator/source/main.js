// imports
import { generate } from './generateMaze.js';

// elements
const canvas = document.getElementById('gameScreen');
const context = canvas.getContext('2d');
const playButton = document.getElementById("playButton");
const menu = document.getElementById("menu");
const sizeInput = document.getElementById("size");
const modeInput = document.getElementById("mode");
const winThing = document.getElementById("win");
const winText = document.getElementById("winText");
const lastTime = document.getElementById("lastTime");

// mode
let mode = "normal";
let level = 15;

// dwayne the rock johnson
let theRock = 0;
const rock = document.getElementById("rock");
const rockArray = [document.getElementById("rock0"), document.getElementById("rock1"), document.getElementById("rock2"), document.getElementById("rock3"), document.getElementById("rock4"), document.getElementById("rock5"), document.getElementById("rock6"), document.getElementById("rock7"), document.getElementById("rock8"), document.getElementById("rock9"), document.getElementById("rock10")]
let rocks = [];

// paint
let paint = 0;
let paintMax = 0;

// timer
let startTime;
let finishTime;
let win = false;

// listeners
playButton.addEventListener("click", startGame);

// canvas vars
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = -1;
let zoom = 10;
let tileSize = Math.ceil(window.innerHeight / zoom);
let widthOffset = window.innerWidth - window.innerHeight;

// player vars
let playerx = 0;
let playery = 0;

// maze vars
let maze;

// sets player initial position
function findStart(){
  for(let x = 0; x < maze.length; x++){
    for(let y = 0; y < maze.length; y++){
      if(maze[x][y] == 2){
        playerx = Math.floor((x + 0.25) * tileSize);
        playery = Math.floor((y + 0.25) * tileSize);
      }
    }
  }
}

// find tile player is on and render all tiles around it
function render(){
  context.fillStyle = "black";
  if(theRock == 1){
    context.drawImage(rockArray[0], 0, 0, window.innerWidth, window.innerHeight);
  }else if(theRock > 1){
    context.drawImage(rockArray[0], 0, 0, window.innerWidth, window.innerHeight);
    for(let i = 0; i < rocks.length; i++){
      context.drawImage(rocks[i][0], rocks[i][1], rocks[i][2], rocks[i][3], rocks[i][4]);
    }
  }else{
    context.fillStyle = "lightblue";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "black";
  }

  // set vars
  let xindex = Math.floor(playerx / tileSize);
  let yindex = Math.floor(playery / tileSize);
  let xoffset = playerx % tileSize;
  let yoffset = playery % tileSize;

  // goes through all tiles to render
  for(let x = xindex - 1 - (zoom / 2) - Math.ceil(widthOffset / 2 / tileSize); x < xindex + 2 + (zoom / 2)+ Math.ceil(widthOffset / 2 / tileSize); x++){
    for(let y = yindex - 1 - (zoom / 2); y < yindex + 2 + (zoom / 2); y++){
      if(x >= 0 && y >= 0 && x < maze.length && y < maze.length){
        if(maze[x][y] == 1){
          context.fillRect(Math.ceil((x - xindex + zoom / 2 - .25) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2 - .25) * tileSize - yoffset), tileSize, tileSize);
        }else if(maze[x][y] == 2){
          context.fillStyle = "green";
          context.fillRect(Math.ceil((x - xindex + zoom / 2 - .25) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2 - .25) * tileSize - yoffset), tileSize, tileSize);
          context.fillStyle = "black";
        }else if(maze[x][y] == 3){
          context.fillStyle = "red";
          context.fillRect(Math.ceil((x - xindex + zoom / 2 - .25) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2 - .25) * tileSize - yoffset), tileSize, tileSize);
          context.fillStyle = "black";
        }else if(maze[x][y] == 4){
          context.fillStyle = "yellow";
          context.fillRect(Math.ceil((x - xindex + zoom / 2 - .25) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2 - .25) * tileSize - yoffset), tileSize, tileSize);
          context.fillStyle = "black";
        }else if(maze[x][y] == 5){
          context.fillStyle = "darkgreen";
          context.fillRect(Math.ceil((x - xindex + zoom / 2) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2) * tileSize - yoffset), tileSize/2, tileSize/2);
          context.fillStyle = "black";
        }else if(maze[x][y] == 6){
          context.fillStyle = "maroon";
          context.fillRect(Math.ceil((x - xindex + zoom / 2) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2) * tileSize - yoffset), tileSize/2, tileSize/2);
          context.fillStyle = "black";
        }else if(maze[x][y] == 7){
          context.fillStyle = "yellow";
          context.fillRect(Math.ceil((x - xindex + zoom / 2) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2) * tileSize - yoffset), tileSize/2, tileSize/2);
          context.fillStyle = "black";
        }else if(maze[x][y] == 8){
          context.drawImage(rock, Math.ceil((x - xindex + zoom / 2) * tileSize - xoffset + widthOffset / 2), Math.ceil((y - yindex + zoom / 2) * tileSize - yoffset), tileSize/2, tileSize/2);
        }
      }
    }
  }

  // render paint bar
  if(paintMax > 0){
    context.fillStyle = "white";
    context.fillRect(window.innerWidth / 2 - 105, 10, 210, 30);
    context.fillStyle = "yellow";
    context.fillRect(window.innerWidth / 2 - 100, 15, 200 * paint / paintMax, 20);
  }

  // render player
  context.fillStyle = "darkSlateBlue";
  context.fillRect(Math.ceil((zoom / 2 - 0.25) * tileSize + widthOffset / 2), Math.ceil((zoom / 2 - 0.25) * tileSize), tileSize / 2, tileSize / 2);
}

// move events
var leftI;
var upI;
var rightI;
var downI;
let speedIndex = 20;
let speed = Math.ceil(tileSize/speedIndex);
function move(){
  if(event.keyCode == 37 || event.keyCode == 65) {
    // left
    if(leftI) return;
    clearInterval(rightI);
    rightI = null;
    leftI = setInterval(moveLeft, 10);
  }else if(event.keyCode == 38 || event.keyCode == 87) {
    // up
    if(upI) return;
    clearInterval(downI);
    downI = null;
    upI = setInterval(moveUp, 10);
  }else if(event.keyCode == 39 || event.keyCode == 68) {
    // right
    if(rightI) return;
    clearInterval(leftI);
    leftI = null;
    rightI = setInterval(moveRight, 10);
  }else if(event.keyCode == 40 || event.keyCode == 83) {
    // down
    if(downI) return;
    clearInterval(upI);
    upI = null;
    downI = setInterval(moveDown, 10);
  }else if(event.keyCode == 27){
    // to menu
    toMenu();
  }else if(event.keyCode == 69 || event.keyCode == 191){
    // paint
    if(paint > 0 && maze[Math.floor(playerx / tileSize + 0.25)][Math.floor(playery / tileSize + 0.25)] == 0){
      paint--;
      maze[Math.floor(playerx / tileSize + 0.25)][Math.floor(playery / tileSize + 0.25)] = 4;
      render();
    }else if(maze[Math.floor(playerx / tileSize + 0.25)][Math.floor(playery / tileSize + 0.25)] == 4){
      paint++;
      maze[Math.floor(playerx / tileSize + 0.25)][Math.floor(playery / tileSize + 0.25)] = 0;
      render();
    }
  }
}
function stop(){
  if(event.keyCode == 37 || event.keyCode == 65) {
    // left
    clearInterval(leftI);
    leftI = null;
  }else if(event.keyCode == 38 || event.keyCode == 87) {
    // up
    clearInterval(upI);
    upI = null;
  }else if(event.keyCode == 39 || event.keyCode == 68) {
    // right
    clearInterval(rightI);
    rightI = null;
  }else if(event.keyCode == 40 || event.keyCode == 83) {
    // down
    clearInterval(downI);
    downI = null;
  }
}

function moveLeft(){
  if(menu.style.display == "block"){
    clearInterval(leftI);
    leftI = null;
  }else{
    playerx -= speed;
    if(playerx < tileSize){
      playerx = tileSize;
    }
    if((playery + tileSize / 2) / tileSize % 1 == 0){
      if(maze[Math.floor(playerx / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor(playerx / tileSize)][Math.floor(((playery - 1) + tileSize / 2) / tileSize)] == 1){
        playerx = Math.ceil(playerx / tileSize) * tileSize;
      }
    }else{
      if(maze[Math.floor(playerx / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor(playerx / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1){
        playerx = Math.ceil(playerx / tileSize) * tileSize;
      }
    }
    powerUp();
    winCheck();
    render();
  }
}
function moveUp(){
  if(menu.style.display == "block"){
    clearInterval(upI);
    upI = null;
  }else{
    playery -= speed;
    if(playery < tileSize){
      playery = tileSize;
    }
    if((playerx + tileSize / 2) / tileSize % 1 == 0){
      if(maze[Math.floor(playerx / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor(((playerx - 1) + tileSize / 2) / tileSize)][Math.floor(playery / tileSize)] == 1){
        playery = Math.ceil(playery / tileSize) * tileSize;
      }
    }else{
      if(maze[Math.floor(playerx / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor(playery / tileSize)] == 1){
        playery = Math.ceil(playery / tileSize) * tileSize;
      }
    }
    powerUp();
    winCheck();
    render();
  }
}
function moveRight(){
  if(menu.style.display == "block"){
    clearInterval(rightI);
    rightI = null;
  }else{
    playerx += speed;
    if(playerx > tileSize * (maze.length - 1.5)){
      playerx = tileSize * (maze.length - 1.5);
    }
    if((playery + tileSize / 2) / tileSize % 1 == 0){
      if(maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor(((playery - 1) + tileSize / 2) / tileSize)] == 1){
        playerx = Math.floor(playerx / tileSize) * tileSize + tileSize / 2;
      }
    }else{
      if(maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor(playery / tileSize)] == 1 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1){
        playerx = Math.floor(playerx / tileSize) * tileSize + tileSize / 2;
      }
    }
    powerUp();
    winCheck();
    render();
  }
}
function moveDown(){
  if(menu.style.display == "block"){
    clearInterval(downI);
    downI = null;
  }else{
    playery += speed;
    if(playery > tileSize * (maze.length - 1.5)){
      playery = tileSize * (maze.length - 1.5);
    }
    if((playerx + tileSize / 2) / tileSize % 1 == 0){
      if(maze[Math.floor(playerx / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1 || maze[Math.floor(((playerx - 1) + tileSize / 2) / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1){
        playery = Math.floor(playery / tileSize) * tileSize + tileSize / 2;
      }
    }else{
      if(maze[Math.floor(playerx / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 1){
        playery = Math.floor(playery / tileSize) * tileSize + tileSize / 2;
      }
    }
    powerUp();
    winCheck();
    render();
  }
}

// display time beaten
function displayTime(time){
  let seconds = Math.floor(time / 1000) % 60;
  let minutes = Math.floor(time / 60000);
  if(minutes == 0){
    if(seconds < 10){
      winText.innerHTML = "You Win! 0:0" + seconds;
      lastTime.innerHTML = "Last run time was 0:0" + seconds;
    }else{
      winText.innerHTML = "You Win! 0:" + seconds;
      lastTime.innerHTML = "Last run time was 0:" + seconds;
    }
  }else{
    if(seconds < 10){
      winText.innerHTML = "You Win! " + minutes + ":0" + seconds;
      lastTime.innerHTML = "Last run time was " + minutes + ":0" + seconds;
    }else{
      winText.innerHTML = "You Win! " + minutes + ":" + seconds;
      lastTime.innerHTML = "Last run time was " + minutes + ":" + seconds;
    }
  }
}

// check for win
function winCheck(){
  if(maze[Math.floor(playerx / tileSize)][Math.floor(playery / tileSize)] == 3 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor(playery / tileSize)] == 3 || maze[Math.floor(playerx / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 3 || maze[Math.floor((playerx + tileSize / 2) / tileSize)][Math.floor((playery + tileSize / 2) / tileSize)] == 3){
    if(!win){
      if(mode == "normal"){
        let finalTime = Date.now() - startTime;
        displayTime(finalTime);
        winThing.style.display = "block";
        win = true;
      }else if(mode == "levels"){
        level++;
        newMaze(level);
      }
    }
  }
}

// leave to main menu
function toMenu(){
  document.removeEventListener('keydown', move);
  document.removeEventListener('keyup', stop);
  canvas.style.zIndex = -1;
  context.fillStyle = "lightblue";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  menu.style.display = "block";
  winThing.style.display = "none";
  rocks = [];
}

// start a new maze
function newMaze(size){
  paintMax = paint;
  maze = generate(size);
  findStart();
  render();
}

// checks mode input
function modeCheck(){
  if(modeInput.value.toLowerCase() == "levels"){
    mode = "levels";
    level = 1;
  }else{
    mode = "normal";
  }
}

// is int
function isInt(value) {
  if(value == ""){
    return false;
  }
  return !isNaN(value) && parseInt(Number(value)) == value;
}

// dows power up things including check
function powerUp(){
  let power = powerUpCheck();
  if(power == 8){
    theRock++;
    if(theRock > 1){
      rocks.push([rockArray[Math.ceil(Math.random() * 10)], Math.floor(Math.random() * (window.innerWidth - window.innerHeight / 5)), Math.floor(Math.random() * (window.innerHeight - window.innerHeight / 5)), Math.ceil(Math.random() * window.innerHeight / 5) + window.innerHeight / 5, Math.ceil(Math.random() * window.innerHeight / 5) + window.innerHeight / 5]);
    }
  }else if(power == 5){
    speedIndex /= 1.05;
    if(speedIndex <= 7){
      speedIndex = 7;
    }
    speed = Math.ceil(tileSize/speedIndex);
  }else if(power == 6){
    playerx /= tileSize;
    playery /= tileSize;
    zoom += 2;
    tileSize = Math.ceil(window.innerHeight / zoom);
    widthOffset = window.innerWidth - window.innerHeight;
    speed = Math.ceil(tileSize/speedIndex);
    playerx = Math.floor(playerx * tileSize);
    playery = Math.floor(playery * tileSize);
  }else if(power == 7){
    paintMax += 3;
    paint += 3;
  }
}

// checks if player touching powerUp
function powerUpCheck(){
  let thing;
  if(playery / tileSize % 1 < 0.5){
    thing = maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor((playery + 0.5 * tileSize) / tileSize)];
    if(thing > 4){
      maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor((playery + 0.5 * tileSize) / tileSize)] = 0;
      return thing;
    }
  }else if(playery / tileSize % 1 < 0.75){
    thing = maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor(playery / tileSize)];
    if(thing > 4){
      maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor(playery / tileSize)] = 0;
      return thing;
    }
  }else if(playery / tileSize % 1 > 0.75){
    thing = maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor((playery + 0.5 * tileSize) / tileSize)];
    if(thing > 4){
      maze[Math.floor((playerx + 0.25 * tileSize) / tileSize)][Math.floor((playery + 0.5 * tileSize) / tileSize)] = 0;
      return thing;
    }
  }
  return 0;
}

// starts the game from menu
function startGame(){
  canvas.style.zIndex = 5;
  paint = 0;
  paintMax = 0;
  zoom = 10;
  tileSize = Math.ceil(window.innerHeight / zoom);
  widthOffset = window.innerWidth - window.innerHeight;
  speedIndex = 20;
  speed = Math.ceil(tileSize/speedIndex);
  theRock = 0;
  win = false;
  modeCheck();
  menu.style.display = "none";
  winThing.style.display = "none";
  winThing.style.zIndex = 6;
  if(isInt(sizeInput.value)){
    if(sizeInput.value < 5){
      newMaze(5);
      level = 5;
    }else{
      newMaze(sizeInput.value);
      level = sizeInput.value;
    }
  }else{
    newMaze(10);
    level = 10;
  }
  startTime = Date.now();
  document.addEventListener('keydown', move);
  document.addEventListener('keyup', stop);
}