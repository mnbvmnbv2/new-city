let currentDir = 'west';

function timeTick(){
    for(let i = 0; i < mapWidth*mapHeight; i++){
        findTile(i).changeTemperature();
    }
    let dirs = ['north', 'west', 'east', 'south'];
    shuffle(dirs);
    //wind(dirs[0]);
    wind(currentDir);
    if(activeMode == 'weather'){
        mapMode('weather');
    } else if (activeMode == 'temperature'){
        mapMode('temperature');
    }
    console.log('tick');
    setTimeout(timeTick,1000);
}
timeTick();