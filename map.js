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

const mapWidth = 80;
const mapHeight = 45;
const boxSize = 12;

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

const tileName = [ 'sea', 'desert' ];
//const mapTypeChances = [ 1, 2 ];
// const mapTotalChance = mapTypeChances.reduce();

//const tileFuncs = [desertMaker()]

let nature = [];
let map = [];
let heightMap = [];

createHeightMap();
function createHeightMap() {
	for (var i = 0; i < mapHeight; i++) {
		line = [];
		for (var j = 0; j < mapWidth; j++) {
			if (i == 0 && j == 0) {
				line.push(5);
			} else if (j == 0) {
				line.push(Math.floor(Math.random() * 9) + 1);
			} else {
				let randomHeigth = Math.floor(Math.random() * 5);
				if (line[j - 1] + randomHeigth - 4 <= 0) {
					line.push(1);
				} else if (line[j - 1] + randomHeigth - 2 >= 10) {
					line.push(9);
				} else {
					line.push(line[j - 1] + randomHeigth - 2);
				}
				if (i != 0) {
					if (line[j] < heightMap[i - 1][j] - 3) {
						line[j] = heightMap[i - 1][j] - 3;
					} else if (line[j] > heightMap[i - 1][j] + 3) {
						line[j] = heightMap[i - 1][j] + 3;
					}
				}
			}
		}
		heightMap.push(line);
	}
}

createMap();
function createMap() {
	let makingMapTile = 0;

	for (var i = 0; i < heightMap.length; i++) {
		let mapLine = [];
		for (var j = 0; j < heightMap[i].length; j++) {
			let mapTileType;
			if (heightMap[i][j] < 4) {
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
	//clickable.id = i;
	//clickable.addEventListener('click', selected);
	clickable.style.opacity = 0.1;
	overlayEl.appendChild(clickable);
}
var ho = document.getElementsByClassName('overlayBlock');
for (var i = 0; i < ho.length; i++) {
	ho[i].style.width = `${boxSize}px`;
	ho[i].style.height = `${boxSize}px`;
}

var theList = document.querySelectorAll('.overlayBlock');

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

			tilePic.src = `bilder/${tileName[map[i][j]]}/0.png`;

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
