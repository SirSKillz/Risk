class Game {
    roomName;
    users = [];
    maxNumOfPlayers;
    numOfPlayers = 0;

    constructor(roomName, user, maxNumOfPlayers){
        this.roomName = roomName;
        this.users.push(user);
        this.maxNumOfPlayers = maxNumOfPlayers;
    }

    addUser(user){
        if(this.numOfPlayers < this.maxNumOfPlayers) {
            this.users.push(user);
            this.numOfPlayers++;
        } else {
            return 'full';
        }
    }

    removeUser(user){
        for (let i = 0; i<this.users.length; i++){
            if(user === this.users[i]) {
                this.users.splice(i, 1);
                this.numOfPlayers--;
            }//end if
        }//end for
    }//end method

    getRoomName(){
        return this.roomName;
    }

    getUsers(){
        return this.users;
    }

    isInRoom(user){
        for (let i = 0; i<this.users.length; i++){
            if(user === this.users[i]){
                return true;
            }
        }
        return false;
    }

    hasRoom(){
        if(this.numOfPlayers < this.maxNumOfPlayers){
            return true;
        }
        return false;
    }
}