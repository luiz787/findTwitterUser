console.log("Bot is up and running!");

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var cursor = -1;
var nameToLookFor = "Victor";
var iter = 0;
var followers = [];

T.get('followers/list', { screen_name: 'RedBertt', count: 200, cursor: cursor},  function getData(err, data, response) {
    console.log("Entered getData");
    if (err!==null){
        iter++;
        console.log(iter);
        console.log(data.next_cursor);
        cursor = data.next_cursor;
        data.users.forEach(element => {
            var userName = element.screen_name;
            if (userName.includes(nameToLookFor) || userName.includes(nameToLookFor.toLowerCase())){
                console.log(userName);
                followers.push(userName);
            }
        });
        if(data['next_cursor'] > 0) {
            T.get('followers/list', { screen_name: 'RedBertt', count: 20, cursor: data['next_cursor']}, getData);
        }
    }
    console.log("Did stuff...");
}).then(function writeData() {
    console.log("After done all stuff...");
    var fs = require('fs');
    updateCursor(fs, cursor);
    appendListOfFollowers(fs, 'followers.txt');
});



function appendListOfFollowers(fs, filePath){
    var stream = fs.createWriteStream(filePath, {
        flags:'a'
    });
    console.log('Writing followers to file.')
    stream.write(followers.join('\n'));
    console.log('Followers written successfully.');
    stream.end();
}

function updateCursor(fs, cursor) {
    eraseOldCursor(fs);
    addNewCursor(fs, cursor);
}

function eraseOldCursor(fs){
    fs.writeFile('lastCursor.txt', '', () => {} );
}

function addNewCursor(fs, cursor) {
    var stream = fs.createWriteStream('lastCursor.txt', {
        flags:'a'
    });
    console.log('Writing cursor ' + cursor + ' to file at ' + new Date().toISOString())
    stream.write(cursor.toString());
    console.log('Cursor written successfully.');
    stream.end();
}