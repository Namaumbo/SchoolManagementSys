import {FiHome, FiUmbrella} from "react-icons/fi";
import React from "react";
import './deparment.css'
import {Link, useNavigate} from 'react-router-dom';

export default function Department(){
    return(
        <>
            <div className="department-wrapper">
                <div className="heading-title">
                    <FiUmbrella/><h4>Department-Panel</h4>
                </div>
                <div className="science-content">
                <div className="conWrapper">
                        <div className="containerTabs">
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        SCIENCES
                                    </span>
                                    <Link to="/science" className="links nav-link
                                                    small-box-footer">More info
                                                    </Link>
                                </div>
                                <span className="stats">
                               
                                    <span>
                                        <h4 className="numbers">
                                
                                        </h4>
                                    </span>
                                </span>
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        languages
                                    </span>
                                </div>
           
                            </div>
                            <div className="card">
                                <div>
                                    <span className="heading">
                                        HUMANITIES
                                    </span>
                                </div>
                                
                            </div>

                     
                      
                        
                          
                        </div>
                    </div>
                    <br />   
                </div>
            </div>
        </>
    )
}
