map = [];

for(var i = 0; i < 11; i++){
    line = [];
    for(var j = 0; j < 11; j++){
        console.log("a")
        if(i == 0 && j == 0){
            line.push(5);
        } else if(j==0){
            line.push(Math.floor(Math.random()*9)+1);
        } else{
            
            var tilfeldig = Math.floor(Math.random()*5);
            if((line[j-1]+tilfeldig-3) <= 0){
                line.push(1);
            } else if((line[j-1]+tilfeldig-2) >= 10){
                line.push(9);
            } else {
                line.push(line[j-1]+tilfeldig-2);
            }
            if(i != 0){
                if(line[j] < map[i-1][j]-4){
                    line[j] = map[i-1][j]-4;
                } else if(line[j] > map[i-1][j]+4) {
                    line[j] = map[i-1][j]+4;
                }
            }
        }
    }
    map.push(line)
}
console.log(map)
