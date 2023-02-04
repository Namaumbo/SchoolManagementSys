import React, {useState} from "react"
import './teachers.css'
import {AddCircle, GpsFixed, Phone, Search} from "@mui/icons-material";
import profile from '../../../../assets/profile.jpeg'


const Team = () => {

    const [newTeacher, setNewTeacher] = useState(false)


    function AddTeacher() {
        setNewTeacher(true)
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
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Last Name</label><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Title</label><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>village</label><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Phone number</label><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Traditional Authority</label><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>District</label><br/>
                                    <input className='form-control'/>
                                </div>
                            </div>
                            <div className="organisation">
                                <div className='input'>
                                    <label>Email</label><span style={{color: 'red'}}>*</span><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Partial Password</label><span style={{color: 'red'}}>*</span><br/>
                                    <input className='form-control'/>
                                </div>
                                <div className='input'>
                                    <label>Department</label><span style={{color: 'red'}}>*</span><br/>
                                    <select className='form-select'>
                                        <option>Science</option>
                                        <option>Language</option>
                                        <option>History</option>
                                        <option>Humanities</option>
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
                                    <label><b>ROLE<span style={{color: 'red'}}>*</span></b></label><br/>
                                    <select className='form-select'>
                                        <option>Administrator</option>
                                        <option>Head Teacher</option>
                                        <option>Teacher</option>
                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="sendBtn">
                            <button className='saveBtn'>Save as Draft</button>
                            <button className='saveBtn'>SAVE</button>
                        </div>
                    </div>

                </div>
            </>
        )
    }


    return <>
        <div>
            <h3 className='teacher'>Teachers</h3>
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