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
		this.toggle_StatusbarStatus();
		this.set_StatusbarIcon();
		this.set_toggleHttpFox();
	},
	
	set_toggleHttpFox: function()
	{
		JWR_HF.cmd_hf_toggleWatching();
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
		if (this.StatusbarStatus == true)
		{
			this.StatusbarStatus = false;
			return;
		}

		this.StatusbarStatus = true;
	},
	
}

var JWR = new JaredWebRecorder();
