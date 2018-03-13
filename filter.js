let fs = require('fs');
let fileUtils = require('./FileUtils');
let name = "Victor";

let followers = fs.readFileSync('followers.txt','utf8');
followers = followers.split("\n").filter(function(value) {
    return value.includes(name) || value.includes(name.toLowerCase());
});
console.log(followers);

fileUtils.appendListOfFollowers(fs, followers, "followersvictor.txt");