//Declare and initialize global variables
let brains = [], colors = ["cyan", "magenta", "yellow","black"], score = 0, clicks = 10;

//Use Javascript to create game grid
for(let i=0; i<10; i++){
  document.getElementById("board").innerHTML += "<div class='row' id='"+String(i)+"'></div>";
  for(let j=0; j<10; j++){
    document.getElementById(i).innerHTML += "<div class='box' id='"+String(i)+String(j)+"'></div>";
  }
}

//Add event listeners
for(let i=1; i<10; i++){
  for(let j=0; j<10; j++){
    document.getElementById(String(i)+String(j)).addEventListener("mouseover", function(){
      upside(String(i)+String(j));
    });
    document.getElementById(String(i)+String(j)).addEventListener("click", function(){
      wildCard(String(i)+String(j));
    });
  }
}

//Populate two-dimensional array named brains with random values
for(let i=0; i<10; i++){
  brains.push([]);
  for(let j=0; j<10; j++){
      brains[i].push(Math.floor(Math.random()*4));
  }
}

//Check out the console to see what the brains array looks like after it is populated. Notice how the game grid's colors mirror the values in the brains array.
console.log(brains);

//The update board functions makes it so each div in the game grid takes on the correct color, based on the values in the brains array.
//It also updates the score and clicks and shows a game over once clicks equals zero.
updateBoard();

function updateBoard(){
  for(let i=0; i<10; i++){;
    for(let j=0; j<10; j++){
      document.getElementById(String(i)+String(j)).style.backgroundColor = colors[brains[i][j]];
    }
  }
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("clicks").innerHTML = "Clicks: " + clicks;

  if(clicks===0){
    document.getElementById("board").innerHTML = "<img src='gameover.jpg' width='409'>";
  }
}

//The upside function swaps the value of a cell with with the value directly above it.
//Notice just the values in the brains array are being changed. The updateBoard function will change the colors of the divs.
//The event listener sends the cell as an argument to the upside function. So if the id sent is "34", cell[0] would represent "3" and cell[1] would be "4" in the function below.
function upside(cell){
  [brains[cell[0]][cell[1]], brains[cell[0]-1][cell[1]]] = [brains[cell[0]-1][cell[1]], brains[cell[0]][cell[1]]]; // [a, b] = [b, a]; is a terrific way to swap variables in Javascript.
  updateBoard();
  checkRows();
}

//Source for line 65: https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
//Checks each row to see if the colors/values all match. Matching rows are then cleared, and the rows above are moved down.
//A new randomized row is placed at the top.
function checkRows(){
  for(let i=0; i<10; i++){
    if(brains[i].every( (val, i, arr) => val === arr[0] ) ){
      score++;
      for(let j=0; j<10; j++){
        for(let k=i; k>0; k--){
          brains[k][j]=brains[k-1][j];
        }
        brains[0][j] = Math.floor(Math.random()*4);
      }
      updateBoard();
    }
  }
}

//The wildCard function allows the user to click on a cell and rotate through colors.
//When a user runs out of wildcard clicks, the game is over.
function wildCard(cell){
  if(brains[cell[0]][cell[1]]===3){
    brains[cell[0]][cell[1]] = 0;
  } else {
    brains[cell[0]][cell[1]]++;
  }
  clicks--;
  updateBoard();
  checkRows();
}