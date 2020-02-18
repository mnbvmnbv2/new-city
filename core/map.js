//-------------------MAP-OG-OVERLAY------------------------
class TileClass {
	constructor(tileNumber, height, y, x) {
		this.tileNumber = tileNumber;
		this.height = height;
		this.y = y;
		this.x = x;
		this.name = 'OK';

		this.fixHeight();
		this.setClimate();
		this.setWeather();
		this.setTemperature();
		this.setResource();
	}
	fixHeight() {
		if (this.height > maxHeight) {
			this.height = maxHeight;
		} else if (this.height < minHeight) {
			this.height = minHeight;
		}

		if (this.y > 0) {
			//compares to line over
			if (this.height < this.north().height - heightToOver) {
				this.height = this.north().height - heightToOver;
			} else if (this.height > this.north().height + heightToOver) {
				this.height = this.north().height + heightToOver;
			}
		}

		if (this.height == 0 || this.height == 1) {
			this.type = 'sand';
		} else if (this.height >= 15) {
			this.type = 'mountain';
		} else if (this.height >= 10) {
			this.type = 'desertDune';
		} else if (this.height >= 0) {
			this.type = 'desert';
		} else if (this.height >= -10) {
			this.type = 'coast';
		} else {
			this.type = 'sea';
		}
	}
	changeHeight() {
		if (Math.random() < 0.5) {
			if (Math.random() < 0.5) {
				this.height++;
			} else {
				this.height--;
			}
		}
		this.fixHeight();
	}
	north() {
		try {
			return map[this.y - 1][this.x];
		} catch (err) {
			return false;
		}
	}
	west() {
		try {
			return map[this.y][this.x - 1];
		} catch (err) {
			return false;
		}
	}
	east() {
		try {
			return map[this.y][this.x + 1];
		} catch (err) {
			return false;
		}
	}
	south() {
		try {
			return map[this.y + 1][this.x];
		} catch (err) {
			return false;
		}
	}
	setClimate() {
		if (this.height >= 0) {
			this.climate =
				Math.floor(this.y - this.height * heigthClimateValue + topClimate) +
				randInt(-climateVariation, climateVariation);
		} else {
			this.climate = Math.floor(this.y + topClimate) + seaClimate + randInt(-climateVariation, climateVariation);
		}
	}
	setWeather() {
		this.weather = this.pickInDatabase(Weather)[0];
	}
	setTemperature() {
		this.temperature = this.climate + randInt(-temperatureChange, temperatureChange);
	}
	changeTemperature() {
		this.temperature += randInt(-1, 1);
		if (this.temperature > this.climate + temperatureChange) {
			this.temperature = this.climate + temperatureChange;
		} else if (this.temperature < this.climate - temperatureChange) {
			this.temperature = this.climate - temperatureChange;
		}
	}
	wind(dir) {
		if (Math.random() < windChance) {
			try {
				this[dir]().weather = this.weather;
				this.setWeather();
			} catch (err) {}
		}
	}
	checkRegionTo(tile) {
		try {
			if (tile.region != 0 && tile.region != undefined) {
				//if tile has region
				if (Math.random() < regionJoinChance + (regionJoinMinimum - regions[tile.region - 1].length / 10)) {
					//chance for this to join its region
					this.region = tile.region; //this gets its region
					regions[tile.region - 1].push(this); //join the region array
				}
			}
		} catch (err) {}
	}
	setRegion() {
		try {
			if (this.height < 0) {
				this.region = 0;
			}
			if (this.region == undefined) {
				if (this.height >= 0) {
					//tests if the tiles around has a region in a random order
					let aroundTiles = [ this.north(), this.west(), this.east(), this.south() ];
					shuffle(aroundTiles);
					aroundTiles.forEach((element) => this.checkRegionTo(element));

					//if this tile did not get a region, then it creates a new one
					if (this.region == undefined) {
						numberOfRegions++;
						regions.push([]);
						this.region = numberOfRegions;
						regions[map[this.y][this.x].region - 1].push(this); //join the region array
					}

					//makes the tiles around do the regionCheck
					aroundTiles.forEach((element) => element.setRegion());
				}
			}
		} catch (err) {}
	}
	checkSeaRegionTo(tile) {
		try {
			if (tile.seaRegion != 0 && tile.seaRegion != undefined) {
				//if tile has region
				if (
					Math.random() <
					regionJoinChance + (regionJoinMinimum - seaRegions[tile.seaRegion - 1].length / 10)
				) {
					//chance for this to join its region
					this.seaRegion = tile.seaRegion; //this gets its region
					seaRegions[tile.seaRegion - 1].push(this); //join the region array
				}
			}
		} catch (err) {}
	}
	setSeaRegion() {
		try {
			if (this.height >= 0) {
				this.seaRegion = 0;
			}
			if (this.seaRegion == undefined) {
				if (this.height < 0) {
					//tests if the tiles around has a region in a random order
					let aroundTiles = [ this.north(), this.west(), this.east(), this.south() ];
					shuffle(aroundTiles);
					aroundTiles.forEach((element) => this.checkSeaRegionTo(element));

					//if this tile did not get a region, then it creates a new one
					if (this.seaRegion == undefined) {
						numberOfSeaRegions++;
						seaRegions.push([]);
						this.seaRegion = numberOfSeaRegions;
						seaRegions[map[this.y][this.x].seaRegion - 1].push(this); //join the region array
					}

					//makes the tiles around do the regionCheck
					aroundTiles.forEach((element) => element.setSeaRegion());
				}
			}
		} catch (err) {}
	}
	toString() {
		return `Name : ${this.name}
		Heigth: ${this.height}
		x : ${this.x}
		y : ${this.y}
		Region : ${this.region}
		Mean-temp : ${this.climate}
		Temperature : ${this.temperature}
		Weather : ${this.weather}
		Resource : ${this.resource}`;
	}
	setResource() {
		if (this.height >= 0) {
			this.resource = this.pickInDatabase(Resources.land)[0];
		} else {
			this.resource = this.pickInDatabase(Resources.sea)[0];
		}
	}
	pickInDatabase(database) {
		let totalChance = 0;
		for (let name in database) {
			totalChance += database[name].chance;
		}

		let chance = Math.random() * totalChance;
		let toNow = 0;
		for (let name in database) {
			if (chance < database[name].chance + toNow) {
				return [ name, database[name] ];
			} else {
				toNow += database[name].chance;
			}
		}
	}
}

