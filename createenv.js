var myArgs = process.argv.slice(2)
var relationships = myArgs[0]
var db = myArgs[1]
var json_rel = JSON.parse(relationships)
var json_db = json_rel[db][0]
console.log("postgres://"+json_db["username"]+":"+json_db["password"]+"@"+json_db["host"]+":"+json_db["port"]+"/"+json_db["path"])

