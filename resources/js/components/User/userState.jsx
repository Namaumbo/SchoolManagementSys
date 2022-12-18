import { atom } from "recoil";

export const userState = atom({
    key: "login",
    default:{ loggedIn:""},
})
