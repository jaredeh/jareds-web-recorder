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
	Chrome: null,
	
	init: function()
	{
		this.doSaveState = 0;
		this.copyDataState = 0;
		this.Chrome = new JWR_DoChromeHandler();
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
		
		this.Chrome.DatabaseBar.update_file(this.currentDatabase.path);
		this.Chrome.DatabaseBar.update_status("Database Open");
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
		var val = this.doSaveState;
		this.doSaveState += 1;
		
		switch(val)
		{
		case 1:
			this.Chrome.DatabaseBar.update_status("Creating Database");
			this.configureDatabase();
			break;
		case 2:
			this.Chrome.DatabaseBar.update_status("Saving structure");
			Database.commitQueue('JWR_SQL.doSaveDatabase();');
			return;
		case 3:
			this.Chrome.DatabaseBar.update_status("Saving Data");
			this.copyData('JWR_SQL.doSaveDatabase();');
			return;
		case 4:
			this.Chrome.DatabaseBar.update_status("Closing Database");
			Database.closeDatabase('JWR_SQL.doSaveDatabase();');
			break;
		case 5:
			this.currentDatabase = null;
			this.Chrome.DatabaseBar.update_status("Saved");
			break;
		default:
			this.doSaveState = 0;
			return;
		}
		this.doSaveDatabase();
		
	},
	
	copyData: function(callback)
	{
		this.copyDataState += 1;
		
		switch(this.copyDataState)
		{
		case 1:
			if (JWR_HF.getNextRequest()) {
				this.copyDataState = 0;
				return eval(callback);
			}
			var msg = (JWR_HF.RequestPos/JWR_HF.NumberRows)*100;
			this.Chrome.DatabaseBar.update_progress(msg);
			break;
		case 2:
			JWR_HF.getData();
			window.setTimeout('JWR_SQL.copyData("' + callback + '");',100);
			return;
		case 3:
			var data = JWR_HF.getColumns(HttpFox.RequestTree.getCurrent());
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
			Database.dataInsert("requests",column_string,values_string);
			break;
		case 4:
			Database.commitQueue('JWR_SQL.copyData("' + callback + '");');
			return;
		case 5:
			Database.clearQueue();
			this.copyDataState = 0;
			break;
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