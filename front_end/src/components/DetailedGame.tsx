import React, {useEffect, useState, useRef, useContext} from 'react';
import { DetailedGameInterface } from '../App';
import CheapSharkURLs from '../CheapSharkURLs';
import { UserContext, userInfoContextType } from '../UserContext';
import URLs from '../ApiURLs';

interface storesInfoInterface{
    storeID: string,
    storeName: string,
    isActive: number,
    images: {
        banner: string,
        logo: string,
        icon: string
    }
}

interface gameInfoInterface{
    info: {
        title: string,
        steamAppID?: string,
        thumb: string
    },
    cheapestPriceEver: {
        price: number,
        date: string
    },
    deals: [
        {
            storeID: string,
            dealID: string,
            price: string,
            retailPrice: string,
            savings: string
        }
    ]
}

const DetailedGame = ({gameId, setGameId, getUserGames}: DetailedGameInterface) =>{
    const detailDivRef = useRef<HTMLDivElement>(null);

    const userInfo: userInfoContextType = useContext(UserContext);

    const [storesInfo, setStoresInfo] = useState<storesInfoInterface[]>([]);

    const [detailedGamesInfo, setDetailedGameInfo] = useState<gameInfoInterface[]>([]);

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
                let newUserInfo = userInfo.userInfo;
                newArray.push(clickedId);
                newUserInfo.games = newArray;
                userInfo.setUserInfo(newUserInfo);
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
                let newUserInfo = userInfo.userInfo;
                let index: number = newArray.indexOf(clickedId);
                if (index > -1) newArray.splice(index, 1); // remove the gameId
                newUserInfo.games = newArray;
                userInfo.setUserInfo(newUserInfo);
                getUserGames();

                // if the game is currently displayed remove it
                index = gameId.indexOf(clickedId);
                if(index > -1){
                    let newGameIdArray = [...gameId];
                    newGameIdArray.splice(index, 1);
                    console.log(gameId, newGameIdArray);
                    setGameId(newGameIdArray);
                } 
            }
        }
    }

    const followOnClick = (e:React.MouseEvent<HTMLElement>) => {
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
            {detailedGamesInfo.map((game, index) => (
                <div key={`detailed-game-${game.info.title}`} className='detailed-games'>
                    <img src={game.info.thumb} className='big-image'/>

                    <p>
                        Name: {game.info.title}
                        <br />
                        Cheapest: ${game.cheapestPriceEver.price} ({game.cheapestPriceEver.date}.)
                    </p>

                    <button onClick={(e: React.MouseEvent<HTMLElement>) => followOnClick(e)} className={`follow-button-${gameId[index]}`} key={`follow-button-${game.info.title}`}>{userInfo.userInfo.games?.includes(gameId[index]) ? 'Unfollow' : 'Follow'}</button>

                    <div className='deals-div' key={`game-${index}`}>
                        {game.deals.map((deal)=>(
                            <a href={CheapSharkURLs.deal.replace('placeholder', deal.dealID)} target='_blank' key={deal.dealID}>
                            <br/>
                            <img src={CheapSharkURLs.default + storesInfo[parseInt(deal.storeID)-1].images.icon}></img>
                            <br/>
                            <p>{storesInfo[parseInt(deal.storeID)-1].storeName}</p>
                            <br />
                            <p>{`Discount: ${parseInt(deal.savings).toFixed(0)}%`}</p>
                            <br />
                            <p>{`Price: $${deal.price}`}</p>
                        </a>
                        ))}
                    </div>
                    {index+1 != detailedGamesInfo.length && <hr/>}
                </div>
            ) ) }
        </div>
    );

}

export default DetailedGame;