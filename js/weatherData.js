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
    icon.src = updateIcon(data.currently.icon);

    let index;
    let nextDay;
    let nextMax;
    let nextMin;
    let nextIcon;

    for (let i = 0; i < 6; i++) {
      index = (day + i + 1) % 7;
      nextDay = document.getElementById('nextDay' + (i+1));
      nextMax = document.getElementById('nextMax' + (i+1));
      nextMin = document.getElementById('nextMin' + (i+1));
      nextIcon = document.getElementById('nextIcon' + (i+1));

      nextDay.innerHTML = days[index];
      nextMax.innerHTML = Math.round(data.daily.data[i].temperatureHigh) + '°F';
      nextMin.innerHTML = Math.round(data.daily.data[i].temperatureMin) + '°F';
      nextIcon.src = updateIcon(data.daily.data[i].icon);
    }

    let beanie = '<img height="70px" width="70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMXSURBVGhD7ZbLa9RQFMajC8FqBaELH0jpQjdabRX8G6zzEMSNrgQXUgVFXAq6ENFKGd+Zqd05JlPIoFLUosU2oyiV1iYt2EKRNhkt7tUiPtp4zvS0Jp072skk6RXzgw8m95x7zneSuZMRQkJCQirjdmaLkMy0CqLcWxB+TkqbKfqPIGaahaT8A8xbTuGadJSyOCclxeAJzBQPQcKYmGmibI5JZoaKzBdLo2xOuSFvYJhmK5VeT7s4JHW3nmmaJczlljapBkxOF5ku1rQgSmtpF6ck5R6G8YV6Rtkck+rYCb9MUwzzs8KYKDdSNt/UZntOr2jPfl84BK5tutdzktL4JTowWRXVDDGmGTNNb8athu5+q+6+atU9UAufcQ1jMd24deBVfiVt44u92kRDTDdHQNZiFNXNt7Hh99tpOx/Eh8w43OkvLMN/Ejy9z3HNiFCZpQXMHI/qxk+W0cUI90YH88eo3NIAJs6yzLlRVDPPUNlggebNC814oGYqHwwxfWJ/JV+nUsKaeN6ojb9EtPxu+Bp8YxnxRJr5NTJs7qJ2/rCnb2wNHO53TAOeyhiLj45WU1vvKbzsmI19kGZeo7beEtcnGv04F6WEvfAlS+29A97ED1kNfZVmdFJ7b4gMju+Y/Y/EaOanoGdEz28jG5UDZ+Mqs1EgMhJkozLOWdZyOHgf2U38F5yVSfRAdtyzbyhfz2oQqDRzK9lxDzzaI8ziQUozD5Md98CvVQuzeIACD5fIjnvgbrSzigcq8EB23AOFpKLCwUsiOy6wrGVCVj20rqt/rPbpoFUjd1mr2zrmhde4PqeNnS8d8ep2xRFH4Zo9B/fY46V6oAdB6T1Y8FQ2yvNTQjZnzetm2hLOX/ktvLbH04+d8QvXnXEUrtlzcI89/rceinqC3JWBkut2FOFiEPBUNtncC0cRHgZBT2UTDkIKB7HFvRlEVR1FuBgEPJWNkmtxFOFhEEW9SO7K4M6TVXAHEqDXoAFBlD8Il8WpeeE1rs8p/WjEEW9t++SIo3DNnoN77PHSPfpACaFzoIrchYSE/J8Iwi/aWUnJShx0aQAAAABJRU5ErkJggg==">';
    let shoes1 = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let shorts = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let jeans1 = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let tshirt = '<img height="70px" width="70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASMSURBVGhD3Zpbb1RVFMfH6IO+iL4YfVbxA/gBeAE6F7VyM0SIIPCmL8b45IMxJsaYEKnM3tMit5RY2hIKw620+0yn06mlMtPSBGakpa0tUO7lJipvi7UOe6A9s87p6VxP5p/80nbO3nv919ln9tmX+sqlus7GtwJq59JQj3yfoN/pM33Zmwol5esBJdcElQjjz3RAiYdBQ4IND4KGSGHZncFusXq5alqim6mSAF4Idcs6NN6O5h5bzC6Gx9SGPyZWUpu69cqI7mTAkOcYU0UihoMqXK/DlE/0nAcMoXgTJUTJrlB35F0dtrTyK7kFk/iXDVwGnsYKb9bhi9ey+HcvYZfv4YJVAkyoaV17+4vaTmFaO7D9FRyBolyASkIelsX3vaxtLU50F7yQRA7yUlDPVPNxskdIbc+dsMJWviFn1id2w7r4LvbaXDYn98PGxD722kJgz3ymbTpLD7GuRqdNffvhx6Hj0DF2BrIzY3Bv9hr0/z0MP6U72PIhZMdwFDIzF82yUzcn4fRECraPdMLWZDNbh+HRynj4HW3XXk7viU96f4Pv01E4PDoAY9fHTTMcI1eycOKvPvhq4HeojzXCmp4m+HawDY7hZ+MO9cavT5g35YehKMbazXog8GXcqe3yChmRVVxFupPpqXMwe2eGNcBxF8umps9DYiINycm0mRxXzg6q35aJ53nJEYrJj7Rti3Ce4zTtuHI1wwYsJ72j/awXgian2vl84RzHz1XIkcUeuTfrvkeK5cbtaTie7WG95DAnmlbpWSxbgYheTMCdW1Ns0HKQmhqBn9NHWC9zaNX2n6o+/str+KHjVPzrwVa4eeMSG7Qc9I6fgc/7nIdovPn/+U81vKrTwAmhEV7LFbQyffUCG7QU3LX83TOaZD3kMXfaTys7tpCFLvzyJbDLI+cVfDnQAmcvly6xA9mE2Sa1HZ8chgZ833AerOAA9atOw3yTp7hCCzGIwytnqhCaMwk2xkLgm/5PnQZ90R3X2LZ4IRHkgZlEMB5+k7noCo8kAiu65Bu+uph8j7voBq8kQvNDH+05cRfd4JVEKIfaSaRmHq2a+bKbI5e5jckXcsIbiYj7ZhKkmnkhup2iWPFEIoZo0GlgIt1iNVdoIbyQyLyVojmNV+J/rqAT1U6ENknmTeNJ+GEbV9iJqieixEFt/7norIMr7ET1eySyQtufI9p8UHKIq2BHdRMRKe08X3bbQXZUMxG86R9o27zokIWryFHKRPZmnHdM5qHESW3XXrQd6XbLtBmXp5ypxUIbf98MHmJj5KHkP/5Y49varrNCSm5iG2HY1n8AvvijpSg+Texl2+YRG7VNd8IKkm+oiuAMRNtzr5o56CHRcVfAkEe5hisJJtFR8NFbTmbPGKKJC1AR8HEquCc40VExNvwoL1C5oNFJRTbo8KUVDXvYO6fZwKUE3xOuh9hiRFNnOp9gTRQBtek3xIc6TOVE5xNooJV2xa2m3EJ1kRZ+Alhh0ZoAH7mPkQY0d5bW0VbDzxH3aXlKZaln89YTXhPtbNA/xtCekwn+/my3o+Ty+Z4AzN/5CveQKRIAAAAASUVORK5CYII=">';
    let hoodie = '<img height="70px" width="70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAeCSURBVGhDzVpZc1RFFI6lD/ri8mLps9sP8De4PLjrm5ZaWoWKUEWZ+AARSCTIpkACRBERRYuEAUICIZk7EzKQdfaZhMxMcicUJb8AZNG39nx3umf63jl3mSRETtVXTLr7nnO+231On+5L072SYnH46eLV6POlReNFAL/RJrvvT5n9a/CJkhl9t2RGDs6bkfR8OfI3QXAolSM3500jRThQXIi8c/Vq9DGp5v8RIcQD5NQr5FyI/v3X6XBQyGdDRdN4GTql+tURvElyIOd0yons/Ig4kZsQvflJkVkYYcfoKJWN7Hw5+qY0c+/EWvNlI8o54YQxd1m0TWfEN1NZC/gdoTZuLAOjsBh5TppdWSmZ4U9o/d9hjNYhMndJbJnOimYjJtYPDFloiVDbVEaMFC6xz9SBbJUWjI+l+eVLLBZ7iBQfrTPkghQtp/bptFjXPyjW9IRsWH9uSLTH0yIXYJlVYUYOCxF6ULqzNLl+feoRyi4DrAEX/JKZppkYrSOh0DIyJo5np9hnXUE+XLsWe1i61ZjgLTRKIk9vGktq7Zl+lgSw7ux5K14KZpTV4QryZUkzQw8HXk4KYQrm1smMWNN7iiUBfHbytBX8Y8VRVocXKNF0S/eCCbH/lFPkhzMz42LjeJIloANkQZrT4YeFcvRD6aa3IMUGzU5OnCYirZNp1vkqaLYwI0slQrg9Vw4/K911l6D7BIeB2THLSb8YwZiLQdMwg5JpDEt3eVlYNN7mHgyKKO0fcLKZ9gyOBPA1ZS2MmSo1HiM6qLJ4Q7ptF1k7+ZYdXsD+sJmchKNf9g3UkVg3cMHqa6ONkWyxOgKDilPpul2oxnmVfSAAkEqjtOaP56bEdtrw4OzGsaT4PNRXJbH2dL/YNJGy+nYk0lY8jRdjyyKEQlO6XxPqCDkH+gEEQjMTYptWUwGYlc2TKbFhKFol0hwepbYKSR27iFTf7PiSCNGxoVe6XxHaNR8nRQ2X4sdzk3WOKXTlCqJ1LFEhQplq03hKHMoX2LHAHzSbnA0vUNDfNc2hRyUNFITGe9xAL6QXLlbjgcOu1KyFL06dteJlWzwv9mXm2LHAFkKGdHK2vKGV/dbJjh3';

  let item1 = document.getElementById('item1');
  let item2 = document.getElementById('item2');
  let item3 = document.getElementById('item3');
  let item4 = document.getElementById('item4');
  item1.innerHTML = beanie;
  item2.innerHTML = tshirt;
  item3.innerHTML = shorts;
  item4.innerHTML = shoes1;

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
      $.ajax({
        type: 'POST',
        url: 'py/bingo.py',
        data: {"param": "lol"},
        dataType: 'text',
        success: function(res) {
          output = res;
          alert(output);
        }
      })

      console.log('you sucks tobi');
    }
  });


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
