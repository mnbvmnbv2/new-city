class InfoTab {
	constructor(title, p) {
		this.title = title;
		this.p = p;
		this.buttons = [];
	}
	addBtn(name, toTab, layout) {
		let btn = document.createElement('button');
		btn.innerHTML = name;
		btn.addEventListener('click', function() {
			toTab.print(layout);
		});
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

let home = new InfoTab('Home', 'blabla text');
let other = new InfoTab('Other', '123456');
home.addBtn('toOther', other, 'normal');
other.addBtn('back', home, 'normal');
let tabs = [ home, other ];

function helpness() {
	openInfo();
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
