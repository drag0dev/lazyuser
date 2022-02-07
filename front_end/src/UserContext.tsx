import { createContext } from "react";
import { userInfoContextType, userInfoInterface } from './TypeInterfaces';

const defaultUserInfo: userInfoInterface = {username: '', logged: true, games: [], email: '', emailVerified: false};
const defaultFunction: Function = () => {};

export const UserContext = createContext<userInfoContextType>({userInfo: defaultUserInfo, setUserInfo: defaultFunction});