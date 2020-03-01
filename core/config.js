//-----------regions-----------
const regionJoinChance = 0.92;
const regionJoinMinimum = 0.44;

//---------MAPSIZE---------------

let boxSize = 20;
let mapWidth = 85;
let mapHeight = 37;

if (screen.width >= 1850) {
	boxSize = 20;
	mapWidth = 96;
	mapHeight = 43;
} else {
	boxSize = 20;
	mapWidth = 85;
	mapHeight = 37;
}

//--------------MAPMAKER------------------------

const maxHeight = 20;
const minHeight = -20;
const heightRange = maxHeight - minHeight;
const newHeightRange = 12; // 10 => (-5) - 5
const heightToOver = 7;

//----------------wind----------------------

const windChance = 0.92;

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
