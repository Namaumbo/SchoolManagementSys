import axios from "axios";

class StudentsService {
    urlPrefix = "http://127.0.0.1:8000/api";
    constructor() {}

    async getAllStudent() {
        let res = null;
        try {
            let students = new Array();
            let availableStudent = await axios.get(
                `${this.urlPrefix}/students`
            );
            if (availableStudent.data.length > 0) {
                //if status successfully an array is returned
                students = availableStudent.data;
                res = students
            }
        } catch (error) {
            res = error
        }

        return res;
    }
    
    async createStudent(){
        // let 

    }

    async updateStudent(){}

    async getStudentAssignments (){

    }
}

export default new StudentsService();
