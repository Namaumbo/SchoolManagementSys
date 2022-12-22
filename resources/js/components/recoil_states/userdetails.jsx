import { atom } from "recoil";

export const userDetails = atom({
    key: "userDetails",
    default:{
        usersList: []
    },
})
