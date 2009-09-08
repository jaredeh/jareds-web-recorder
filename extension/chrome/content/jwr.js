function JaredWebRecorder()
{
	this.init(); 
}

JaredWebRecorder.prototype =
{
	StatusbarStatus: null,
	StatusbarIcon: null,
	
	init: function()
	{
		this.StatusbarStatus = new Boolean();
		JWR_listen(window, "load", JWR_hitch(this, "chromeLoad"));
		JWR_listen(window, "unload", JWR_hitch(this, "chromeUnload"));
	},
	
	chromeLoad: function(e)
	{
		this.StatusbarIcon = document.getElementById("jwr_StatusbarIcon");
		this.set_StatusbarIcon();
	},

	chromeUnload: function(e)
	{
	},
	
	onClickStatusIcon: function()
	{
		if(this.toggle_StatusbarStatus()) {
			return this.turnRecorderOn();
		}
		return this.turnRecorderOff();
	},
	
	turnRecorderOn: function()
	{
		this.set_StatusbarIcon();
		JWR_HF.set_toggleHttpFox();
	},
	
	turnRecorderOff: function()
	{
		this.set_StatusbarIcon();
		JWR_HF.set_toggleHttpFox();
		//JWR_HF.openWindow();
		this.saveDatabase();
	},

	set_StatusbarIcon: function()
	{
		if (this.StatusbarStatus == true)
		{
			this.StatusbarIcon.src = "chrome://jwr/skin/status-enabled.png"
			return;
		}
		this.StatusbarIcon.src = "chrome://jwr/skin/status-disabled.png"
	},

	toggle_StatusbarStatus: function()
	{
		if (this.StatusbarStatus == true) {
			this.StatusbarStatus = false;
		} else {
			this.StatusbarStatus = true;
		}
		return this.StatusbarStatus;
	},
	
	saveDatabase: function()
	{
		JWR_SQL.saveDatabase();
	},
	
	saveAsDatabase: function()
	{
		JWR_SQL.saveAsDatabase();
	},
	
}

var JWR = new JaredWebRecorder();
