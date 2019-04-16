// Functionality for turns

// Number of troops at the beginning of the turn
function beginTurn() {
    fortifyArmies = 0;
    fortifyArmies = ownedCountryBonus(players[playerTurn].owns.length);
    for(var i=0; i<continents.length; i++)
    {
        var contName = continents[i].name;
        var bonus = continents[i].bonus;
        var cCount = continents[i].cCount;
        for(var z= 0; z<players[playerTurn].owns.length; z++)
        {
            var countryGrap = players[playerTurn].owns[z].name;
            for(var w=0; w<arrayCountries.length; w++)
            {
                if(arrayCountries[w].name == countryGrap)
                {
                    if(arrayCountries[w].continent == contName)
                    {
                        cCount= cCount-1
                    }//if statement for CCount
                }//if statement for this crap is done
            }//country done loop
        }//for loop own countries end
        if (cCount == 0)
        {
            fortifyArmies = fortifyArmies+ bonus;
            alert(contName)
        }//if cCount done
    }//end continents for loop
}

// Executes when a player ends their turn
function endTurn() {
    if(playerTurn == players.length - 1)
    {
        playerTurn = 0
    }//counter player length
    else
    {
        playerTurn++
    }
    defendingCountry = {};
    attackingCountry = {};
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
    beginTurn();
    document.getElementById("randomAssigns").style.visibility = "visible";
    document.getElementById("playerTurnID").style.visibility = "visible";
    document.getElementById("playerTurnID").style.color = players[playerTurn].color;
    document.getElementById("playerTurnID").innerHTML = "Player Turn: " + players[playerTurn].number;
    document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
    document.getElementById("numTroopsRemaining").style.visibility = "visible";
    document.getElementById("turnPhase").innerHTML = "Fortify";
    turnPhase = "fortify"
}