import React from 'react';
import { SearchResultInerface } from '../TypeInterfaces';

const SearchResultGame = ({name, cheapestPrice, imageURL, gameId, setGameId}:SearchResultInerface) => {

    const gameOnClick = () => {
        setGameId([[]]);
        setGameId([gameId]);
    }

    return(
        <div className='game-search-result' onClick={gameOnClick}>
            <img src={imageURL}/>
            <p>{`Name: ${name}`}</p>
            <p>{`Cheapest: $${cheapestPrice}`}</p>
        </div>
    );
}

export default SearchResultGame;