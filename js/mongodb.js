$(document).ready(function() {

  function render(data) {
    let temp = document.getElementById();
  }

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
      render(data);
    },
    failure: function(err) {
      console.log('you sucks tobi');
    }
  });
  

}

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
