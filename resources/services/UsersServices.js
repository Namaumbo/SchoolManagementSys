import axios from "axios";
class UserService {
    urlPrefix = "http://127.0.0.1:8000/api";

    constructor() {}

    async userLogin(user) {
        let res = null;
        try {
            let response = await axios.post(`${this.urlPrefix}/login`, user);
            res = response
        } catch (e) {
            res = e;
        }
        return res;
    }

    async getAllUsers() {
        let res = null;
        try {
            let users = new Array();
            let usersAvailable = await axios.get(`${this.urlPrefix}/users`);
            if (usersAvailable.data.length > 0) {
                users = usersAvailable.data;
                res = users;
            }
        } catch (e) {
            res = e;
        }
        return res;
    }
    async addUser(user) {}

    async deleteUser(user) {}

    async updateUser(user) {}
}

export default new UserService();
