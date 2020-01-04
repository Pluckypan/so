function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return "";
}
String.prototype.trim = function(char, type) {
	if (char) {
		if (type == 'left') {
			return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
		} else if (type == 'right') {
			return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
		}
		return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
	}
	return this.replace(/^\s+|\s+$/g, '');
};
