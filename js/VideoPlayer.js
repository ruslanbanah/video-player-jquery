var Player = function(el, options) {
  var self = this;
  this.player = el;
  this.ready().then(function(){
    $(self.player).removeAttr('controls');
    self.init(options);
    self.eventInit();
  });
};

Player.prototype.play = function() {
  this.player.play();
};
Player.prototype.pause = function() {
  this.player.pause();
};
Player.prototype.mute = function() {
  this.player.mute();
};
Player.prototype.setCurrentTime = function(currentTime) {
  this.player.currentTime = currentTime;
};
Player.prototype.setVolume = function(volume) {
  this.player.volume = volume;
};
Player.prototype.setTemplateControls = function(){
  $(this.player).after(this.options.templateControls);
};
Player.prototype.setTemplateWrapper = function(){
  $(this.player).wrap(this.options.templateWrapper);
};
Player.prototype.setTemplateVideoWrapper = function(){
  $(this.player).wrap(this.options.templateVideoWrapper);
};
Player.prototype.ready = function() {
    var self = this;
    return new Promise(function(resolve, reject){
    function check(count) {
      if (self.player.readyState === 4) {
        resolve(arguments);
      } else {
        if(count<5){
          setTimeout(function() { check(count++); }, 100);
        }else{
          reject('Error: Player not ready.');
        }
      }
    }
    check(0);
    })
};
Player.prototype.eventInit = function(){
  var self = this;
  this.options.controlPanel.btnPlay.bind('click',function(){
    if(self.player.paused){
      self.play();
    }else{
      self.pause();
    }
  });
  this.player.ontimeupdate = function(){
    var seconds = self.player.currentTime;
    var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
    var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
    var width = self.options.controlPanel.progressBar.width();
    var duration = self.player.duration;
    var percent = (seconds * 100) / duration;
    self.options.controlPanel.timerPanel.text(m+":"+s);
    self.options.controlPanel.progressBarActive.css({ width: percent+'%'});
  };
  this.player.onplay = function() {
    var btnPlay = self.options.controlPanel.btnPlay;
    btnPlay.find('i').removeClass('fa-play').addClass('fa-pause');
  };
  this.player.onpause = function() {
    var btnPlay = self.options.controlPanel.btnPlay;
    btnPlay.find('i').removeClass('fa-pause').addClass('fa-play');
  };
}
//Init player
Player.prototype.init = function(options) {
  var self = this;
  var defaultOptions = {
        theme: 'theme-player-dark',
        controlPanel: {
          btnPlay: $('<div><i class="fa fa-play"></i></div>').addClass('js-video-control-play __sep-line'),
          timerPanel: $('<div>00:00</div>').addClass('js-video-control-time __sep-line'),

          progressBar: $('<div>').addClass('line'),
          progressBarActive: $('<div>').addClass('line-active'),

          btnMute: $('<i>').addClass('fa fa-volume-up'),
          volumeProgerssBar: $('<div>').addClass('line'),
          volumeProgerssBarActive: $('<div>').addClass('line-active'),

          btnFullScreen: $('<div>').addClass('js-video-control-fullscreen').append($('<i>').addClass('fa fa-arrows-alt')),
          btnSocial: $('<div>').addClass('js-video-control-share __sep-line').append('<ul><li><i class="fa fa-twitter"></i></li><li><i class="fa fa-facebook"></i></li><li><i class="fa fa-google"></i></li></ul>')
        }
  };
  defaultOptions.controlPanel.volumePanel = $('<div>').addClass('js-video-control-volume __sep-line')
                                                      .append(defaultOptions.controlPanel.btnMute)
                                                      .append(defaultOptions.controlPanel.volumeProgerssBar.append(defaultOptions.controlPanel.volumeProgerssBarActive));

  defaultOptions.controlPanel.timeLinePanel = $('<div>').addClass('js-video-control-timeline __sep-line').append(defaultOptions.controlPanel.progressBar.append(defaultOptions.controlPanel.progressBarActive));
  defaultOptions.templateVideoWrapper = $('<div>').addClass('js-video-view');
  defaultOptions.templateWrapper = $('<div></div>').addClass('js-video');

  defaultOptions.templateControls = $('<div>').addClass('js-video-control').append(defaultOptions.controlPanel.btnPlay)
                                                                          .append(defaultOptions.controlPanel.timerPanel)
                                                                          .append(defaultOptions.controlPanel.timeLinePanel)
                                                                          .append(defaultOptions.controlPanel.volumePanel)
                                                                          .append(defaultOptions.controlPanel.btnSocial)
                                                                          .append(defaultOptions.controlPanel.btnFullScreen);


  self.options = $.extend(defaultOptions, options);

  self.setTemplateWrapper();
  self.setTemplateControls();
  self.setTemplateVideoWrapper();
};


(function($) {
  $.fn.videoPlayer = function(options){
  return this.each(function() {
      return new Player(this, options);
  });
};
})(jQuery);
