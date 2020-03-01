class Map {
	constructor(width, height) {
		this.height = height;
		this.width = width;
	}
}

//-------------------MAP-OG-OVERLAY------------------------

let numberOfRegions = 0;
let regions = [];
let numberOfSeaRegions = 0;
let seaRegions = [];

//------------------MAPMODES----COLORS-----------------

let activeMode = 'none';

function mapMode(mode) {
	for (var i = 0; i < mapHeight * mapWidth; i++) {
		overlayblocks[i].innerHTML = findTile(i)[mode];
		overlayblocks[i].style.background = colorModes[mode](findTile(i)[mode]);
	}
	activeMode = mode;
}

const randomRegionColors = Math.floor(Math.random() * 9) + 2;

let colorModes = {
	none        : function() {
		for (var i = 0; i < mapHeight * mapWidth; i++) {
			overlayblocks[i].innerHTML = '';
			overlayblocks[i].style.background = 'rgba(0,0,0,0)';
		}
		activeMode = 'none';
	},
	height      : function(height) {
		if (height >= 0) {
			return `rgba(90,60,20,${height / maxHeight})`;
		} else {
			return `rgba(45,20,90,${height / minHeight})`;
		}
	},
	region      : function(region) {
		let possibles = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
		let color = '#';
		let offset = randomRegionColors;
		for (var i = 0; i < 6; i++) {
			color += possibles[(region + offset * i + ((region * offset) % 11) * i) % possibles.length]; //hashing?
		}
		if (region == 0) {
			return 'rgba(0,0,0,0)';
		}
		return color;
	},
	seaRegion   : function(seaRegion) {
		if (seaRegion == 0) {
			return 'rgba(0,0,0,0)';
		}
		return `hsla(${seaRegion * 49},${(seaRegion * 7) % 30 + 60}%,${(seaRegion * 17) % 30 + 35}%,1)`;
	},
	climate     : function(climate) {
		if (climate < 0) {
			return `rgba(0,0,150,${climate / minClimate})`;
		} else {
			return `rgba(200,0,0,${climate / maxClimate})`;
		}
	},
	temperature : function(temperature) {
		if (temperature < 0) {
			return `rgba(0,0,150,${temperature / minTemperature})`;
		} else {
			return `rgba(200,0,0,${temperature / maxTemperature})`;
		}
	},
	weather     : function(weather) {
		return `hsla(${Object.keys(Weather).indexOf(weather) * 82},85%,50%,0.2)`;
	},
	resource    : function(resource) {
		return `rgba(0,0,0,0) url(bilder/resources/${resource}.png) no-repeat center`;
	}
};

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

//-------------WEATHER-------------------

const Weather = {
	fair   : { chance: 10 },
	sunny  : { chance: 5 },
	cloudy : { chance: 5 },
	windy  : { chance: 3 },
	storm  : { chance: 1 },
	hurric : { chance: 0.5 }
};

//-------------RESOURCES----------------------

const Resources = {
	sea  : {
		fish   : { chance: 10 },
		whale  : { chance: 2 },
		sharks : { chance: 0.5 }
	},

	land : {
		gold   : { chance: 0.1 },
		iron   : { chance: 0.5 },
		copper : { chance: 0.3 },
		cattle : { chance: 2 },
		wheat  : { chance: 3 }
	}
};

//------------WIND--------------------------

function wind(direction) {
	if (direction == 'north') {
		onAll('wind', 'north');
		for (tile of map[mapHeight - 1]) {
			if (Math.random() < windChance) {
				tile.setWeather();
			}
		}
	} else if (direction == 'west') {
		onAll('wind', 'west');
		for (line of map) {
			if (Math.random() < windChance) {
				line[mapWidth - 1].setWeather();
			}
		}
	} else if (direction == 'east') {
		inverseOnAll('wind', 'east');
		for (line of map) {
			if (Math.random() < windChance) {
				line[0].setWeather();
			}
		}
	} else if (direction == 'south') {
		inverseOnAll('wind', 'south');
		for (tile of map[0]) {
			if (Math.random() < windChance) {
				tile.setWeather();
			}
		}
	}
}

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
				let o = new TileClass(tileCounter, randInt(-newHeightRange / 2, newHeightRange / 2), i, j);
				line.push(o);
			} else {
				let o = new TileClass(
					tileCounter,
					line[j - 1].height + randInt(-newHeightRange / 2, newHeightRange / 2),
					i,
					j
				);
				line.push(o);
			}
			tileCounter++;
		}
		map.push(line);
	}
}

createRegions();
function createRegions() {
	for (let i = 0; i < mapHeight * mapWidth; i++) {
		findTile(i).setRegion();
		findTile(i).setSeaRegion();
	}
}

//--------------------TILES-------------------------------

let x = 0;
let y = 0;

let tileNumber = 0;
let tilePic;

drawGame();
function drawGame() {
	let ctx = gameEl.getContext('2d');

	x = 0;
	y = -boxSize * 2 / 7;

	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			tilePic = document.createElement('img');

			tilePic.src = `pictures/tiles/${map[i][j].type}/0.png`;

			ctx.drawImage(tilePic, x, y * 7 / 5, boxSize, boxSize * 7 / 5);

			x += boxSize;
			if (x >= mapWidth * boxSize) {
				x = 0;
				y += boxSize * 5 / 7;
			}
		}
	}
	setTimeout(drawGame, 300);
	//requestAnimationFrame(drawGame);
}
