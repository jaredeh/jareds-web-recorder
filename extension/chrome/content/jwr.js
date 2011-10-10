function JaredWebRecorder()
{
	this.init(); 
}

JaredWebRecorder.prototype =
{
	Chrome: null,
	
	init: function()
	{
		JWR_listen(window, "load", JWR_hitch(this, "chromeLoad"));
		JWR_listen(window, "unload", JWR_hitch(this, "chromeUnload"));
		this.Chrome = new JWR_DoChromeHandler();
	},
	
	chromeLoad: function(e)
	{
		this.Chrome.StatusBar.UpdateIcon();
	},

	chromeUnload: function(e)
	{
	},
	
/*
	onClickStatusIcon: function()
	{
		if(this.Chrome.StatusBar.ToggleIconStatus()) {
			this.Chrome.StatusBar.UpdateIcon();
			JWR_HF.openWindow();
			JWR_HF.cmd_hf_startWatching();
			return;
		}
		JWR_HF.cmd_hf_stopWatching();
		JWR_SQL.saveDatabase();
		JWR_HF.closeWindow();
		this.Chrome.StatusBar.UpdateIcon();
		return;
	},
*/
	
	doSaveData: function()
	{
		JWR_HF.cmd_hf_stopWatching();
		JWR_SQL.saveDatabase();
	},
	
	doSaveAsData: function()
	{
		JWR_HF.cmd_hf_stopWatching();
		JWR_SQL.saveAsDatabase();
	},
	
	startRecording: function()
	{
		JWR_HF.cmd_hf_startWatching();
	},
	
	stopRecording: function()
	{
		JWR_HF.cmd_hf_stopWatching();
	},
	
	clearBuffers: function()
	{
		this.Chrome.DatabaseBar.update_status("");
		this.Chrome.DatabaseBar.update_file("");
		this.Chrome.DatabaseBar.update_progress("");
		JWR_HF.cmd_hf_clear();
	},
	
}

var JWR = new JaredWebRecorder();
