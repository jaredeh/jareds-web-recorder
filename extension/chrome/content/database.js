function DatabaseHandler() {
	this.storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);
	this.closecount = 0;
	this.busycount = 0;
};

DatabaseHandler.prototype = {
	databaseConnection: null,
	storageService: null,
	statementQueue: null,
	closecount: null,
	busycount: null,
	
	openDatabase: function (file)
	{
		try {
			this.databaseConnection = this.storageService.openDatabase(file);
			if (this.databaseConnection == null)  throw "openDatabase: databaseConnection == null";
		}
		catch(exception) {
			alert("look at me!" + exception.name + " error in opening file " + file.leafName);
			return false;
		}
		
		return true;
	},
	
	databaseBusy: function ()
	{
		if (this.closecount > 0) {
			return false;
		}
		
		if (!this.databaseConnection.connectionReady) {
			return true;
		}
		
		if (this.databaseConnection.transactionInProgress) {
			return true;
		}
		
		return false;
	},
	
	closeDatabase: function (callback)
	{
		if (this.databaseConnection == null) {
			alert("databaseConnection == null");
			return;
		}
		
		for (s in this.statementQueue)
		{
			try {
				s.finalize();
			} catch(e) {}
		}
		
		if (this.databaseBusy()) {
			if (this.busycount > 3) throw "database busy";
			this.busycount += 1;
			window.setTimeout('Database.closeDatabase("' + callback + '");', 300);
			return;
		}
		
		try {
			var db = this.databaseConnection;
			db.close();
		} catch (e) {
		}
		this.databaseConnection = null;
		this.closecount = 0;
		eval(callback);
	},
	
	addToQueue: function (statement)
	{
		if (this.statementQueue == null) {
			this.statementQueue = new Array();
		}
		
		this.statementQueue.push(statement);
	},
	
	createTable: function (name,column)
	{
		var query = "CREATE TABLE IF NOT EXISTS " + name + " (" + column + ");";
		var statement = this.databaseConnection.createStatement(query);
		this.addToQueue(statement);
	},
	
	dataInsert: function (name,columns,values)
	{
		var query = "INSERT INTO " + name + " ("  + columns + ") VALUES (" + values + ");";
		var statement = this.databaseConnection.createStatement(query);
		this.addToQueue(statement);
	},
	
	commitQueue: function (callback)
	{
		this.databaseConnection.executeAsync(this.statementQueue,this.statementQueue.length,{
			handleResult: function(aResultSet) {
				eval(callback);
			},
			
			handleError: function(aError) {
				dump("Error: " + aError.message);
			},
			
			handleCompletion: function(aReason) {
				if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
					dump("Query canceled or aborted!");
				eval(callback);
			}
		});
	},
	
	clearQueue: function ()
	{
		this.statementQueue = null;
		dump("clearQueue: " + this.statementQueue + "\n");
	},
}

var Database = new DatabaseHandler();