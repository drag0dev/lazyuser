import { createContext } from "react";
import { userInfoContextType, userInfoInterface } from './TypeInterfaces';

const defaultUserInfo: userInfoInterface = {
    username: '',
    logged: false,
    games: [],
    email: '',
    emailVerified: false,
    loading: true
};
const defaultFunction: Function = () => {};

export const UserContext = createContext<userInfoContextType>({userInfo: defaultUserInfo, setUserInfo: defaultFunction});