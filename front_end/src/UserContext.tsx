import { createContext } from "react";
import { userInfoInterface } from "./App";
export type userInfoContextType = {
    userInfo: userInfoInterface,
    setUserInfo: Function
}

const defaultUserInfo: userInfoInterface = {username: '', logged: true, games: []};
const defaultFunction: Function = () => {};

export const UserContext = createContext<userInfoContextType>({userInfo: defaultUserInfo, setUserInfo: defaultFunction});

