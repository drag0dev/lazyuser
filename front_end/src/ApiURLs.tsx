const URLs = {
    urlLogin: process.env.REACT_APP_URL_LOGIN || '',
    urlCheckLogin: process.env.REACT_APP_URL_CHECK_LOGIN || '',
    urlRegister: process.env.REACT_APP_URL_REGISTER || '',
    urlDelUser: process.env.REACT_APP_URL_DEL_USER || '',
    urlAddGame: process.env.REACT_APP_URL_ADD_GAME || '',
    urlDelGame: process.env.REACT_APP_URL_DEL_GAME || '',
    urlLogout: process.env.REACT_APP_URL_LOGOUT || '',
    urlGames: process.env.REACT_APP_URL_GAMES || '',
    urlChangeInfo: process.env.REACT_APP_URL_CHANGE_INFO || '',
    urlForgot: process.env.REACT_APP_URL_FORGOT || '',
    urlVerifyEmail: process.env.REACT_APP_URL_VERIFY_EMAIL || '',
    urlRequestEmailVerification: process.env.REACT_APP_URL_REQUEST_EMAIL_VERIFICATION || ''
}

export default URLs;