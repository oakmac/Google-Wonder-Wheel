// global object prototypes

// html encode
if (! String.prototype.html_encode) {
	String.prototype.html_encode = function () {
		var str = this;
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#39;");
		return str;
	};
}	

// array unique 
if (! Array.prototype.unique) {
	Array.prototype.unique = function () {
		var r = new Array();
		o:for(var i = 0, n = this.length; i < n; i++)
		{
			for(var x = 0, y = r.length; x < y; x++)
			{
				if(r[x]==this[i])
				{
					continue o;
				}
			}
			r[r.length] = this[i];
		}
		return r;
	};
}