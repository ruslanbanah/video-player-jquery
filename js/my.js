$(document).ready(function() {

  $('#m2, #m3').videoPlayer();

  var player = $('#m1').videoPlayer();
  player = player[0];

  //For example
  player.addEventListener('timeUpdateOneSecond', function() {
    var time = player.getCurrentTimeSecond();
    switch(time){
      case 5: player.pause();
              if (confirm('Continue?')){
                player.play();
              }
          break;
      case 10: player.pause();
        if (confirm('Continue?')){
          player.play();
        }
        break;
      case 15: player.pause();
        if (confirm('Continue?')){
          player.play();
        }
        break;
    }
  });
});
