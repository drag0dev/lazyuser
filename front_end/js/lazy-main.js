let userUsername = '';
let userGames = [];

// api urls
let urlLogin = 'http://localhost:5000/api/user/login';
let urlCheckLogin = 'http://localhost:5000/api/user/checklogin';
let urlRegister = 'http://localhost:5000/api/user/register';
let urlDelUser = 'http://localhost:5000/api/user/del';
let urlAddGame = 'http://localhost:5000/api/user/addgame';
let urlDelGame = 'http://localhost:5000/api/user/delgame';
let urlLogout = 'http://localhost:5000/api/user/logout';
let urlGames = 'http://localhost:5000/api/user/games';

async function getResults(gameName){
    // remove the border if it exists
    results();

    // delete old results
    deleteDetailedResult();
    deleteResults();

    // searching for the game
    let query = `https://www.cheapshark.com/api/1.0/games?title=${gameName}&limit=20&exact=0`;
    let res = await fetch(query);
    let data = await res.json();
    
    if(data.length==0){
        noResults();
        return;
    }

    const displayDiv = document.querySelector('.display-div');
    data.forEach(game => {
        let par = document.createElement('p');
        if(game["thumb"]!=undefined){
            par.innerHTML += `<img src="${game["thumb"]}"></img><br>`
        }
                
        par.innerHTML += `Name: ${game["external"]}<br>`;
        par.innerHTML += `Cheapest: $${game["cheapest"]}<br>`;
        par.className = `game-${game["gameID"]}`;

        par.addEventListener('click', () => showDetailed(par.className));
        displayDiv.appendChild(par);
    });
}

async function showDetailed(className, games=[]){
    // games[] is an array holding game ids
    deleteDetailedResult();

    // fetching info about all stores
    let resStores = await fetch('https://www.cheapshark.com/api/1.0/stores');
    let storesInfo = await resStores.json();

    const detailedDiv = document.querySelector('.display-detailed-div');
    if(className!=null)games.push(className.split('-')[1]); // gameID

    for(let i=0;i<games.length;i++){
        // fetching info about a game
        let data = await fetchInfoAboutGame(games[i]);
        // game image
        detailedDiv.innerHTML += `<img src="${data["info"]["thumb"]}" class="big-image"></img>`;

        // game info
        let par = document.createElement('p');
        par.innerHTML += `Name: ${data["info"]["title"]}<br>`;
        let date = new Date(data["cheapestPriceEver"]["date"]*1000); // converting unix timestamp to human readable date
        par.innerHTML += `Cheapest: $${data["cheapestPriceEver"]["price"]} (${date.toDateString()}.)<br>`;
        detailedDiv.appendChild(par);

        // button for follow/unfollow
        let button = document.createElement('button');
        button.className = `x-${games[i]}`;
        detailedDiv.appendChild(button);
        
        // listing all the deals
        let dealsDiv = document.createElement('div');
        dealsDiv.className = `deals-div-${games[i]}`;
        detailedDiv.appendChild(dealsDiv);

        dealsDiv = document.querySelector(`.deals-div-${games[i]}`);

        data["deals"].forEach(deal => {
            let linkToDeal = document.createElement('a');

            // adding a redirect to the actual sales page
            linkToDeal.href = `https://www.cheapshark.com/redirect?dealID=${deal["dealID"]}`;
            linkToDeal.target = '_blank';
            linkToDeal.ref = 'noopener noreferrer';

            // adding all the info about the deal
            let logoPath = storesInfo[deal["storeID"]-1]["images"]["icon"];
            linkToDeal.innerHTML += `<img src="https://www.cheapshark.com/${logoPath}" class="logo-img"></img><br>`;
            linkToDeal.innerHTML += `${storesInfo[deal["storeID"]-1]["storeName"]}<br>`;
            let discount = ((1 - (deal["price"] / deal["retailPrice"]))*100).toFixed(0);
            linkToDeal.innerHTML += `Discount: ${discount}%<br>`;
            linkToDeal.innerHTML += `Price: $${deal["price"]}<br>`;

            // styling the deal
            linkToDeal.className = 'deal-link';
            linkToDeal.style.paddingLeft = '2.5vw';
            linkToDeal.style.paddingRight = '2.5vw';
            dealsDiv.appendChild(linkToDeal);
        });

        // if mulitple games are being listed add hr between them
        if(i+2<=games.length) detailedDiv.appendChild(document.createElement('hr'));
        
    }
    // set listener for the buttons
    listenerFollowUnfollow();

    document.querySelector('.jump-div').scrollIntoView();
}

