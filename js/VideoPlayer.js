var Player = function(el, options) {
  var self = this;
  this.player = el;
  this.events = [];
  this.ready().then(function() {
    $(self.player).removeAttr('controls');
    self.init(options);
    self.eventInit();
  });
};
/**
 * Start playing video.
 * @function play
 */
Player.prototype.play = function() {
  this.player.play();
};
/**
 * Stop video.
 * @function pause
 */
Player.prototype.pause = function() {
  this.player.pause();
};
/**
 * Volume on\off.
 * @function toggleMute
 */
Player.prototype.toggleMute = function() {
  this.player.muted = !this.player.muted;
  this.options.controlPanel.btnMute.toggleClass('fa-volume-up', !this.player.muted).toggleClass('fa-volume-off', this.player.muted);
};
/**
 * Go to current time.
 * @function setCurrentTime
 * @param currentTime
 */
Player.prototype.setCurrentTime = function(currentTime) {
  this.player.currentTime = currentTime;
};
/**
 * Set volume.
 * @function setVolume
 * @param volume
 */
Player.prototype.setVolume = function(volume) {
  this.player.volume = volume;
};
/**
 * Get duration video.
 * @function getDuration
 * @returns {Number}
 */
Player.prototype.getDuration = function() {
  return this.player.duration;
};
/**
 * Returns the current time video.
 * @function getCurrentTime
 * @returns {Number}
 */
Player.prototype.getCurrentTime = function() {
  return this.player.currentTime;
};
/**
 * Returns the current percent video.
 * @function getCurrentPercent
 * @returns {number}
 */
Player.prototype.getCurrentPercent = function() {
  return (this.player.currentTime * 100) / this.player.duration;
};
/**
 * Adds a toolbar.
 * @function setTemplateControls
 */
Player.prototype.setTemplateControls = function() {
  $(this.player).after(this.options.templateControls);
};
/**
 * Wrap for the whole player.
 * @function setTemplateWrapper
 */
Player.prototype.setTemplateWrapper = function() {
  $(this.player).wrap(this.options.templateWrapper);
};
/**
 * Wrap for the tag <video>.
 * @function setTemplateVideoWrapper
 */
Player.prototype.setTemplateVideoWrapper = function() {
  $(this.player).wrap(this.options.templateVideoWrapper);
};
/**
 * Enable full screen mode.
 * @function fullScreen
 */
Player.prototype.fullScreen = function() {
  if (!!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    this.player.setAttribute('data-fullscreen', false);
  }
  else {
    if (this.player.requestFullscreen) this.player.requestFullscreen();
    else if (this.player.mozRequestFullScreen) this.player.mozRequestFullScreen();
    else if (this.player.webkitRequestFullScreen) this.player.webkitRequestFullScreen();
    else if (this.player.msRequestFullscreen) this.player.msRequestFullscreen();
    this.player.setAttribute('data-fullscreen', true);
  }
};
/**
 * There is enough data for the playback to continue at the current playback rate without running out of content.
 * @function ready
 * @returns {Promise}
 */
Player.prototype.ready = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    function check(count) {
      if (self.player.readyState === 4) {
        resolve();
      } else {
        if (count < 20) {
          setTimeout(function() {
            check(count++);
          }, 100);
        } else {
          reject('Error: Player not ready.');
        }
      }
    }
    check(0);
  })
};
/**
 * Add event listener.
 * @function addEventListener
 * @param event
 * @param callBack
 */
Player.prototype.addEventListener = function(event, callBack) {
  this.player.addEventListener(event, callBack);
};
/**
 * Init player`s event.
 * @function
 */
Player.prototype.eventInit = function() {
  var self = this;
  //Format time
  var formatTime = function() {
    var seconds = self.player.currentTime;
    var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
    var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60))
    return m + ":" + s;
  };
  console.log([this.player]);
  //Play/stop
  this.options.controlPanel.btnPlay.bind('click', function() {
    if (self.player.paused) {
      self.play();
    } else {
      self.pause();
    }
  });
  //Time line
  this.options.controlPanel.progressBar.bind('click', function(e) {
    var width = e.currentTarget.clientWidth;
    var duration = self.player.duration;

    self.player.currentTime = (e.offsetX * duration) / width;
  });
  //Fullscreen
  this.options.controlPanel.btnFullScreen.bind('click', function() {
    self.fullScreen();
  });
  //Volume
  this.options.controlPanel.btnMute.bind('click', function() {
    self.toggleMute();
  });
  this.options.controlPanel.volumeProgerssBar.bind('click', function(e) {
    var width = e.currentTarget.clientWidth;
    self.player.volume = e.offsetX / width;
  });
  this.player.onvolumechange = function() {
    var volume = self.player.volume;
    self.options.controlPanel.volumeProgerssBarActive.css({width: (volume * 100) + '%'});
  };
  this.player.ontimeupdate = function() {
    var seconds = self.player.currentTime;
    var duration = self.player.duration;
    var percent = (seconds * 100) / duration;
    self.options.controlPanel.timerPanel.text(formatTime());
    self.options.controlPanel.progressBarActive.css({width: percent + '%'});
  };
  this.player.onplay = function() {
    var btnPlay = self.options.controlPanel.btnPlay;
    btnPlay.find('i').removeClass('fa-play').addClass('fa-pause');
  };
  this.player.onpause = function() {
    var btnPlay = self.options.controlPanel.btnPlay;
    btnPlay.find('i').removeClass('fa-pause').addClass('fa-play');
  };
};
/**
 * Init player.
 * @param options
 */
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
    .append(defaultOptions.controlPanel.volumeProgerssBar
      .append(defaultOptions.controlPanel.volumeProgerssBarActive)
  );

  defaultOptions.controlPanel.timeLinePanel = $('<div>')
    .addClass('js-video-control-timeline __sep-line')
    .append(defaultOptions.controlPanel.progressBar.append(defaultOptions.controlPanel.progressBarActive));
  defaultOptions.templateVideoWrapper = $('<div>').addClass('js-video-view');
  defaultOptions.templateWrapper = $('<div></div>').addClass('js-video');

  defaultOptions.templateControls = $('<div>')
    .addClass('js-video-control')
    .append(defaultOptions.controlPanel.btnPlay)
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
  $.fn.videoPlayer = function(options) {
    return this.map(function() {
      return new Player(this, options);
    });
  };
})(jQuery);
