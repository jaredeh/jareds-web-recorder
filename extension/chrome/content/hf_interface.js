function JWR_HttpFox_Interface()
{
	this.init(); 
}

JWR_HttpFox_Interface.prototype =
{
	init: function()
	{
		
	},
	
	cmd_hf_toggleWatching: function(e)
	{
		return HttpFox.cmd_hf_toggleWatching(e);
	}
}

var JWR_HF = new JWR_HttpFox_Interface();
