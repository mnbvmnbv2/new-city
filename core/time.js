function timeTick(){
    for(let i = 0; i < mapWidth*mapHeight; i++){
        findTile(i).setWeather();
    }
    if(activeMode == 'weather'){
        mapMode('weather');
    }
    console.log('tick');
    setTimeout(timeTick,1000);
}
timeTick();