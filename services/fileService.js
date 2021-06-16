var fs = require("fs");

function createFileForLogger(filename){
    fs.appendFile(filename, ' ', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}

module.exports = createFileForLogger