class Game {
    constructor(roomName, user, maxNumOfPlayers) {
        this.roomName = roomName;
        this.users = [];
        this.users.push(user);
        this.maxNumOfPlayers = maxNumOfPlayers;
    }

    addUser(user) {
        if (this.users.length < this.maxNumOfPlayers) {
            this.users.push(user);
        } else {
            return 'full';
        }
    }

    removeUser(user) {
        for (let i = 0; i < this.users.length; i++) {
            if (user === this.users[i]) {
                this.users.splice(i, 1);
            }//end if
        }//end for
    }//end method

    getRoomName() {
        return this.roomName;
    }

    getUsers() {
        return this.users;
    }

    isInRoom(user) {
        for (let i = 0; i < this.users.length; i++) {
            if (user === this.users[i]) {
                return true;
            }
        }
        return false;
    }

    hasRoom() {
        if (this.users.length < this.maxNumOfPlayers) {
            return true;
        }
        return false;

    }

    getMaxNum(){
        return this.maxNumOfPlayers;
    }

}


module.exports = Game;