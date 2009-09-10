var Ci = Components.interfaces;
var Cc = Components.classes;
var JWR_Prompt = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);							
var JSON = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);

function JWR_hitch(obj, meth) {
	if (!obj[meth]) {
		throw "method '" + meth + "' does not exist on object '" + obj + "'";
	}

	var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);

	return function() {
	// make a copy of staticArgs (don't modify it because it gets reused for
	// every invocation).
	var args = staticArgs.concat();

	// add all the new arguments
	for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	// invoke the original function with the correct this obj and the combined
	// list of static and dynamic arguments.
	return obj[meth].apply(obj, args);
	};
}

function JWR_listen(source, event, listener, opt_capture) {
	Components.lookupMethod(source, "addEventListener")(
		event, listener, opt_capture);
}

function JWR_unlisten(source, event, listener, opt_capture) {
	Components.lookupMethod(source, "removeEventListener")(
		event, listener, opt_capture);
}

function JWR_open_in_tab(url) {
//	var oldtab = getBrowser().selectedTab;
	var newtab = getBrowser().addTab(url);
//	var newtab = getBrowser().addTab("www.google.com");
//	window.open(url);
//	oldtab.focus();
}

function JWR_choose_directory(title) {
	const nsIFilePicker = Ci.nsIFilePicker;
	var filepicker = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	filepicker.init(window, title, nsIFilePicker.modeGetFolder);
	
	var retval = filepicker.show();
	
	//if chosen then
	if (retval == nsIFilePicker.returnOK || retval == nsIFilePicker.returnReplace)
		return filepicker.file;
		
	return null; 
}

function JWR_add_zero(number)
{
	if (number < 10) {
		return "0" + number.toString();
	}
	return number;
}

function JWR_get_timestamp()
{
	var date = new Date();
	
	var text = date.getFullYear();
	text += "-" + JWR_add_zero(new Number(date.getMonth() + 1));
	text += "-" + JWR_add_zero(new Number(date.getDate()));
	text += "-" + JWR_add_zero(new Number(date.getHours()));
	text += "-" + JWR_add_zero(new Number(date.getMinutes()));
	text += "-" + JWR_add_zero(new Number(date.getSeconds()));
	return text;
}

function JWR_get_home_dir()
{
	const Cconstructor = Components.Constructor("@mozilla.org/file/directory_service;1","nsIProperties");
	var constructor = new Cconstructor();
	var file = constructor.get("Home", Components.interfaces.nsIFile);
	var path = file.path; 
	
	return path;
}

function JWR_get_extension(filename)
{
	var pos = filename.lastIndexOf(".");
	if (!(pos > 0)) return "";
	
	name = filename.substr(0, pos);
	return filename.substr(pos);
}

function JWR_set_extension(file, ext)
{
	var oldext = JWR_get_extension(file);
	
	if (oldext == ext) return file;
	
	return file + "." + ext;
}
