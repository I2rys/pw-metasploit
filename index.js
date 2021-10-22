//Dependencies
const Chalk = require("chalk")
const Path = require("path")
const Fs = require("fs")

//Variables
var Self = {}

//Functions
Self.directory_files = async function(dir){
    return new Promise((resolve)=>{
        var results = []

        Fs.readdir(dir, function (err, list) {
            if (err) return resolve(err)

            var list_length = list.length

            if (!list_length) return resolve(results)

            list.forEach(function (file) {
                file = Path.resolve(dir, file)

                Fs.stat(file, async function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        const res = await Self.directory_files(file)

                        results = results.concat(res)

                        if (!--list_length) resolve(results)
                    } else {
                        results.push(file)
                        
                        if (!--list_length) resolve(results)
                    }
                })
            })
        })
    })
}

Self.pretty_and_search = function(base_directory, files, to_search){
    var results = []

    files.forEach(file =>{
        var result = {
            normal: file,
            highlighted: ""
        }

        file = file.replace(`${Path.resolve(base_directory, "plugins")}\\`, "")
        file = file.split("\\")

        for( i in file ){
            file[i] = file[i].toLowerCase()

            if(file[i].indexOf(to_search) != -1){
                file[i] = file[i].replace(to_search, Chalk.redBright(to_search))
            }

            if(file[i] == to_search){
                file[i] = Chalk.redBright(file[i])
            }

            if(!result.highlighted.length){
                result.highlighted = file[i]
            }else{
                result.highlighted += `/${file[i]}`
            }
        }

        if(result.highlighted.split("/")[result.highlighted.split("/").length-1] != "main.js"){
            return
        }

        result.highlighted = result.highlighted.replace(/.\w+.js/g, "")

        if(results.indexOf(result.highlighted.split("/")[0]) == -1 ){
            if(result.highlighted.indexOf("[") != -1){
                results.push(result)
            }
        }
    })
    
    return results
}

//Main
async function search(base_directory = String, plugins_directory = String, to_search = String){
    return new Promise(async(resolve)=>{
        const files = await Self.directory_files(plugins_directory)
        const results = Self.pretty_and_search(base_directory, files, to_search)

        resolve(results)
    })
}

//Exporter
module.exports = {
    search: search
}
