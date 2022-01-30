import React from 'react';

export interface SearchResultInerface{
    name: string,
    cheapestPrice: string,
    imageURL: string
}

const SearchResultGame = ({name, cheapestPrice, imageURL}:SearchResultInerface) => {
    return(
        <div className='game-search-result'>
            <img src={imageURL}/>
            <p>{`Name: ${name}`}</p>
            <p>{`Cheapest: ${cheapestPrice}`}</p>
        </div>
    );
}

export default SearchResultGame;