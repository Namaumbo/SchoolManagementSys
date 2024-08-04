// SubjectService.js
import HttpService from "./HttpService";
import axios from "axios";

class SubjectService {
    constructor() {}
    urlPrefix = "http://127.0.0.1:8000/api";
    headers = HttpService.setHeaders();

    async addSubject(subject) {
    
            let res = null;
            try {
                const headers = {
                    headers: { "Content-Type": "application/json" },
                };
    
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/create-subject",
                    subject,
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
        }
    /**
     * Retrieves all subjects from the server.
     * @returns {Promise<Array>} A promise that resolves with an array of subjects.
     * @throws {Error} If there is an error retrieving the subjects.
     */
    async getAllSubjects() {
        try {
            const response = await axios.get(`${this.urlPrefix}/subjects`, {
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async fetchSubjectPerformance() {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/subjectPerformance`,
                {
                    headers: this.headers,
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

export default new SubjectService();