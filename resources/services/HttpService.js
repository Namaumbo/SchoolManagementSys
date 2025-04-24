class HttpService {
    constructor() {}

    getToken() {
        return localStorage.getItem("key");
    }

    setHeaders() {
        const accessKey = this.getToken()
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessKey}`,
        };
        return headers;
    }
}


export default new HttpService();