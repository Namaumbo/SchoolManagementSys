import HttpService from "./HttpService";
import axios from "axios";
import utils from "../GlobalUtils/utils";

class SubjectService {
    constructor() {
        this.headers = HttpService.setHeaders();
    }
    // TODO: this url prefix should be coming from  freezed object``
    urlPrefix = "http://127.0.0.1:8000/api";
    availableSubjectNames = [
        "ENGLISH",
        "MATHEMATICS",
        "AGRICULTURE",
        "BIOLOGY",
        "PHYSICS",
        "CHEMISTRY",
        "COMPUTER STUDIES",
        "CHICHEWA",
        "BIBLE KNOWLEDGE",
        "EXPRESSIVE ARTS",
        "LIFE SKILLS",
        "OTHER",
    ];
    /**
     * Makes an HTTP POST request to create a new subject.
     * Makes an HTTP POST request to create a new subject.
     * @param {Object} subject - The details of the subject to be created.
     * @param {Object} subject - The details of the subject to be created.
     * @returns {Promise} - A promise that resolves with the response data or rejects with an error object.
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

    async getAllSubjects() {
        try {
            const response = await axios.get(`${this.urlPrefix}/subjects`, {
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to get subjects", error);
        }
    }
}
export default new SubjectService();
