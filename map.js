//-------------------MAP-OG-OVERLAY------------------------
class TileClass {
	constructor(tileNumber, heigth, y, x) {
		this.tileNumber = tileNumber;
		this.height = heigth;
		this.y = y;
		this.x = x;

		this.fixHeigth();
	}
	fixHeigth() {
		//console.log(this.heigth)
		if (this.height > maxHeigth) {
			this.height = maxHeigth;
		} else if (this.height < minHeigth) {
			this.height = minHeigth;
		}

		if (this.y > 0) {
			//compares to line over
			if (this.height < map[this.y - 1][this.x].height - heigthToOver) {
				this.height = map[this.y - 1][this.x].height - heigthToOver;
			} else if (this.height > map[this.y - 1][this.x].height + heigthToOver) {
				this.height = map[this.y - 1][this.x].height + heigthToOver;
			}
		}

		if(this.height == 0) {
			this.type = 'grass';
		} else if ( this.height >= 0) {
			this.type = 'desert';
		} else {
			this.type = 'sea';
		}
	}
	changeHeigth() {
		if (Math.random() < 0.5) {
			if (Math.random() < 0.5) {
				this.height++;
			} else {
				this.height--;
			}
		}
		this.fixHeigth();
	}
	getRegion(){
		if(this.region == undefined){
			if(this.height < 0){
				this.region = 0;
			} else if(this.height >= 0){

				if(map[this.y-1][this.x].region != 0 && map[this.y-1][this.x].region != undefined){//over
					this.region = map[this.y-1][this.x].region;

				} else if (map[this.y][this.x-1].region != 0 && map[this.y][this.x-1].region != undefined){ //left
					this.region = map[this.y][this.x-1].region;

				} else if (map[this.y][this.x+1].region != 0 && map[this.y][this.x+1].region != undefined){ //right
					this.region = map[this.y][this.x+1].region;

				} else if (map[this.y+1][this.x].region != 0 && map[this.y+1][this.x].region != undefined){ //under
					this.region = map[this.y][this.x].region;
				
				} 
				if(this.region != 0 && this.region != undefined){
					regions++;
					this.region = regions;
				}

				if(this.y > 0){
					//over
					if(map[this.y-1][this.x].height >= 0){
						map[this.y-1][this.x].getRegion();
					}
				}
				if(this.x > 0){
					//left
					if(map[this.y][this.x-1].height >= 0){
						map[this.y][this.x-1].getRegion();
					}
				}
				if(this.x < mapWidth-1){
					//right
					if(map[this.y][this.x+1].height >= 0){
						map[this.y][this.x+1].getRegion();
					}
				}
				if(this.y < mapHeight-1){
					//under
					if(map[this.y+1][this.x].height >= 0){
						map[this.y+1][this.x].getRegion();
					}
				}
			}
			overlayblocks[this.tileNumber].innerHTML = this.region;
		}
	}
}

let regions = 0;

//----keybinds

document.addEventListener('keydown', myFunction);

function myFunction(e){
	if(e.code == "KeyA"){
		for(let i = 0; i < mapWidth*mapHeight;i++){
			findTile(i).changeHeigth();
		}
		console.log(e.code);
	}
}

//---------MAPSIZE---------------
const boxSize = 25;
const mapWidth = 56;
const mapHeight = 25;
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
infoEl.style.height = `100px`;

//--------------OVERLAY BLOCKS_-------------

for (var i = 0; i < mapWidth * mapHeight; i++) {
	var clickable = document.createElement('div');
	clickable.classList.add('overlayBlock');
	clickable.id = i;
	clickable.addEventListener('click', selected);
	overlayEl.appendChild(clickable);
}
var overlayblocks = document.getElementsByClassName('overlayBlock');
for (var i = 0; i < overlayblocks.length; i++) {
	overlayblocks[i].style.width = `${boxSize}px`;
	overlayblocks[i].style.height = `${boxSize}px`;
}

//--------------MAPMAKER------------------------

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const maxHeigth = 20;
const minHeigth = -20;
const heightRange = maxHeigth - minHeigth;
const newHeigthRange = 12; // 10 => (-5) - 5
const heigthToOver = 7;

//const mapTypeChances = [ 1, 2 ];
// const mapTotalChance = mapTypeChances.reduce();

let map = [];

createMap();
function createMap() {
	let tileCounter = 0;
	for (var i = 0; i < mapHeight; i++) {
		//i per line
		line = [];
		for (var j = 0; j < mapWidth; j++) {
			if (j == 0) {
				//first tile on new line
				let o = new TileClass(tileCounter, randInt(-newHeigthRange / 2, newHeigthRange / 2), i, j);
				line.push(o);
			} else {
				let o = new TileClass(
					tileCounter,
					line[j - 1].height + randInt(-newHeigthRange / 2, newHeigthRange / 2),
					i,
					j
				); // (-4)-4 range
				line.push(o);
			}
			tileCounter++;
		}
		map.push(line);
	}
}

createRegions();
function createRegions(){
	/*for(let i = 0; i < mapHeight*mapWidth;i++){
		findTile(i).getRegion();
	}*/
	map[0][0].getRegion();
}

//--------------------MODAL-------------------------------

var modal = document.getElementById('myModal');

const spantextEl = document.getElementById('spantext');

// Get the <span> element that closes the modal
var closeBtnEl = document.getElementById('close');

// When the user clicks on <span> (x), close the modal
closeBtnEl.onclick = function() {
	modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
};

//--------------------------------------------------------------

function findTile(tile) {
	let i = Math.floor(tile / mapWidth);
	let j = tile - mapWidth * i;
	return map[i][j];
}

function selected(e) {
	modal.style.display = 'block';
	console.log(findTile(e.target.id));
	spantextEl.innerHTML = `Dette er block ${e.target.id}<br>Denne har: ${findTile(e.target.id).height} hoyde`;

	let pointer = 0;
	for (var i = 0; i < Number(e.target.id); i++) {
		pointer++;
		if (pointer > mapWidth - 1) {
			line++;
			pointer = 0;
		}
	}

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

			ctx.drawImage(tilePic, x, y * 7 / 5, boxSize, boxSize * 7 / 5);

			x += boxSize;
			if (x >= mapWidth * boxSize) {
				x = 0;
				y += boxSize * 5 / 7;
			}
		}
	}
	//setTimeout(drawGame, 1000);
	requestAnimationFrame(drawGame);
}
