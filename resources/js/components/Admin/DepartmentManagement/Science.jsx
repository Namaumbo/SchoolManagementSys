import {AiFillDelete, FiBook, FiDelete} from "react-icons/all";
import './Science.css'
import { MaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import React, { useEffect, useState } from "react";
import { userState } from "../../User/userState";
import { userDetails } from "../../recoil_states/userdetails";
import { useRecoilState } from "recoil";
export default function Science() {
    let [userInfo, setUserInfo] = useRecoilState(userDetails);
    const [data, setData] = useState([]);
    let [{ loggedIn, role }] = useRecoilState(userState);
    const accessKey = localStorage.getItem("key");

    useEffect(() => {
        async function getUsers() {
            const headers = {
                Authorization: `Bearer ${accessKey}`,
            };
            await axios
                .get("http://127.0.0.1:8000/api/users", { headers })
                .then((res) => {
                    setUserInfo(res.data);
                    setData(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        getUsers().then(null);
    }, ["http://127.0.0.1:8000/api/users"]);


  
    const columns = useMemo(
      () => [
        {accessorKey: 'title',  header: 'Title',size: 150, },
        { accessorKey: 'firstname', header: 'Firstname',size: 150, },
        {accessorKey: 'surname',  header: 'Surname',  size: 200,},
        { accessorKey: 'email', header: 'Email',  size: 150,},
        { accessorKey: 'role_name', header: 'Role', size: 150, },
      ],
   
      [],
    );
    const rows = data;
    return <MaterialReactTable columns={columns}
    
    data={data}
    
    
     />;
  };