async function fetchInfoAboutGame(gameID){
    let query = `https://www.cheapshark.com/api/1.0/games?id=${gameID}`;
    let res = await fetch(query);
    let data = await res.json();
    return data;
}

function deleteDetailedResult(){
    const detailedDiv = document.querySelector('.display-detailed-div');
    while(detailedDiv.lastElementChild)
        detailedDiv.removeChild(detailedDiv.lastElementChild);
}

function deleteResults(){
    const displayDiv = document.querySelector('.display-div');
    while(displayDiv.lastElementChild)
        displayDiv.removeChild(displayDiv.lastElementChild);

}

function noResults(){
    const inputBox = document.querySelector('.game-name-box');
    inputBox.style.border = 'solid 1px red';
}

function results(){
    const inputBox = document.querySelector('.game-name-box');
    inputBox.style.border = '';
}

function sendLoginReg(){
    if(document.querySelector('.sign-in-button').innerHTML == 'Sign in')login();
    else register();
}

async function login(){ // function which checks if the entered login is valid
    const username = document.querySelector('.username-input').value;
    const password = document.querySelector('.password-input').value;
    const msg = document.querySelector('.message');

    if(username == ''){
        msg.innerHTML = 'Username is required';
        return;
    }

    if(password == ''){
        msg.innerHTML = 'Password is required';
        return;
    }

    msg.innerHTML = '';

    let res = await fetch(urlLogin, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
    });

    if(res.status==400){
        msg.innerHTML = 'Wrong credentials';
    }

    if(res.status==200)
        window.location.reload();
}

async function register(){ // function which register a user in the db
    const username = document.querySelector('.username-input').value;
    const password = document.querySelector('.password-input').value;
    const email = document.querySelector('.email-input').value;
    const msg = document.querySelector('.message');

    if(username == ''){
        msg.innerHTML = 'Username is required';
        return;
    }

    if(password == ''){
        msg.innerHTML = 'Password is required';
        return;
    }

    if(email == ''){
        msg.innerHTML = 'Email is required';
        return;
    }

    msg.innerHTML = '';

    let res = await fetch(urlRegister, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password, email: email})
    });

    let error;

    try{
        error = await res.json();
    }
    catch{}

    if(res.status==400){
        if(error)msg.innerHTML = error["error"];
    }

    if(res.status==200)
        window.location.reload();
}

async function checkLogin(){ // upon every load of the page we check if the has a jwt or if its expired
    let res = await fetch(urlCheckLogin, {
        credentials: 'include',
        method: 'POST',
    });

    let data;
    try{
        data = await res.json();
    }
    catch{}

    if(res.status==200){
        userUsername = data["username"];
        let button = document.createElement('button');
        button.className = 'tracked-games';
        button.innerHTML = 'Show tracked games';
        button.addEventListener('click', () => showDetailed(null, userGames));
        document.querySelector('.jump-div').appendChild(button);
        changeNavLogged();
    }
        
}

function signInPopUp(cn){ // function to show a popup for login/resgister
    if(!document.querySelector('.backdrop-div')){
        const backDropDiv = document.createElement('div');
        backDropDiv.style.position = 'fixed';
        backDropDiv.style.top = '0';
        backDropDiv.style.left = '0';
        backDropDiv.style.width = '100%';
        backDropDiv.style.height = '100%';
        backDropDiv.style.opacity = '0';
        backDropDiv.style.zIndex = '1';
        backDropDiv.className = "backdrop-div";
        backDropDiv.addEventListener('click', hideSignInPopUp);
        document.body.appendChild(backDropDiv);
    }

    if(cn == 'register-press'){
        let div = document.querySelector('.content');
        div.style.height = '50vh';
    
        document.querySelector('.login-h').innerHTML = 'Sign up';
        document.querySelector('.register-message').innerHTML = `
            Already have an account? <a class="register-redirect">Sign in</a>
        `;
        document.querySelector('.sign-in-button').innerHTML = 'Sign up';
        if(!document.querySelector('.email-input')){
            let email = document.querySelector('.email-input-div');
            let emailInput = document.createElement('input');
            emailInput.type = 'text';
            emailInput.placeholder = 'E-Mail';
            emailInput.className = 'email-input';
            email.appendChild(emailInput);
        }
    }

    else if(cn == 'signin-press'){
        let div = document.querySelector('.content');
        div.style.height = '45fvh';

        let email = document.querySelector('.email-input-div');
        if(email.lastElementChild){
            email.removeChild(email.lastElementChild);
        }
        
        document.querySelector('.login-h').innerHTML = 'Sign in';
        document.querySelector('.register-message').innerHTML = `
            Don't have an account? <a class="register-redirect">Sign up</a>
        `;
        document.querySelector('.sign-in-button').innerHTML = 'Sign in';
    }

    let redirect = document.querySelector('.register-redirect');
        redirect.addEventListener('click', () => signRedirect(redirect.innerHTML));

    if(!document.querySelector('.popup-style')){
        let newStyle = `
            body > *:not(.login-popup) {
            filter:blur(3px);
        }
        `;

        let styleSheet = document.createElement('style');
        styleSheet.innerText = newStyle;
        styleSheet.className = "popup-style";
        document.head.appendChild(styleSheet);
    }

    const popup = document.querySelector('.content');
    popup.style.zIndex = '2';
}

