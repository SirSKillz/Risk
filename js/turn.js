// Functionality for turns

// Number of troops at the beginning of the turn
function beginTurn() {
    fortifyArmies = ownedCountryBonus(players[playerTurn].owns.length);
    for(let i = 0; i < continents.length; i++) {
        const contName = continents[i].name;
        const bonus = continents[i].bonus;
        let cCount = continents[i].cCount;
        for(let z = 0; z < players[playerTurn].owns.length; z++) {
            const countryGrap = players[playerTurn].owns[z].name;
            for(let w = 0; w < arrayCountries.length; w++) {
                if(arrayCountries[w].name === countryGrap) {
                    if(arrayCountries[w].continent === contName) {
                        cCount= cCount-1
                    }
                }
            }
        }
        if (cCount === 0) {
            fortifyArmies += bonus;
            //alert(contName)
        }
    }
}

// Executes when a player ends their turn
function endTurn() {
    // if(playerTurn === players.length - 1) {
    //     playerTurn = 0
    // } else {
    //     playerTurn++
    // }
    // defendingCountry = {};
    // attackingCountry = {};
    document.getElementById("attackingCountry").style.visibility = "hidden";
    document.getElementById("defendingCountry").style.visibility = "hidden";
    document.getElementById("isAttacking").style.visibility = "hidden";
    document.getElementById("undoButton").style.visibility = "hidden";
    document.getElementById("attackingTroops").style.visibility = "hidden";
    document.getElementById("defendingTroops").style.visibility = "hidden";
    document.getElementById("attackControlled").style.visibility = "hidden";
    document.getElementById("select2").style.visibility = "hidden";
    document.getElementById("attack20").style.visibility = "hidden";
    document.getElementById("numberTroopsAttacking").style.visibility = "hidden";
    document.getElementById("endTurn").style.visibility = "hidden";
    // beginTurn();
    // document.getElementById("randomAssigns").style.visibility = "visible";
    // document.getElementById("playerTurnID").style.visibility = "visible";
    // document.getElementById("playerTurnID").style.color = players[playerTurn].color;
     //document.getElementById("playerTurnID").innerHTML = "Player Turn: " + players[playerTurn].number;
    // document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
    // document.getElementById("numTroopsRemaining").style.visibility = "visible";
    document.getElementById("turnPhase").innerHTML = "Move Troops";
    document.getElementById("DontMoveTroops").style.visibility = "visible";
    // turnPhase = "fortify"
    turnPhase = "moveTroops"
    socket.emit('moveTroops1');
}

function winGame(){
    players = [{name: "", number: 1, owns: [{name: "Alaska", armies:1}], color: "red"}, {
        name: "",
        number: 2,
        owns: [{name: "NW Territory", armies:1}],
        color: "blue"
    }, {name: "", number: 3, owns:[{name: "Kamchatka", armies:100}], color: "green"}];
    for(let i = 0; i<players.length; i++){
        for(let j = 0; j<players[i].owns.length; j++) {
            document.getElementById(players[i].owns[j].name.replace(/\s+/g, '')).style.color = players[i].color;
            document.getElementById(players[i].owns[j].name.replace(/\s+/g, '')).value = players[i].owns[j].armies;
        }
    }
}