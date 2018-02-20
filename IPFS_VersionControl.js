//IPFS_VersionControl
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { exec } = require('child_process');
var PouchDB = require('pouchdb');
var db = new PouchDB('programs');
var programs =[];
var programDB={"_id":"programs","programs": programs};//create an object containing the array of programs in order to store it to pouchdb
db.get('programs').then(function (doc) {
programs = doc.programs;
    programDB={"_id":"programs","programs": programs};
                });

function fileAlreadyExists(file_name, programs) {//returns -1 if the file doesn't exists, the index of the file if it exists
    var index = 0;
    for (var index = 0; index < programs.length; index++) {
        if (programs[index].name == file_name)
            return index;
    }

    return -1;
}
/*function showPrograms() {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
  //  redrawTodosUI(doc.rows);
      console.log(JSON.stringify(doc.rows, null, 4));
  });
}*/

var recursiveAsyncReadLine = function () {

    rl.question("What do you want to do : \n 1-Add a new file to IPFS \n 2-Display your IPFS files\n 3-Exit\n", (answer) => {

        switch (answer.trim()) {
            case "1"://adds a new file
                var program = { "name": "", "versions": [] };
                var version = { "number": "", "hash": "" };
                rl.question("Enter the file path you want to add to IPFS :\n", (path) => {
                    var command = "ipfs add " + path.trim();

                    exec(command, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err);
                            recursiveAsyncReadLine();
                            return;
                        }
                        console.log(stdout);
                        var arrayOfSubstrings = stdout.split(" ");
                        var file_name = arrayOfSubstrings[2].replace("\n", "");
                        var file_hash = arrayOfSubstrings[1];
                        var exists = fileAlreadyExists(file_name, programs);
                        rl.question("Enter the file version :\n", (file_version) => {
                            version.number = file_version;
                            version.hash = file_hash;
                            if (exists != -1) {//if the file already exists
                                programs[exists].versions.push(version);

                            }
                            else {//if the files doesn't exists
                                program.name = file_name;
                                program.versions.push(version);
                                programs.push(program);
                            }
                            db.put(programDB, function callback(err, result) {
                            if (!err) {
                              console.log('Successfully posted the program !');
                            }
                                else
                                    {
                                        
                                    console.log(err);
                                        console.log("you tried to post :\n"+JSON.stringify(programDB, null, 4));
                                    }
                          });
                setTimeout(recursiveAsyncReadLine,1000);//calls back the function after a second to post the program to the database first
                        });
                    });

                });

                break;


            case "2"://displays the files
                   console.log("local programs :\n"+JSON.stringify(programDB, null, 4));
                console.log("pouchdb :");
                db.get('programs').then(function (doc) {
                  console.log(JSON.stringify(doc, null, 4));
                });
                setTimeout(recursiveAsyncReadLine,1000);//calls back the function after a second to display the list of programs first
                break;
                
            case "3"://exit
                rl.close();
                break;

            default:
                console.log("wrong input");
                recursiveAsyncReadLine();
                break;
        }

    });

}
recursiveAsyncReadLine();