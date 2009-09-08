var Database = new DatabaseHandler();
var JWR_column_names = new Array("Started","Time","Sent","Received","Method","Result","Type","URL","Request_Header","Response_Header","POST_Data","Content");


function JWR_SQLite_Interface()
{
	this.init(); 
}

JWR_SQLite_Interface.prototype =
{
	
	currentDatabase: null,
	doSaveState: null,
	copyDataState: null,
	currentRequest: null,
	
	init: function()
	{
		JWR_listen(window, "load", JWR_hitch(this, "chromeLoad"));
		JWR_listen(window, "unload", JWR_hitch(this, "chromeUnload"));
		this.doSaveState = 0;
		this.copyDataState = 0;
	},
	
	chromeLoad: function(e)
	{
		$$("jwr_db_status").value = "Not Connected";
	},
	
	chromeUnload: function(e)
	{
	},
	
	openDatabase: function(file)
	{
		this.currentDatabase = file;
		
		try {
			Database.openDatabase(this.currentDatabase);
		}
		catch(exception) {
			var temp = this.currentDatabase.path;
			this.currentDatabase = null;
			alert("Connect to '" + temp + "' failed: " + exception, 0x3);
			throw "openDatabase failed";
		}
		
		$$("jwr_db_status").value = this.currentDatabase.path;
	},
	
	getAutoNamedDatabaseFile: function()
	{
		var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
		file.initWithPath(JWR_get_home_dir());
		var filename = "JWR_" + JWR_get_timestamp();
		
		file.append(JWR_set_extension(filename,"sqlite"));
		
		return file;
	},
	
	getDatabaseFile: function()
	{
		var filename = prompt("Enter the database name (.sqlite will be automatically appended to the name)", "", "Enter the Database Name");
		
		//no name
		if (filename == "" || filename == null) {
			return this.getAutoNamedDatabase();
		}
		
		var dir = JWR_choose_directory("My thing");
		
		if(dir == null) throw "no directory";
		
		var newfile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
		newfile.initWithPath(dir.path);
		newfile.append(JWR_set_extension(filename,"sqlite"));
		
		return newfile;
	},
	
	saveDatabase: function()
	{
		if (this.doSaveState != 0) return;
		
		this.doSaveState += 1;
		var file = this.getAutoNamedDatabaseFile();
		this.openDatabase(file);
		this.doSaveDatabase();
	},
	
	saveAsDatabase: function()
	{
		if (this.doSaveState != 0) return;
		
		this.doSaveState += 1;
		var file = this.getDatabaseFile();
		this.openDatabase(file);
		this.doSaveDatabase();
	},
	
	doSaveDatabase: function()
	{
		//alert("doSaveDatabase: " + this.doSaveState);
		
		var val = this.doSaveState;
		this.doSaveState += 1;
		
		switch(val)
		{
		case 1:
			this.configureDatabase();
			break;
		case 2:
			Database.commitQueue('JWR_SQL.doSaveDatabase();');
			return;
		case 3:
			this.copyData('JWR_SQL.doSaveDatabase();');
			return;
		case 4:
			Database.closeDatabase('JWR_SQL.doSaveDatabase();');
			break;
		case 5:
			this.currentDatabase = null;
			$$("jwr_db_status").value = "Not Connected";
			break;
		default:
			return;
		}
		this.doSaveDatabase();
		
	},
	
	copyData: function(callback)
	{
		this.copyDataState += 1;
		
		//alert("copyData: " + this.copyDataState);
		
		switch(this.copyDataState)
		{
		case 1:
			this.currentRequest = JWR_HF.getNextRequest();
			if (this.currentRequest == null) {
				this.copyDataState = 0;
				return eval(callback);
			}
			break;
		case 2:
			JWR_HF.doLoad(this.currentRequest,'JWR_SQL.copyData("' + callback + '");');
			return;
		case 3:
			var data = JWR_HF.getColumns(this.currentRequest);
			var column_string = '';
			var values_string = '';
			var i = 0;
			for (i=0;i<JWR_column_names.length;i+=1) {
				if (i > 0) {
					column_string += ', ';
					values_string += ', ';
				}
				column_string += '"' + JWR_column_names[i] + '"';
				values_string += '"' + data[JWR_column_names[i]] + '"';
			}
//			alert('column_string:' + column_string);
//			alert('values_string:' + values_string);
			Database.dataInsert("requests",column_string,values_string);
			break;
		case 4:
			this.copyDataState = 0;
			Database.commitQueue('JWR_SQL.copyData("' + callback + '");');
			return;
		default:
			this.copyDataState = 0;
			eval(callback);
			return;
		}
		
		this.copyData(callback);
	},
	
	configureDatabase: function()
	{
		
		var columns = "id INTEGER PRIMARY KEY AUTOINCREMENT";
		columns += ", Started TEXT";
		columns += ", Time TEXT";
		columns += ", Sent TEXT";
		columns += ", Received TEXT";
		columns += ", Method TEXT";
		columns += ", Result TEXT";
		columns += ", Type TEXT";
		columns += ", URL TEXT";
		columns += ", Request_Header TEXT";
		columns += ", Response_Header TEXT";
		columns += ", POST_Data TEXT";
		columns += ", Content TEXT";

		Database.createTable("requests",columns);
	},
	
}

var JWR_SQL = new JWR_SQLite_Interface();

/*

dbfile = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("ProfD", Components.interfaces.nsIFile);
storageService = Components.classes["@mozilla.org/storage/service;1"]
			.getService(Components.interfaces.mozIStorageService);

file.append("my_db_file_name.sqlite");

var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);
var mDBConn = storageService.openDatabase(file); // Will also create the file if it does not exist


dbConn.executeSimpleSQL("CREATE TEMP TABLE table_name (column_name INTEGER)");


var statement = dbConn.createStatement("SELECT * FROM table_name WHERE column_name = :parameter");  

var statement = dbConn.createStatement("SELECT * FROM table_name WHERE id = :row_id");
statement.params.row_id = 1234;




statement.executeAsync({
  handleResult: function(aResultSet) {
    for (let row = aResultSet.getNextRow();
         row;
         row = aResultSet.getNextRow()) {

      let value = row.getResultByName("column_name");
    }
  },

  handleError: function(aError) {
    print("Error: " + aError.message);
  },

  handleCompletion: function(aReason) {
    if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
      print("Query canceled or aborted!");
  }
});

 */
