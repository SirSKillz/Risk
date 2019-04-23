// Functions for interacting with the board

// Return country owned bonus so the number of countries divided by 3
function ownedCountryBonus(OwnedCount) {
    return Math.max(3, Math.floor(OwnedCount/3))
}

// Return true if the player clicked on a country they own
function playerOwnedIndex(country, player) {
    for(let i = 0; i<players[player].owns.length; i++) {
        if(players[player].owns[i].name  === country) {
            return i
        }
    }
}

// Select the pushed button
function selectButton() {
    return document.getElementById("select2").value
}

// Interactions when clicking on a country
function countryButton(country) {
    //if turnPhase is initialFortify
    if(turnPhase === "initialFortify") {
        if(document.getElementById(country.replace(/\s+/g, '')).style.color === players[userTurn].color) { //if they cown the country
            /* TODO:   Disable radio buttons */
            //add one army
            document.getElementById(country.replace(/\s+/g, '')).value = parseInt(document.getElementById(country.replace(/\s+/g, '')).value) + 1;
            players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].armies++;
            remainingArmies[playerTurn] = remainingArmies[playerTurn] - 1;
            if(remainingArmies[playerTurn] === 0 ){
                socket.emit('fortification', userTurn, players);
                turnPhase = "BULLSHIT"
            }
            /*if(playerTurn === players.length - 1) {
                playerTurn = 0

            }
            else {
                playerTurn++

            }*/
            //document.getElementById("playerTurnID").style.color = players[playerTurn].color;
            //document.getElementById("playerTurnID").innerHTML = "Player Turn: " + players[playerTurn].number;
            //document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + remainingArmies[playerTurn];
            //start the first round
            // if(remainingArmies.reduce(function(a,b){return a + b},0)===0)
            // {
            //     beginTurn();
            //     document.getElementById("turnPhase").innerHTML = "Fortify";
            //     document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
            //     turnPhase = "fortify"
            // }
            // *********TODO PLAYER TURN TEXT IN UPPER RIGHT CORNER
        }
    }//intialFortify end if statement
    else if(turnPhase === "fortify" && playerTurn === userTurn)
    //if turnPhase is fortify
    {
        if(document.getElementById(country.replace(/\s+/g, '')).style.color === players[playerTurn].color)
        {
            document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
            //armies to start crap at begin = var fortifyArmies
            if(fortifyArmies>0)
            {
                document.getElementById(country.replace(/\s+/g, '')).value = parseInt(document.getElementById(country.replace(/\s+/g, '')).value) + 1;
                players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].armies++;
                fortifyArmies = fortifyArmies - 1
            }//fortifyArmies if statement end
            document.getElementById("numTroopsRemaining").innerHTML = "Troops Remaining to Place: " + fortifyArmies;
            if(fortifyArmies === 0)
            {
                socket.emit('fortifyIndy', players);
                document.getElementById("turnPhase").innerHTML = "Attack";
                document.getElementById("numTroopsRemaining").style.visibility = "hidden";
                document.getElementById("troopNum").style.visibility = "hidden";
                document.getElementById("endTurn").style.visibility = "visible";
                document.getElementById("randomAssigns").style.visibility = "hidden";
                turnPhase = "attack"
            }//turnPhase end

        }//if statement end if color == player color
    }// else if statement for fortify end
    else if(turnPhase === "attack")
    {

        if(document.getElementById(country.replace(/\s+/g, '')).style.color === players[playerTurn].color)
        {
            if(players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].armies > 1)
            {
                attackingCountry.armies =  players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].armies;
                attackingCountry.country = players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].name;
                attackingCountry.color = players[playerTurn].color;
                document.getElementById("attackControlled").style.visibility = "visible";
                document.getElementById("select2").style.visibility = "visible";
                document.getElementById("numberTroopsAttacking").style.visibility = "visible";
                document.getElementById("attackingCountry").style.visibility = "visible";
                document.getElementById("attackingCountry").innerHTML = country;
                document.getElementById("attackingCountry").style.color = players[playerTurn].color;
                document.getElementById("undoButton").style.visibility = "visible";
                document.getElementById("attackingTroops").style.visibility = "visible";
                document.getElementById("attackingTroops").innerHTML = players[playerTurn].owns[playerOwnedIndex(country, playerTurn)].armies;
                document.getElementById("isAttacking").style.visibility = "visible";
                document.getElementById("attack20").style.visibility = "visible";
                turnPhase = "defend"
            }//if statement for >1
        }//if color = end
    }//else if statement end attack
    else if(turnPhase === "defend")
    {
        if(document.getElementById(country.replace(/\s+/g, '')).style.color !== players[playerTurn].color)
        {
            for(let i = 0; i<players.length; i++)
            {
                const found = findIndexInData(players[i].owns, "name", country);
                if(found !== -1)
                {
                    const numCountry = findIndexInData(arrayCountries, "name", attackingCountry.country);
                    const attackFound = arrayCountries[numCountry].attacks.indexOf(country);
                    if(attackFound !== -1)
                    {
                        defendingCountry.country = country;
                        defendingCountry.armies = players[i].owns[found].armies;
                        defendingCountry.player = i;
                        defendingCountry.color = players[i].color;
                        document.getElementById("defendingCountry").style.visibility = "visible";
                        document.getElementById("defendingCountry").style.color = players[i].color;
                        document.getElementById("defendingCountry").innerHTML = country;
                        document.getElementById("defendingTroops").style.visibility = "visible";
                        document.getElementById("defendingTroops").innerHTML = defendingCountry.armies;

                        // await input from attackControlled
                        turnPhase = "battleInProgress"
                        /* *** TODO: Render attack page elements */
                    }
                }
            }
        }//if color != to player color
    }//defend else if end
}

