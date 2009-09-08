function JWR_SQLite_Interface()
{
	this.init(); 
}

JWR_SQLite_Interface.prototype =
{
	init: function()
	{
		
	},
	
	openWindow: function()
	{
		return window.open("chrome://jwr/sqlite/chrome/content/sqlitemanager.xul", "", "chrome,resizable,centerscreen");
	},
	
	newDatabase: function()
	{
		SQLiteManager.newDatabase();
	}
}

var JWR_SQL = new JWR_SQLite_Interface();
