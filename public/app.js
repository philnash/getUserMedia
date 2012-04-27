// Set up the PhotoBox object and get the relevant elements
var PhotoBox = function(){
  var _this=this;
  this.video = document.getElementById('video');
  this.canvas = document.getElementById('canvas');
  this.link = document.getElementById('control');

  // function to call when clicking the video link.
  this.clickEvent = function(e){
    e.preventDefault();
    _this.getStream(e);
  }
  this.link.addEventListener('click', this.clickEvent, false);

  // hide the video and canvas elements initially
  this.video.setAttribute('style', 'display:none;');
  this.canvas.setAttribute('style', 'display:none;');
}

// getStream does the negotiotion of the existence of getUserMedia and uses the
// vendor prefixed version for Chrome
PhotoBox.prototype.getStream = function(){
  var _this=this;
  if(navigator.getUserMedia){
    navigator.getUserMedia({video: true}, function(stream){_this.success(stream);}, _this.error);
  }else if(navigator.webkitGetUserMedia){
    // we save whether it is webkit as this will work differently later too
    _this.isWebkit = true;
    navigator.webkitGetUserMedia('video', function(stream){_this.success(stream);}, _this.error);
  }else{
    alert("No getUserMedia available");
  }
};

// on getting the stream successfully, we set the source of the video element to
// the stream. In Chrome we have to make an object url out of it.
PhotoBox.prototype.success = function(stream){
  var _this = this;
  if(!this.isWebkit){
    source = stream;
  }else{
    source = window.webkitURL.createObjectURL(stream);
  }

  this.video.src = source;

  // then we show the video and repurpose the link for taking photos.
  this.video.setAttribute('style', 'display:block;');
  this.link.removeEventListener('click', this.clickEvent, false);
  this.clickEvent = function(e) {
    e.preventDefault();
    _this.takePhoto();
  }
  this.link.innerHTML = "Take photo";
  this.link.addEventListener('click', this.clickEvent, false);
};

// Alert if there is a problem with the stream.
PhotoBox.prototype.error = function () {
  alert('Something went wrong');
};


// To take a photo, all we do is get the canvas element, clear the context and
// draw the image straight from the video.
PhotoBox.prototype.takePhoto = function(){
  var context = this.canvas.getContext('2d');

  context.clearRect(0, 0);
  context.drawImage(this.video, 0, 0);
  this.canvas.setAttribute('style', 'display:block;');
  this.video.setAttribute('style', 'display:none;');
};

window.addEventListener('load', function(){ new PhotoBox(); });
