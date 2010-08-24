// wrap code in an anonymous function
(function() {

	// DOM elements
	var search_field_el,
		get_results_button_el,
		results_el;	
	
	// convert hex codes to characters in a string
	var hex2char = function(str) {
		// returns a unique array of hex codes in a string
		var find_hex_codes = function(str2) {
			// get hex codes from the string
			var hex_codes = str2.match(/\\x[abcdef0-9][abcdef0-9]/g);
			
			// remove duplicates
			hex_codes = hex_codes.unique();	

			// return array
			return hex_codes;
		};
	
		var codes = find_hex_codes(str);

		// replace all the hex codes with their characters
		for (var i = 0; i < codes.length; i++) {
			// get the hex value
			var hex = codes[i].replace("\\x", "");
			
			// convert hex to decimal
			var char_code = parseInt(hex, 16);
			
			// replace the value with the character
			var character = String.fromCharCode(char_code);
			var regex = new RegExp("\\\\x" + hex, "g");
			str = str.replace(regex, character);
		}
		
		return str;
	};
		
	// create wonderwheel url
	var create_wonderwheel_request_url = function(search) {
		var url = "http://www.google.com/search?";
		url += "q=" + encodeURIComponent(search); // search terms
		url += "&tbs=ww:1"; // enable wonder wheel (tbs = tabs)
		url += "&tch=1"; // return result as JSON? not entirely sure
		return url;
	};	
		
	// extract the wonder wheel data from the search result
	// returns an object of the results if the parse worked
	// else returns 0
	var extract_ww_data = function(data) {
		// convert hex codes
		data = hex2char(data);
	
		// cut out the data we want
		// NOTE: this is the "weakest link" in this code; Google could change something and break this
		var start_phrase = "parent.google.ww.r(";
		var data_start = data.indexOf(start_phrase);
		data = data.substr(data_start + start_phrase.length);
		var end = data.indexOf("});");
		data = data.slice(0, end + 1);
	
		// the result should be JSON
		try {
			var results = YAHOO.lang.JSON.parse(data);
			return results;
		}
		catch (e) {
			return 0;
		}
	};

	// print the results to the page
	var print_results = function(data) {
		// no results
		if (data.r.length == 0) {
			results_el.innerHTML = "No results.";
			return;
		}

		var html = "<ul>";
		for (var i = 0; i < data.r.length; i++) {
			html += "<li>" + data.r[i].html_encode() + "</li>";
		}
		html += "</ul>";
		
		results_el.innerHTML = html;
	};
		
	// send a request to google to get the web wheel results
	var fetch_results = function() {
		var search = search_field_el.value;
		
		var reset_button = function() {
			get_results_button_el.disabled = false;
			get_results_button_el.value = "Get Wonder Wheel Results";
		};
		
		var callback = {
			success : function(o) {
				reset_button();
			
				var data = extract_ww_data(o.responseText);
				
				if (data == 0) {
					alert("Data parse failed!  Maybe Google changed their code.");
				}
				else {
					print_results(data);
				}
			},
			failure : function(o) {
				reset_button();
				results_el.innerHTML = "AJAX Failure!  Check your proxy?";
			}
		};
		
		// show loading status
		get_results_button_el.disabled = true;
		get_results_button_el.value = "fetching...";
		
		// send the request
		var request_url = create_wonderwheel_request_url(search);
		var post_data   = "url=" + encodeURIComponent(request_url);
		YAHOO.util.Connect.asyncRequest('POST', 'proxy.php', callback, post_data);
	};
	
	// catch the enter key on the search field
	var catch_enter = function(e) {
		var key = YAHOO.util.Event.getCharCode(e);
		if (key == 13) {
			fetch_results();
		}
	};
	
	// initialize
	var init = function() {
		// get DOM elements
		search_field_el       = document.getElementById("search_field");
		get_results_button_el = document.getElementById("get_results_button");		
		results_el            = document.getElementById("results");
		
		// add event handlers
		YAHOO.util.Event.on(get_results_button_el, "click", fetch_results);
		YAHOO.util.Event.on(search_field_el, "keypress", catch_enter);
		
		// put the focus on the search field
		search_field_el.focus();
	};
	YAHOO.util.Event.onDOMReady(init);
	
})(); // end anonymous function wrapper