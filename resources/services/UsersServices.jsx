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
        try {
            const response = await axios.get(`${this.urlPrefix}/users`);
            return response.data;
        } catch (error) {
            // Log the error
            console.error("Error fetching users:", error);
    
            // Return an Error object to indicate failure
            return new Error("Failed to fetch users. Please try again later.");
        }
    }
    

    async addUser(userDetails) {
        let res = null;
        try {
            const headers = {
                headers: { "Content-Type": "application/json" },
            };

            let response = await axios.post(
                "http://127.0.0.1:8001/api/register-user",
                userDetails,
                headers
            );
            res = {
                message: "Successfully registered",
                data: response.data,
                status: response.status,
            };
        } catch (err) {
            res = {
                message: "Error registering",
                status: err.response ? err.response.status : 500,
                error: err.message,
            };
        }
        return res;
    }

    async deleteUser(user) {
        // Implement the delete user functionality
    }

    async updateUser(user) {
        // Implement the update user functionality
    }
}

export default new UserService();