let numberOfRegions = 0;
let regions = [];
let numberOfSeaRegions = 0;
let seaRegions = [];
const regionJoinChance = 0.92;
const regionJoinMinimum = 0.44;

//fisher-yates shuffle
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

//---------------ON-ALL--------------------------------

function onAll(fun, arg) {
	for (let i = 0; i < mapWidth * mapHeight; i++) {
		findTile(i)[fun](arg);
	}
}

function inverseOnAll(fun, arg) {
	for (let i = mapWidth * mapHeight - 1; i > -1; i--) {
		findTile(i)[fun](arg);
	}
}

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

//----keybinds

document.addEventListener('keydown', keyClick);

function keyClick(e) {
	if (e.code == 'KeyA') {
		for (let i = 0; i < mapWidth * mapHeight; i++) {
			findTile(i).changeHeight();
		}
	} else if (e.code == 'KeyQ') {
		colorModes.none();
	} else if (e.code == 'KeyW') {
		mapMode('height');
	} else if (e.code == 'KeyE') {
		mapMode('region');
	} else if (e.code == 'KeyR') {
		mapMode('resource');
	} else if (e.code == 'KeyT') {
		mapMode('temperature');
	} else if (e.code == 'KeyY') {
		mapMode('climate');
	} else if (e.code == 'KeyU') {
		mapMode('weather');
	} else if (e.code == 'KeyI') {
		mapMode('seaRegion');
	} else if (e.code == 'Escape') {
		openMenu();
	}
}

//---------MAPSIZE---------------
let boxSize = 20;
let mapWidth = 70;
let mapHeight = 30;

console.log(screen.width);
if (screen.width >= 1850) {
	boxSize = 20;
	mapWidth = 96;
	mapHeight = 43;
} else {
	boxSize = 20;
	mapWidth = 70;
	mapHeight = 30;
}
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

const maxHeight = 20;
const minHeight = -20;
const heightRange = maxHeight - minHeight;
const newHeightRange = 12; // 10 => (-5) - 5
const heightToOver = 7;

//-------------CLIMATECONFIG------------

const climateVariation = 2;
const topClimate = -10;
const heigthClimateValue = 1 / 3;
const minClimate = topClimate - Math.floor(maxHeight * heigthClimateValue) - climateVariation;
const maxClimate = mapHeight + topClimate + climateVariation;
const seaClimate = -2;

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

const windChance = 0.92;

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

//------------TEMPERATURE----------------

const temperatureChange = 3;
const minTemperature = minClimate - temperatureChange;
const maxTemperature = maxClimate + temperatureChange;

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

//---------------------findtile----------------------------

function findTile(tile) {
	let i = Math.floor(tile / mapWidth);
	let j = tile - mapWidth * i;
	return map[i][j];
}

//---------------Tileclick---------------

let activeTile = 0;

function selected(e) {
	console.log(findTile(e.target.id));
	activeTile = e.target.id;
	openInfo();
}

//----------------------------------

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
