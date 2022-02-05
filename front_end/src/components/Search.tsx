import React, { useState } from 'react';
import CheapSharkURLs from '../CheapSharkURLs';
import SearchResultGame from './SearchResultGame';
import { DetailedGameInterface, gamesSerachResultJSON} from '../TypeInterfaces';

const Search = ({gameId, setGameId}: DetailedGameInterface) => {
    const [searchString, setSearchString] = useState('');
    const [results, setResults] = useState ([]);

    const fetchSearchResults = async () => {
        if(!searchString)return;
        let res = await fetch(CheapSharkURLs.search.replace('placeholder', searchString));
        let data = await res.json();
        setResults(data);
    }

    return(
        <div>
            <div className='search-div'>
                <label>Enter a game name:</label>
                <input type="text" id="name" className="game-name-box" value={searchString} onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setSearchString(e.currentTarget.value)}}/>
                <input type="submit" className="submit-dugme" value="Go" onClick={fetchSearchResults}></input>
            </div>
        
            <div className='results-div'>
                {results.map((game:gamesSerachResultJSON)=>(
                    <SearchResultGame 
                    name={game.external}
                    cheapestPrice={game.cheapest}
                    imageURL={game.thumb}
                    key={game.gameID}
                    gameId={game.gameID}
                    setGameId={setGameId}
                    />
                ))}
            </div>
        </div>
    );
}

export default Search;