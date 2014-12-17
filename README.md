# node-trello-leadtime

This product defines some REST services allowing to calculate lead time for trello cards between two columns.
An angular front end application will be added later.

## Install

### Prerequisites
This product runs under [node js][nodejs].

[nodejs]: http://nodejs.org/

### Getting your key and token
* [Generate your developer key][devkey] and supply it as the first constructor parameter.
* To read a user’s private information, get a token by directing them to `https://trello.com/1/connect?key=<PUBLIC_KEY>&name=MyApp&response_type=token` replacing, of course, &lt;PUBLIC_KEY&gt; with the public key obtained in the first step.
* If you never want the token to expire, include `&expiration=never` in the url from the previous step.
* If you need write access as well as read, `&scope=read,write` to the request for your user token.

[devkey]: https://trello.com/1/appKey/generate

### After repository has been cloned
* Set your token and your key in trelloUtils.js file
* run following command in the directory node-trello-leadtime:
```
npm install 
```

## Launch Tests
You could run tests with following command in directory node-trello-leadtime:
```
npm run test 
```

## Use
You could launch the server with the following command:
```
npm start
```

Available routes are:
* GET {server url}:8080/myBoards in order to get all available boards
* GET {server url}:8080/lists/{idBoard} in order to get all columns for the board with identifier idBoard
* GET {server url}:8080/lead-time/{idFirstList}/{idLastList} in order to calculate lead time from column identified by idFirstList for all cards in column identified by idLastList

## License

Released under [MIT](https://github.com/adunkman/node-trello/blob/master/LICENSE.md).