import axios from "axios";

// TODO : remove the hard coded url get it from the env or config filee
class SchoolInformationService {
    urlPrefix = "http://127.0.0.1:8000/api";

    async getSchoolInformation() {
        let res = null;
        try {
            let schoolInformation = new Array();
            let schoolInformationAvailable = await axios.get(
                `${this.urlPrefix}/school-information`
            );
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

    // Function to sanitize headers before using them in the request
    async creatNewEntry(schoolDetails) {
        const headers = {
            headers: { "Content-Type": "application/json" },
        };
        try {
            // Ensure `headers` are properly defined and sanitized before using them in the request
            const sanitizedHeaders = sanitizeHeaders(headers);

            // TODO: remove the hardcoded url
            if (validateSchoolDetails(schoolDetails)) {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/school-information",
                    schoolDetails,
                    sanitizedHeaders
                );
                return response.data;
            } else {
                throw new Error("Invalid schoolDetails format");
            }
        } catch (error) {
            console.error(
                `Error in fetching school information: ${error.message}`
            );
            // Handle the error as needed
        }
        function validateSchoolDetails(schoolDetails) {
            if (!schoolDetails || typeof schoolDetails !== "object") {
                return false;
            }

            const requiredFields = ["name", "address", "phoneNumber", "email"];

            for (const field of requiredFields) {
                if (
                    !schoolDetails.hasOwnProperty(field) ||
                    typeof schoolDetails[field] !== "string" ||
                    schoolDetails[field].trim() === ""
                ) {
                    return false;
                }
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(schoolDetails.email)) {
                return false;
            }

            // Validate phone number format (simple check for digits only)
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(schoolDetails.phoneNumber)) {
                return false;
            }

            return true;
        }

        function sanitizeHeaders(headers) {
            const sanitizedHeaders = {};
            for (const [key, value] of Object.entries(headers.headers)) {
                const sanitizedKey = key.replace(/[^\w-]/g, "");
                const sanitizedValue =
                    typeof value === "string"
                        ? value.replace(/[^\w-]/g, "")
                        : value;
                sanitizedHeaders[sanitizedKey] = sanitizedValue;
            }
            return { headers: sanitizedHeaders };
        }
    }
}

export default new SchoolInformationService();
