//-------------worldgen-----------

const worldgen = 'random'; //random / even

//-----------regions-----------
const regionJoinChance = 0.92;
const regionJoinMinimum = 0.44;

//---------MAPSIZE---------------

const canvasEl = document.getElementById('canvas');
const overlayEl = document.getElementById('overlay');

let boxSize = 20;
let mapWidth = Math.floor(canvasEl.scrollWidth / boxSize);
let mapHeight = Math.floor(canvasEl.scrollHeight / boxSize);

//--------------MAPMAKER------------------------

const maxHeight = 20;
const minHeight = -20;
const heightRange = maxHeight - minHeight;
const newHeightRange = 5; // 5 => (-5) - 5
const heightToOver = 5;

//----------------wind----------------------

const windChance = 0.92;
let currentDir = 'west';

//-------------CLIMATECONFIG------------

const climateVariation = 2;
const topClimate = -10;
const heigthClimateValue = 1 / 3;
const minClimate = topClimate - Math.floor(maxHeight * heigthClimateValue) - climateVariation;
const maxClimate = mapHeight + topClimate + climateVariation;
const seaClimate = -2;

//------------TEMPERATURE----------------

const temperatureChange = 3;
const minTemperature = minClimate - temperatureChange;
const maxTemperature = maxClimate + temperatureChange;

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

//const mapTypeChances = [ 1, 2 ];
// const mapTotalChance = mapTypeChances.reduce();
