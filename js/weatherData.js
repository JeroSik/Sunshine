$(document).ready(function() {

  function render(data) {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let today = new Date();
    console.log(today);
    let day = today.getDay();
    let month = today.getMonth();
    let date = today.getDate();
    let thisCity = data.timezone.split('/')[2];

    let currDay = document.getElementById('currDay');
    let currTemp = document.getElementById('currTemp');
    let currDate = document.getElementById('currDate');
    let city = document.getElementById('city');
    let summary = document.getElementById('summary');
    let icon = document.getElementById('currIcon');

    currDay.innerHTML = days[day];
    currTemp.innerHTML = Math.floor(data.currently.temperature) + '°F';
    currDate.innerHTML = date + ' ' + months[month];
    city.innerHTML = thisCity;
    summary.innerHTML = data.currently.summary;
    icon.src = updateIcon();

    let index;
    let nextDay;
    let nextMax;
    let nextMin;

    for (let i = 0; i < 6; i++) {
      index = (day + i + 1) % 7;
      nextDay = document.getElementById('nextDay' + (i+1));
      nextMax = document.getElementById('nextMax' + (i+1));
      nextMin = document.getElementById('nextMin' + (i+1));

      nextDay.innerHTML = days[index];
      nextMax.innerHTML = Math.round(data.daily.data[i].temperatureHigh) + '°F';
      nextMin.innerHTML = Math.round(data.daily.data[i].temperatureMin) + '°F';

    }
  }

  let darksky = 'https://api.darksky.net/forecast/';
  let key = 'bf3559fca2202670fd98af01a08f00b8';
  let lat = 40.429048;
  let lng = -86.921162;
  let url = darksky + key + '/' + lat + ',' + lng;
  console.log(url);
  url = url.concat('?units=us');

  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(data) {
      console.log(data);
      render(data);
    },
    failure: function(err) {
      console.log('you sucks tobi');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://localhost/py/bingo.py',
    data: {"param": "lol"},
    dataType: 'text',
    success: function(res) {
      output = res;
      alert(output);
    }
  })

})

/*

const client = stitch.Stitch.initializeDefaultAppClient('weatherwear-lhpvt');
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('owm');

client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
  db.collection('WeatherData').updateOne({owner_id: client.auth.user.id}, {$set:{number:42}}, {upsert:true})
).then(() =>
  db.collection('WeatherData').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
).then(docs => {
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
});

})

*/


/*
<script src="https://s3.amazonaws.com/stitch-sdks/js/bundles/4.0.8/stitch.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/mongodb.js"></script>
*/
