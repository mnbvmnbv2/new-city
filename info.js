var helpfulEl = document.getElementById("helpful");

function helpness(){

    if(map[activeSelectTile] === "5"){

        var houseNumber = 0;

        for(var i = 0; i < buildings.house.length; i++){
            if(buildings.house[i].mapTile === activeSelectTile){
                houseNumber = buildings.house[i].id;
            }
        }

        var nearbyText = "";
        for(var i = 0; i < buildings.house[houseNumber].nearby.length; i++){
            nearbyText += (tiles[Number(buildings.house[houseNumber].nearby[i])][0] + " ");
        }

        helpfulEl.innerHTML = "This is a " + buildings.house[houseNumber].name + "<br>" +
        "These people live here: " + buildings.house[houseNumber].population + "<br>" +
        "It is surrounded by: " + nearbyText;
    } else if(map[activeSelectTile] === 0 || map[activeSelectTile] === 1 || map[activeSelectTile] === 2 || map[activeSelectTile] === 3 || map[activeSelectTile] === 4){
        var natureNumber = 0;

        for(var i = 0; i < nature.length; i++){
            if(nature[i].mapTile === Number(activeSelectTile)){
                natureNumber = nature[i].id;
            }
        }

        helpfulEl.innerHTML = nature[natureNumber].name + "<br>" +
        "Food: " + nature[natureNumber].food + "<br>" +
        "Wood: " + nature[natureNumber].wood + "<br>" +
        "Stone: " + nature[natureNumber].stone + "<br>" +
        "Gold: " + nature[natureNumber].gold + "<br>";
    } else {
        helpfulEl.innerHTML = "This is a " + tiles[Number(map[activeSelectTile])]
    }
}