import React, {useContext} from 'react';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../UserContext';
const JumpDiv = () => {
    const userInfo: userInfoContextType = useContext(UserContext);

    const onClickJump = () => {
        window.scrollTo(0,0);
    }

    return(
        <div className='jump-div' >
            <p onClick={onClickJump}>Press me if you want to go to the top!</p>
            {userInfo.userInfo.logged && <button>Show tracked games</button>}
        </div>
    );
}

export default JumpDiv;