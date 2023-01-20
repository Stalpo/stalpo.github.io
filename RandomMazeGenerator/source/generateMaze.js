/*

maze codes for reference:
  movementArray
0 = has not moved
1 = up
2 = left
3 = down
4 = right
  usedArray
0 = nope
1 = yes
2 = yes but dont branch
  theMaze
0 = nothing
1 = wall
2 = start
3 = finish
4 = paint
5 = speed up
6 = sight up
7 = paint up
8 = rock

*/

// arrays
let movementsArray;
let usedArray;
let theMaze;

// sets up other arrays
function makeArray(size){
  let theArray = [];
  for(let i = 0; i < size; i++){
    let newArray = [];
    for(let x = 0; x < size; x++){
      newArray.push(0);
    }
    theArray.push(newArray);
  }
  return theArray;
}

// sets up maze array
function setUpMaze(size){
  let theArray = [];
  for(let x = 0; x < size * 2 + 1; x++){
    let newArray = [];
    for(let y = 0; y < size * 2 + 1; y++){
      if(x % 2 == 1 && y % 2 == 1){
        newArray.push(0);
      }else{
        newArray.push(1);
      }
    }
    theArray.push(newArray);
  }
  return theArray;
}

// gets maze space
function getMazeSpace(pos){
  return pos * 2 + 1;
}

// check if space in direction is used
function checkDir(dir, x, y){
  if(dir == 1 && y > 0){
    if(usedArray[x][y - 1] == 0){
      return true;
    }
  }else if(dir == 2 && x > 0){
    if(usedArray[x - 1][y] == 0){
      return true;
    }
  }else if(dir == 3 && y < movementsArray.length - 1){
    if(usedArray[x][y + 1] == 0){
      return true;
    }
  }else if(dir == 4 && x < movementsArray.length - 1){
    if(usedArray[x + 1][y] == 0){
      return true;
    }
  }
  return false;
}

// updates used array
function updateUsed(dir, x, y){
  if(dir == 1){
    usedArray[x][y - 1] = 1;
  }else if(dir == 2){
    usedArray[x - 1][y] = 1;
  }else if(dir == 3){
    usedArray[x][y + 1] = 1;
  }else{
    usedArray[x + 1][y] = 1;
  }
}

// updates movements array
function updateMovements(dir, x, y){
  if(dir == 1){
    movementsArray[x][y - 1] = 3;
  }else if(dir == 2){
    movementsArray[x - 1][y] = 4;
  }else if(dir == 3){
    movementsArray[x][y + 1] = 1;
  }else{
    movementsArray[x + 1][y] = 2;
  }
}

// make a random move and update arrays
function randomMove(posx, posy){
  if(checkDir(1, posx, posy) || checkDir(2, posx, posy) || checkDir(3, posx, posy) || checkDir(4, posx, posy)){
    while(true){
      let direction = Math.ceil(Math.random() * 4);
      // 1 up 2 left 3 down 4 right
      if (checkDir(direction, posx, posy)){
        updateUsed(direction, posx, posy);
        updateMovements(direction, posx, posy);
        return direction;
      }
    }
  }else{
    return 0;
  }
}

// find random used tile
function randomUsed(){
  let possible = [];
  for(let x = 0; x < movementsArray.length; x++){
    for(let y = 0; y < movementsArray.length; y++){
      if(usedArray[x][y] == 1){
        if(y > 0){
          if(usedArray[x][y - 1] > 0){
            if(x > 0){
              if(usedArray[x - 1][y] > 0){
                if(y < usedArray.length - 1){
                  if(usedArray[x][y + 1] > 0){
                    if(x < usedArray.length - 1){
                      if(usedArray[x + 1][y] > 0){
                        usedArray[x][y] = 2;
                        continue;
                      }
                    }else{
                      usedArray[x][y] = 2;
                      continue;
                    }
                  }
                }else{
                  if(x < usedArray.length - 1){
                    if(usedArray[x + 1][y] > 0){
                      usedArray[x][y] = 2;
                      continue;
                    }
                  }else{
                    usedArray[x][y] = 2;
                    continue;
                  }
                }
              }
            }else{
              if(y < usedArray.length - 1){
                if(usedArray[x][y + 1] > 0){
                  if(x < usedArray.length - 1){
                    if(usedArray[x + 1][y] > 0){
                      usedArray[x][y] = 2;
                      continue;
                      // random comment to see if mr goodman finds it also please don't make fun of this copy and paste mess I didn't want to fix it (I was really tired)
                    }
                  }else{
                    usedArray[x][y] = 2;
                    continue;
                  }
                }
              }else{
                if(x < usedArray.length - 1){
                  if(usedArray[x + 1][y] > 0){
                    usedArray[x][y] = 2;
                    continue;
                  }
                }else{
                  usedArray[x][y] = 2;
                  continue;
                }
              }
            }
          }
        }else{
          if(x > 0){
            if(usedArray[x - 1][y] > 0){
              if(y < usedArray.length - 1){
                if(usedArray[x][y + 1] > 0){
                  if(x < usedArray.length - 1){
                    if(usedArray[x + 1][y] > 0){
                      usedArray[x][y] = 2;
                      continue;
                    }
                  }else{
                    usedArray[x][y] = 2;
                    continue;
                  }
                }
              }else{
                if(x < usedArray.length - 1){
                  if(usedArray[x + 1][y] > 0){
                    usedArray[x][y] = 2;
                    continue;
                  }
                }else{
                  usedArray[x][y] = 2;
                  continue;
                }
              }
            }
          }else{
            if(y < usedArray.length - 1){
              if(usedArray[x][y + 1] > 0){
                if(x < usedArray.length - 1){
                  if(usedArray[x + 1][y] > 0){
                    usedArray[x][y] = 2;
                    continue;
                  }
                }else{
                  usedArray[x][y] = 2;
                  continue;
                }
              }
            }else{
              if(x < usedArray.length - 1){
                if(usedArray[x + 1][y] > 0){
                  usedArray[x][y] = 2;
                  continue;
                }
              }else{
                usedArray[x][y] = 2;
                continue;
              }
            }
          }
        }
        possible.push([x, y]);
      }
    }
  }
  if(possible.length == 0){
    return [usedArray.length];
  }
  while(true){
    if(Math.floor(Math.random() * possible.length) == 0){
      return possible[possible.length - 1];
    }else{
      possible.pop();
    }
  }
}

