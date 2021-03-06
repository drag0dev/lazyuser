import URLs from '../ApiURLs';
import CheapSharkURLs from '../CheapSharkURLs';
import React, {useEffect, useState, useRef, useContext} from 'react';
import { UserContext } from '../UserContext';
import { userInfoContextType, DetailedGameInterface, storesInfoInterface, gameInfoInterface} from '../TypeInterfaces';
import { Link } from 'react-router-dom';

const DetailedGame = ({gameId, setGameId, getUserGames}: DetailedGameInterface) =>{
    const detailDivRef = useRef<HTMLDivElement>(null);
    const userInfo: userInfoContextType = useContext(UserContext);
    const [storesInfo, setStoresInfo] = useState<storesInfoInterface[]>([]);
    const [detailedGamesInfo, setDetailedGameInfo] = useState<gameInfoInterface[]>([]);
    const popUpDiv = useRef<HTMLDivElement>(null);
    const overlayDiv = useRef<HTMLDivElement>(null);

    const handleFollowServerSide = async (clickedId: string, follow: boolean = true) => {
        if(follow){
            let res = await fetch(URLs.urlAddGame, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({username: userInfo.userInfo.username, gameName: clickedId})
            });

            if (res.status == 200){ // add the game to the tracked games on front end
                let newArray = userInfo.userInfo.games;
                newArray.push(clickedId);
                userInfo.setUserInfo({
                    ...userInfo.userInfo,
                    games: newArray
                });
                getUserGames();
            }
        
        }else {
            let res = await fetch(URLs.urlDelGame, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({username: userInfo.userInfo.username, gameName: clickedId})
            });
            if(res.status == 200){ // remove the game from the tracked on front end
                let newArray = userInfo.userInfo.games;
                let index: number = newArray.indexOf(clickedId);
                if (index > -1) newArray.splice(index, 1); // remove the gameId
                userInfo.setUserInfo({
                    ...userInfo.userInfo,
                    games: newArray
                });
                getUserGames();

                // if the game is currently displayed remove it
                index = gameId.indexOf(clickedId);
                if(index > -1){
                    let newGameIdArray = [...gameId];
                    newGameIdArray.splice(index, 1);
                    setGameId(newGameIdArray);
                } 
            }
        }
    }

    const showPopUpDiv = () => {
        if (overlayDiv.current && popUpDiv.current){
            overlayDiv.current.className += ' active';
            popUpDiv.current.className += ' active';
        }
    }

    const closePopUpDiv = () => {
       if (overlayDiv.current && popUpDiv.current){
           overlayDiv.current.className = overlayDiv.current.className.replaceAll(' active', '');
           popUpDiv.current.className = popUpDiv.current.className.replaceAll(' active', '');
       } 
    }

    const followOnClick = (e:React.MouseEvent<HTMLElement>) => {
        //check if the user is loggied, if not popup for login
        if (!userInfo.userInfo.logged){
            showPopUpDiv(); 
            return;
        }

        const className = e.currentTarget.className.split('-')[2];

        if (userInfo.userInfo.games.includes(className)){ // if game is followed  
            handleFollowServerSide(className, false);
        }
        else{ // if game is to be followed
            handleFollowServerSide(className, true);
        }
    }

    const getStores = async () =>{
        const res = await fetch(CheapSharkURLs.store);
        let data: storesInfoInterface[] = await res.json();
        return data;
    }

    const getGames = async () => {
        let currentDetailedGamesInfo: gameInfoInterface[] = [];

        for(let i=0;i<gameId.length;i++){
            const game = await fetch(CheapSharkURLs.game.replace('placeholder', gameId[i]));
            const gameInfo: gameInfoInterface = await game.json();

            let date = new Date(parseInt(gameInfo.cheapestPriceEver.date)*1000);
            gameInfo.cheapestPriceEver.date = date.toDateString();

            currentDetailedGamesInfo.push(gameInfo);
        }

        // changing array elements doesnt fire rerender, since the reference stays the same, a new array is required to fire a rerender 
        setDetailedGameInfo([...currentDetailedGamesInfo]);
        if(gameId.length==1)detailDivRef.current?.scrollIntoView();
    }

    const emptyGameArray = async () =>{
        await setDetailedGameInfo([]);
    }

    useEffect(()=>{
        getStores().then((data)=> {setStoresInfo(data)});
    },[]);

    useEffect(()=>{
        emptyGameArray();
        if(gameId.length==0)return;
        getGames();
    }, [gameId]);


    return(
        <div className='detailed-game-div' ref={detailDivRef} >
            <div ref={overlayDiv} className='login-overlay' onClick={closePopUpDiv}></div>
            <div ref={popUpDiv} className='login-popup'>

                <div>
                    <button onClick={closePopUpDiv}>&times;</button>

                    <p>
                        In order to follow a game you need to be logged in.
                    </p>
                </div>

                <div className='links'>
                    <Link to='/login' onClick={closePopUpDiv}>Login</Link>
                    <Link to='/register' onClick={closePopUpDiv}>Register</Link>
                </div>

            </div>


            {detailedGamesInfo.map((game, index) => (
                <div key={`detailed-game-${game.info.title}`} className='detailed-games'>

                    <div className='detailed-game-description'>
                        <img src={game.info.thumb} className='big-image'/>

                        <p className='description-p'>
                            Name: {game.info.title}
                            <br />
                            Cheapest: ${game.cheapestPriceEver.price} ({game.cheapestPriceEver.date}.)
                        </p>

                        <button onClick={(e: React.MouseEvent<HTMLElement>) => followOnClick(e)} className={`follow-button-${gameId[index]}`} key={`follow-button-${game.info.title}`}>{userInfo.userInfo.games?.includes(gameId[index]) ? 'Unfollow' : 'Follow'}</button>
                    </div>
                    
                    <div className='deals-div' key={`game-${index}`}>
                        {game.deals.map((deal)=>(
                            <a href={CheapSharkURLs.deal.replace('placeholder', deal.dealID)} target='_blank' key={deal.dealID}>
                            <br/>
                            <img src={CheapSharkURLs.default + storesInfo[parseInt(deal.storeID)-1].images.icon}></img>
                            <p>{`$${deal.price} (${parseInt(deal.savings).toFixed(0)}%)`}</p>
                        </a>
                        ))}
                    </div>
                </div>
            ) ) }
        </div>
    );

}

export default DetailedGame;