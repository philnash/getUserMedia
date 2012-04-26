var PhotoBox = function(){
  var _this=this;
  this.video = document.getElementById('video');
  this.canvas = document.getElementById('canvas');
  this.link = document.getElementById('control');
  this.clickEvent = function(e){
    e.preventDefault();
    _this.getStream(e);
  }

  this.video.setAttribute('style', 'display:none;');
  this.canvas.setAttribute('style', 'display:none;');
  this.link.addEventListener('click', this.clickEvent, false);
}

PhotoBox.prototype.success = function(stream){
  var _this = this;
  if(!this.isWebkit){
    source = stream;
  }else{
    source = window.webkitURL.createObjectURL(stream);
  }

  this.video.src = source;
  this.video.setAttribute('style', 'display:block;');
  this.link.removeEventListener('click', this.clickEvent, false);
  this.clickEvent = function(e) {
    e.preventDefault();
    _this.takePhoto();
  }
  this.link.innerHTML = "Take photo";
  this.link.addEventListener('click', this.clickEvent, false);
};

PhotoBox.prototype.error = function () {
  alert('Something went wrong');
};

PhotoBox.prototype.getStream = function(){
  var _this=this;
  if(navigator.getUserMedia){
    navigator.getUserMedia({video: true}, function(stream){_this.success(stream);}, _this.error);
  }else if(navigator.webkitGetUserMedia){
    _this.isWebkit = true;
    navigator.webkitGetUserMedia('video', function(stream){_this.success(stream);}, _this.error);
  }else{
    alert("No getUserMedia available");
  }
};

PhotoBox.prototype.takePhoto = function(){
  var context = this.canvas.getContext('2d');

  context.clearRect(0, 0);
  context.drawImage(this.video, 0, 0);
  this.canvas.setAttribute('style', 'display:block;');
  this.video.setAttribute('style', 'display:none;');
};

window.addEventListener('load', function(){
  new PhotoBox();
});
