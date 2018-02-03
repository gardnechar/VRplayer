var source;
var index = 0;
var hotspots = {};
var hotspot1;
var hotspot2;
var json;
var videoName = localStorage.getItem("video"+Number(localStorage.videoCount));
var videoList = document.getElementById("videoList");
var pathList = document.getElementById("pathList");
var videoCount = localStorage.videoCount;


for (i = 1; i <= videoCount; i++) { 

	var video = localStorage.getItem("video"+i);
    var option = document.createElement("option");
    option.text = video;
    videoList.add(option);
    
}

for (i = 1; i <= videoCount; i++) { 

	var video = localStorage.getItem("video"+i);
    var option = document.createElement("option");
    option.text = video;
    pathList.add(option);
    
}

loadVideo(videoList.value);

function loadVideo(video){

	source = video;

	$("#videoArea").empty();
	
	var video = $('<video />', {
	    id: 'video',
	    src: video,
	    type: 'video/mp4',
	    controls: false,
	    width: "auto",
	    height: "360px"
	});
	video.appendTo($('#videoArea'));

	$('#video').click(function(e)
	{   
	    var offset_t = $(this).offset().top - $(window).scrollTop();
	    var offset_l = $(this).offset().left - $(window).scrollLeft();

	    var left = Math.round( (e.clientX - offset_l) );
	    var top = Math.round( (e.clientY - offset_t) );

	    var frameWidth = $(this).width();

	    var percentage = Math.round( (frameWidth/360) );

	    var xposition = Math.round( ((left - 360)/percentage) );
	    var number = xposition - (xposition * 2);
	    var yposition = ((180 - top)/2);
	   
	   $("#yaw").val(number);
	   $("#pitch").val(yposition);


	});

}

	



function saveHotspot(){

	if (index < 2) {
		var pitch = document.getElementById("pitch").value;
		var yaw = document.getElementById("yaw").value;
		var path = document.getElementById("pathList").value;

		index += 1;
		document.getElementById("hotspotList").innerHTML += ("Hotspot" + index + ":" + ", Video: " + source + ", Pitch: " + pitch + ", Yaw: " + yaw + ", Path: " + path + "<br>");
		
	    
	    if (index === 1) {
	    	hotspot1 = {"video1": {"video": source, "hotspots": {"video2": {"pitch": pitch, "yaw": yaw, "radius": 0.05, "distance": 1}}}};
		} else {
			hotspot2 = {"video2": {"video": source, "hotspots": {"video1": {"pitch": pitch, "yaw": yaw, "radius": 0.05, "distance": 1}}}};

		}	 
	}
}

function finished(){

	
   for (var key in hotspot1) {
      hotspots[key] = hotspot1[key];
   }
   for (var key in hotspot2) {
      hotspots[key] = hotspot2[key];
   }

	json = JSON.stringify(hotspots);

	localStorage.setItem("scenes", json);

	window.location.href = "https://storage.googleapis.com/vrplayer/player.html";

}

function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}
