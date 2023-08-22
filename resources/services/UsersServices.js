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
    async addUser(userDetails) {
        let res = null;
        try {

            const headers = {
                headers: { "Content-Type": "application/json",}};
             
            await axios
                .post(
                    "http://127.0.0.1:8000/api/register-user",
                    userDetails,
                    headers
                )
                .then((res) => {
                    if (res) {
                      res = {
                        'message':'Successfully registered',
                        'data':res.data,
                        'status':res.status
                      }
                    }
                })
                .catch((err) => {
                    res = {
                        'message':'Error registering',
                        'status':err.status,
                        'error':err.message
                    }
                });
        }
        catch (e) {
            res = {
                'message':'Error encountered please contact the IT support',
                'status':500,
                'error':e.message
            }
        }
        console.log(res)

    }

    async deleteUser(user) {}

    async updateUser(user) {}
}

export default new UserService();
