$(document).ready(function() {
  
  const client = stitch.Stitch.initializeDefaultAppClient('weatherwear-lhpvt');

  function createModel(data) {
    //data[i].temp data[i].humi data[i].wind data[i].res
    let wb = { tempA: 0, tempB: 0, humiA: 0, humiB: 0, windA: 0, windB: 0};

    let t = t_init(data);
    let h = h_init(data);
    let w = w_init(data);
    
    console.log(t.a);
 
    wb.tempA = t.a;
    wb.tempB = t.b;
    wb.humiA = h.a;
    wb.humiB = h.b;
    wb.windA = w.a;
    wb.windB = w.b;
 
    return wb;
  }

  function getRec(data, wb) {
    let rec = 0;
    console.log(JSON.stringify(wb));
    let temp_res = wb.tempA * data.temp + wb.tempB;
    let humid_res = wb.humiA * data.humi + wb.humiB;
    let wind_res = wb.windA * data.wind + wb.windB;
 
    rec = (temp_res + humid_res + wind_res) / 3;

    return rec;
  }
  
  function getWb(callback) {
    let wb = undefined;
    client.auth.loginWithCredential(new stitch.AnonymousCredential())
    .then(user => {
      let db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather');
      console.log(db);
      db.collection('wb').find().asArray().then(result => {
        let wb = result[0];
        if (true) {
          client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather').collection('rec').find().asArray().then(data => {
            
 
          wb = { tempA: 0, tempB: 0, humiA: 0, humiB: 0, windA: 0, windB: 0}
          //train data then store to wb
          wb = createModel(data);

          callback(wb);
          });
        }

      });
 
    });
  }

  function render(data, wb) {

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
    let iconNum;
    let noti = data.currently.icon;
    if (noti == 'rain') {
        iconNum = 14;
      } else if (noti == 'tornado') {
        iconNum = 8;
      } else if (noti == 'partly-cloudy-day') {
        iconNum = 3;
      } else if (noti == 'partly-cloudy-night' || noti == 'cloudy') {
        iconNum = 5;
      } else if (noti == 'clear-day') {
        iconNum = 1;
      } else if (noti == 'thunderstorm') {
        iconNum = 1;
      } else {
        iconNum = 5;
      }
    icon.innerHTML = '<img src="images/icons/icon-' + iconNum+ '.svg" alt="" width=90>';

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

      if (data.daily.data[i].icon == 'rain') {
        iconNum = 14;
      } else if (data.daily.data[i].icon == 'tornado') {
        iconNum = 8;
      } else if (data.daily.data[i].icon == 'partly-cloudy-day') {
        iconNum = 3;
      } else if (data.daily.data[i].icon == 'partly-cloudy-night' || data.daily.data[i].icon == 'cloudy') {
        iconNum = 5;
      } else if (data.daily.data[i].icon == 'clear-day') {
        iconNum = 1;
      } else if (data.daily.data[i].icon == 'thunderstorm') {
        iconNum = 1;
      } else {
        iconNum = 5;
      }
      nextIcon.innerHTML = '<img src="images/icons/icon-' + iconNum + '.svg" alt="" width=48>';
    }

    let beanie = '<img height="70px" width="70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMXSURBVGhD7ZbLa9RQFMajC8FqBaELH0jpQjdabRX8G6zzEMSNrgQXUgVFXAq6ENFKGd+Zqd05JlPIoFLUosU2oyiV1iYt2EKRNhkt7tUiPtp4zvS0Jp072skk6RXzgw8m95x7zneSuZMRQkJCQirjdmaLkMy0CqLcWxB+TkqbKfqPIGaahaT8A8xbTuGadJSyOCclxeAJzBQPQcKYmGmibI5JZoaKzBdLo2xOuSFvYJhmK5VeT7s4JHW3nmmaJczlljapBkxOF5ku1rQgSmtpF6ck5R6G8YV6Rtkck+rYCb9MUwzzs8KYKDdSNt/UZntOr2jPfl84BK5tutdzktL4JTowWRXVDDGmGTNNb8athu5+q+6+atU9UAufcQ1jMd24deBVfiVt44u92kRDTDdHQNZiFNXNt7Hh99tpOx/Eh8w43OkvLMN/Ejy9z3HNiFCZpQXMHI/qxk+W0cUI90YH88eo3NIAJs6yzLlRVDPPUNlggebNC814oGYqHwwxfWJ/JV+nUsKaeN6ojb9EtPxu+Bp8YxnxRJr5NTJs7qJ2/rCnb2wNHO53TAOeyhiLj45WU1vvKbzsmI19kGZeo7beEtcnGv04F6WEvfAlS+29A97ED1kNfZVmdFJ7b4gMju+Y/Y/EaOanoGdEz28jG5UDZ+Mqs1EgMhJkozLOWdZyOHgf2U38F5yVSfRAdtyzbyhfz2oQqDRzK9lxDzzaI8ziQUozD5Md98CvVQuzeIACD5fIjnvgbrSzigcq8EB23AOFpKLCwUsiOy6wrGVCVj20rqt/rPbpoFUjd1mr2zrmhde4PqeNnS8d8ep2xRFH4Zo9B/fY46V6oAdB6T1Y8FQ2yvNTQjZnzetm2hLOX/ktvLbH04+d8QvXnXEUrtlzcI89/rceinqC3JWBkut2FOFiEPBUNtncC0cRHgZBT2UTDkIKB7HFvRlEVR1FuBgEPJWNkmtxFOFhEEW9SO7K4M6TVXAHEqDXoAFBlD8Il8WpeeE1rs8p/WjEEW9t++SIo3DNnoN77PHSPfpACaFzoIrchYSE/J8Iwi/aWUnJShx0aQAAAABJRU5ErkJggg==">';
    let shoes1 = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let shorts = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let jeans1 = '<img height="70px" width="70px" src="data:image/png;base64,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">';
    let tshirt = '<img height="70px" width="70px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASMSURBVGhD3Zpbb1RVFMfH6IO+iL4YfVbxA/gBeAE6F7VyM0SIIPCmL8b45IMxJsaYEKnM3tMit5RY2hIKw620+0yn06mlMtPSBGakpa0tUO7lJipvi7UOe6A9s87p6VxP5p/80nbO3nv919ln9tmX+sqlus7GtwJq59JQj3yfoN/pM33Zmwol5esBJdcElQjjz3RAiYdBQ4IND4KGSGHZncFusXq5alqim6mSAF4Idcs6NN6O5h5bzC6Gx9SGPyZWUpu69cqI7mTAkOcYU0UihoMqXK/DlE/0nAcMoXgTJUTJrlB35F0dtrTyK7kFk/iXDVwGnsYKb9bhi9ey+HcvYZfv4YJVAkyoaV17+4vaTmFaO7D9FRyBolyASkIelsX3vaxtLU50F7yQRA7yUlDPVPNxskdIbc+dsMJWviFn1id2w7r4LvbaXDYn98PGxD722kJgz3ymbTpLD7GuRqdNffvhx6Hj0DF2BrIzY3Bv9hr0/z0MP6U72PIhZMdwFDIzF82yUzcn4fRECraPdMLWZDNbh+HRynj4HW3XXk7viU96f4Pv01E4PDoAY9fHTTMcI1eycOKvPvhq4HeojzXCmp4m+HawDY7hZ+MO9cavT5g35YehKMbazXog8GXcqe3yChmRVVxFupPpqXMwe2eGNcBxF8umps9DYiINycm0mRxXzg6q35aJ53nJEYrJj7Rti3Ce4zTtuHI1wwYsJ72j/awXgian2vl84RzHz1XIkcUeuTfrvkeK5cbtaTie7WG95DAnmlbpWSxbgYheTMCdW1Ns0HKQmhqBn9NHWC9zaNX2n6o+/str+KHjVPzrwVa4eeMSG7Qc9I6fgc/7nIdovPn/+U81vKrTwAmhEV7LFbQyffUCG7QU3LX83TOaZD3kMXfaTys7tpCFLvzyJbDLI+cVfDnQAmcvly6xA9mE2Sa1HZ8chgZ833AerOAA9atOw3yTp7hCCzGIwytnqhCaMwk2xkLgm/5PnQZ90R3X2LZ4IRHkgZlEMB5+k7noCo8kAiu65Bu+uph8j7voBq8kQvNDH+05cRfd4JVEKIfaSaRmHq2a+bKbI5e5jckXcsIbiYj7ZhKkmnkhup2iWPFEIoZo0GlgIt1iNVdoIbyQyLyVojmNV+J/rqAT1U6ENknmTeNJ+GEbV9iJqieixEFt/7norIMr7ET1eySyQtufI9p8UHKIq2BHdRMRKe08X3bbQXZUMxG86R9o27zokIWryFHKRPZmnHdM5qHESW3XXrQd6XbLtBmXp5ypxUIbf98MHmJj5KHkP/5Y49varrNCSm5iG2HY1n8AvvijpSg+Texl2+YRG7VNd8IKkm+oiuAMRNtzr5o56CHRcVfAkEe5hisJJtFR8NFbTmbPGKKJC1AR8HEquCc40VExNvwoL1C5oNFJRTbo8KUVDXvYO6fZwKUE3xOuh9hiRFNnOp9gTRQBtek3xIc6TOVE5xNooJV2xa2m3EJ1kRZ+Alhh0ZoAH7mPkQY0d5bW0VbDzxH3aXlKZaln89YTXhPtbNA/xtCekwn+/my3o+Ty+Z4AzN/5CveQKRIAAAAASUVORK5CYII=">';
    let hoodie = '<img height="70px" width="70px" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTYuMTgyIDQ5Ni4xODIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5Ni4xODIgNDk2LjE4MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiMzMzcxODA7IiBkPSJNMjQ4LjA5NCwwQzExMS4wNzQsMCwwLDExMS4wNjMsMCwyNDguMDkxYzAsMTM3LjAxMiwxMTEuMDc0LDI0OC4wOTEsMjQ4LjA5NCwyNDguMDkxICBjMTM3LjAxMiwwLDI0OC4wODgtMTExLjA3OSwyNDguMDg4LTI0OC4wOTFDNDk2LjE4MiwxMTEuMDYzLDM4NS4xMDYsMCwyNDguMDk0LDB6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNENEQ4RDg7IiBkPSJNMjQ3Ljc1NiwxMTEuMDc2Yy0zMy43NzksMC01NC45NDctMjAuODE0LTU0Ljk4Ni0yMC44NTRjMC4wNzksMC4xODMsMzkuMTkxLDg5Ljg1Myw1NC45ODYsODkuODUzICBjMTUuNzkzLDAsNTQuOTA3LTg5LjY3LDU0Ljk4Ni04OS44NTNDMzAyLjcwMyw5MC4yNjEsMjgxLjUzMywxMTEuMDc2LDI0Ny43NTYsMTExLjA3NnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0yNDYuMDM3LDcxLjEzM2MtNDIsMC02MC4yNSw1LjI1LTYwLjI1LDUuMjV2NDIuNzVoMTIydi00Mi43NSAgQzMwNy43ODcsNzYuMzgzLDI4OC4wMzcsNzEuMTMzLDI0Ni4wMzcsNzEuMTMzeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRDREOEQ4OyIgZD0iTTI0Ni4wMzcsOTkuMTMzYy00MiwwLTYwLjI1LDUuMjUtNjAuMjUsNS4yNXY0Mi43NWgxMjJ2LTQyLjc1ICBDMzA3Ljc4NywxMDQuMzgzLDI4OC4wMzcsOTkuMTMzLDI0Ni4wMzcsOTkuMTMzeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRUFFQUVBOyIgZD0iTTQwNi41NDEsMjQwLjQwOWMtNC4yOTEtMjYtMTYuNzM2LTYwLjA2My00Ni43MzYtMTE5LjMxMWMtOC40NDktMTYuNjg4LTU3LjA2MS0zMC44NzktNTcuMDYxLTMwLjg3OSAgbC0wLjAwMiwwLjAwNGwwLjAwMi0wLjAwMWMwLDAtMzYuNTg4LDk4LjMyNy01NS4yNzIsOTguMzI3cy01NC43MDQtOTguMzI4LTU0LjcwNC05OC4zMjhsMC4wMDIsMC4wMDFsLTAuMDAyLTAuMDA0ICBjMCwwLTQ4LjgxMSwxNC4xLTU3LjA2MiwzMC44NzljLTI3LjIzNCw1NS4zODUtNDIuNDQ1LDkzLjMxMS00Ni43MzUsMTE5LjMxMWMtNC4yOTEsMjYsMy40MDIsMTU1LjY2NywzLjQwMiwxNTUuNjY3ICBzNy41MTYsMC4yNSwxNi4wMTYtMS41czExLjk4NC02LjUsMTEuOTg0LTYuNXMyLjMwNy0xMjIuMzMzLDUuOTgzLTEzNy42NjdzMzAuNjkyLTU0Ljc4OCwzMC42OTItNTQuNzg4bDEyLjg4MiwxMDEuNDU0bC0xNi4zODIsMTExICBjMCwxMy41LDE3LjIxOCwxNi44NDYsMzguNDY1LDE2Ljg0NmgxMTEuNDgzYzIxLjI0NywwLDM4LjQ2Ni0zLjM0NiwzOC40NjYtMTYuODQ2bC0xNi4zODMtMTExbDEyLjg4My0xMDEuNDU0ICBjMCwwLDI3LjAxNSwzOS40NTUsMzAuNjkxLDU0Ljc4OGMzLjY3OCwxNS4zMzMsNS45ODQsMTM3LjY2Nyw1Ljk4NCwxMzcuNjY3czIuNzUsMy41LDExLjI1LDYuNXMxNi43NSwxLjUsMTYuNzUsMS41ICBTNDEwLjgzMiwyNjYuNDA5LDQwNi41NDEsMjQwLjQwOXoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjlGOUY5OyIgZD0iTTQwNi41NjQsMzcwLjMxM2MwLDAtMzEuMjg0LTcuNjQ3LTM0LjA2NS02LjI1N2MwLDAtMS4zOTEsMTUuMjk1LTEuMzkxLDIyLjI0NyAgIGMwLDAsNi4yNTgsMTUuOTksMzYuODQ3LDEzLjkwNUM0MDcuOTU0LDQwMC4yMDksNDEwLjAzOSwzNzIuMzk5LDQwNi41NjQsMzcwLjMxM3oiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGOUY5Rjk7IiBkPSJNMTIzLjY4NCwzNjQuMDU2Yy0yLjc4MS0xLjM5MS0zNC4wNjUsNi4yNTctMzQuMDY1LDYuMjU3Yy0zLjQ3NiwyLjA4Ni0xLjM5MSwyOS44OTYtMS4zOTEsMjkuODk2ICAgYzMwLjU4OSwyLjA4NSwzNi44NDctMTMuOTA1LDM2Ljg0Ny0xMy45MDVDMTI1LjA3NCwzNzkuMzUxLDEyMy42ODQsMzY0LjA1NiwxMjMuNjg0LDM2NC4wNTZ6Ii8+CjwvZz4KPGc+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMzc5LjI2MSIgY3k9IjM1OC40ODEiIHI9IjEuOTcxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMzc4Ljk4MSIgY3k9IjM1MC44ODEiIHI9IjEuOTcxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMzc4LjcwMSIgY3k9IjM0My41NjEiIHI9IjEuOTcxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMTE3LjMxMSIgY3k9IjM1OC40ODEiIHI9IjEuOTcxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMTE3LjU5MSIgY3k9IjM1MC44ODEiIHI9IjEuOTcxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNEM0QzRDM7IiBjeD0iMTE3Ljg3MSIgY3k9IjM0My41NjEiIHI9IjEuOTcxIi8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMDAuODM4LDkwLjIxOGwtMC4wMDIsMC4wMDRjLTAuMDY5LDAuMTYxLTYwLjc0LDk5LjQ5NC02MC43NCw5OS40OTR2MjM1LjMzM2gxMy4xMTEgIGMwLDAsMC0yMjUuNjY3LDAtMjMwLjk0N3M0NC44OTEtNjkuMjIzLDU5LjMwMy0xMDAuMDY2QzMwNS42NTMsOTEuNjA5LDMwMC44MzgsOTAuMjE4LDMwMC44MzgsOTAuMjE4eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjlGOUY5OyIgZD0iTTE5MC4yODcsOTEuMTMzYzAsMC0yLjMzNCwwLjQ3Ny05LjE5MSwyLjkwNGMxNC40MTIsMzAuODQzLDU5LjMwMyw5NC43ODYsNTkuMzAzLDEwMC4wNjYgIHMwLDIzMC45NDcsMCwyMzAuOTQ3aDEzLjExMVYxODkuNzE2QzI1My41MSwxODkuNzE2LDE5MC4zNTcsOTEuMjkzLDE5MC4yODcsOTEuMTMzeiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMTkzLjUzNyw4OS42MzNsLTQsMC43NWMwLDAtMy4wODQsMS4yMjctOS45NDEsMy42NTRjMTQuNDEyLDMwLjg0Myw1OS4zMDMsOTQuNzg2LDU5LjMwMywxMDAuMDY2ICAgczAsMjMwLjk0NywwLDIzMC45NDdoMTMuMTExVjE4OS43MTZDMjUyLjAxLDE4OS43MTYsMTkzLjYwNyw4OS43OTMsMTkzLjUzNyw4OS42MzN6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTE5Mi43NjgsOTAuMjE4bC02Ljk4LTEzLjgzNmMwLDAtMTEsMjMtMzAuNSw0MC41bDM3LTFsMjQuMjUsMTMuMjVMMTkyLjc2OCw5MC4yMTh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTMwNy43ODcsNzYuMzgzbC02Ljk4LDEzLjgzNmwtMjMuNzcsMzguOTE0bDI0LjI1LTEzLjI1bDM3LDEgICBDMzE4Ljc4Nyw5OS4zODMsMzA3Ljc4Nyw3Ni4zODMsMzA3Ljc4Nyw3Ni4zODN6Ii8+CjwvZz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRURFREVEOyIgY3g9IjI0NS4zMzEiIGN5PSIxOTAuMDExIiByPSI0LjE2NiIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDMuNjMxIiBjeT0iMTg4LjQ4MSIgcj0iMC45MjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDcuMDMxIiBjeT0iMTg4LjQ4MSIgcj0iMC45MjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDMuNjMxIiBjeT0iMTkxLjM3MSIgcj0iMC45MjEiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDcuMDMxIiBjeT0iMTkxLjM3MSIgcj0iMC45MjEiLz4KPC9nPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFREVERUQ7IiBjeD0iMjQ1LjMzMSIgY3k9IjIzNC43MTEiIHI9IjQuMTY2Ii8+CjxnPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0My42MzEiIGN5PSIyMzMuMTkxIiByPSIwLjkyMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0Ny4wMzEiIGN5PSIyMzMuMTkxIiByPSIwLjkyMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0My42MzEiIGN5PSIyMzYuMDgxIiByPSIwLjkyMSIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0Ny4wMzEiIGN5PSIyMzYuMDgxIiByPSIwLjkyMSIvPgo8L2c+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0VERURFRDsiIGN4PSIyNDUuMzMxIiBjeT0iMjc5LjQyMSIgcj0iNC4xNjciLz4KPGc+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQzLjYzMSIgY3k9IjI3Ny45MDEiIHI9IjAuOTIyIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQ3LjAzMSIgY3k9IjI3Ny45MDEiIHI9IjAuOTIyIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQzLjYzMSIgY3k9IjI4MC43ODEiIHI9IjAuOTIxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQ3LjAzMSIgY3k9IjI4MC43ODEiIHI9IjAuOTIxIi8+CjwvZz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRURFREVEOyIgY3g9IjI0NS4zMzEiIGN5PSIzMjQuMTMxIiByPSI0LjE2NiIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDMuNjMxIiBjeT0iMzIyLjYxMSIgcj0iMC45MjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDcuMDMxIiBjeT0iMzIyLjYxMSIgcj0iMC45MjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDMuNjMxIiBjeT0iMzI1LjQ5MSIgcj0iMC45MjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0UwRTBFMDsiIGN4PSIyNDcuMDMxIiBjeT0iMzI1LjQ5MSIgcj0iMC45MjIiLz4KPC9nPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFREVERUQ7IiBjeD0iMjQ1LjMzMSIgY3k9IjM2OC44NDEiIHI9IjQuMTY2Ii8+CjxnPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0My42MzEiIGN5PSIzNjcuMzIxIiByPSIwLjkyMSIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0Ny4wMzEiIGN5PSIzNjcuMzIxIiByPSIwLjkyMSIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0My42MzEiIGN5PSIzNzAuMjAxIiByPSIwLjkyMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTBFMEUwOyIgY3g9IjI0Ny4wMzEiIGN5PSIzNzAuMjAxIiByPSIwLjkyMiIvPgo8L2c+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0VERURFRDsiIGN4PSIyNDUuMzMxIiBjeT0iNDEzLjU1MSIgcj0iNC4xNjYiLz4KPGc+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQzLjYzMSIgY3k9IjQxMi4wMjEiIHI9IjAuOTIxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQ3LjAzMSIgY3k9IjQxMi4wMjEiIHI9IjAuOTIxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQzLjYzMSIgY3k9IjQxNC45MTEiIHI9IjAuOTIxIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFMEUwRTA7IiBjeD0iMjQ3LjAzMSIgY3k9IjQxNC45MTEiIHI9IjAuOTIxIi8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRDREOEQ4OyIgZD0iTTE1Ny4zNzMsMTc3LjA3NWMtMC4yNS03Ljc1LTMuMzM0LTI2LTMuMzM0LTI2cy0xLDI5LDIuODU3LDQ0LjU0NiAgIEMxNTYuODk3LDE5NS42MjEsMTU3LjYyMywxODQuODI1LDE1Ny4zNzMsMTc3LjA3NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNENEQ4RDg7IiBkPSJNMzQxLjQ3MiwxNTEuMDc1YzAsMC0zLjA4MywxOC4yNS0zLjMzMywyNnMwLjQ3NywxOC41NDYsMC40NzcsMTguNTQ2ICAgQzM0Mi40NzIsMTgwLjA3NSwzNDEuNDcyLDE1MS4wNzUsMzQxLjQ3MiwxNTEuMDc1eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />';

    let rec = getRec({temp: data.currently.temperature, humi: data.currently.humidity, wind: data.currently.windSpeed}, wb);
    
    
    let item1 = document.getElementById('item1');
    let item2 = document.getElementById('item2');
    let item3 = document.getElementById('item3');
    let item4 = document.getElementById('item4');
    
    item1.innerHTML = beanie;
    item2.innerHTML = hoodie;
    item3.innerHTML = shorts;
    item4.innerHTML = shoes1;

    let record = {
      temp: data.currently.temperature, // add temp,
      wind: data.currently.windSpeed, // add wind,
      humi: data.currently.humidity, // add humi,
      rec: rec,
      altered: 0,
     time: data.currently.time
    }


    //const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather');

    client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user => {
      client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather').collection('last').deleteOne({});
    }).then(() => {
      client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather').collection('last').insertOne(record);
    }).then(docs => {
      client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('weather').collection('rec').insertOne(record);
    }).catch(err => {
      console.error(err)
    });

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
      getWb(function(wb) {
        render(data, wb);
      })
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
<script src="https://s3.amazonaws.com/stitch-sdks/js/bundles/4.0.8/stitch.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/mongodb.js"></script>
*/
