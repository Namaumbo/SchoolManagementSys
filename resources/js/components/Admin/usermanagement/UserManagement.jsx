import React, {useEffect, useState} from "react"
import "./users.css"
import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";
import {userDetails} from "@/components/recoil_states/userdetails";
import {Delete, Edit} from "@mui/icons-material";
import Chart from '../utils/Chart.jsx'
import {FiHome, FiUsers} from "react-icons/all";


function UserManagement() {
    const [{loggedIn, role, usersList}, setUsersList] = useRecoilState(userState)
    const [loading, setLoading] = useState(true);

    let [userInfo, setUserInfo] = useRecoilState(userDetails)

    useEffect(() => {
        async function getUsers() {
            await axios.get('http://127.0.0.1:8000/api/users').then(res => {
                setUserInfo(userInfo = res.data)
                setLoading(false)
            }).catch(err => {
                console.error(err)
            })
        }

        getUsers().then(null)
    }, ['http://127.0.0.1:8000/api/users'])

    return <>
        <div className="heading-title">
            <FiUsers/><h4>Users-available</h4>
        </div>
        {
            loading ?
                <div className='container text-center' style={{marginTop: '25%'}}>
                    <span className='noUser'> loading...</span>
                </div>
                :
                <div>
                    {
                        userInfo ?
                            <>
                                                              <div className='user-tb'>
                                    <table className="table table-hover" style={{width: '800px'}}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>District</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            userInfo.map(user => {
                                                return <tr>
                                                    <td>{user.id}</td>
                                                    <td>{user.title}</td>
                                                    <td>{user.firstname}</td>
                                                    <td>{user.surname}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.district}</td>
                                                    <td><button>Delete</button></td>
                                                </tr>

                                            })
                                        }
                                        </tbody>
                                    </table>

                                </div>
                            </>
                            :
                            <div className='container text-center' style={{marginTop: '25%'}}>
                        <span className='noUser'>
                       Oops! no users so far add Users
                     </span>
                            </div>


                    }

                </div>
        }
    </>
}

export default UserManagement
