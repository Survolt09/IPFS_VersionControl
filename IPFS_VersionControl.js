//IPFS_VersionControl



const readline = require('readline');
var exec = require('child_process').exec;
var PouchDB = require('pouchdb');

var db = new PouchDB('programs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function fileAlreadyExistsInDatabase(file_name) { //Try to retrieve the document in the db to see if the file exists.
    return new Promise((resolve, reject) => {
        db.get(file_name)
            .then((doc) => {
                console.log("The following program already exists :\n\n" + JSON.stringify(doc));
                return resolve(0);
            })
            .catch((err) => {
                console.log("The program doesn't exist yet !\n\n");
                return resolve(-1);
            })
    })
}

function showPrograms() {
    return new Promise((resolve, reject) => {
        db.allDocs({ include_docs: true, descending: true })
            .then((doc) => {
                console.log(JSON.stringify(doc.rows, null, 4));
                return resolve()
            })
    })
}


var recursiveAsyncReadLine = function () {

    rl.question("\n\n What do you want to do : \n\n 1-Add new file to IPFS \n 2-Look at the IPFS files\n 3-Sync to CouchDB\n\n", (answer) => {

        switch (answer.trim()) {
            case "1":
                var program = { "_id": "", "versions": [] };
                var version = { "number": "", "hash": "" };
                rl.question("Enter the file path you want to add to IPFS :\n\n", (path) => {
                    var command = "ipfs add " + path.trim();

                    exec(command, (err, stdout, stderr) => {
                        if (!err) {

                            console.log(stdout);
                            var arrayOfSubstrings = stdout.split(" ");
                            var file_name = arrayOfSubstrings[2].replace("\n", "");
                            var file_hash = arrayOfSubstrings[1];
                            fileAlreadyExistsInDatabase(file_name)
                                .then((exists) => {

                                    rl.question("Enter the file version :\n\n", (file_version) => {
                                        version.number = file_version;
                                        version.hash = file_hash;
                                        if (exists != -1) {//if the file already exists
                                            db.get(file_name)
                                                .then((prog) => {
                                                    prog.versions.push(version)
                                                    return db.put(prog)
                                                })
                                                .then(console.log(`Succesfully add the version ${version.number} of the program ${file_name} ! `))
                                                .catch((err) => console.log(err))
                                        }
                                        else {//if the files doesn't exists
                                            program._id = file_name;
                                            program.versions.push(version);
                                            db.put(program)
                                                .then(console.log(`Succefully added the program ${file_name} !`))
                                                .catch((err) => console.log(err))
                                        }
                                        recursiveAsyncReadLine()//calls back the function after a second to post the program to the database first
                                    })

                                });
                        }
                        else{
                            console.error(err);
                        }

                    });

                });

                break;

            case "2":
                console.log("Your PouchDB Programs :\n\n");
                showPrograms()
                    .then(recursiveAsyncReadLine);

                break;

            case "3":
            rl.question("Enter the url of the CouchDB database you want to sync to : \n\n", (answer)=>{
              var url = answer;
              PouchDB.sync(db,url)
                .on('change',(info)=>{
                  console.log(info)
                  recursiveAsyncReadLine();
                })
                .on('complete',(info)=>{
                  console.log(info)
                  recursiveAsyncReadLine();
                })
                .on('error',(err)=>{
                  console.log(err)
                  recursiveAsyncReadLine();
                })
              })

              break;


            default:
                console.log("Wrong input\n\n");
                recursiveAsyncReadLine();
                break;
        }

    });

}

recursiveAsyncReadLine();
