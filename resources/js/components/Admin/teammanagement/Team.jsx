import React, {useEffect, useState} from "react"
import './teachers.css'
import {AddCircle, GpsFixed, Phone, Search} from "@mui/icons-material";
import profile from '../../../../assets/profile.jpeg'
import {FiUsers} from "react-icons/fi";

const Team = () => {

    const [newTeacher, setNewTeacher] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);


    useEffect(() => {
        async function departments() {
            await axios.get('http://127.0.0.1:8000/api/departments').then(res => {
                setDepartments(res.data)
                console.log(res.data)
            }).catch(err => {
                console.error(err)
            })
        }
        departments().then(null)

        async function roles() {
            await axios.get('http://127.0.0.1:8000/api/roles').then(res => {
                setRoles(res.data)
                console.log(res.data)
            }).catch(err => {
                console.error(err)
            })
        }
        // departments().then(null)
        roles().then(null)
    }, ['http://127.0.0.1:8000/api/departments'])


    function submit(){

    }

    function AddTeacher() {
        setNewTeacher(true)
        const [formValues, setFormValues] = useState({
            firstname: '',
            surname: '',
            title: '',
            village: '',
            phoneNumber: '',
            traditional_authority: '',
            district: '',
            email: '',
            password: '',
            departmentName: '',
            sex: ''
        });
        const handleInputChange = event => {
            const {name, value} = event.target;
            setFormValues({...formValues, [name]: value});
        };

        const handleSelectChange = event => {
            setFormValues({...formValues, departmentName: event.target.value, sex: event.target.value});
        };

        const handleSubmit = async event => {
            event.preventDefault();
            try {
                const options = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                 await axios.post('http://127.0.0.1:8000/api/register-user', formValues, options).then(res=>{
                     if(res.status === 201){
                         alert('for now alert is ok user saved')
                         setFormValues({
                             firstname: '',
                             surname: '',
                             title: '',
                             village: '',
                             phoneNumber: '',
                             traditional_authority: '',
                             district: '',
                             email: '',
                             password: '',
                             departmentName: '',
                             sex: ''
                         })
                     }
                     }
                 ).catch(err=>{
                     alert(err)
                 });

            } catch (error) {
                console.log(error)
            }
        };

        return (
            <>
                <div className='addTeacherWrapper'>
                    <div className="title">
                        Add New Teacher Details
                    </div>
                    <div className="infoWrapper">
                        <div className='details'>
                            <div className="personal">
                                <div className='input'>
                                    <label>First Name</label><br/>
                                    <input className='form-control' type="text" value={formValues.firstname}
                                           onChange={handleInputChange} name="firstname"/>
                                </div>
                                <div className='input'>
                                    <label>Last Name</label><br/>
                                    <input className='form-control' type="text" value={formValues.surname}
                                           onChange={handleInputChange} name="surname"/>
                                </div>
                                <div className='input'>
                                    <label>Title</label><br/>
                                    <input className='form-control' type="text" value={formValues.title}
                                           onChange={handleInputChange} name="title"/>
                                </div>
                                <div className='input'>
                                    <label>village</label><br/>
                                    <input className='form-control' type="text" value={formValues.village}
                                           onChange={handleInputChange} name="village"/>
                                </div>
                                <div className='input'>
                                    <label>Phone number</label><br/>
                                    <input className='form-control' type="tel" value={formValues.phoneNumber}
                                           onChange={handleInputChange} name="phoneNumber"/>
                                </div>
                                <div className='input'>
                                    <label>Traditional Authority</label><br/>
                                    <input className='form-control' type="text" value={formValues.traditional_authority}
                                           onChange={handleInputChange} name="traditional_authority"/>
                                </div>
                                <div className='input'>
                                    <label>District</label><br/>
                                    <input className='form-control' type="text" value={formValues.district}
                                           onChange={handleInputChange} name="district"/>
                                </div>
                            </div>
                            <div className="organisation">
                                <div className='input'>
                                    <label>Email</label><span style={{color: 'red'}}>*</span><br/>
                                    <input className='form-control' type="email" value={formValues.email}
                                           onChange={handleInputChange} name="email"/>
                                </div>
                                <div className='input'>
                                    <label>Partial Password</label><span style={{color: 'red'}}>*</span><br/>
                                    <input className='form-control' type="password" value={formValues.password}
                                           onChange={handleInputChange} name="password"/>
                                </div>
                                <div className='input'>
                                    <label>Department</label><span style={{color: 'red'}}>*</span><br/>
                                    <select className='form-select' name="department" value={formValues.department}
                                            onChange={handleSelectChange}>
                                        <option value=""></option>
                                        {
                                            departments.map(department => {
                                                return (
                                                    <option
                                                        value={department.departmentName}>{department.departmentName}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                <div className='input'>
                                    <label>Class</label><span style={{color: 'red'}}>*</span><br/>
                                    <select className='form-select'>
                                        <option>Form 1</option>
                                        <option>Form 2</option>
                                        <option>Form 3</option>
                                        <option>Form 4</option>
                                    </select>
                                </div>
                                <div className='input'>
                                    <label>Sex</label><span style={{color: 'red'}}>*</span><br/>
                                    <select className='form-select' value={formValues.sex}
                                            onChange={handleSelectChange}>
                                        <option value="male">Female</option>
                                        <option value="female">Male</option>
                                    </select>
                                </div>
                                <div className='input'>
                                    <label><b>ROLE<span style={{color: 'red'}}>*</span></b></label><br/>
                                    <select className='form-select'>
                                        {
                                            roles.map(role => {
                                                return (
                                                    <option>{role.role_name}</option>
                                                )
                                            })
                                        }
                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="sendBtn">
                            <button className='saveBtn'>Save as Draft</button>
                            <button className='saveBtn' onClick={handleSubmit}>SAVE</button>
                        </div>
                    </div>

                </div>
            </>
        )
    }


    return <>
        <div>
            <div className="heading-title">
                <FiUsers/><h4>Teachers-panel</h4>
            </div>
            {/*search and buttons*/}
            <div className="upperActions">
                <div className="search">
                    <Search/>
                    <input type='text' className='input' placeholder='Search Teachers'/>
                </div>
                <div className="buttons">
                    <button className='addBtn' onClick={AddTeacher}><AddCircle/>New Teacher</button>
                </div>
            </div>
            {
                newTeacher ?

                    <>
                        <AddTeacher/>
                    </>
                    :
                    <>
                        <div className="teacherInfo">
                            <div className='insideWrapper'>
                                <div className="Image">
                                    <img src={profile} className='profilePic'/>
                                </div>
                                <span className='name'>Tom Hanswell</span>
                                <div className='expertise'>
                                    Science
                                </div>
                                <div className="details">
                                    <Phone/>
                                    <GpsFixed/>
                                </div>
                            </div>
                        </div>

                    </>
            }

        </div>
    </>
}
export default Team
