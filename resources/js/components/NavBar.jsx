import React from "react";
import "../../css/navbar.css"

export default function NavBar() {
    return <>
        <div className="main">
            <div className="container-md">
                <div className="row">
                    <div className="col">
                        <div className="card" style={{width: "16rem", height: "8rem"}}>
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card" style={{width: "16rem", height: "8rem"}}>
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card" style={{width: "16rem", height: "8rem"}}>
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card" style={{width: "16rem", height: "8rem"}}>
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
