$(document).ready(function() {
  var output = []; 
  var feel = 0;

  for (let i = 0; i < 50; i++) {
    //var temp = Math.random() * 100;
    var wind = Math.random() * 20;
      if (wind > 50) 
        feel = 0;
      else if (wind > 25)
        feel = 1;
      else if (wind > 15)
        feel = 2;
      else if (wind > 10)
        feel = 3;
      else if (wind > 6)
        feel = 4;
      else if (wind > 3)
        feel = 5;
      else
        feel = 6;

      var obj = { "wind": wind, "feel": feel };
      output.push(obj);
      feel = 0;
  }

  document.getElementById("data").innerHTML = JSON.stringify(output);
})
