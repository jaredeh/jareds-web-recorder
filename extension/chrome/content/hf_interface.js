function JWR_HttpFox_Interface()
{
	this.init(); 
}

JWR_HttpFox_Interface.prototype =
{
	HttpFoxService: null,
	Requests: null,
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
	
	getNextRequest: function()
	{
		
		if (this.NumberRows == -1) {
			this.setVariables();
			this.NumberRows = HttpFox.RequestTree.rowCount;
		}
		
		var val = this.RequestPos;
		
		dump("val: " + val + " rows: " + this.NumberRows + "\n");

		this.RequestPos += 1;
		
		if (val == this.NumberRows) {
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
	
/*
	doLoad: function(request,callback)
	{
		var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var url = request.Url;
		var myPostData = request.PostData;
		var ckey = request.CacheKey;
		
		var channel;
		try {
			channel = ioService.newChannel(url, null, null);
			channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_FROM_CACHE;
			channel.loadFlags |= Components.interfaces.nsIChannel.LOAD_TARGETED;
			channel.loadFlags |= Components.interfaces.nsIRequest.VALIDATE_NEVER;
			channel.owner = new JWR_ResponseLoaderFlagger();
		}
		catch(ex){
			alert(ex);
			return;
		}
		
		if (channel instanceof Components.interfaces.nsIUploadChannel) {
			if (myPostData) {
				var inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
				inputStream.setData(myPostData, myPostData.length);
				
				var postStream = inputStream.QueryInterface(Components.interfaces.nsISeekableStream);
				postStream.seek(0, 0);
				
				var uploadChannel = channel.QueryInterface(Components.interfaces.nsIUploadChannel);
				uploadChannel.setUploadStream(postStream, "application/x-www-form-urlencoded", -1);
				
				var cachingChannel = channel.QueryInterface(Components.interfaces.nsIHttpChannel);
				var httpChannel = channel.QueryInterface(Components.interfaces.nsIHttpChannel);
				httpChannel.requestMethod = "POST";
			}
		}
		
		if (channel instanceof Components.interfaces.nsICachingChannel) {
			var cacheChannel = channel.QueryInterface(Components.interfaces.nsICachingChannel);
			cacheChannel.loadFlags |= Components.interfaces.nsICachingChannel.LOAD_ONLY_FROM_CACHE;
			cacheChannel.loadFlags |= Components.interfaces.nsIRequest.VALIDATE_NEVER;
			cacheChannel.cacheKey = ckey;
		}
		
		try {
			var listener = new JWR_Listen(request,callback);
			channel.asyncOpen(listener, null);
		}
		catch(ex) {
			alert(ex);
			return;
		}
	},
*/
}


function JWR_Listen(callback)
{
	this.callback = callback;
	this.data = "";
}

JWR_Listen.prototype =
{
	onStartRequest: function(request, context) {},
	
	onStopRequest: function(request, context, status) {
		this.done = true;
		context = this.data;
		request.Content = context;
		request.ContentStatus = status;
		eval(this.callback);
	},
	
	onDataAvailable: function(request, context, inStr, sourceOffset, count) {
		var bstream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
		bstream.setInputStream(inStr);
	
		var bytes = bstream.readBytes(bstream.available());
		this.data += bytes;
	},
	
};

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


/*


var Ci = Components.interfaces;
var Cc = Components.classes;

var foo = {};
foo.bar = "new property";
foo.baz = 3;

var nativeJSON = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);
var JSONfoo = nativeJSON.encode(foo);


HttpFox: null,
HttpChannel: null,
Context: null,
RequestLog: null,
EventSource: null,
EventSourceData: null,
MasterIndex: null,
HttpFoxRequestEventSink: null,

// custom request properties
StartTimestamp: null,
ResponseStartTimestamp: null,
EndTimestamp: null,
Content: null,
ContentStatus: null,
BytesLoaded: 0,
BytesLoadedTotal: 0,
BytesSent: 0,
BytesSentTotal: 0,
ResponseHeadersSize: 0,
RequestHeadersSize: 0,

// request states
IsFinished: false,
IsFinal: false, // last scan and cleanup was done
IsAborted: false,
IsLoadingBody: false,
IsSending: false,
HasReceivedResponseHeaders: false,
IsRedirect: false,
HasErrorCode: false,
IsError: false,
IsFromCache: false,
HasCacheInfo: false,
//IsContentAvailable: false,
HasPostData: false, 
HasQueryStringData: false,
HasCookieData: false,

// request/response data
RequestHeaders: null,
ResponseHeaders: null,
PostDataHeaders: null,
PostData: null,
PostDataParameters: null,
PostDataMIMEParts: null,
PostDataMIMEBoundary: null,
IsPostDataMIME: null,
PostDataContentLength: null,
IsPostDataTooBig: false,
QueryString: null,
QueryStringParameters: null,
CookiesSent: null,
CookiesReceived: null,
IsBackground: false,

// httpchannel-, request properties
Status: null,
Url: null,
URIPath: null,
URIScheme: null,
RequestProtocolVersion: null,
RequestMethod: null,
ResponseProtocolVersion: null,
ResponseStatus: null,
ResponseStatusText: null,
ContentType: null,
ContentCharset: null,
ContentLength: null,
LoadFlags: null,
Name: null,
RequestSucceeded: null,
IsNoStoreResponse: null,
IsNoCacheResponse: null,
IsFromCache: null,
CacheToken: null,
CacheToken_key: null,
CacheKey: null,
CacheAsFile: null,
CacheFile: null,
Priority: null,
EntityId: null,

*/