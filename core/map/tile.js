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
