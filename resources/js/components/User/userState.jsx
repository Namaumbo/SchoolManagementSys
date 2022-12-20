import { atom } from "recoil";

export const userState = atom({
    key: "loginStatus",
    default:{
        loggedIn:"",
        role:""
    },
})
