/**
 * Created by iluxa_000 on 12/10/2014.
 */


window.cache = (function () {

	var data = {};
	var tickers = {};
	var handlers = [];
	var handlersByKey = {};

	var set = function (key, value, seconds) {
		var ticker = tickers[key];
		if (ticker) {
			clearInterval(ticker);
			ticker = null;
			console.log('Timer is about to restart with key:', key);
		}
		tickers[key] = setTimeout(function () {
			onTimeout(key);
		}, seconds);

		data[key] = value;

	};

	var fireEvents = function (handlers, key,obj) {
		if (!handlers || handlers.length === 0)
			return;
		for (var i = 0; i < handlers.length; i++) {
			var handler = handlers[i];
			if (handler) {
				handler({key:key,data:obj});
			}
		}
	};
	var get = function (key) {
		console.time('get by key');
		var res= data[key];
		console.timeEnd('get by key');
		return res;
	};

	var onTimeout = function (key) {
		(function (key) {
			console.time('onTimeout with handlers');
			var fetched = data[key];
			fireEvents(handlers, key,fetched);
			fireEvents(handlersByKey[key],key, fetched);
			delete data[key];
			console.log('Remove key:', key);
			console.timeEnd('onTimeout with handlers');
		})(key);
	};
	var onExpired = function (key, callback) {
		if (arguments.length > 1 && typeof key === 'string' && typeof callback === 'function') {
			if (!handlersByKey[key])
				handlersByKey[key]=[];

			handlersByKey[key].push(callback);
		}
		if (arguments.length === 1 && typeof key === 'function' && !callback) {
			handlers.push(key);
		}
	};

	return {
		set: set,
		get: get,
		onExpired: onExpired,
		data:data
	};
})();
