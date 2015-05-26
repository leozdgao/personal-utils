// {
// 	method: "",
// 	url: "",
// 	headers: {},
// 	data: {},
// 	timeout: 0
// }

// function(err, res, status, xhr)

function ajax(opts, cb) {

	opts = opts || {};
	opts.method = opts.method || 'GET';
	opts.url = opts.url || '';
	opts.headers = opts.headers || {};
	var ct = opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';

	if(opts.data === null) opts.data = void(0);

	var xhr = new XMLHttpRequest();
	xhr.open(opts.method, opts.url);

	for(var key in opts.headers) xhr.setRequestHeader(key, opts.headers[key]);
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {

			var res = {};
			if(ct === 'application/json') {

				try {

					res = JSON.parse(xhr.response);
				}
				catch(ex) {

					res = {};
				}	
			}
			else if(ct === 'application/x-www-form-urlencoded') {

				var kvs = xhr.response.split('&');
				for (var i = 0, l = kvs.length; i < l; i++) {
					
					var kv = kvs[0].split('=');
					if(kv.length > 1) {

						res[kv[0]] = kv[1];
					}
				}
			}

			cb.call(null, null, res, xhr.status, xhr);
		}
	};
	xhr.send(JSON.stringify(opts.data));
	xhr.timeout = opts.timeout || 3000;
	xhr.ontimeout = function() {

		cb.call(null, new Error('timeout'), void(0), xhr.status, xhr);
	};
}