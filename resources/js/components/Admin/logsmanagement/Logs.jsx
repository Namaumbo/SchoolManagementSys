import React from "react"
import {AiFillDelete, FiBook, FiDelete} from "react-icons/all";
import './logs.css'

const Logs = () => {
    return <>
        <div className='logs-wrapper'>
            <div className="heading-title">
                <FiBook/><span style={{color:'white'}}>Logs - Panel</span>
            </div>
            <div className="logs-content">
                <table className="table-hover">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Type</th>
                        <th>User Id</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className='table-row'>
                        <td>3</td>
                        <td>Login</td>
                        <td>4</td>
                        <td>10:10am</td>
                        <td>
                            <button className='delete-btn'><AiFillDelete color='red'/> Delete</button>
                        </td>
                    </tr>
                    <tr className='table-row'>
                        <td>3</td>
                        <td>Login</td>
                        <td>4</td>
                        <td>10:10am</td>
                        <td>
                            <button className='delete-btn'><AiFillDelete size='10px'/> Delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>


    </>
}
export default Logs
