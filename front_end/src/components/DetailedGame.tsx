import React, {useEffect, useState, useRef} from 'react';
import { DeatiledGameInterface } from '../App';
import CheapSharkURLs from '../CheapSharkURLs';

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

const DetailedGame = ({gameId}: DeatiledGameInterface) =>{
    const detailDivRef = useRef<HTMLDivElement>(null);

    const [storesInfo, setStoresInfo] = useState<storesInfoInterface[]>([]);

    const [detailedGameInfo, setDetailedGameInfo] = useState<gameInfoInterface>({
        info: {
            title: '',
            thumb: ''
        },
        cheapestPriceEver: {
            price: 0,
            date: ''
        },
        deals: [
            {
                storeID: '',
                dealID: '',
                price: '',
                retailPrice: '',
                savings: ''
            }
        ]
    });

    const getStores = async () =>{
        const res = await fetch(CheapSharkURLs.store);
        let data: storesInfoInterface[] = await res.json();
        return data;
    }

    const getGame = async () => {
        const game = await fetch(CheapSharkURLs.game.replace('placeholder', gameId));
        const gameInfo: gameInfoInterface = await game.json();
        let date = new Date(parseInt(gameInfo.cheapestPriceEver.date)*1000);
        gameInfo.cheapestPriceEver.date = date.toDateString();
        setDetailedGameInfo(gameInfo);
    }

    useEffect(()=>{
        getStores().then((data)=> {setStoresInfo(data)});
    },[]);

    useEffect(()=>{
        if(gameId == '')return;
        getGame();
        detailDivRef.current?.scrollIntoView();
    }, [gameId]);

    return(
        <div className='detailed-game-div' ref={detailDivRef}>
            {gameId != ''
                ?<>
                    <img src={detailedGameInfo.info.thumb} className='big-image'/>

                    <p>
                        Name: {detailedGameInfo.info.title}
                        <br />
                        Cheapest: ${detailedGameInfo.cheapestPriceEver.price} ({detailedGameInfo.cheapestPriceEver.date}.)
                    </p>

                    <button className={`follow-button`}>Follow</button>

                    <div className='deals-div'>
                        {detailedGameInfo.deals.map((deal, index)=>(
                            <a href={CheapSharkURLs.deal.replace('placeholder', deal.dealID)} target='_blank' key={deal.dealID}>
                            <br/>
                            <img src={CheapSharkURLs.default + storesInfo[index].images.icon}></img>
                            <br/>
                            <p>{storesInfo[index].storeName}</p>
                            <br />
                            <p>{`Discount: ${parseInt(deal.savings).toFixed(0)}%`}</p>
                            <br />
                            <p>{`Price: $${deal.price}`}</p>
                        </a>
                        ))}
                    </div>
                </>
                :<></>
            }
        </div>
    );

}

export default DetailedGame;