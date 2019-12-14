function searchSubmit(sid) {
	var wd = $.trim($('#' + sid).val());
	if (wd != "") {
		return true;
	} else {
		return false;
	}
}

function autoCompleteMovie(sid) {
	$('#' + sid).autocomplete({
		lookup: function(query, done) {
			if (query != "") {
				$.get("/movie/suggest", {
					"wd": query
				}, function(result) {
					if (result.status == '1') {
						if (result.data.length > 1) {
							done({
								suggestions: result.data
							});
						}
					}
				}, 'json');
			}
		},
		onSelect: function(suggestion) {
			if (suggestion.value != "") {
				location.href = "/movie/search?wd=" + encodeURI(suggestion.value);
			}
		}
	});
}

function autoComplete(sid, stype) {
	var st = (stype == undefined ? 0 : stype);
	$('#' + sid).autocomplete({
		lookup: function(query, done) {
			$.ajax({
				type: "get",
				url: "http://tip.soku.com/search_tip_1",
				async: false,
				data: {
					"query": query
				},
				dataType: 'jsonp',
				jsonp: "jsoncallback", //服务端用于接收callback调用的function名的参数  
				success: function(data) {
					var tipdata = data.r;
					tipdata.sort(function(a, b) {
						var ay = a.y == undefined ? 0 : a.y;
						var by = b.y == undefined ? 0 : b.y;
						return by - ay
					});

					var choices = new Array();
					for (var i = 0; i < tipdata.length; i++) {
						var item = new Object();
						item.value = tipdata[i].w;
						item.year = tipdata[i].y == undefined ? "" : tipdata[i].y;
						item.type = tipdata[i].c == undefined ? "" : tipdata[i].c;
						choices.push(item);
					}
					done({
						suggestions: choices
					});
				}
			});
		},
		onSelect: function(suggestion) {
			// console.info('You selected: ' + suggestion.value + ', ' + suggestion.year+ ', ' + suggestion.type);
			var wd = suggestion.value;
			if (wd != "" && st == 0) {
				if (suggestion.type != "") {
					st = 4;
				} else {
					var flagArr = ["电影", "电视", "视频", "tv", "集", "季", "直播", "卫视", "高清", "bd", "hd",
						"720", "1080", "蓝光", "抢先", "中字", "预告片", "花絮"
					];
					for (var i = 0; i < flagArr.length; i++) {
						if (wd.charAt(wd.length - 1) == "版") {
							st = 4;
							break;
						}
						if (wd.toLowerCase().indexOf(flagArr[i]) > -1) {
							st = 4;
							break;
						}
					}
				}
			}

			if (wd != "") {
				//console.info(type);
				location.href = "/s?wd=" + encodeURI(wd) + "&st=" + st;
			}

		}

	});
}
