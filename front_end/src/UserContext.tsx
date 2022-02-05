import { createContext } from "react";
import { userInfoContextType, userInfoInterface } from './TypeInterfaces';

const defaultUserInfo: userInfoInterface = {username: '', logged: true, games: [], email: ''};
const defaultFunction: Function = () => {};

export const UserContext = createContext<userInfoContextType>({userInfo: defaultUserInfo, setUserInfo: defaultFunction});