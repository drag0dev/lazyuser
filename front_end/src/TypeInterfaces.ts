export interface userInfoInterface{
  username: string
  logged: boolean
  games: string[]
  email: string
}

export type userInfoContextType = {
    userInfo: userInfoInterface,
    setUserInfo: Function
}

export interface DetailedGameInterface{
  gameId: string[],
  setGameId: Function,
  getUserGames: Function
}

export interface headerStateProp{
    state: boolean;
}

export interface gamesSerachResultJSON{
    gameID: string,
    steamAppId?: string,
    cheapest: string,
    cheapestDealID: string,
    external: string,
    internalName: string,
    thumb : string
}

export interface SearchResultInerface{
    name: string,
    cheapestPrice: string,
    imageURL: string,
    gameId: string,
    setGameId: Function
}

export interface storesInfoInterface{
    storeID: string,
    storeName: string,
    isActive: number,
    images: {
        banner: string,
        logo: string,
        icon: string
    }
}

export interface gameInfoInterface{
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