// finishes the maze
function finish(){
  let checkboxes = document.querySelectorAll('input[name="powerUp"]:checked');
  let values = [];
checkboxes.forEach((checkbox) => {
    values.push(checkbox.value);
});
  let speed = values.includes("speedUp");
  let sight = values.includes("sightUp");
  let paint = values.includes("paintUp");
  let rock = values.includes("rockUp");
  for(let x = 0; x < movementsArray.length; x++){
    for(let y = 0; y < movementsArray.length; y++){
      if(movementsArray[x][y] == 1){
        theMaze[getMazeSpace(x)][getMazeSpace(y) - 1] = 0;
      }else if(movementsArray[x][y] == 2){
        theMaze[getMazeSpace(x) - 1][getMazeSpace(y)] = 0;
      }else if(movementsArray[x][y] == 3){
        theMaze[getMazeSpace(x)][getMazeSpace(y) + 1] = 0;
      }else if(movementsArray[x][y] == 4){
        theMaze[getMazeSpace(x) + 1][getMazeSpace(y)] = 0;
      }
      if(Math.floor(Math.random() * 1000) == 0 && theMaze[getMazeSpace(x)][getMazeSpace(y)] == 0 && rock){
        theMaze[getMazeSpace(x)][getMazeSpace(y)] = 8;
      }else if(Math.floor(Math.random() * 275) == 0 && theMaze[getMazeSpace(x)][getMazeSpace(y)] == 0 && speed){
        theMaze[getMazeSpace(x)][getMazeSpace(y)] = 5;
      }else if(Math.floor(Math.random() * 275) == 1 && theMaze[getMazeSpace(x)][getMazeSpace(y)] == 0 && sight){
        theMaze[getMazeSpace(x)][getMazeSpace(y)] = 6;
      }else if(Math.floor(Math.random() * 275) == 2 && theMaze[getMazeSpace(x)][getMazeSpace(y)] == 0 && paint){
        theMaze[getMazeSpace(x)][getMazeSpace(y)] = 7;
      }
    }
  }
}

export function generate(size){
  // make arrays
  movementsArray = makeArray(size);
  usedArray = makeArray(size);
  theMaze = setUpMaze(size);

  // start position
  let posx = Math.floor(Math.random() * size);
  let posy = Math.floor(Math.random() * size);
  usedArray[posx][posy] = 1;
  theMaze[getMazeSpace(posx)][getMazeSpace(posy)] = 2;

  // create routes
  let length = Math.floor(Math.random() * size * size / 10 + size * size / 10);
  let done = false;
  while(true){
    for(let i = 0; i < length; i++){
      let move = randomMove(posx, posy);
      if(move == 0){
        break;
      }else if(move == 1){
        posy -= 1;
      }else if(move == 2){
        posx -= 1;
      }else if(move == 3){
        posy += 1;
      }else{
        posx += 1;
      }
    }
    let newpos = randomUsed();
    if(newpos[0] == usedArray.length){
      break;
    }
    posx = newpos[0];
    posy = newpos[1];
  }

  // make end block
  theMaze[getMazeSpace(posx)][getMazeSpace(posy)] = 3;
  usedArray[posx][posy] = 2;

  finish();
  return theMaze;
}