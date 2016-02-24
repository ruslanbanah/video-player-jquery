var Player = function(el, options) {
  var self = this;
  var defaultOptions = {
    theme: 'theme-player-dark'
  };
  this.id = this.getID();
  this.options = $.extend(defaultOptions, options);
  this.player = el;
  this.videoPosition = 0;
  this.$control_panel = null;
  this.$video_seek = null;
  this.$video_timer = null;
  this.$button_play = null;
  this.$seek_cursor = null;

  $(self.player).removeAttr('controls');

  this.ready(function(){
    self.buildWrapper();
    self.initSeek();
    self.$control_panel.show();
    self.seekUpdate();
    self.player.ontimeupdate = function() { self.seekUpdate()};
  });

};

Player.prototype.getID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

Player.prototype.pixelToTime = function(px) {
  console.log('Input:',px);
  var px = px - this.$seek_cursor.width();
  var duration = this.player.duration;
  var width = this.$video_seek.width() - this.$seek_cursor.width();
  if(px>width){
    px = width;
  }
  return (px * duration) / width
};

Player.prototype.timeToPixel = function(ms) {
  var duration = this.player.duration;
  var width = this.$video_seek.width() - this.$seek_cursor.width();
  var px = Math.round((ms * width) / duration);
  if(px<0){
    px=0;
  }
  console.log('Output: ',px);
  return px;
};


Player.prototype.ready = function(callBack) {
  var self = this;
  if (this.player.readyState === 4) {
    console.info('Video plaeyr #',this.id,': Ready.', [this.player]);
    callBack.apply(this, arguments);
  } else {
      setTimeout(function() { self.ready(callBack) }, 100);
  }
}

Player.prototype.play = function() {
  if(this.player.paused){
    this.player.play();
  }else{
    this.player.pause();
  }
}

Player.prototype.initSeek = function() {
  var self = this;
  this.$seek_cursor = $('<div>').addClass('video-player-slider').draggable({
    axis: "x",
    containment: "parent",
    drag: function(e) {
      // console.log('Dragged',e.clientX);
      self.player.currentTime = self.pixelToTime(e.clientX);
    },
    stop: function(e) {
      self.player.currentTime = self.pixelToTime(e.clientX);
      console.log('Slide: ',self.player.currentTime,'ms : ',e.clientX,' px');
    }
  });

  this.$video_seek.append(this.$seek_cursor);
  this.$video_seek.bind('click', function(e) {
    self.player.currentTime = self.pixelToTime(e.clientX);
    // console.log(e.offsetX);
    // slider.css({ left:e.offsetX });
  });
};

Player.prototype.buildWrapper = function() {
  var self = this;
  var $video_wrap = $('<div>').addClass('video-player').addClass(this.options.theme).attr('id',this.id).width(this.player.width);

  this.$control_panel = $('<div>').addClass('video-player-controls');
  this.$button_play = $('<a title="Play/Pause"><i class="fa fa-play"></i></a>').addClass('play-button').attr('btn','play');
  this.$video_seek = $('<div></div>').addClass('video-player-seek');
  this.$video_timer = $('<div>timer</div>').addClass('video-player-timer');
  var $video_volume_box = $('<div></div>').addClass('video-player-volume-box');
  var $volume_slider = $('<div></div>').addClass('video-volume-box-slider');
  var $volume_btn = $('<div><i class="fa fa-volume-up"></i></div>').addClass('video-volume-btn').attr('btn','mute');

  $video_volume_box.append($volume_slider).append($volume_btn);
  this.$control_panel.append(this.$button_play).append(this.$video_seek).append(this.$video_timer).append($video_volume_box);

  this.$button_play.bind('click',function() { self.play();});

  $(this.player).wrap($video_wrap);
  $(this.player).after(this.$control_panel);
}


Player.prototype.time_format = function(seconds) {
  var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
  var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
  return m+":"+s;
};

Player.prototype.seekUpdate = function() {
  var currentTime = this.player.currentTime;
  this.$video_timer.text(this.time_format(currentTime));
  this.$seek_cursor.css({ left: this.timeToPixel(currentTime)});
};


(function($) {
  $.fn.videoPlayer = function(options){
  return this.each(function() {
      return new Player(this, options);
  });
};
})(jQuery);
