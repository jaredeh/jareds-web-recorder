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
