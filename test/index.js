//Dependencies
const PW_Metasploit = require("../index.js")

//Functions
async function Main(){
    const results = await PW_Metasploit.search(__dirname, "./plugins", "t")

    for( i in results ){
        console.log(results[i].highlighted)
        require(results[i].normal).self()
    }
}

//Main
Main()
