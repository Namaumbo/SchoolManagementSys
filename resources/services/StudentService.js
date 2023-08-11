import axios from "axios";

class StudentsService {
    urlPrefix = "http://127.0.0.1:8000/api";
    constructor() {}

    async getAllStudent() {
        let res = [];
        try {
            let students = new Array();
            let availableStudent = await axios.get(
                `${this.urlPrefix}/students`
            );
            if (availableStudent.data.length > 0) {
                students = availableStudent.data;
                res = students
            }
        } catch (error) {
            res = error
        }

        return res;
    }
    createStudent(){
    }

    updateStudent(){}

    getStudentAssignments(){

    }
}

export default new StudentsService();
