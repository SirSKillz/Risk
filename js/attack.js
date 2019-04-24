// Functions needed to attack other countries

// Executes when a country is taken over
function conquered1(attackingArmies) {
    let newTroopCount;
    const maxtransfer = attackingCountry.armies - 1; //maxtransfer of troops to new country
    const response = prompt("How many troops would you like to move from " + attackingCountry.country +
        " to " + defendingCountry.country + "? (" + attackingArmies + "-" + maxtransfer + ")"); //this is a prompt of the number of troops to transfer
    const numberOfTroops = parseInt(response); //number of troops to new country
    if( response.toLowerCase() === "max"){//if max is written
        document.getElementById(defendingCountry.country.replace(/\s+/g, '')).style.color = players[playerTurn].color; //replace color
        document.getElementById(defendingCountry.country.replace(/\s+/g, '')).value = maxtransfer; //set troop number
        newTroopCount = document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value - maxtransfer; // old country troop number
        document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value = newTroopCount; //replace the old country troop number
        players[playerTurn].owns.push({name: defendingCountry.country, armies: maxtransfer }); //add defending country to the user
        players[playerTurn].owns[playerOwnedIndex(attackingCountry.country, playerTurn)].armies = newTroopCount; // change the old country troop number
        players[defendingCountry.player].owns.splice(playerOwnedIndex(defendingCountry.country, defendingCountry.player), 1); //remove the country from defending player
        if(players[defendingCountry.player].owns.length === 0) //if the player defending has no countries left
        {
            players.splice(defendingCountry.player , 1);//remove player
            if(players.length === 1) // if there is only one
                //THIS IS WHERE THE WINNER IS DECLARED
            {
                alert("Player " + players[0].number + " has won the game")
            }
        }
        defendingCountry = {}; //reset defending country
        attackingCountry = {}; //reset attacking country
        turnPhase = "attack"; //reset turnPhase
        //hide all elements necessary
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
    else if(numberOfTroops > attackingArmies - 1) //if it is more than attacking Armies
    {
        if(numberOfTroops< attackingCountry.armies) //if it less than the number of armies attacking
        {
            document.getElementById(defendingCountry.country.replace(/\s+/g, '')).style.color = players[playerTurn].color; //change colors
            document.getElementById(defendingCountry.country.replace(/\s+/g, '')).value = numberOfTroops; //change number of troops
            newTroopCount = document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value - numberOfTroops; // get newTroop count
            document.getElementById(attackingCountry.country.replace(/\s+/g, '')).value = newTroopCount; //set newTroop count
            players[playerTurn].owns.push({name: defendingCountry.country, armies: numberOfTroops });//add country to attacking player
            players[playerTurn].owns[playerOwnedIndex(attackingCountry.country, playerTurn)].armies = newTroopCount;//add newTroop count to player data
            players[defendingCountry.player].owns.splice(playerOwnedIndex(defendingCountry.country, defendingCountry.player), 1);//remove country from defending player
            turnPhase = "attack";//set turnPhase
            if(players[defendingCountry.player].owns.length === 0) //IF PLAYER IS ELIMINATED
            {
                socket.emit('playerElimination', defendingCountry.player)
                players.splice(defendingCountry.player , 1);
                if(players.length === 1)
                //IF THE GAME IS OVER
                {
                    alert("Player " + players[0].number + " has won the game");
                    document.getElementById("endTurn").style.visibility = "hidden";
                    turnPhase = "END"
                }
            }
            socket.emit('battleInProgress', players, attackingCountry.country, defendingCountry.country);
            defendingCountry = {}; // reset defending country
            attackingCountry = {}; //reset attacking country
            //reset the page
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
        else if (numberOfTroops >= attackingCountry.armies)//number of troops is too high
        {
            alert("Number entered was too high. Try a number below the number of armies in " + attackingCountry.country + " minus 1");
            conquered1(attackingArmies)
        }
    }
    else if (numberOfTroops < attackingArmies) //if there aren't enough troops
    {
        alert("Number entered was too low. The minimum number of troops required to move into " + defendingCountry.country + " is " + attackingArmies);
        conquered1(attackingArmies)
    }
    else { //if there was no number entered or something other than the amount
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
    let conquered = false; //set conquered = false
    if(attackingCountry.armies >= 1 + attackingArmies) {//if they can attack
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

        for(let compare = 0; compare < Math.min(defenderDice.length, attackDice.length); compare++) {
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
    if (attackingCountry.armies === 1) {//if they lost the battle
        alert("You have lost the battle between " + attackingCountry.country + " and " + defendingCountry.country);
        socket.emit('successDefense', attackingCountry.country, defendingCountry.country);
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
    if(turnPhase==="battleInProgress") {
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

