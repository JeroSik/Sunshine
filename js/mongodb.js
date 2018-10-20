/* function getLocation(callback) {

  let status = document.getElementById("status");

  if (navigator.geolocation) {
    console.log(navigator.geolocation.getCurrentPosition(callback));
  } else {
    status.innerHTML = "Location not supported by this browser.";
  }
}

getLocation((postion) => {
  status.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
});
*/

let darksky = 'https://api.darksky.net/forecast/';
let key = 'bf3559fca2202670fd98af01a08f00b8';
let lat = 40.429048;
let lng = -86.921162;
let url = darksky + key + '/' + lat + ',' + lng;
console.log(url);
url = url.concat('?units=ca');

$.ajax({
  url: url,
  dataType: 'jsonp',
  success: function(data) {
    console.log(data);
  },
  failure: function(err) {
    console.log('you sucks tobi');
  }
});
/*
let options = {
  method: 'GET',
  mode: 'no-cors'
}
let req = new Request(uri, options);

fetch(req)
  .then((res) => { if (res.ok) {
      return res.json();
    } else {
      console.log(res);
      throw new Error('Bad HTTP!')
    }
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
  });

/*
$(document).ready(function() {

  /*
  let key = '578ad584ea51a8fa4723b99b6c4d06ca';
  let coords = 'lat=40.429048&lon=-86.921162';

  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?lat=40.429048&lon=-86.921162&APPID=' + key,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      console.log(data);
    }
  })

  let key = 'https://api.darksky.net/forecast/bf3559fca2202670fd98af01a08f00b8/40.429048,-86.921162';

  $.ajax({
    url: key,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      console.log(data);
    }
  })
*/

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

//});
/*
<script src="https://s3.amazonaws.com/stitch-sdks/js/bundles/4.0.8/stitch.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/mongodb.js"></script>
*/
