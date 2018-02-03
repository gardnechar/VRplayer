var vrView;
var playButton;
var muteButton;
var savedVolumeLevel = 1;
var isMuted = false;
var json = localStorage.getItem("scenes");

var scenes = JSON.parse(json);

console.log(scenes);

function onLoad() {
  // Load VR View.
  vrView = new VRView.Player('#vrview', {
    width: '100%',
    height: 480,
    image: 'img/blank.png',
    preview: 'img/blank.png',
  });

  playButton = document.querySelector('#toggleplay');
  muteButton = document.querySelector('#togglemute');
  volumeRange = document.querySelector('#volumerange');
  timeContainer = document.querySelector('#time');

  playButton.addEventListener('click', onTogglePlay);
  muteButton.addEventListener('click', onToggleMute);
  volumeRange.addEventListener('change', onVolumeChange);
  volumeRange.addEventListener('input', onVolumeChange);

  vrView.on('ready', onVRViewReady);
  vrView.on('click', onHotspotClick);
  vrView.on('timeupdate', function(e) {
    var current = formatTime(e.currentTime);
    var duration = formatTime(e.duration);
    timeContainer.innerText = current + ' | ' + duration;
    console.log('currently playing ' + current + ' secs.');
  });

}

function onVRViewReady() {
  loadScene('video1');
  // Set the initial state of the buttons.
  if (vrView.isPaused) {
    playButton.classList.add('paused');
  } else {
    playButton.classList.remove('paused');
  }
}

function onHotspotClick(e) {
  console.log('onHotspotClick', e.id);
  if (e.id != null) {
    loadScene(e.id);
  }
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
    vrView.setContent({
      video: scenes[id].video,
      is_stereo: false,
      is_autopan_off: true
    });

  // Add all the hotspots for the scene
  var newScene = scenes[id];
  var sceneHotspots = Object.keys(newScene.hotspots);
  for (var i = 0; i < sceneHotspots.length; i++) {
    var hotspotKey = sceneHotspots[i];
    var hotspot = newScene.hotspots[hotspotKey];

    vrView.addHotspot(hotspotKey, {
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      radius: hotspot.radius,
      distance: hotspot.distance
    });
  }
}

function onTogglePlay() {
  if (vrView.isPaused) {
    vrView.play();
    playButton.classList.remove('paused');
  } else {
    vrView.pause();
    playButton.classList.add('paused');
  }
}

function onToggleMute() {
  if (isMuted) {
    vrView.setVolume(savedVolumeLevel);
    isMuted = false;
  } else {
    vrView.setVolume(0);
    isMuted = true;
  }
  muteButton.classList.toggle('muted');

  console.log(isMuted);
}

function onVolumeChange(e) {

  	savedVolumeLevel = volumeRange.value / 100;
  	if (!isMuted) {
    	vrView.setVolume(savedVolumeLevel);
	}
    
}

function formatTime(time) {
  time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time % 60);

  minutes = minutes <= 0 ? 0 : minutes;
  seconds = seconds <= 0 ? 0 : seconds;

  var result = (minutes < 10 ? '0' + minutes : minutes) + ':';
  result += seconds < 10 ? '0' + seconds : seconds;
  return result;
}

window.addEventListener('load', onLoad);