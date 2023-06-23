const fs = require('fs')
function logger(...args) {
    try {
        deleteOldLog()
        let path = __dirname
        let logPath = path+"/logger/log.txt";
        let mainFolder = path+"/logger";
        let str = args.reduce((cur, next)=> cur += JSON.stringify(next), "")
        const dirD = fs.readdirSync(path)
        if (!dirD.includes("logger")) {
            fs.mkdirSync(mainFolder)
            fs.mkdirSync(mainFolder+"/backup")
        }
        if (!fs.readdirSync(mainFolder).includes("log.txt")) {
            fs.writeFileSync(logPath, "")
        }
        const { birthtime  } = fs.statSync(logPath)
        if(parseInt( new Date().getTime()/1000) - parseInt(Number(birthtime )/1000) >= 60*5){
            const data = fs.copyFileSync(logPath, mainFolder+"/backup/log"+new Date().getTime()+".txt")
            fs.unlinkSync(logPath)
            fs.appendFileSync(logPath,new Date().toISOString()+ " logs => " +str+"\n" )
        }else{
            fs.appendFileSync(logPath,new Date().toISOString()+ " logs => " +str+"\n" )
        }
    } catch (error) {
        console.log("logger",error)
    }
  
}

function deleteOldLog() {
    try {
        // path.join(__dirname, '../utilities/logger/log.txt');
        let path = __dirname
        let logPath = path+"/logger/backup";
        // let path ='../utilities/logger/backup'

        
        fs.readdir(logPath, (err, files) => {
            if(err) throw err;
            for(let [index, file] of files.entries()) {
                const { birthtime  } = fs.statSync(`${logPath}/${file}`)
                if(parseInt( new Date().getTime()/1000) - parseInt(Number(birthtime )/1000) >= 1*30){
                    fs.unlink(`${logPath}/${file}`, (err, res) => {
                        if(err) throw err;
                    })
                }
            }
        })
    } catch (error) {
        console.log("deleteLoggger",error)
    }
        
}

module.exports = {logger}