class HttpService {
    constructor() {}

    getToken() {
        return localStorage.getItem("key");
    }

    setHeaders() {
        const accessKey = this.getToken()
        const headers = {
            Authorization: `Bearer ${accessKey}`,
        };
        return headers;
    }
}


export default new HttpService();