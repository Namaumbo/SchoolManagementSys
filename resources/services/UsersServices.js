

import axios from "axios";
class UserService {
    urlPrefix = "http://127.0.0.1:8000/api";

    constructor(){};

   async getAllUsers(){
        let res = [];
        try{
            let users = new Array();
            let usersAvailable = await axios.get(
                `${this.urlPrefix}/users`
            )
            if(usersAvailable.data.length > 0){
                users = usersAvailable.data
                res = users
            }

        }
        catch(e){
            res = e
        }
        return res
    }
    async addUser(user){}

    async deleteUser(user){}

    async updateUser(user){}
}

export default new UserService();