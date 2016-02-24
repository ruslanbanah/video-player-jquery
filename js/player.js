(function($) {
  $.fn.videoPlayer = function(options){
    var defaultOptions = {
      theme: 'theme-player-dark'
    };
    var options = $.extend(defaultOptions, options);
  console.log('start video player: ',options);
    return this.each(function() {
      var $video = $(this);

      var $video_wrap = $('<div></div>').addClass('video-player').addClass(options.theme);

      var $video_controls = $('<div></div>').addClass('video-player-controls');
      var $video_btn_play = $video_controls.append('<a title="Play/Pause"></a>').addClass('video-player-btn-play');
      var $video_seek = $video_controls.append('<div></div>').addClass('video-player-seek');
      var $video_timer = $video_controls.append('<div></div>').addClass('video-player-timer');
      var $video_volume_box = $video_controls.append('<div></div>').addClass('video-player-volume-box');

      var $volume_slider = $video_volume_box.append('<div></div>').addClass('video-volume-box-slider');
      var $volume_btn = $video_volume_box.append('<div></div>').addClass('video-volume-box-btn');

      $video.wrap($video_wrap);
      $video.after($video_controls);

      $video_controls.hide();

      var videoPlay = function() {
        if($video.attr('paused')){
          $video[0].play();
          console.log('Play.');
        }else{
          $video[0].pause();
          console.log('Pause.');
        }
      };

      $video_btn_play.click(videoPlay);
      $video.bind('play',function() {
        $video_btn_play.addClass('video-btn-pause');
      });
      $video.bind('puse, ended',function() {
        $video_btn_play.removeClass('video-btn-pause');
      });

      var initSeek = function() {
        if(!$video.attr('readyState')){
          setTimeout(initSeek, 150);
        }else{
          var video_duration = $video.attr('duration');
          $video_controls.show();
          $video_seek.slider({
            orientation: 'horizontal',
            animate: true,
            value: 0,
            max: video_duration,
            step: 0.01,
            stop: function(e, ui) {
              $video.attr('currentTime', ui.value);
            }
          });
        }
      };
      $video.removeAttr('controls');
    });
  }
})(jQuery);

