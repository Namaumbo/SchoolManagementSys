import HttpService from "./HttpService";
import axios from "axios";

class SchoolVitals {
    urlPrefix = "http://127.0.0.1:8000/api";
    response = null;
    headers = HttpService.setHeaders();

    async getRoles() {
        await axios
            .get(`${this.urlPrefix}/roles`, { headers: this.headers })
            .then((res) => {
                this.response = res.data;
            })
            .catch((err) => {
                this.response = err;
            });
        return this.response;
    }
    async getDepartments() {
        await axios
            .get(`${this.urlPrefix}/departments`, { headers: this.headers })
            .then((res) => {
                this.response = res.data;
            })
            .catch((err) => {
                this.response = err;
            });
        return this.response;
    }
   
}

export default new SchoolVitals();
