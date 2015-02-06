
function bestOfRestData (){
	var htmlStr = ""
	targetClip = $('#bestGraph');
	_.each(datasetBestOfRest, function (item,i){
		htmlStr+="<div class= 'graphBarHorizontal' id='bestGraphBar_"+item.scorer+"'></div>";
	});
	targetClip.html(htmlStr);

	drawBestWidths();
}

function drawBestWidths(){

	var maxUnit = getMaxVal(datasetBestOfRest,"goals");
	var w = $("#bestGraph").width();
	w = w  / maxUnit;

	console.log(w)

	_.each(datasetBestOfRest, function (item,i){
		var targetClip = $("bestGraphBar_"+item.scorer);
		var newW = Math.floor(w * item.goals);

		targetClip.css("width",newW+"px")



	})	
}


