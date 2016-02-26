$(document).ready(function() {

  $('#m2, #m3').videoPlayer();

  var player = $('#m1').videoPlayer();
  player = player[0];

  //For example
  player.addEventListener('timeUpdateOneSecond', function() {
    var time = player.getCurrentTimeSecond();
    switch(time){
      case 5:
        console.log('5 seconds. This is advertising!');
        player.pause();
        setTimeout(function(){
                player.play();
              },3000);
          break;
      case 10:
        console.log('10 seconds. This is advertising!');
        player.pause();
        setTimeout(function(){
                player.play();
              },3000);
          break;
    }
  });
});
