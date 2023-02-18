import React, {useEffect, useState} from "react"
import "./users.css"
import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";
import {userDetails} from "@/components/recoil_states/userdetails";
import {Delete, Edit} from "@mui/icons-material";
import Chart from '../utils/Chart.jsx'


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
                                <span className="list-title">List of Users</span>
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
                                                    <td><Delete style={{color: "red"}}/>{" "}<Edit
                                                        style={{color: "green"}}/></td>
                                                </tr>

                                            })
                                        }
                                        </tbody>
                                    </table>
                                    <div>
                                        <div className='scoresNumber'>
                                            <h4 className='heading' style={{color: 'black', textAlign: 'center'}}>Average
                                                scores in %</h4>
                                            <h4 className='subHeading'>English</h4>
                                            <div className='chartItem'><Chart/></div>
                                            <span></span>
                                            <h4 className='subHeading'>Mathematics</h4>
                                            <div className='chartItem'><git add Chart/></div>
                                            <span></span>
                                            <h4 className='subHeading'>Biology</h4>
                                            <div className='chartItem'><Chart/></div>
                                        </div>
                                    </div>
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