function hideSignInPopUp(){
    // remove the css for the popup
    const styleSheet = document.querySelector('.popup-style');
    styleSheet.parentNode.removeChild(styleSheet); 

    const popup = document.querySelector('.content');
    popup.style.zIndex = '-1';

    const backDropDiv = document.querySelector('.backdrop-div');
    backDropDiv.remove();
}

async function logOut(){ // clearing the cookie
    let res = await fetch(urlLogout, {
        method: 'GET',
        credentials: 'include'
    });
    window.location.reload();
}

function changeNavLogged(){ // change nav bar if the user is logged
    document.querySelector('.signin-press').innerHTML = '';
    document.querySelector('.register-press').innerHTML = '';

    document.querySelector('.welcome-p').innerHTML = `Welcome, ${userUsername}`;
    document.querySelector('.settings-p').innerHTML = 'Settings';
    document.querySelector('.logout-p').innerHTML = 'Logout';

    document.querySelector('.login').style.width = '35%';
    
    savedGames();
}

async function savedGames(){ // load in all the games from the db that user tracks

    let res = await fetch(urlGames, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: userUsername})
    });

    let data = await res.json();
    userGames = data;
}

function listenerFollowUnfollow(){ // separate function to add listeners for follow/unfollow buttons
    const buttons = document.querySelectorAll('[class^=x-]');

    buttons.forEach(button =>{
        let gameID = button.className.split('-')[1];

        if(userGames.indexOf(gameID)>-1){
            button.innerHTML = 'Unfollow';
            button.addEventListener('click', ()=>followUnfollow(button.className));
        }

        else{
            button.innerHTML = 'Follow';
            button.addEventListener('click', ()=>followUnfollow(button.className));
        }
    });
}

async function followUnfollow(cn){ // handling click on follow/unfollow
    let gameId = cn.split('-')[1];

    if(userUsername==''){ // if the user is not logged, prompt for a login
        document.querySelector('.signin-press').click();
        window.scrollTo(0,0);
        return;
    }

    let query;
    if(userGames.indexOf(gameId)>-1)query = urlDelGame;
    else query = urlAddGame;

    let res = await fetch(query, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: userUsername, gameName: gameId})
    });

    if(res.status != 200){
        document.querySelector(`.${cn}`).style.border = 'solid 1px red';
    }
    else{
        const button = document.querySelector(`.${cn}`);
        if(button.innerHTML == 'Unfollow'){
            userGames.pop(gameId);
            button.innerHTML = 'Follow';
            showDetailed(null, userGames);
        }
        else{
            userGames.push(gameId);
            button.innerHTML = 'Unfollow';
        } 
    }

}

function signRedirect(option){
    if(option == 'Sign up')document.querySelector('.register-press').click();
    else document.querySelector('.signin-press').click();
}

// adding event listeners to elements
const inputBox = document.querySelector('.game-name-box');
const searchButton = document.querySelector('.submit-dugme');
const jump = document.querySelector('.jump');
const signInButton = document.querySelector('.sign-in-button');
const registerPress = document.querySelector('.register-press');
const signInPress = document.querySelector('.signin-press');
const logoutPress = document.querySelector('.logout-p');

logoutPress.addEventListener('click', logOut);
registerPress.addEventListener('click', ()=>signInPopUp(registerPress.className));
signInPress.addEventListener('click', ()=>signInPopUp(signInPress.className));
signInButton.addEventListener('click', sendLoginReg);
jump.addEventListener('click', () => window.scrollTo(0,0));
searchButton.addEventListener('click', ()=>getResults(inputBox.value));

// on load check the jwt
checkLogin();