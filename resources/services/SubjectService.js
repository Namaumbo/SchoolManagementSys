// SubjectService.js
import HttpService from "./HttpService";
import axios from "axios";

class SubjectService {
    constructor() {}
    urlPrefix = "http://127.0.0.1:8000/api";
    headers = HttpService.setHeaders();

    async addSubject(subject) {
        try {
            const wordNormalizer = utils.wordNormalizer(subject);
            console.info(`adding ${wordNormalizer} to database`);
            if (this.availableSubjectNames.includes(wordNormalizer)) {
                const response = await axios.post(
                    `${this.urlPrefix}/create-subject`,
                    { name: wordNormalizer },
                    {
                        headers: this.headers,
                    }
                );
                return response.data;
            } else {
                throw new Error("Invalid subject name");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create subject", error.message);
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
