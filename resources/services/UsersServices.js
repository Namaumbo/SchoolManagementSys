import axios from "axios";
class UserService {
    urlPrefix = "http://127.0.0.1:8000/api";

    constructor() {}

    async userLogin(user) {
        let res = null;
        try {
            let response = await axios.post(`${this.urlPrefix}/login`, user);
            res = response;
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
    /**
     * Sends a POST request to register a new user by making an API call to the specified endpoint.
     * @param {Object} userDetails - An object containing the details of the user to be registered.
     */
    async addUser(userDetails) {
        let res = null;
        try {
            const headers = {
                headers: { "Content-Type": "application/json" },
            };

            const response = await axios.post(
                "http://127.0.0.1:8000/api/register-user",
                userDetails,
                headers
            );

            res = {
                message: "Successfully registered",
                data: response.data,
                status: response.status,
            };
        } catch (err) {
            if (err.response) {
                res = {
                    message: "Error registering",
                    status: err.response.status,
                    error: err.response.data.message,
                };
            } else {
                res = {
                    message: "Error encountered. Please contact the IT support",
                    status: 500,
                    error: err.message,
                };
            }
        }

        return res;
    }

    async deleteUser(user) {}

    async updateUser(user) {}
}

export default new UserService();
