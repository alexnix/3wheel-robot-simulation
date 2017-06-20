var saveData = (function () {
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	return function (data, fileName) {
	    var json = JSON.stringify(data),
	        blob = new Blob([json], {type: "octet/stream"}),
	        url = window.URL.createObjectURL(blob);
	    a.href = url;
	    a.download = fileName;
	    a.click();
	    window.URL.revokeObjectURL(url);
	};
}());

var confs = [
	{
		elitism:1
		populations:1,
		name:
	},
	{
		elitism:1
		populations:1,
	},
	{
		elitism:1
		populations:1,
	}
];

confs.forEach(conf => {

	game.begin(conf, (res) => {
		saveData(res, conf.name);
	});

})