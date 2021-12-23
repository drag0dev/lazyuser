# Lazy user
Lazy user is a small web application that tracks game prices using cheapshark API. Front end is written in vanilla HTML, CSS and JavaScript. Backend is a Node.js/Express API that is an interface for a Mongo database.
## Database
Database holds users email, username, password, token and followed games. Password is peppered, salted and hashed and then stored in database. Cookies are used to store JWT tokens which as of right now expire in 7 days.
## Things left to implement and or fix
**Implement** - settings page, password reset, email notifications, remeber me button, make cookies persistant in incognito mode, find a new api to get game images (maybe?)

**Fix** - follow buttons not rendering correctly on smaller phones, handle server error properly on back end, organize css better 
## back_end/config
This path is ignored because it contains MongoURI, pepper, salting rounds and secret for signing JWT.
