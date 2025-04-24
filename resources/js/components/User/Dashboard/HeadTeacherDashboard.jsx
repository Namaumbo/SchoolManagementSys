import {useRecoilState} from "recoil";
import {userState} from "@/components/User/userState";
import {userDetails} from "@/components/recoil_states/userdetails";

export default  function HeadTeacherDashboard() {
    let [{loggedIn, role}] = useRecoilState(userState)
    const [userInfo, setUserInfo] = useRecoilState(userDetails)
    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field: 'firstname', headerName: 'First name', width: 130},
        {field: 'surname', headerName: 'Last name', width: 130},
        {field: 'Sex', headerName: 'Sex', type: 'String', width: 10},
        {field: 'email', headerName: 'Email', type: 'String', width: 180},
        {field: 'role_name', headerName: 'Role', width: 100}
    ];
    const rows = userInfo;
    return(
        <>
            return (
                     <div>
                         <div>
                             <div style={{maxWidth: "70%"}}>
                                             <div className="container text-center">
                                     <div className="row">
                                         <div className="col">
                                             <div style={{display: "flex", marginLeft: "45%"}}>
                                                 <div className="col-6">
                                                     <div className="cards">
                                                         <div className="card-header bg-transparent border-success">
                                                             <span className="heading">Members Available</span>
                                                             <hr/>
                                                         </div>
                                                         <span style={{display: "flex", justifyContent: "space-around"}}>
                                                              <span><h4>3/{rows.length} </h4></span>
                                                         <span><img src={teachers} alt="users" className="usersCard"/></span>
                                                           </span>
                                                     </div>
                                                 </div>
                                                 <div className="col-6">
                                                     <div className="cards">
                                                         <div className="card-header bg-transparent border-success">

                                                             <span className="heading">Students Available</span></div>
                                                         <hr/>
                                                         <span style={{display: "flex", justifyContent: "space-around"}}>
                                                               <span><h4>356</h4></span>
                                                          <span>
                                                            <img src={students} alt="users"
                                                                      className="usersCard"/></span>
                                                             </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <div className="container text-center" style={{marginTop: "5px"}}>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                         <span className="headings">
                                                         <b>STUDENTS</b>
                                                     </span>
                                    </div>
                                </div>
                                <div className="container text-center">
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div className="col-11">
                                            <div style={{height: 300, width: '100%'}}>
                                                <DataGrid
                                                    rows={rows}
                                                    columns={columns}
                                                    pageSize={5}
                                                    rowsPerPageOptions={[6]}
                                                    checkboxSelection
                                                />
                                            </div>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                         <span className="headings">
                                                             <br/>
                                                         <b>STATISTICS</b>
                                                     </span>
                                            </div>
                                            <hr/>
                                            <div className="col-11">
                                                <div className="container text-center">
                                                    <div className="row">
                                                        <div className="col-sm-5 col-md-6">
                                                            <div className="graph">
                                                                {/*<Chart student="Male" percentages="56"/>*/}
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-5 offset-sm-2 col-md-6 offset-md-0">
                                                            <div className="graph">
                                                                {/*<Chart*/}
                                                                {/*    student="Females" percentages="44"/>*/}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-5" style={{marginLeft: "10px"}}>
                                            <div className="card">
                                                <DatePicker/>
                                            </div>
                                            <br/>
                                            <span className="headings">
                                                         <b>UPCOMING CLASSES</b>
                                                     </span>
                                            <br/>
                                            <div className="card">
                                                <div className="people">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        </>
    )
}
