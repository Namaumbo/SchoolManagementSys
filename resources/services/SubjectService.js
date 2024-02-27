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
            const response = await axios.post(
                `${this.urlPrefix}/create-subject`,
                subject,
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
