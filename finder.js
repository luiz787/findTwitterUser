console.log("App is up and running!");

let config = require('./config');
let fileUtils = require('./FileUtils');
let fs = require('fs');
let Twit = require('twit');

const name = "Victor";
const surname = "Gabriel";
let T = new Twit(config);

let cursor = fileUtils.getCursor(fs);
console.log('Current cursor: ' + cursor);

let iter = 0;
let followers = [];

T.get('followers/list', { screen_name: 'RedBertt', count: 200, cursor: cursor }, function getData(err, data, response) {
    console.log(`Retrieved data ${++iter} times`);
    if (data.errors == null && iter <= 15) {
        console.log(`Next cursor: ${data.next_cursor}`);
        cursor = data.next_cursor !== undefined ? data.next_cursor : cursor;
        if (data !== undefined && data.users !== undefined) {
            data.users.forEach(element => {
                let userName = element.screen_name;
                if (userName.includes(name) || userName.includes(name.toLowerCase())
                    || userName.includes(surname) || userName.includes(surname.toLowerCase())) {
                    console.log(userName);
                    followers.push(userName);
                }
            });
        }
        if (data['next_cursor'] > 0) {
            T.get('followers/list', { screen_name: 'RedBertt', count: 200, cursor: data['next_cursor'] }, getData).then(() => {
                console.log('Follower list so far:');
                console.log(followers);
            });
        } else {
            console.log('End of all data.');
            return;
        }
    } else if (data.errors !== null) {
        console.log('An error occurred. Persisting data gathered so far. . .');
        data.errors.forEach(function(error) {
            console.log(error.message);
        });
        fileUtils.appendListOfFollowers(fs, followers, 'followers.txt');
        fileUtils.updateCursor(fs, cursor);
        console.log('Data persisted successfully.');
        return;
    } else {
        console.log('End of data. Persisting gathered data. . .');
        fileUtils.appendListOfFollowers(fs, followers, 'followers.txt');
        fileUtils.updateCursor(fs, cursor);
        console.log('Data persisted successfully.');
    }
    console.log(`End of ${iter} iteration.`);
}).then(() => {
    console.log(followers);
});