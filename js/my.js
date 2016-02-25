$(document).ready(function() {
  $('#m2, #m3').videoPlayer();

  var player = $('#m1').videoPlayer();
  player = player[0];
  player.addEventListener('timeupdate', function() {
    console.log(player.getCurrentTime());
  });
});
