# IPFS_VersionControl

NodeJS program allowing you to manage your IPFS files versions and store/sync them to CouchDB.

# Installation

To install this program:

- Download the ZIP file project and extract it
- Go in the directory where you unzip the file and run a CLI (Powershell or CMD for Windows environment, Terminal for UNIX environment)
- Then run ```npm install``` to install dependencies

# Usage

- Open a terminal and type : ```node IPFS_VersionControl.js```

## Notes
- To avoid enter file path manually, you can drag and drop the file into the command line interface.


## Using CouchDB

To access couchDB interface, type in your favorite navigator :
```
http://localhost:5984/_utils/fauxton/```

Then create a database with name that you want
When the program tell you to enter the path of the CouchDB database, type :
```
http://localhost:5984/name_of_your_db```


# Improvements

- Preview of the uploaded files
- Add API to handle multiple platforms
- Sort/ serach by tag/date
- Snapshot of the selected file
- Archiving
- Retrieve files from the IPFS network
- File encryption
- Backup
