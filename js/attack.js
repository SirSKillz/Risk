// Functions needed to attack other countries

// Executes when a country is taken over
function conquered1(attackingArmies) {
    let newTroopCount;
    const maxtransfer = attackingCountry.armies - 1;
    const response = prompt("How many troops would you like to move from " + attackingCountry.country +
        " to " + defendingCountry.country + "? (" + attackingArmies + "-" + maxtransfer + ")");
    const numberOfTroops = parseInt(response);
    if( response.toLowerCase() === "max"){
        document.getElementById(defendingCountry.country.replace(/\s+/g, '')).style.color = players[playerTurn].color;
        document.getElementById(defendingCountry.country.replace(/\s+/g, '')).value = maxtransfer;
        newTroopCount = document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value - maxtransfer;
        document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value = newTroopCount;
        players[playerTurn].owns.push({name: defendingCountry.country, armies: maxtransfer });
        players[playerTurn].owns[playerOwnedIndex(attackingCountry.country, playerTurn)].armies = newTroopCount;
        players[defendingCountry.player].owns.splice(playerOwnedIndex(defendingCountry.country, defendingCountry.player), 1);
        if(players[defendingCountry.player].owns.length === 0)
        {
            players.splice(defendingCountry.player , 1);
            if(players.length === 1)
            {
                alert("Player " + players[0].number + " has won the game")
            }
        }
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
    else if(numberOfTroops > attackingArmies - 1)
    {
        if(numberOfTroops< attackingCountry.armies)
        {
            document.getElementById(defendingCountry.country.replace(/\s+/g, '')).style.color = players[playerTurn].color;
            document.getElementById(defendingCountry.country.replace(/\s+/g, '')).value = numberOfTroops;
            newTroopCount = document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value - numberOfTroops;
            document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value = newTroopCount;
            players[playerTurn].owns.push({name: defendingCountry.country, armies: numberOfTroops });
            players[playerTurn].owns[playerOwnedIndex(attackingCountry.country, playerTurn)].armies = newTroopCount;
            players[defendingCountry.player].owns.splice(playerOwnedIndex(defendingCountry.country, defendingCountry.player), 1);
            turnPhase = "attack";
            if(players[defendingCountry.player].owns.length === 0)
            {
                players.splice(defendingCountry.player , 1);
                if(players.length === 1)
                {
                    alert("Player " + players[0].number + " has won the game");
                    document.getElementById("endTurn").style.visibility = "hidden";
                    turnPhase = "END"
                }
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
            document.getElementById("numberTroopsAttacking").style.visibility = "hidden"
        }
        else if (numberOfTroops >= attackingCountry.armies)
        {
            alert("Number entered was too high. Try a number below the number of armies in " + attackingCountry.country + " minus 1");
            conquered1(attackingArmies)
        }
    }
    else if (numberOfTroops < attackingArmies)
    {
        alert("Number entered was too low. The minimum number of troops required to move into " + defendingCountry.country + " is " + attackingArmies);
        conquered1(attackingArmies)
    }
    else {
        alert("Not a number. Try again");
        conquered1(attackingArmies)
    }
}

// Get the manual attack button
function callAttackbutton() {

    if(turnPhase === "battleInProgress"){
        const sbuttonvalue = parseInt(selectButton());
        attackControlled(sbuttonvalue)
    }
}

// Get the automated attack button
function attackControlled (attackingArmies) {
    let conquered = false;
    if(attackingCountry.armies >= 1 + attackingArmies)
    {
        //creating attack dice rolls
        let attackDice = [];
        for(let i = 0; i < attackingArmies; i++){
            attackDice.push(Math.floor(Math.random()* 6))
        }
        attackDice.sort();
        attackDice.reverse();

        let defenderDice = [];
        for(let d = 0; d < Math.min(2, defendingCountry.armies); d++){
            defenderDice.push(Math.floor(Math.random()* 6))
        }
        defenderDice.sort();
        defenderDice.reverse();

        for(let compare = 0; compare < Math.min(defenderDice.length, attackDice.length); compare++)
        {
            if(attackDice[compare]>defenderDice[compare])
            {
                // Attacker won
                // Subtract from defender, defender object and check for conquer (change turnPhase = attack)
                defendingCountry.armies = defendingCountry.armies -1;
                players[defendingCountry.player].owns[playerOwnedIndex(defendingCountry.country, defendingCountry.player)].armies = defendingCountry.armies;
                document.getElementById("defendingTroops").innerHTML = defendingCountry.armies;
                document.getElementById(defendingCountry.country.replace(/\s+/g, '')).value = defendingCountry.armies;
                if(defendingCountry.armies === 0){
                    conquered = true;
                    conquered1(attackingArmies)
                }
                // set conquered flag
                // Change inner html
            } else {
                // Defender won
                // subtract from attacker, attacker object and check for remaining troops == 1
                attackingCountry.armies = attackingCountry.armies -1;
                players[playerTurn].owns[playerOwnedIndex(attackingCountry.country, playerTurn)].armies = attackingCountry.armies;
                document.getElementById("attackingTroops").innerHTML = attackingCountry.armies;
                document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value = attackingCountry.armies
            }
        } //End compare


    }// End if
    if (attackingCountry.armies === 1)
    {
        alert("You have lost the battle between " + attackingCountry.country + " and " + defendingCountry.country);
        defendingCountry = [];
        attackingCountry = [];
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
    return conquered

}

// Open the dropdown menu for attacking
function attack20() {
    if(turnPhase==="battleInProgress"){
        let conquered = false;
        if (attackingCountry.armies > 3) {
            while(attackingCountry.armies > 3 && conquered === false) {
                conquered = attackControlled(3);
            }
        }
        if (attackingCountry.armies > 2) {
            while(attackingCountry.armies>2 && conquered === false) {
                conquered = attackControlled(2);
            }
        }
        if (attackingCountry.armies>1) {
            while(attackingCountry.armies>1 && conquered === false) {
                conquered = attackControlled(1);
            }
        }
    }
}

