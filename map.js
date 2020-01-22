//-------------------MAP-OG-OVERLAY------------------------
class NatureClass {
	constructor(mapTile, type, food, wood, stone, gold, name) {
		this.mapTile = mapTile;
		this.type = type;
		this.food = food;
		this.wood = wood;
		this.stone = stone;
		this.gold = gold;
		this.name = name;
	}
}

const mapWidth = 60;
const mapHeight = 30;
const boxSize = 25;

const gameEl = document.getElementById('game');
const overlayEl = document.getElementById('overlay');
gameEl.style.width = `${boxSize * mapWidth}px`;
gameEl.style.height = `${boxSize * mapHeight}px`;
overlayEl.style.width = `${boxSize * mapWidth}px`;
overlayEl.style.height = `${boxSize * mapHeight}px`;
var overlayBlocks = document.getElementsByClassName('overlayBlock');
for (i = 0; i < overlayBlocks.length; i++) {
	overlayBlocks[i].style.width = `${boxSize * mapWidth}px`;
	overlayBlocks[i].style.height = `${boxSize * mapHeight}px`;
}

const infoEl = document.getElementById('info');
infoEl.style.width = `${boxSize * mapWidth}px`;
infoEl.style.marginTop = `${boxSize * mapHeight}px`;

const tileName = [ 'desert', 'sea' ];
const mapTypeChances = [ 2, 1 ];
const mapTotalChance = mapTypeChances.reduce();

//const tileFuncs = [desertMaker()]

let nature = [];
let map = [];
let heightMap = [];

createHeightMap();
function createHeightMap() {
	for (var i = 0; i < mapHeight; i++) {
		let mapLine = [];
		for (var j = 0; j < mapWidth; j++) {
			const randomNum = Math.random() * 2 - 1;
			mapLine.push(randomNum);
		}
		heightMap.push(mapLine);
	}
}

createMap();
function createMap() {
	let makingMapTile = 0;

	for (var i = 0; i < heightMap; i++) {
		let mapLine = [];
		for (var j = 0; j < heightMap[i].length; j++) {
			let mapTileType;
			if (heightMap[i][j] < 0) {
				mapTileType = 0;
			} else {
				mapTileType = 1;
			}
			mapLine.push(mapTileType);
			if (mapTileType === 0) {
				seaMaker(makingMapTile); // nature/...
			} else if (mapTileType === 1) {
				desertMaker(makingMapTile); // nature/...
			}
			makingMapTile++;
		}
		map.push(mapLine);
	}
}

for (var i = 0; i < mapWidth * mapHeight; i++) {
	var clickable = document.createElement('div');
	clickable.classList.add('overlayBlock');
	clickable.id = i;
	//clickable.addEventListener('click', selected);
	clickable.style.opacity = 0.1;
	overlayEl.appendChild(clickable);
}

var theList = document.querySelectorAll('.overlayBlock');

//--------------------TILES-------------------------------

var x = 0;
var y = 0;

var tileNumber = 0;
var tilePic;

var gameWidth = 38;

drawGame();
function drawGame() {
	var ctx = gameEl.getContext('2d');

	x = 0;
	y = -boxSize * 2 / 5;

	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			tilePic = document.createElement('img');

			tilePic.src = `bilder/${tileName[map[i][j]]}/0.png`;

			ctx.drawImage(tilePic, x, y, boxSize, boxSize * 7 / 5);

			x += boxSize;
			if (x >= mapWidth * boxSize) {
				x = 0;
				y += boxSize;
			}
		}
	}
	requestAnimationFrame(drawGame);
}
