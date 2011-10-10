function JWR_HttpFox_Interface()
{
	this.init(); 
}

JWR_HttpFox_Interface.prototype =
{
	HttpFoxService: null,
	Requests: null,
	RequestTree: null,
	RequestPos: null,
	HoldsData: null,
	NumberRows: null,
	
	init: function()
	{
		this.NumberRows = -1;
	},
	
	setVariables: function()
	{
		this.HttpFoxService = HttpFox.HttpFoxService;
		this.Requests = this.HttpFoxService.Requests;
		this.RequestTree = HttpFox.RequestTree;
		this.RequestPos = 0;
	},
	
	openWindow: function()
	{
		HttpFox.cmd_hf_detach();
	},
	
	closeWindow: function()
	{
		HttpFox.cmd_hf_close();
	},	
	
	set_toggleHttpFox: function(e)
	{
		return HttpFox.cmd_hf_toggleWatching(e);
	},
	
	cmd_hf_startWatching: function(e)
	{
		return HttpFox.cmd_hf_startWatching(e);
	},

	cmd_hf_stopWatching: function(e)
	{
		return HttpFox.cmd_hf_stopWatching(e);
	},
	
	cmd_hf_clear: function(e)
	{
		this.init();
		return HttpFox.cmd_hf_clear(e);
	},
	
	getNextRequest: function()
	{
		
		if (this.NumberRows == -1) {
			this.setVariables();
			this.NumberRows = HttpFox.RequestTree.rowCount;
		}
		
		var val = this.RequestPos;
		
		this.RequestPos += 1;
		
		if (val >= this.NumberRows) {
			return true;
		}
		HttpFox.RequestTree.setCurrent(val);
		return false;
	},
	
	getColumns: function(request)
	{
		var data = new Array();
		
		data["Started"] = this.getRequest_Started(request);
		data["Time"] = this.getRequest_Time(request);
		data["Sent"] = this.getRequest_Sent(request);
		data["Received"] = this.getRequest_Received(request);
		data["Method"] = this.getRequest_Method(request);
		data["Result"] = this.getRequest_Result(request);
		data["Type"] = this.getRequest_Type(request);
		data["URL"] = this.getRequest_Url(request);
		data["Request_Header"] = this.getRequest_RequestHeaders(request);
		data["Response_Header"] = this.getRequest_ResponseHeaders(request);
		data["POST_Data"] = this.getRequest_PostData(request);
		data["Content"] = this.getRequest_Content(request);
		
		return data;
	},
	
	getRequest_Started: function(request)
	{
		var date = new Date(request.StartTimestamp);
		return date.getTime();
	},
	
	getRequest_Time: function(request)
	{
		var data = net.decoded.utils.formatTimeDifference(request.StartTimestamp, request.EndTimestamp);
		return escape(data);
	},
	
	getRequest_Sent: function(request)
	{
		return request.getBytesSentTotal();
	},
	
	getRequest_Received: function(request)
	{
		return request.getBytesLoaded();
	},
	
	getRequest_Method: function(request)
	{
		var data = request.RequestMethod;
		return escape(data);
	},
	
	getRequest_Result: function(request)
	{
		var data = request.ResponseStatus;
		return escape(data);
	},
	
	getRequest_Type: function(request)
	{
		var data = request.ContentType;
		return escape(data);
	},
	
	getRequest_Url: function(request)
	{
		return request.Url;
	},
	
	jsonizeArray: function(array)
	{
		var text = "{";
		var count = 0;
		
		for (i in array) {
			if(count != 0) {
				text += ',';
			}
			count += 1;
			text += '"' + escape(i) + '":"' + escape(array[i]) + '"';
		}
		text +='}'
		var data = JSON.decode(text);
		return escape(JSON.encode(data));
	},
	
	getRequest_RequestHeaders: function(request)
	{
		return this.jsonizeArray(request.RequestHeaders);
	},
	
	getRequest_ResponseHeaders: function(request)
	{
		return this.jsonizeArray(request.ResponseHeaders);
	},
	
	getRequest_PostData: function(request)
	{
		var data = request.PostData;
		return escape(data);
	},
	
	getRequest_Content: function(request)
	{
		var data = request.Content;
		return escape(data);
	},
	
	getData: function()
	{
		var currentRequest = HttpFox.RequestTree.getCurrent();
		currentRequest.startGetRawContent(HttpFox);
	},
	
}

function JWR_ResponseLoaderFlagger() 
{}
JWR_ResponseLoaderFlagger.prototype =
{
	data: "JWR_ResponseLoaderFlagger",
	
	toString: function()
	{
		return "JWR_ResponseLoaderFlagger";
	},
	
	QueryInterface: function(iid)
	{
		if (iid.equals(Components.interfaces.nsISupportsString) ||
			iid.equals(Components.interfaces.nsISupports))
			return this;
		throw Components.results.NS_NOINTERFACE;
	}
}

var JWR_HF = new JWR_HttpFox_Interface();
