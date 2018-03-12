let self = module.exports = {
    appendListOfFollowers: function (fs, followers, filePath) {
        let stream = fs.createWriteStream(filePath, {
            flags:'a'
        });
        console.log('Writing followers to file.');
        stream.write('\n');
        stream.write(followers.join('\n'));
        console.log('Followers written successfully.');
        stream.end();
    },
    
    updateCursor: function (fs, cursor) {
        self.eraseOldCursor(fs);
        self.addNewCursor(fs, cursor);
    },
    
    eraseOldCursor: function (fs) {
        fs.writeFile('lastCursor.txt', '', () => {} );
    },
    
    getCursor: function (fs) {
        return fs.readFileSync('lastCursor.txt','utf8');
    },
    
    addNewCursor: function (fs, cursor) {
        let stream = fs.createWriteStream('lastCursor.txt', {
            flags:'a'
        });
        console.log('Writing cursor ' + cursor + ' to file at ' + new Date().toISOString())
        stream.write(cursor.toString());
        console.log('Cursor written successfully.');
        stream.end();
    }
}