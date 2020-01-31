//-------------------MAP-OG-OVERLAY------------------------
class TileClass {
	constructor(tileNumber, heigth) {
		this.tileNumber = tileNumber;

		if (heigth > maxHeigth){
			this.height = maxHeigth;
		} else if(heigth < minHeigth){
			this.height = minHeigth;
		} else{
			this.height = heigth;
		}
		
		if(this.height <= 0){
			this.type = 'desert';
		} else{
			this.type = 'sea';
		}
		
		this.food = 2;
		this.wood = 2;
		this.stone = 2;
		this.value = 2;
		this.name = "generic";
	}
}

//---------MAPSIZE---------------
const boxSize = Math.floor(screen.width/50);
const mapWidth = Math.floor(screen.width/boxSize)-5;
const mapHeight = 20;
//-------------------------------

const gameEl = document.getElementById('game');
const overlayEl = document.getElementById('overlay');
gameEl.style.width = `${boxSize * mapWidth}px`;
gameEl.style.height = `${boxSize * mapHeight}px`;
gameEl.width = `${boxSize * mapWidth}`;
gameEl.height = `${boxSize * mapHeight}`;

overlayEl.style.width = `${boxSize * mapWidth}px`;
overlayEl.style.height = `${boxSize * mapHeight}px`;

const infoEl = document.getElementById('info');
infoEl.style.width = `${boxSize * mapWidth}px`;
infoEl.style.marginTop = `${boxSize * mapHeight}px`;
infoEl.style.height = `${boxSize * mapHeight/2}px`;

//--------------MAPMAKER------------------------

const maxHeigth = 8;
const minHeigth = -8;
const heightRange = maxHeigth-minHeigth;
const newHeigthRange = 8; // 8 = (-4)-4
const heigthToOver = 4;

//const mapTypeChances = [ 1, 2 ];
// const mapTotalChance = mapTypeChances.reduce();

let map = [];

createMap();
function createMap() {
	let tileCounter = 0; 
	for (var i = 0; i < mapHeight; i++) { //i per line
		line = [];
		for (var j = 0; j < mapWidth; j++) {
			if (i == 0 && j == 0) { 
				//first tile
				let o = new TileClass(tileCounter,0); // first tile with heigth 0
				line.push(o);
			} else if (j == 0) {
				//first tile on new line
				let o = new TileClass(tileCounter,Math.floor(Math.random() * 4) - 2); //random heigth (-2)-1
				line.push(o);
			} else {
				let o = new TileClass(tileCounter,line[j-1].height + Math.floor(Math.random() * newHeigthRange*+1)-newHeigthRange/2); // (-4)-4 range
				line.push(o)
				}
			if (i != 0) {
				//compares to line over
				if (line[j].height < map[i - 1][j].height - heigthToOver) {
					line[j].height = map[i - 1][j].height - heigthToOver;
				} else if (line[j] > map[i - 1][j] + heigthToOver) {
					line[j] = map[i - 1][j] + heigthToOver;
				}
			}
			tileCounter++;
		}
		map.push(line);
	}
}


for (var i = 0; i < mapWidth * mapHeight; i++) {
	var clickable = document.createElement('div');
	clickable.classList.add('overlayBlock');
	clickable.id = i;
	clickable.addEventListener('click', selected);
	//clickable.style.opacity = 0.1;
	overlayEl.appendChild(clickable);
}
var overlayblocks = document.getElementsByClassName('overlayBlock');
for (var i = 0; i < overlayblocks.length; i++) {
	overlayblocks[i].style.width = `${boxSize}px`;
	overlayblocks[i].style.height = `${boxSize}px`;
}




//--------------------MODAL-------------------------------

var modal = document.getElementById("myModal");

const spantextEl = document.getElementById("spantext");

// Get the <span> element that closes the modal
var closeBtnEl = document.getElementById("close");

// When the user clicks on <span> (x), close the modal
closeBtnEl.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//--------------------------------------------------------------

function findTile(tile){
	let i = Math.floor(tile/mapWidth);
	let j = tile - (mapWidth*i)
	return map[i][j];
}

function selected(e){
	modal.style.display = "block";
	console.log(findTile(e.target.id))
	spantextEl.innerHTML = `Dette er block ${e.target.id}<br>Denne har: ${findTile(e.target.id).value} verdi`;

	let pointer = 0;
	for(var i = 0; i < Number(e.target.id); i++){
		pointer++;
		if(pointer > mapWidth-1){
			line++;
			pointer = 0;
		}
	}

	e.target.innerHTML = '1';

	/*if(map[line][pointer] == 0){
		map[line][pointer] = 1;
	} else{
		map[line][pointer] = 0;
	}*/
}

//--------------------TILES-------------------------------

var x = 0;
var y = 0;

var tileNumber = 0;
var tilePic;

drawGame();
function drawGame() {
	var ctx = gameEl.getContext('2d');

	x = 0;
	y = -boxSize * 2 / 7;

	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			tilePic = document.createElement('img');

			tilePic.src = `bilder/${map[i][j].type}/0.png`;

			ctx.drawImage(tilePic, x, y*7/5, boxSize, boxSize*7/5);

			x += boxSize;
			if (x >= mapWidth * boxSize) {
				x = 0;
				y += boxSize * 5 / 7;
			}
		}
	}
	requestAnimationFrame(drawGame);
}
