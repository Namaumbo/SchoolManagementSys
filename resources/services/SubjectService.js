// SubjectService.js
import HttpService from "./HttpService";
import axios from "axios";

class SubjectService {
    constructor() {}
    urlPrefix = "http://127.0.0.1:8000/api";
    headers = HttpService.setHeaders();

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
