function timeTick(){
    for(let i = 0; i < mapWidth*mapHeight; i++){
        findTile(i).setWeather();
        findTile(i).changeTemperature();
    }
    if(activeMode == 'weather'){
        mapMode('weather');
    } else if (activeMode == 'temperature'){
        mapMode('temperature');
    }
    console.log('tick');
    setTimeout(timeTick,1000);
}
timeTick();