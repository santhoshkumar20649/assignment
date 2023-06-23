const fs = require('fs');
const path = require('path');


async function getLogs(_,res) {
    try {
        let logsPath = path.join(__dirname, '../utilities/logger/log.txt');
        var data = fs.readFileSync(logsPath);
        return res.send(data.toString())
    } catch(err) {
        console.log(err)
        return res.send(err)
    }
}

module.exports = {getLogs};