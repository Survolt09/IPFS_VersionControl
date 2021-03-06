

const chalk = require('chalk');
const inquirer = require('inquirer')

function selectAction(){

	var actions = [
		{
			type: 'list',
			name: 'actions',
			message: 'What do you want to do ?',
			choices: ['Add file to IPFS',
			'View IPFS files',
			'Sync to COUCHDB',
			'Retrieve files',
			new inquirer.Separator(),
			'Exit']
		}
	];

	return new Promise((resolve,reject)=>{
		inquirer.prompt(actions).then(answer => {
			return resolve(answer.actions);
		})
	})
}

function enterFileHash(){
	var file =[{
		type : 'input',
		name : 'fileHash',
		message : 'Enter the hash of the file you want to retrieve :'
	}]
	return new Promise((resolve,reject)=>{
		inquirer.prompt(file).then(answer=>{
			return resolve(answer.fileHash);
		})
	})
}

function enterCouchURL(){
	var couchDBURL =[{
		type : 'input',
		name : 'couchURL',
		message : 'Enter the url of the CouchDB database you want to sync to :'
	}]
	return new Promise((resolve,reject)=>{
		inquirer.prompt(couchDBURL).then(answer=>{
			return resolve(answer.couchURL);
		})
	})
}


function enterFileVersion(){
	var fileVersion =[{
		type : 'input',
		name : 'Version',
		message : 'Enter the file Version :'
	}]
	return new Promise ((resolve,reject) =>{
		inquirer.prompt(fileVersion).then(answer =>{
			return resolve(answer.Version);
		})
		//handle the case where the version already exists
	})
}


function enterFileDescription(){
	var isDescription = [{
		type:'confirm',
		name:'isDescription',
		message : 'Do you want to add a description to your file ?'
	}]

	var fileDescription= [{
		type : 'input',
		name : 'Description',
		message : 'Enter the description :'
	}]

	return new Promise((resolve,reject)=>{
		inquirer.prompt(isDescription).then(answer=>{
			if(answer.isDescription == true){
				inquirer.prompt(fileDescription).then(answer=>{
					return resolve (answer.Description);
				})
			}
			else{
				return resolve();
			}
		})
	})
}



function enterFilePath(){

	var filePath =[{
		type : 'input',
		name : 'Path',
		message : 'Enter the file path you want to add to IPFS :'
	}]

return new Promise ((resolve,reject)=>{
	inquirer.prompt(filePath).then(answer =>{
		return resolve(answer.Path);
		})
	//handle something
	})
}


module.exports = {
    enterFilePath,
    enterCouchURL,
    enterFileVersion,
    enterFileDescription,
	selectAction,
	enterFileHash
}
