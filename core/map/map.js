//--------imports------------

const canvasEl = document.getElementById('canvas');
const overlayEl = document.getElementById('overlay');
canvasEl.style.width = `${boxSize * mapWidth}px`;
canvasEl.style.height = `${boxSize * mapHeight}px`;
canvasEl.width = `${boxSize * mapWidth}`;
canvasEl.height = `${boxSize * mapHeight}`;

overlayEl.style.width = `${boxSize * mapWidth}px`;
overlayEl.style.height = `${boxSize * mapHeight}px`;

const footerEl = document.getElementById('footer');
footerEl.style.width = `${boxSize * mapWidth}px`;
footerEl.style.marginTop = `${boxSize * mapHeight}px`;
footerEl.style.height = `100px`;

//-------------------------------------------------

class Map {
	constructor(width, height) {
		this.height = height;
		this.width = width;

		this.map = [];

		this.createOverlay();
		this.overlayblocks = document.getElementsByClassName('overlayBlock');

		this.createTiles();

		this.randomRegionColors = Math.floor(Math.random() * 9) + 2;

		this.landRegion = []; //(regions)
		this.seaRegion = []; //(regions)

		this.createRegions();

		this.activeMode = 'none';
	}
	createOverlay() {
		for (var i = 0; i < this.width * this.height; i++) {
			var clickable = document.createElement('div');
			clickable.classList.add('overlayBlock');
			clickable.id = i;
			clickable.addEventListener('click', selected);
			clickable.style.width = `${boxSize}px`;
			clickable.style.height = `${boxSize}px`;
			overlayEl.appendChild(clickable);
		}
	}
	createTiles() {
		let tileCounter = 0;
		for (var i = 0; i < this.height; i++) {
			//i per line
			let line = [];
			for (var j = 0; j < this.width; j++) {
				let o = new TileClass(this, tileCounter, i - Math.floor(this.height/2), j - Math.floor(this.width/2));
				line.push(o);
				tileCounter++;
			}
			this.map.push(line);
		}

		//starts mapgenerating at 0.0 (in the middle of the screen)
		//this.map.map[0][0].generateLandscape();
	}
	onAll(func, arg) {
		for (let i = 0; i < this.width * this.height; i++) {
			this.findTile(i)[func](arg);
		}
	}
	inverseOnAll(func, arg) {
		for (let i = this.width * this.height - 1; i > -1; i--) {
			this.findTile(i)[func](arg);
		}
	}
	findTile(tile) {
		let i = Math.floor(tile / this.width);
		let j = tile - this.width * i;
		return this.map[i][j];
	}
	createRegions() {
		this.onAll('setRegion','landRegion');
		this.onAll('setRegion','seaRegion');
	}
	mapMode(mode) {
		for (var i = 0; i < this.height * this.width; i++) {
			try{
				//tries to write the value of the attribute being checked in each overlayblock
				this.overlayblocks[i].innerHTML = this.findTile(i)[mode];
			} catch (err) {
				//if the value does'nt exist, then write nothing (for mapmode none)
				this.overlayblocks[i].innerHTML = '';
			}
			this.overlayblocks[i].style.background = this.colorModes[mode](this.findTile(i)[mode]);
		}
		this.activeMode = mode;
	}
	colorModes(mode) {
		if (mode == 'none') {
			return `rgba(0,0,0,0)`;
		} else if (mode == 'height') {
			if (height >= 0) {
				return `rgba(90,60,20,${height / maxHeight})`;
			} else {
				return `rgba(45,20,90,${height / minHeight})`;
			}
		} else if (mode == 'landRegion') {
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
		} else if (mode == 'seaRegion') {
			if (seaRegion == 0) {
				return 'rgba(0,0,0,0)';
			}
			return `hsla(${seaRegion * 49},${(seaRegion * 7) % 30 + 60}%,${(seaRegion * 17) % 30 + 35}%,1)`;
		} else if (mode == 'climate') {
			if (climate < 0) {
				return `rgba(0,0,150,${climate / minClimate})`;
			} else {
				return `rgba(200,0,0,${climate / maxClimate})`;
			}
		} else if (mode == 'temperature') {
			if (temperature < 0) {
				return `rgba(0,0,150,${temperature / minTemperature})`;
			} else {
				return `rgba(200,0,0,${temperature / maxTemperature})`;
			}
		} else if (mode == 'weather') {
			return `hsla(${Object.keys(Weather).indexOf(weather) * 82},85%,50%,0.2)`;
		} else if (mode == 'resource') {
			return `rgba(0,0,0,0) url(bilder/resources/${resource}.png) no-repeat center`;
		}
	}
	wind(direction) {
		if (direction == 'north') {
			this.onAll('wind', 'north');
			for (let tile of this.map[this.height - 1]) {
				if (Math.random() < windChance) {
					tile.setWeather();
				}
			}
		} else if (direction == 'west') {
			this.onAll('wind', 'west');
			for (let line of this.map) {
				if (Math.random() < windChance) {
					line[mapWidth - 1].setWeather();
				}
			}
		} else if (direction == 'east') {
			this.inverseOnAll('wind', 'east');
			for (let line of this.map) {
				if (Math.random() < windChance) {
					line[0].setWeather();
				}
			}
		} else if (direction == 'south') {
			this.inverseOnAll('wind', 'south');
			for (let tile of this.map[0]) {
				if (Math.random() < windChance) {
					tile.setWeather();
				}
			}
		}
	}
	drawGame() {
		let x = 0;
		let y = -boxSize * 2 / 7;
		
		let tilePic;

		let ctx = canvasEl.getContext('2d');

		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				tilePic = document.createElement('img');

				tilePic.src = `pictures/tiles/${this.map[i][j].type}/0.png`;

				ctx.drawImage(tilePic, x, y * 7 / 5, boxSize, boxSize * 7 / 5);

				x += boxSize;
				if (x >= mapWidth * boxSize) {
					x = 0;
					y += boxSize * 5 / 7;
				}
			}
		}
	}
}

let map = new Map(mapWidth, mapHeight);
map.drawGame();
map.drawGame();