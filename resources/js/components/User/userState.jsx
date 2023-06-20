import { atom } from "recoil";

export const userState = atom({
    key: "loginStatus",
    default:{
        loggedIn:"",
        role:"",
        usersList: []
    },
})

export const userInfo = atom({
    key:"userInfo",
    default:{
        userInfo : {}
    }
})