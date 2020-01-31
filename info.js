var helpfulEl = document.getElementById("helpful");

function helpness(){
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
}