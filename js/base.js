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
				$.ajax({
					type: "get",
					dataType: "jsonp",
					async: false,
					data: {
						"wd": query
					},
					url: "https://api.tv920.com/parse/api.php?tp=jsonp",
					jsonp: "cb",
					success: function(data) {
						if (data.success == '1') {
							if (data.info.length > 1) {
								var choices = [];
								data.info.forEach(function(item) {
									if (item && item.title && item.title.length > 0) {
										var val = decodeURIComponent(item.title);
										choices.push({
											"value": val ? val : query,
											"id": item.id,
											"data": item
										});
									}
								});
								done({
									suggestions: choices
								});
							}
						}
					},
					error: function(xhr, textStatus, errorThrown) {

					}
				});
			}
		},
		onSelect: function(suggestion) {
			if (suggestion.value && suggestion.value.length > 0 && suggestion.data) {
				window.open("https://www.tv920.com/search-" + encodeURI(suggestion.value) + ".html");
			}
		}
	});
}

function autoComplete(sid, stype) {
	console.log("autoComplete sid=" + sid + " stype=" + stype);
	switch (stype) {
		case "1":
			sokuAuto(sid);
			break;
		case "2":
			autoCompleteMovie(sid);
			break;
		case "3":
			qiachu(sid);
			break;
		default:
			baidu(sid);
			break;
	}
}

function sokuAuto(sid) {
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
				jsonp: "jsoncallback",
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
			if (suggestion.value && suggestion.value.length > 0) {
				window.open("https://so.youku.com/search_video/q_" + encodeURI(suggestion.value))
			}

		}
	});
}

function qiachu(sid) {
	$('#' + sid).autocomplete({
		lookup: function(query, done) {
			$.ajax({
				type: "get",
				url: "https://suggest.taobao.com/sug",
				async: false,
				data: {
					"code": "utf-8",
					"bucketid": 9,
					"k": "1",
					"src": "tmall_pc",
					"area": "b2c",
					"q": query
				},
				dataType: 'jsonp',
				success: function(json) {
					if (json && json.result && json.result.length > 0) {
						var choices = json.result.map(function(item) {
							return {
								"value": item[0]
							}
						});
						done({
							suggestions: choices
						});
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					console.log(errorThrown);
				}
			});
		},
		onSelect: function(suggestion) {
			if (suggestion.value && suggestion.value.length > 0) {
				window.open("http://qiachu.com/tao/index.php?r=l&kw=" + encodeURI(suggestion.value))
			}

		}
	});
}

function baidu(sid) {
	$('#' + sid).autocomplete({
		lookup: function(query, done) {
			$.ajax({
				type: "get",
				url: "https://www.baidu.com/sugrec",
				async: false,
				data: {
					"ie": "utf-8",
					"json": 1,
					"prod": "pc",
					"pwd": "hao",
					"from": "pc_web",
					"wd": query
				},
				dataType: 'jsonp',
				jsonp: "cb",
				success: function(json) {
					if (json && json.g && json.g.length > 0) {
						var choices = json.g.map(function(item) {
							return {
								"value": item.q ? item.q : query
							}
						});
						done({
							suggestions: choices
						});
					}
				},
				error: function(xhr, textStatus, errorThrown) {

				}
			});
		},
		onSelect: function(suggestion) {
			if (suggestion.value && suggestion.value.length > 0) {
				window.open("https://www.baidu.com/s?isource=1991th&itype=web&ie=utf-8&wd=" + encodeURI(suggestion.value))
			}

		}
	});
}
