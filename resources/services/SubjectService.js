import HttpService from "./HttpService";
import axios from "axios";

class SubjectService {
    constructor() {}
    // TODO: this url prefix should be coming from  freezed object``
    urlPrefix = "http://127.0.0.1:8000/api";
    response = null;

    headers = HttpService.setHeaders();

    /**
     * Makes an HTTP POST request to create a new subject.
     * @param {Object} subject - The details of the subject to be created.
     * @returns {Promise} - A promise that resolves with the response data or rejects with an error object.
     */
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
}

export default new SubjectService();
