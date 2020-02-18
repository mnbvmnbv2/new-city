class InfoTab {
	constructor(title, p) {
		this.title = title;
		this.p = p;
		this.buttons = [];
	}
	addBtn(name, func) {
		let btn = document.createElement('button');
		btn.innerHTML = name;
		btn.addEventListener('click', func);
		this.buttons.push(btn);
	}
	print(layout) {
		if (layout == 'normal') {
			spantextEl.innerHTML = `${this.title}<br>${this.p}<br>`;
			console.log(this.buttons.length);
			for (let i = 0; i < this.buttons.length; i++) {
				spantextEl.appendChild(this.buttons[i]);
			}
		}
	}
}

const helpfulEl = document.getElementById('helpful');

let home = new InfoTab('Home', 'blabla text');
let other = new InfoTab('Other', '123456');
home.addBtn('toOther', function() {
	other.print('normal');
});
other.addBtn('back', function() {
	home.print('normal');
});
other.addBtn('make tent', function() {
	player.buildings.push('tent');
});
let tabs = [ home, other ];

function helpness() {
	//helpfulEl.innerHTML = findTile(activeTile).toString();
	helpfulEl.innerHTML = `${player.toString()}`;
}

function openInfo() {
	home.print('normal');
	modal.style.display = 'block';
}

const infoFuncs = {
	height : function() {
		///
	},
	region : function() {
		///
	}
};

let menuActive = false;

function openMenu() {
	if (menuActive == false) {
		menuActive = true;
		modal.style.display = 'block';
		spantextEl.innerHTML = `Menu<br>Pause<br>Settings<br>Resume`;
	} else {
		menuActive = false;
		modal.style.display = 'none';
	}
}
