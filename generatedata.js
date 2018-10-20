$(document).ready(function() {
  var output = []; 
  var feel = 0;

  for (let i = 0; i < 1000; i++) {
    var temp = Math.random() * 100;
    var humid = Math.random();
    var wind = Math.random() * 20;
      if (temp > 90) 
        feel += 5;
      else if (temp > 85)
        feel += 4;
      else if (temp > 60)
        feel += 3;
      else if (temp > 30)
        feel += 2;
      else if (temp > 10)
        feel += 1;
      
      if (humid > .4)
        feel += 1;

      if (wind > 10)
        feel -= 1;

      var obj = { "temperature": temp, "humid": humid, "wind": wind, "feel": feel };
      output.push(obj);
      feel = 0;
  }

  document.getElementById("data").innerHTML = JSON.stringify(output);
})
