//IPFS_VersionControl



const readline = require('readline');
const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});
const { exec } = require('child_process');

var programs =[];

 function fileAlreadyExists(file_name , programs){//returns -1 if the file doesn't exists, the index of the file if it exists
     var index = 0;
     for(var index = 0; index < programs.length; index++)
         {
             if(programs[index].name == file_name)
                 return index;
         }
     
   return -1;
} 

var recursiveAsyncReadLine = function(){

       rl.question("What do you want to do : \n 1-Add new file to IPFS \n 2-Look at the IPFS files\n",(answer) =>{
         
           switch (answer.trim()) {
               case "1":
                   var program = {"name":"" , "versions":[]};
                   var version = {"number":"", "hash":""};
                   rl.question("Enter the file path you want to add to IPFS :\n",(path)=>{
                       var command= "ipfs add " + path.trim();
                      
                       exec(command, (err, stdout, stderr) => {
                           if (err) {
                               console.error(err);
                           return;
                           }
                           console.log(stdout);
                           var arrayOfSubstrings = stdout.split(" ");
                           var file_name= arrayOfSubstrings[2].replace("\n","");
                           var file_hash = arrayOfSubstrings[1];
                           var exists = fileAlreadyExists(file_name,programs);
                            rl.question("Enter the file version :\n",(file_version) =>{
                               version.number = file_version;
                            version.hash = file_hash;
                               if (exists != -1){//if the file already exists
                                   programs[exists].versions.push(version);
                                   
                               }
                               else{//if the files doesn't exists
                                   program.name=file_name;
                                   program.versions.push(version);
                                   programs.push(program);
                                   }
                                
                                recursiveAsyncReadLine();//calls the function back to add a new file or display the existing files
                               });
                        });
                       
                       });
                   
                   break;
                   
                         
               case "2":                
                   console.log(programs);
                   recursiveAsyncReadLine(); 
                   break;
                   
               default:
                   console.log("wrong input");
                   recursiveAsyncReadLine(); 
                   break;
       }
      
   });
 
}
recursiveAsyncReadLine();