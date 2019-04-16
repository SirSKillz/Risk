// Provides the core functionality of the game

// Restarts the game
function restart() {
    location.reload(true);
}

// No clue
function findIndexInData(data, property, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item[property] === value) {
            result = i;
            return true;
        }
    });
    return result;
}

// Undo the last attack
function undo() {
    defendingCountry = {};
    attackingCountry = {};
    turnPhase = "attack";
    document.getElementById("attackingCountry").style.visibility = "hidden";
    document.getElementById("defendingCountry").style.visibility = "hidden";
    document.getElementById("isAttacking").style.visibility = "hidden";
    document.getElementById("undoButton").style.visibility = "hidden";
    document.getElementById("attackingTroops").style.visibility = "hidden";
    document.getElementById("defendingTroops").style.visibility = "hidden";
    document.getElementById("attackControlled").style.visibility = "hidden";
    document.getElementById("select2").style.visibility = "hidden";
    document.getElementById("attack20").style.visibility = "hidden";
    document.getElementById("numberTroopsAttacking").style.visibility = "hidden"
}

// Randomly assigns
function randomAssign() {
    if(turnPhase === "initialFortify")
    {
        while(remainingArmies[playerTurn] > 0 ){
            var rand = Math.floor(Math.random()* players[playerTurn].owns.length);
            var temp = 0;
            var z = 0;

            for(z; z < countries.length; z++)
            {

                if(countries[z] === players[playerTurn].owns[rand].name){

                    temp = z;
                }
            }
            players[playerTurn].owns[rand].armies++;
            document.getElementById(countries[temp].replace(/\s+/g, '')).value = parseInt(document.getElementById(countries[temp].replace(/\s+/g, '')).value) + 1;
            remainingArmies[playerTurn]--;
        }
        if(playerTurn == players.length - 1)
        {
            playerTurn = 0

        }
        else
        {
            playerTurn++

        }
        document.getElementById("playerTurnID").style.color = players[playerTurn].color;
        document.getElementById("playerTurnID").innerHTML = "Player Turn: " + players[playerTurn].number;
        document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + remainingArmies[playerTurn];
        if(remainingArmies.reduce(function(a,b){return a + b},0)==0)
        {
            beginTurn();
            document.getElementById("turnPhase").innerHTML = "Fortify";
            document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
            turnPhase = "fortify"
        }
    }
    else if(turnPhase === "fortify"){
        while(fortifyArmies > 0 ){
            var rand = Math.floor(Math.random()* players[playerTurn].owns.length);
            var temp = 0;
            var z = 0;

            for(z; z < countries.length; z++)
            {

                if(countries[z] === players[playerTurn].owns[rand].name){

                    temp = z;
                }
            }

            document.getElementById(countries[temp].replace(/\s+/g, '')).value = parseInt(document.getElementById(countries[temp].replace(/\s+/g, '')).value) + 1;
            fortifyArmies--;
            players[playerTurn].owns[rand].armies++;
            if(fortifyArmies == 0)
            {
                document.getElementById("turnPhase").innerHTML = "Attack";
                document.getElementById("numTroopsRemaining").style.visibility = "hidden";
                document.getElementById("troopNum").style.visibility = "hidden";
                document.getElementById("endTurn").style.visibility = "visible";
                document.getElementById("randomAssigns").style.visibility = "hidden";
                turnPhase = "attack"
            }
        }
    }
}

// Assign a country to the player that selected the country
function assignCountries() {
    if(parseInt(document.getElementById("select").value) == 3)
    {
        players.push({name: "", number: 3, owns:["D"], color: "green"})

    }//if statement end push players 3,4
    if(parseInt(document.getElementById("select").value) == 4)
    {
        players.push({name: "", number: 3, owns:["D"], color: "green"});
        players.push({name: "", number: 4, owns:["D"], color: "magenta"})
    }// if statement push players 3,4
    if(parseInt(document.getElementById("select").value) == 5)
    {
        players.push({name: "", number: 3, owns:["D"], color: "green"});
        players.push({name: "", number: 4, owns:["D"], color: "magenta"});
        players.push({name: "", number: 5, owns:["D"], color: "black"})
    }
    if(parseInt(document.getElementById("select").value) == 6)
    {
        players.push({name: "", number: 3, owns:["D"], color: "green"});
        players.push({name: "", number: 4, owns:["D"], color: "magenta"});
        players.push({name: "", number: 5, owns:["D"], color: "black"});
        players.push({name: "", number: 6, owns:["D"], color: "white"})
    }
    document.getElementById("playGame").style.visibility = "hidden";
    document.getElementById("select").style.visibility =  "hidden";
    document.getElementById("textSelect").style.visibility =  "hidden";
    document.getElementById("playerTurnID").style.visibility = "visible";
    document.getElementById("numTroopsRemaining").style.visibility = "visible";
    document.getElementById("troopNum").style.visibility = "visible";
    document.getElementById("restart").style.visibility = "visible";
    document.getElementById("turnPhase").style.visibility = "visible";
    document.getElementById("randomAssigns").style.visibility = "visible";
    document.getElementById("turnPhase").innerHTML = "Intial Fortification";
    var numPlayers = document.getElementById("select").value;
    var countries2 = JSON.parse(JSON.stringify(countries));
    var counter = 0;
    while(countries2.length>0)
    {
        var rand = Math.floor(Math.random()*countries2.length);
        var splicer = countries2.splice(rand, 1)[0];
        var ownObject = {name: splicer, armies: 1};
        players[counter].owns.push(ownObject);
        document.getElementById(splicer.replace(/\s+/g, '')).style.color = players[counter].color;
        document.getElementById(splicer.replace(/\s+/g, '')).style.visibility = "visible";
        if(counter == players.length - 1)
        {
            counter = 0
        }//counter player length
        else
        {
            counter++
        }//counter player length

    }  // End while loop
    playerTurn = counter;
    document.getElementById("playerTurnID").style.color = players[playerTurn].color;
    document.getElementById("playerTurnID").innerHTML = "Player Turn: " + players[playerTurn].number;
    for (var z=0; z<players.length; z++)
    {
        players[z].owns.shift()
    }  // End for remove "D"s
    for (var y=0; y<players.length; y++)
    {
        var originalArmies = 0;
        for (var x=0; x<players[y].owns.length; x++)
        {
            originalArmies = originalArmies + players[y].owns[x].armies
        }  // End Inner for loop
        remainingArmies[y] = startingArmies[players.length] - originalArmies
    }// End players for loop
    document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + remainingArmies[playerTurn];
    turnPhase = "initialFortify"
}