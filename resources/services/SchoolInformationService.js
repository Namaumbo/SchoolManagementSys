import axios from "axios";


class  SchoolInformationService {

    urlPrefix = "http://127.0.0.1:8000/api";

    async getSchoolInformation() {
        let res = null;
        try {
            let schoolInformation = new Array();
            let schoolInformationAvailable = await axios.get(`${this.urlPrefix}/school-information`);
            if (schoolInformationAvailable.data.length > 0) {
                schoolInformation = schoolInformationAvailable.data;
                res = schoolInformation;
            }
        } catch (e) {
            res = e;
        }
        return res;
    }

    async updateSchoolInformation(schoolInformation) {
        let res = null;
        try {
            const headers = {
                headers: { "Content-Type": "application/json" },
            };
            const response = await axios.post(
                "http://127.0.0.1:8000/api/update-school-information",  
                schoolInformation,
                headers
            );
            res = {
                message: "Successfully updated",
                data: response.data,
                status: response.status,
            };
        } catch (err) {
            if (err.response) {
                res = {
                    message: "Error updating",
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
        return res;
    }


    async addSchoolDetails(schoolDetails) {
        try {
            await this.creatNewEntry(schoolDetails);
            return {
                message: "Successfully added",
                status: 200,
            };
        } catch (e) {
            return {
                message: "Error adding",
                status: 500,
                error: e.message,
            };
        }
    }


    async creatNewEntry(schoolDetails) {
        const headers = {
            headers: { "Content-Type": "application/json" },
        };

        const response = await axios.post(
            "http://127.0.0.1:8000/api/school-information", 
            schoolDetails,
            // headers
        );
        return response.data;
    }

}

export default new SchoolInformationService()