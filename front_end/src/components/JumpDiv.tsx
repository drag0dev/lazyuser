import React, {useContext} from 'react';
import { UserContext } from '../UserContext';
import { userInfoContextType } from '../UserContext';
import DetailedGameContext, { DetailedGameInterface } from '../App';
const JumpDiv = ({gameId, setGameId}: DetailedGameInterface) => {
    const userInfo: userInfoContextType = useContext(UserContext);

    const onClickJump = () => {
        window.scrollTo(0,0);
    }

    const onClickTracked = () => {
        setGameId([[]]);
        setGameId([...userInfo.userInfo.games]);
    }

    return(
        <div className='jump-div' >
            <p onClick={onClickJump}>Press me if you want to go to the top!</p>
            {userInfo.userInfo.logged && <button onClick={onClickTracked}>Show tracked games</button>}
        </div>
    );
}

export default JumpDiv;