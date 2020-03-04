class TileClass {
	constructor(tileNumber, height, y, x) {
		this.tileNumber = tileNumber;
		this.height = height;
		this.y = y;
		this.x = x;
		this.name = 'OK';

		this.landRegion;
		this.seaRegion;
		this.weather;
		this.temperature;
		this.resource;

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
	checkRegionTo(tile,regionType) {
		try {
			//if tile has region
			if (tile[regionType] != 0 && tile[regionType] != undefined) {
				//chance for this to join its region
				if (Math.random() < regionJoinChance + (regionJoinMinimum - map[regionType][tile[regionType] - 1].length / 10)) {
					//this gets its region
					this[regionType] = tile[regionType];
					//join the region array
					map[regionType][tile[regionType] - 1].push(this); 
				}
			}
		} catch (err) {}
	}
	setRegion(regionType) {
		try {
			if (regionType = 'seaRegion' && this.height >= 0) {
				this[regionType] = 0;
			} else if(regionType = 'landRegion' && this.height < 0) {
				this[regionType] = 0;
			}
			if (this[regionType] == undefined) {
				//if (this.height >= 0) {
					//tests if the tiles around has a region in a random order
					let aroundTiles = [ this.north(), this.west(), this.east(), this.south() ];
					shuffle(aroundTiles);
					aroundTiles.forEach((element) => this.checkRegionTo(element,regionType));

					//if this tile did not get a region, then it creates a new one
					if (this[regionType] == undefined) {
						//makes a new array for the tiles of the new region
						map[regionType].push([]);
						//sets the tile region as the new one
						this[regionType] = mpa[regionType].length - 1;
						//the tile gets added to the region array
						map[regionType][map[this.y][this.x][regionType] - 1].push(this); 
					}

					//makes the tiles around do the regionCheck
					aroundTiles.forEach((element) => element.setRegion(regionType));
				//}
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
