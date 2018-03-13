//IPFS_VersionControl


const readline = require('readline');
const exec = require('child_process').exec;
const PouchDB = require('pouchdb');
const chalk = require('chalk');
const clear = require('clear');
var db = new PouchDB('programs');
const figlet = require('figlet');
const inquirer = require('inquirer')
const interface = require('./Interface.js')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function fileAlreadyExistsInDatabase(file_name) { //Try to retrieve the document in the db to see if the file exists.
	return new Promise((resolve, reject) => {
		db.get(file_name)
		.then((doc) => {
			console.log(chalk.yellow("\nThe following program already exists :\n\n" + JSON.stringify(doc) +"\n\n"));
			return resolve(0);
		})
		.catch((err) => {
			console.log(chalk.yellow("\nThe program doesn't exist yet !\n\n"));
			return resolve(-1);
		})
	})
}

function showPrograms() {
	console.log("\nYour PouchDB Programs :\n\n");
	return new Promise((resolve, reject) => {
		db.allDocs({ include_docs: true, descending: true })
		.then((doc) => {
			console.log(chalk.cyanBright(JSON.stringify(doc.rows, null, 4)));
			console.log()
			return resolve()
		})
	})
}

clear();
console.log(
	chalk.yellow(
		figlet.textSync('IPFS_VC', { horizontalLayout: 'full' })
	)
);


function main(){

	var actions = [
		{
			type: 'list',
			name: 'actions',
			message: 'What do you want to do ?',
			choices: ['Add file to IPFS',
			'View IPFS files',
			'Sync to COUCHDB',
			new inquirer.Separator(),
			'Exit']
		}
	];

	inquirer.prompt(actions).then(answer => {
		switch(answer.actions){
			case 'Add file to IPFS' :
			addFileToIPFS();
			break;
			case 'View IPFS files' :
			viewIPFSFile();
			break;
			case 'Sync to COUCHDB':
			syncCouchDB();
			break;
			case 'Exit':
			process.exit(-1);
			break;
		}
	})
}

function viewIPFSFile(){
	showPrograms()
	.then(main);
}

function syncCouchDB(){

		interface.enterCouchURL()
		.then((couchURL)=>{
			PouchDB.sync(db,couchURL)
			.on('change',(info)=>{
				console.log(info)
				main();
			})
			.on('complete',(info)=>{
				console.log(info)
				console.log(chalk.green("Succefully synchonized with CouchDB !\n"))
				main();
			})
			.on('error',(err)=>{
				console.log(chalk.red("Error : \n Check the URL or check your internet connection\n"))
				console.log(err)
				main();
			})
	 })
	 .catch((err)=>onError(err))
}



function onError(err){
	console.log(chalk.red("An error has occured !\n"));
	console.log(err);
	main();
}



function getDateTime(){
	var today = new Date()
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + "h :" + today.getMinutes() + "m :" + today.getSeconds() +"s";
	var dateTime = date+' '+time;
	return dateTime
}

function addFileToIPFS(){

	interface.enterFilePath()
	.then(path=>{
		var command = {cmd : `ipfs add ${path}`};
		exec(command.cmd, (err, stdout, stderr) => {
			if (!err) {

				var arrayOfSubstrings = stdout.split(" ");
				var file_name = arrayOfSubstrings[2].replace("\n", "");
				var file_hash = arrayOfSubstrings[1];
				var program = { "_id": "", "versions": [] };
				var version = { "number": "", "hash": "", "description" : "","datetime":"" };

				fileAlreadyExistsInDatabase(file_name)
				.then((exists) => {
					if (exists != -1) {//if the file already exists
						interface.enterFileVersion()
						.then((vers)=>{
							version.number = vers;
							version.hash = file_hash;
							version.datetime = getDateTime()
							interface.enterFileDescription().then(description=>{
								version.description=description;
								db.get(file_name)
								.then((prog) => {
									prog.versions.push(version)
									return db.put(prog)
								})
								.then(()=>{
									console.log(chalk.green(`\nSuccesfully add the version ${vers} of the program ${file_name} ! \n`));
									main();
								})
							})
						})
						.catch((err) => onError(err))
					}
					else {//if the files doesn't exists
					interface.enterFileVersion()
					.then((vers)=>{
						version.number = vers;
						version.hash = file_hash;
						program._id = file_name;
						version.datetime = getDateTime()
						interface.enterFileDescription().then(description=>{
							version.description=description
							program.versions.push(version);
							db.put(program)
							.then(()=>{
								console.log(chalk.green(`\nSuccefully added the program ${file_name} !\n`));
								main();
							})
							.catch((err) => onError(err))
						})
					})
					.catch((err) => onError(err))
				}
			})
			.catch((err) => onError(err))
		}
	})
})
}

main()
