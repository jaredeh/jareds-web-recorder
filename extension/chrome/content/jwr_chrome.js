function JWR_DoChromeHandler()
{
	this.init(); 
}

JWR_DoChromeHandler.prototype =
{
	StatusBar: null,
	DatabaseBar: null,
	
	init: function()
	{
		JWR_listen(window, "load", JWR_hitch(this, "chromeLoad"));
		JWR_listen(window, "unload", JWR_hitch(this, "chromeUnload"));
		this.StatusBar = new JWR_StatusBar_Handler();
		this.DatabaseBar = new JWR_DatabaseBar_Handler();
	},
	
	chromeLoad: function(e)
	{
	},

	chromeUnload: function(e)
	{
	},

}

function JWR_StatusBar_Handler()
{
	this.init(); 
}

JWR_StatusBar_Handler.prototype =
{
	IconStatus: null,
	
	init: function()
	{
		this.IconStatus = new Boolean();
		JWR_listen(window, "load", JWR_hitch(this, "chromeLoad"));
		JWR_listen(window, "unload", JWR_hitch(this, "chromeUnload"));
	},
	
	chromeLoad: function(e)
	{
		this.UpdateIcon();
	},

	chromeUnload: function(e)
	{
	},

	UpdateIcon: function()
	{
		var icon = document.getElementById("jwr_StatusbarIcon");
		
		if (icon == null){
			return;
		}
		
		if (this.IconStatus == true) {
			icon.src = "chrome://jwr/skin/status-enabled.png"
			return;
		}
		icon.src = "chrome://jwr/skin/status-disabled.png"
	},

	ToggleIconStatus: function()
	{
		if (this.IconStatus == true) {
			this.IconStatus = false;
		} else {
			this.IconStatus = true;
		}
		return this.IconStatus;
	},

}


function JWR_DatabaseBar_Handler()
{
	this.init(); 
}

JWR_DatabaseBar_Handler.prototype =
{
	
	init: function()
	{
	},
	
	update_status: function(value)
	{
		document.getElementById("jwr_db_status").value = value;
	},

	update_progress: function(value)
	{
		document.getElementById("jwr_db_progress").value = value;
	},

	update_file: function(value)
	{
		document.getElementById("jwr_db_file").value = value;
	},

}
