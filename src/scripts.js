const holeBtn = document.getElementById("holeBtn");
const distBtn = document.getElementById("distBtn");
const finishBtn = document.getElementById("finishRound");
const distTable = document.getElementById("distTable");
let array = []; // Adding four elements per point: latitude, longitude, accuracy and distance
let hole = 0; // Count hole number
let shots = 0; // Count shots on hole
let roundStarted = false; // This indicates that the round has started
let holeStarted = false; // This indicates that the hole has started

// The haversine formula is commonly used to calculate the great-circle distance between two points on a sphere
const R = 6371e3; // metres
const metresToYards = 1.09361;

/* const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}; */

function success(pos) {
  let crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  //showPosition(pos);

  if (holeStarted === false) {
    array.push(crd.latitude, crd.longitude, crd.accuracy, 0);
    /* document.getElementById("startLat").innerHTML = Math.round(crd.latitude * 10000) / 10000 + "\xB0";
    document.getElementById("startLon").innerHTML = Math.round(crd.longitude * 10000) / 10000 + "\xB0";
    document.getElementById("startAcc").innerHTML = Math.round(crd.accuracy * 10000) / 10000; */
    //holeStarted = true;
    distTable.lastChild.innerHTML = `<td>${hole} Tee</td>
                                    <td>${Math.round(array[array.length - 4] * 10000)/10000}\xB0</td>
                                    <td>${Math.round(array[array.length - 3] * 10000)/10000}\xB0</td>
                                    <td>${Math.round(array[array.length - 2] * 10000)/10000}</td>
                                    <td>-</td>
                                    <td>-</td>`;
    holeStarted = true;
    shots = 0;
  } else {
    array.push(crd.latitude, crd.longitude, crd.accuracy);
    getDist(array);
  }
  shots++;
  console.log("The current array is: " + array);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

/* function showPosition(pos) {
  var latlon = pos.coords.latitude + "," + pos.coords.longitude;

  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyBbObHbrPXZ6Hyd5PoZOrHPcbQvm-fqqhM";

  document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
} */

function getDist(array) {
  // Now doing the haversine formula calculations
  let lat_new = array[array.length - 3];
  console.log("lat_new is " + lat_new);
  let lat_old = array[array.length - 7];
  let lon_new = array[array.length - 2];
  let lon_old = array[array.length - 6];
  //let x = lat_new - lat_old;
  let φ1 = toRadians(lat_old);
  let φ2 = toRadians(lat_new);
  let Δφ = toRadians(lat_new - lat_old);
  let Δλ = toRadians(lon_new - lon_old);

  let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;

  console.log("The distance from the last point is " + d + " metres.");
  array.push(d);
  console.log("The number of shots is: " + shots);
  distTable.lastChild.innerHTML = `<td>Shot ${shots}</td>
                                <td>${Math.round(array[array.length - 4] * 10000)/10000}\xB0</td>
                                <td>${Math.round(array[array.length - 3] * 10000)/10000}\xB0</td>
                                <td>${Math.round(array[array.length - 2] * 10000)/10000}</td>
                                <td>${Math.round(array[array.length - 1]).toLocaleString()}</td>
                                <td>${Math.round(array[array.length - 1] * metresToYards).toLocaleString()}</td>`;
  if (shots === 1) {
    let driveText = "drive" + hole;
    console.log(`The hole number is ${hole} and driveText is ${driveText}.`);
    document.getElementById(driveText).innerHTML = Math.round(array[array.length - 1] * metresToYards).toLocaleString();
  }
  console.log(`The current array is ${array.length} long.`);
  /* if (hole === 9) {
    console.log("We are now on 9 holes.");
    const tr3 = document.createElement("tr");
    statsTable.appendChild(tr3);
  } */
};

function toRadians(num) {
  return num * Math.PI/180;
}

//putting success and error in below as functions without the trailing () makes them callbacks apparently
//navigator.geolocation.getCurrentPosition(success, error, options);
//array.push(success());
//need to put things in the success() function if they are to wait for the coordinates to be available

distBtn.addEventListener("click", function() {
  console.log(`You have now pressed the button ${shots + 1} times.`)
  if (holeStarted === false) {
    //holeStarted = true;  // Have moved this to the success() function
    distBtn.innerHTML = "Mark";
  } else {
    const tr = document.createElement("tr");
    distTable.appendChild(tr);
  };
  //navigator.geolocation.getCurrentPosition(success, error, options);
  navigator.geolocation.getAccurateCurrentPosition();
  //letsGeolocate();
});

holeBtn.addEventListener("click", function() {
  const tr2 = document.createElement("tr");
  if (roundStarted === false) {
    roundStarted = true;
    holeBtn.innerHTML = "Next Hole";
    distBtn.disabled = false;
    finishBtn.disabled = false;
  };
  hole++;
  distBtn.innerHTML = "Drive";
  distTable.appendChild(tr2);
  distTable.lastChild.innerHTML = `<td>${hole} Tee</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>-</td>
                                <td>-</td>`;
  holeStarted = false;
  document.getElementById(`row${hole - 1}`).style.backgroundColor = "yellow";
  if (hole > 1) {
    document.getElementById(`row${hole - 2}`).style.backgroundColor = "aqua";
  }
  if (hole == 18) {
    holeBtn.disabled = true;
  }
});

function setDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth(); //January is 0
  let yyyy = today.getFullYear();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  today = dd + ' ' + months[mm] + ' ' + yyyy;
  document.getElementById("date").innerHTML = today;
};

setDate();

function myFunction() {
  console.log("this is: " + typeof(this));
  document.getElementById("menu1").innerHTML = $(this[1]).text();
  console.log("myFunction() is running");
};

class Course {
  constructor(arr) {
    this.holeYards = arr[0];
    this.holePars = arr[1];
    this.ss = arr[2];
    this.name = arr[3];
    this.holeSI = arr[4];
    this.tees = arr[5];
  }
  calcFront9(str) {
    let sum = 0;
    for (var i = 0; i < 9; i++) {
      if (str === "length") {
        sum += this.holeYards[i];
      } else if (str === "par") {
        sum += this.holePars[i];
      } 
    }
    return sum;
  }
  calcBack9(str) {
    let sum = 0;
    for (var i = 9; i < 18; i++) {
      if (str === "length") {
        sum += this.holeYards[i];
      } else if (str === "par") {
        sum += this.holePars[i];
      } 
    }
    return sum;
  }
  calc(str) {
    let sum = 0;
    for (var i = 0; i < 18; i++) {
      if (str === "length") {
        sum += this.holeYards[i];
      } else if (str === "par") {
        sum += this.holePars[i];
      } 
    }
    return sum;
  }
  getYards() {
    return this.holeYards;
  }
  getPars() {
    return this.holePars;
  }
  getSS() {
    return this.ss;
  }
  getName() {
    return this.name;
  }
  getSI() {
    return this.holeSI;
  }
};

// Now trying to get this data from Firebase
/* const gxWhiteYards = [367, 452, 364, 411, 187, 277, 526, 188, 392, 384, 409, 371, 157, 390, 406, 172, 350, 440];
const gxWhitePars = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4, 4];
const gxWhiteSS = 71; */
//const gxWhite = new Course([gxWhiteYards, gxWhitePars, gxWhiteSS]);

/* const gxYellowYards = [353, 437, 343, 386, 176, 254, 513, 177, 389, 379, 355, 361, 144, 386, 399, 157, 335, 421];
const gxYellowPars = [4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4, 4];
const gxYellowSS = 70; */

function getData(courseTeesArray) {
  for (i = 0; i < courseTeesArray.length; i++) {
    console.log(`courseTeesArray[${i}] is ${courseTeesArray[i]}.`)
  }
  const url = "https://simple-golf-app.firebaseio.com/courses.json"; 
  let networkDataReceived = false;

  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      networkDataReceived = true;
      console.log('From web', data);
      //var dataArray = [];
      //var dataObj = data;
      let setKey = "";
      for (let key in data) {
        console.log("key: " + key + ", data: " + data[key]);
        //console.log("Seeing if key name prints: " + dataObj[key].name);
        if (data[key].name === courseTeesArray[0] && data[key].tees === courseTeesArray[1]) {
          setKey = key;
          console.log("setKey is: " + setKey);
        }
        //dataArray.push(data[key]);
      //console.log("data: " + data.gxWhite.holePars);
      }
     // Try to adapt this snippet
      /*  var result = jsObjects.filter(obj => {
        return obj.b === 6
      }) */
      setCourseDetails2(data[setKey]);
      //setGXWhite(data[setKey]);

      //updateUI(dataArray);
      //console.log("Test print: " + dataArray[0].holeYards);
    });
    //.then(setGXWhite(dataObj));
  }

function setCourseDetails2(dataObj) {
  console.log("Here! " + dataObj.name);
  document.getElementById("ss").value = dataObj.ss;
  const courseObject = new Course([dataObj.holeYards, dataObj.holePars, dataObj.ss, dataObj.name, dataObj.holeSI]);
  for (let i = 0; i < dataObj.holeYards.length; i++) {
    //setCourseDetails(newCourse);
    document.getElementById(`yards${i + 1}`).innerHTML = courseObject.getYards()[i];
    document.getElementById("yardsFront9").innerHTML = courseObject.calcFront9("length");
    document.getElementById("yardsBack9").innerHTML = courseObject.calcBack9("length");
    document.getElementById("yardsAll").innerHTML = courseObject.calcFront9("length") + courseObject.calcBack9("length");
    document.getElementById(`par${i + 1}`).innerHTML = courseObject.getPars()[i]; 
    document.getElementById("parFront9").innerHTML = courseObject.calcFront9("par");
    document.getElementById("parBack9").innerHTML = courseObject.calcBack9("par");
    document.getElementById("parAll").innerHTML = courseObject.calcFront9("par") + courseObject.calcBack9("par");
    document.getElementById(`si${i + 1}`).innerHTML = courseObject.getSI()[i]; 
  }
}

function setCourse() {
  /* if (document.getElementById("course").value !== "nil" && document.getElementById("course") !== "other" && document.getElementById("tees").value !== "nil") {
    let indexCourse = document.getElementById("course").selectedIndex;
    let indexTees = document.getElementById("tees").selectedIndex;
    getData([document.getElementById("course")[indexCourse].innerHTML, document.getElementById("tees")[indexTees].innerHTML]);
  } */

  if (document.getElementById("course").value === "other") {
    modal.style.display = "block";
  }
};

let scoreDropdownFront9 = `<select class="scores scoresFront9" onchange="sumScoresPutts('scores'); calcStableford();">
                  <option disabled selected value=0>--select--</option>
                  <option value=1>1</option>
                  <option value=2>2</option>
                  <option value=3>3</option>
                  <option value=4>4</option>
                  <option value=5>5</option>
                  <option value=6>6</option>
                  <option value=7>7</option>
                  <option value=8>8</option>
                  <option value=9>9</option>
                  <option value=10>Other</option>
                  <option value=0>-</option>
                </select>`;

let scoreDropdownBack9 = `<select class="scores scoresBack9" onchange="sumScoresPutts('scores'); calcStableford();">
                  <option disabled selected value=0>--select--</option>
                  <option value=1>1</option>
                  <option value=2>2</option>
                  <option value=3>3</option>
                  <option value=4>4</option>
                  <option value=5>5</option>
                  <option value=6>6</option>
                  <option value=7>7</option>
                  <option value=8>8</option>
                  <option value=9>9</option>
                  <option value=10>Other</option>
                  <option value=0>-</option>
                </select>`;

let sumScoresPutts = function(stat) {
  let statFront9 = stat + "Front9";
  let statBack9 = stat + "Back9";
  let statAll = stat + "All";
  let sumFront9 = 0;
  let sumBack9 = 0;

  if (stat === "stableford") {
    let front9Scores = document.getElementsByClassName(statFront9);
    for (let i = 0; i < front9Scores.length; i++) {
      if (Number.isInteger(parseInt(front9Scores[i].innerHTML))) {
        sumFront9 += parseInt(front9Scores[i].innerHTML);
      }
    }

    let back9Scores = document.getElementsByClassName(statBack9);
    for (let i = 0; i < back9Scores.length; i++) {
      if (Number.isInteger(parseInt(back9Scores[i].innerHTML))) {
        sumBack9 += parseInt(back9Scores[i].innerHTML);
      }
    }
  } else if (stat !== "strokesGained") {
    let front9Scores = document.getElementsByClassName(statFront9);
    for (let i = 0; i < front9Scores.length; i++) {
      if (Number.isInteger(parseInt(front9Scores[i].value))) {
        sumFront9 += parseInt(front9Scores[i].value);
      }
    }

    let back9Scores = document.getElementsByClassName(statBack9);
    for (let i = 0; i < back9Scores.length; i++) {
      if (Number.isInteger(parseInt(back9Scores[i].value))) {
        sumBack9 += parseInt(back9Scores[i].value);
      }
    }
  } else {
    let front9Scores = document.getElementsByClassName(statFront9);
    for (let i = 0; i < front9Scores.length; i++) {
      if (parseFloat(front9Scores[i].innerHTML)) {
        sumFront9 += parseFloat(front9Scores[i].innerHTML);
      }
    }
    let back9Scores = document.getElementsByClassName(statBack9);
    for (let i = 0; i < back9Scores.length; i++) {
      if (parseFloat(back9Scores[i].innerHTML)) {
        sumBack9 += parseFloat(back9Scores[i].innerHTML);
      }
    }
  }

  // Need the * 1000 / 1000 as decimals used with strokes gained in this function
  document.getElementById(statFront9).innerHTML = Math.round(sumFront9 * 1000) / 1000;
  document.getElementById(statBack9).innerHTML = Math.round(sumBack9 * 1000) / 1000;
  document.getElementById(statAll).innerHTML = Math.round((sumFront9 + sumBack9) * 1000) / 1000;
}

let fairwaysDropdownFront9 =  `<select class="fairways fairwaysFront9" onchange="sumStats('fairways')">
                                <option disabled selected value="nil">--select--</option>
                                <option value="yes">\u2714</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="bunker">Bunker</option>
                                <option value="duffed">Duffed</option>
                                <option value="over">Over</option>
                                <option value="other">Other</option>
                                <option value="nil">-</option>
                              </select>`;

let fairwaysDropdownBack9 =  `<select class="fairways fairwaysBack9" onchange="sumStats('fairways')">
                                <option disabled selected value="nil">--select--</option>
                                <option value="yes">\u2714</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="bunker">Bunker</option>
                                <option value="duffed">Duffed</option>
                                <option value="over">Over</option>
                                <option value="other">Other</option>
                                <option value="nil">-</option>
                              </select>`;

const sumStats = function(stat) {
  let statFront9 = stat + "Front9";
  let statBack9 = stat + "Back9";
  let statAll = stat + "All";
  let hitFront9 = 0;
  let allFront9 = 0;
  let hitBack9 = 0;
  let allBack9 = 0;

  let front9Sum = document.getElementsByClassName(statFront9);
  for (let i = 0; i < front9Sum.length; i++) {
    if (front9Sum[i].value.indexOf("yes") !== -1) {
      hitFront9++;
      allFront9++;
    } else if (front9Sum[i].value !== "nil") {
      allFront9++;
    }
  }

  let back9Sum = document.getElementsByClassName(statBack9);
  for (let i = 0; i < back9Sum.length; i++) {
    if (back9Sum[i].value.indexOf("yes") !== -1) {
      hitBack9++;
      allBack9++;
    } else if (back9Sum[i].value !== "nil") {
      allBack9++;
    }
  }

  document.getElementById(statFront9).innerHTML = `${hitFront9} of ${allFront9}`;
  document.getElementById(statBack9).innerHTML = `${hitBack9} of ${allBack9}`;
  document.getElementById(statAll).innerHTML = `${hitFront9 + hitBack9} of ${allFront9 + allBack9}`;
}

let greensDropdownFront9 =  `<select class="greens greensFront9" onchange="sumStats('greens')">
                              <option disabled selected value="nil">--select--</option>
                              <option value="yes<">\u2714 <= 10 ft</option>
                              <option value="yes>">\u2714 > 10 ft</option>
                              <option value="over">Over</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="short">Short</option>
                              <option value="wellOff">Well Off</option>
                              <option value=nil>-</option>
                            </select>`;

let greensDropdownBack9 =  `<select class="greens greensBack9" onchange="sumStats('greens')">
                              <option disabled selected value="nil">--select--</option>
                              <option value="yes<">\u2714 <= 10 ft</option>
                              <option value="yes>">\u2714 > 10 ft</option>
                              <option value="over">Over</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="short">Short</option>
                              <option value="wellOff">Well Off</option>
                              <option value=nil>-</option>
                            </select>`;

let upAndDownDropdownFront9 =  `<select class="upAndDown upAndDownFront9" onchange="sumStats('upAndDown')">
                                  <option disabled selected value="nil">--select--</option>
                                  <option value="yes">\u2714</option>
                                  <option value="no">\u2715</option>
                                  <option value=nil>-</option>
                                </select>`;

let upAndDownDropdownBack9 =  `<select class="upAndDown upAndDownBack9" onchange="sumStats('upAndDown')">
                              <option disabled selected value="nil">--select--</option>
                              <option value="yes">\u2714</option>
                              <option value="no">\u2715</option>
                              <option value=nil>-</option>
                            </select>`;

let sandDropdownFront9 =  `<select class="sand sandFront9" onchange="sumStats('sand')">
                                  <option disabled selected value="nil">--select--</option>
                                  <option value="yes">\u2714</option>
                                  <option value="no">\u2715</option>
                                  <option value=nil>-</option>
                                </select>`;

let sandDropdownBack9 =  `<select class="sand sandBack9" onchange="sumStats('sand')">
                              <option disabled selected value="nil">--select--</option>
                              <option value="yes">\u2714</option>
                              <option value="no">\u2715</option>
                              <option value=nil>-</option>
                            </select>`;

let puttsDropdownFront9 = `<select class="putts puttsFront9" onchange="sumScoresPutts('putts')">
                  <option disabled selected value="nil">--select--</option>
                  <option value=0>0</option>
                  <option value=1>1</option>
                  <option value=2>2</option>
                  <option value=3>3</option>
                  <option value=4>4</option>
                  <option value=5>5</option>
                  <option value="nil">Other</option>
                  <option value="nil">-</option>
                </select>`;

let puttsDropdownBack9 = `<select class="putts puttsBack9" onchange="sumScoresPutts('putts')">
                  <option disabled selected value="nil">--select--</option>
                  <option value=0>0</option>
                  <option value=1>1</option>
                  <option value=2>2</option>
                  <option value=3>3</option>
                  <option value=4>4</option>
                  <option value=5>5</option>
                  <option value="nil">Other</option>
                  <option value="nil">-</option>
                </select>`;

let driveClubDropdownFront9 = `<select class="driveClub driveClubFront9" onchange="aveDriverDist()">
                  <option disabled selected value="nil">--select--</option>
                  <option value="DR">Driver</option>
                  <option value="3W">3 Wood</option>
                  <option value="17H">17\xB0 Hybrid</option>
                  <option value="20H">20\xB0 Hybrid</option>
                  <option value="23H">23\xB0 Hybrid</option>
                  <option value="5I">5 Iron</option>
                  <option value="6I">6 Iron</option>
                  <option value="7I">7 Iron</option>
                  <option value="8I">8 Iron</option>
                  <option value="9I">9 Iron</option>
                  <option value="PW">Pitching Wedge</option>
                  <option value="GW">Gap Wedge</option>
                  <option value="5SW">Sand Wedge</option>
                  <option value="nil">Other</option>
                  <option value="nil">-</option>
                </select>`;

let driveClubDropdownBack9 = `<select class="driveClub driveClubBack9" onchange="aveDriverDist()">
                  <option disabled selected value="nil">--select--</option>
                  <option value="DR">Driver</option>
                  <option value="3W">3 Wood</option>
                  <option value="17H">17\xB0 Hybrid</option>
                  <option value="20H">20\xB0 Hybrid</option>
                  <option value="23H">23\xB0 Hybrid</option>
                  <option value="5I">5 Iron</option>
                  <option value="6I">6 Iron</option>
                  <option value="7I">7 Iron</option>
                  <option value="8I">8 Iron</option>
                  <option value="9I">9 Iron</option>
                  <option value="PW">Pitching Wedge</option>
                  <option value="GW">Gap Wedge</option>
                  <option value="5SW">Sand Wedge</option>
                  <option value="nil">Other</option>
                  <option value="nil">-</option>
                </select>`;

let avePuttDist = function() {
  let sumFront9 = 0;
  let countFront9 = 0;
  let sumBack9 = 0;
  let countBack9 = 0;

  let puttDistsFront9 = document.getElementsByClassName("puttDistFront9");
  for (let i = 0; i < puttDistsFront9.length; i++) {
    if (Number.isInteger(parseInt(puttDistsFront9[i].value))) {
      sumFront9 += parseInt(puttDistsFront9[i].value);
      countFront9 += 1;
    }
  }

  let puttDistsBack9 = document.getElementsByClassName("puttDistBack9");
  for (let i = 0; i < puttDistsBack9.length; i++) {
    if (Number.isInteger(parseInt(puttDistsBack9[i].value))) {
      sumBack9 += parseInt(puttDistsBack9[i].value);
      countBack9 += 1;
    }
  }

  if (countFront9 > 0) {
    document.getElementById("avePuttDistFront9").innerHTML = "Ave: " + Math.round(sumFront9/countFront9 * 10) / 10;
  }
  if (countBack9 > 0) {
    document.getElementById("avePuttDistBack9").innerHTML = "Ave: " + Math.round(sumBack9/countBack9 * 10) / 10;
  }
  document.getElementById("avePuttDistAll").innerHTML = "Ave: " + Math.round(10 * (sumFront9 + sumBack9)/(countFront9 + countBack9)) / 10;
}

document.addEventListener('DOMContentLoaded', function() {
  setTable();
}, false);

function setTable() {
  for (let i = 0; i < 18; i++) {
    const tr1 = document.createElement("tr");
    tr1.setAttribute("id", `row${i}`);
    statsTable.appendChild(tr1);
    if (i < 9) {
      statsTable.lastChild.innerHTML = `<td>${i + 1}</td>
                                        <td id="yards${i + 1}"></td>
                                        <td id="par${i + 1}"></td>
                                        <td id="si${i + 1}"></td>
                                        <td id="score${i + 1}">${scoreDropdownFront9}</td>
                                        <td id="stableford${i + 1}" class="stableford stablefordFront9 stablefordColumn"></td>
                                        <td>${fairwaysDropdownFront9}</td>
                                        <td>${driveClubDropdownFront9}</td>
                                        <td id="drive${i + 1}" class="driveDists"></td>
                                        <td>${greensDropdownFront9}</td>
                                        <td>${upAndDownDropdownFront9}</td>
                                        <td>${sandDropdownFront9}</td>
                                        <td id="putts${i + 1}">${puttsDropdownFront9}</td>
                                        <td><input type="number" id="dist${i + 1}" class="puttDistFront9" onchange="avePuttDist(); calcStrokesGained(value, ${i + 1});"></td>
                                        <td id="strokesGained${i+1}" class="strokesGainedFront9"></td>`;
    } else {
      statsTable.lastChild.innerHTML = `<td>${i + 1}</td>
                                        <td id="yards${i + 1}"></td>
                                        <td id="par${i + 1}"></td>
                                        <td id="si${i + 1}"></td>
                                        <td id="score${i + 1}">${scoreDropdownBack9}</td>
                                        <td id="stableford${i + 1}" class="stableford stablefordBack9 stablefordColumn"></td>
                                        <td>${fairwaysDropdownBack9}</td>
                                        <td>${driveClubDropdownBack9}</td>
                                        <td id="drive${i + 1}" class="driveDists"></td>
                                        <td>${greensDropdownBack9}</td>
                                        <td>${upAndDownDropdownBack9}</td>
                                        <td>${sandDropdownBack9}</td>
                                        <td id="putts${i + 1}">${puttsDropdownBack9}</td>
                                        <td><input type="number" id="dist${i + 1}" class="puttDistBack9" onchange="avePuttDist(); calcStrokesGained(value, ${i + 1});"></td>
                                        <td id="strokesGained${i+1}" class="strokesGainedBack9"></td>`;
    }
    if (i + 1 === 9) {
      const tr2 = document.createElement("tr");
      statsTable.appendChild(tr2);
      statsTable.lastChild.innerHTML = `<td>Front 9</td>
                                        <td id="yardsFront9"></td>
                                        <td id="parFront9"></td>
                                        <td></td>
                                        <td id="scoresFront9">0</td>
                                        <td id="stablefordFront9" class="stablefordColumn">0</td>
                                        <td id="fairwaysFront9">0 of 0</td>
                                        <td></td>
                                        <td id="aveDriverDistFront9"></td>
                                        <td id="greensFront9">0 of 0</td>
                                        <td id="upAndDownFront9">0 of 0</td>
                                        <td id="sandFront9">0 of 0</td>
                                        <td id="puttsFront9">0</td>
                                        <td id="avePuttDistFront9">-</td>
                                        <td id="strokesGainedFront9">-</td>`;
    }
    if (i + 1 === 18) {
      const tr2 = document.createElement("tr");
      statsTable.appendChild(tr2);
      statsTable.lastChild.innerHTML = `<td>Back 9</td>
                                        <td id="yardsBack9"></td>
                                        <td id="parBack9"></td>
                                        <td></td>
                                        <td id="scoresBack9">0</td>
                                        <td id="stablefordBack9" class="stablefordColumn">0</td>
                                        <td id="fairwaysBack9">0 of 0</td>
                                        <td></td>
                                        <td id="aveDriverDistBack9"></td>
                                        <td id="greensBack9">0 of 0</td>
                                        <td id="upAndDownBack9">0 of 0</td>
                                        <td id="sandBack9">0 of 0</td>
                                        <td id="puttsBack9">0</td>
                                        <td id="avePuttDistBack9">-</td>
                                        <td id="strokesGainedBack9">-</td>`;
      const tr3 = document.createElement("tr");
      statsTable.appendChild(tr3);
      statsTable.lastChild.innerHTML = `<td>Total</td>
                                        <td id="yardsAll"></td>
                                        <td id="parAll"></td>
                                        <td></td>
                                        <td id="scoresAll">0</td>
                                        <td id="stablefordAll" class="stablefordColumn">0</td>
                                        <td id="fairwaysAll">0 of 0</td>
                                        <td></td>
                                        <td id="aveDriverDistAll"></td>
                                        <td id="greensAll">0 of 0</td>
                                        <td id="upAndDownAll">0 of 0</td>
                                        <td id="sandAll">0 of 0</td>
                                        <td id="puttsAll">0</td>
                                        <td id="avePuttDistAll">-</td>
                                        <td id="strokesGainedAll">-</td>`;
    }
  }
}

// PGA stats from 2010 at https://thesandtrap.com/forums/topic/51757-pga-tour-putts-gainedmake-percentage-stats/
// Fortunately the data is for each foot (1 to 100 feet) with no gaps, so easy to put in one-dimensional array
// Array number is expected number of putts to be taken by PGA tour players from that distance
let expectedPutts = [1.001, 1.009, 1.053, 1.147, 1.256, 1.357, 1.443, 1.515, 1.575, 1.626];
let a2 = [1.669, 1.705, 1.737, 1.765, 1.79, 1.811, 1.83, 1.848, 1.863, 1.878];
let a3 = [1.891, 1.903, 1.914, 1.924, 1.934, 1.944, 1.953, 1.961, 1.97, 1.978];
let a4 = [1.993, 1.993, 2.001, 2.009, 2.016, 2.024, 2.032, 2.039, 2.047, 2.055];
let a5 = [2.062, 2.07, 2.078, 2.086, 2.094, 2.102, 2.11, 2.118, 2.127, 2.135];
let a6 = [2.143, 2.152, 2.16, 2.168, 2.177, 2.185, 2.193, 2.202, 2.21, 2.218];
let a7 = [2.226, 2.234, 2.242, 2.25, 2.257, 2.265, 2.272, 2.279, 2.286, 2.293];
let a8 = [2.299, 2.306, 2.312, 2.318, 2.324, 2.329, 2.334, 2.339, 2.344, 2.349];
let a9 = [2.353, 2.357, 2.361, 2.364, 2.367, 2.37, 2.373, 2.375, 2.377, 2.379];
let a10 = [2.381, 2.382, 2.383, 2.384, 2.384, 2.384, 2.384, 2.383, 2.383, 2.382];
for (let i = 2; i < 11; i++) {
  let x = eval("a" + i);
  //console.log(x[0]);
  for (let j = 0; j < x.length; j++) {
    expectedPutts.push(x[j]);
  };
};

console.log("The length of the array is: " + expectedPutts.length);
console.log(`The expected number of putts from 20 feet is ${expectedPutts[19]}.`);

function calcStrokesGained(dist, hole) {
  console.log("The hole is: " + hole);
  console.log("The distance is: " + dist);
  let x = "strokesGained" + hole;
  console.log(`x is ${x}.`);
  let y = "putts" + hole;
  console.log(`y is ${y}.`);
  let z = "dist" + hole;
  console.log(`The value in y is ${document.getElementById(y).firstChild.value}.`);
  if (document.getElementById(y).firstChild.value === "nil") {
    console.warn("Please enter the number of putts first before the first putt distance.");
    document.getElementById(z).value = 0;
  } else {
    document.getElementById(x).innerHTML = Math.round((expectedPutts[dist - 1] - document.getElementById(y).firstChild.value) * 1000) / 1000;
    console.log("Going to sumScoresPutts() function.");
    sumScoresPutts("strokesGained");
  }
};

finishBtn.addEventListener("click", function() {
  //alert("This button doesn't do anything yet.  It will send data to database in due course.");
  let statsObject = {
    date: {},
    course: {},
    tees:  {},
    css: {},
    scores: {},
    stableford: {},
    fairways: [],
    driveClub: [],
    driveDist: [],
    greens: [],
    upAndDown: [],
    sand: [],
    putts: [],
    puttDists: [],
    strokesGained: []
  };

  // For numerical inputs - currently scores, to add putts, puttsDist and strokesGained later
  let x = document.getElementsByClassName("scores");
  let w = document.getElementsByClassName("stableford");
  let checkNull = true;

  // Set basic stats
  statsObject.date = document.getElementById("date").innerHTML;
  let indexCourse = document.getElementById("course").selectedIndex;
  let indexTees = document.getElementById("tees").selectedIndex;
  statsObject.course = document.getElementById("course")[indexCourse].innerHTML;
  statsObject.tees = document.getElementById("tees")[indexTees].innerHTML;

  for (let i = 0; i < x.length; i++) {
    if (Number.isInteger(parseInt(x[i].value))) {
      statsObject.scores[i] = parseInt(x[i].value);
      //statsObject.scores.push(parseInt(x[i].value));
    } else {
      statsObject.scores[i] = "-";
      checkNull = false;
    }
  }

  for (let i = 0; i < w.length; i++) {
    if (Number.isInteger(parseInt(w[i].innerHTML))) {
      statsObject.stableford[i] = parseInt(w[i].innerHTML);
      //statsObject.scores.push(parseInt(x[i].value));
    } else {
      statsObject.stableford[i] = "-";
    }
  }

  // For non-numerical inputs
  let y = ["fairways", "driveClub", "driveDist", "greens", "upAndDown", "sand"];
  for (let i = 0; i < y.length; i++) {
    let z = document.getElementsByClassName(y[i]);
    console.log("y[i] is " + y[i]);
    console.log("z[0] is " + z[0]);
    for (let j = 0; j < z.length; j++) {
      let ind = z[j].selectedIndex;
      console.log("index is: " + ind); //Need to deal with non-selected option
      if (z[j].selectedIndex !== 0) {
        statsObject[y[i]][j] = z[j][ind].innerHTML;
        console.log("z[j][ind].innerHTML is: " + z[j][ind].innerHTML);
      } else {
        statsObject[y[i]][j] = "-";
      }
    }
  }

  // Check if scores all completed before submitting to database
  if (checkNull === false) {
    var checking = confirm("Not all the scores are completed, do you still want to submit?");
    if (checking) {
      postDatabase("scores", statsObject);
      holeBtn.disabled = true;
    } else {
      alert("Data not yet submitted.  Complete the numbers and resubmit.")
    }
  } else {
    postDatabase("scores", statsObject);
    holeBtn.disabled = true;
  }
});

/* function askNewCourseDetails() {
  document.getElementById("newCourse").style.display = "block";
}; */

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
/* btn.onclick = function() {
    modal.style.display = "block";
} */

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById("newCourseStatsBtn").addEventListener("click", function() {
  modal.style.display = "none"; 
  console.log("The newCourseStats button was pressed");
  let newCourseName = capitaliseFirstLetters(document.getElementById("newCourseName").value);
  let newCourseTees = capitaliseFirstLetters(document.getElementById("newCourseTees").value);
  let newYards = document.getElementsByClassName("a");
  let newPars = document.getElementsByClassName("b");
  let newCourseSS = document.getElementById("c").value;
  let newSI = document.getElementsByClassName("d");
  let newCourseYards = [];
  let newCoursePars = [];
  let newCourseSI = [];

  for (i = 0; i < newYards.length; i += 1) {
    newCourseYards.push(parseInt(newYards[i].value));
    newCoursePars.push(parseInt(newPars[i].value));
    newCourseSI.push(parseInt(newSI[i].value));
  };
  console.log("newCourseYards is: " + newCourseYards);
  console.log("newCoursePars is: " + newCoursePars);
  console.log("newCourseSI is: " + newCourseSI);
  var newCourse = new Course([newCourseYards, newCoursePars, newCourseSS, newCourseName, newCourseSI, newCourseTees]);
  console.log("The new course is " + newCourse);
  let opt = document.createElement("option");
  opt.setAttribute("id", "nc");
  opt.setAttribute("selected", true); // Focuses on this new option, but may apply on future page load if there
  // Need to modify to cater for more than one word names, best set up as function
  //opt.innerHTML = newCourseName[0].toUpperCase() + newCourseName.substr(1, newCourseName.length).toLowerCase();
  opt.innerHTML = newCourse.name;
  document.getElementById("course").appendChild(opt);
  //document.getElementById("course").lastChild.innerHTML = "<option value=\"nc\">newCourseName</option>";
  
  // Now to check if tee colour specified is in list, then select it if it is or add if not
  let tees = document.getElementById("tees");
  let newTees = true;
  console.log("The number of tees is" + (tees.length - 1)); // Ignore first --select-- child
  for (let i = 1; i < tees.length; i += 1) {
    console.log(tees.children[i].innerHTML);
    if (tees.children[i].innerHTML.toLowerCase() === newCourseTees.toLowerCase()) {
      tees.children[i].selected = true;
      newTees = false;
    }
  }
  if (newTees = true) {
    let opt2 = document.createElement("option");
    opt2.setAttribute("id", newCourseTees.toLowerCase());
    //newTeesColour = newCourseTees[0].toUpperCase() + newCourseTees.substr(1, newCourseTees.length).toLowerCase();
    //opt2.innerHTML = newTeesColour;
    opt2.innerHTML = capitaliseFirstLetters(newCourseTees);
    opt2.selected = true;
    tees.appendChild(opt2);
  }

  // Set standard scratch
  document.getElementById("ss").value = newCourse.ss;

  // Add course yards and pars to statsTable
  /* for (i = 0; i < newCourse.getYards().length; i++) {
    setCourseDetails2(newCourse);
    console.log("Just set the course details.");
  }; */
  setCourseDetails2(newCourse);
  postDatabase("course", newCourse);
});

/* let front9Scores = document.getElementsByClassName(statFront9);
for (let i = 0; i < front9Scores.length; i++) {
  if (Number.isInteger(parseInt(front9Scores[i].value))) {
    sumFront9 += parseInt(front9Scores[i].value);
  }
} */

function capitaliseFirstLetters(str) {
  strArrayOld = str.split(" ");
  strArrayNew = [];
  for (let i = 0; i < strArrayOld.length; i += 1) {
    strArrayNew.push(strArrayOld[i][0].toUpperCase() + strArrayOld[i].substr(1, strArrayOld[i].length).toLowerCase());
  }
  return strArrayNew.join(" ");
}

function aveDriverDist() {
  let driveClubsFront9 = document.getElementsByClassName("driveClubFront9");
  let driveClubsBack9 = document.getElementsByClassName("driveClubBack9");
  //let driveClubsAll = document.getElementsByClassName("driveClubAll");
  //console.log("driveClubs is " + driveClubs);
  sumFront9 = 0;
  countFront9 = 0;
  sumBack9 = 0;
  countBack9 = 0;
  sumAll = 0;
  countAll = 0;
  for (let i = 0; i < driveClubsFront9.length; i += 1) {
    if (driveClubsFront9[i].value === "DR") {
      sumFront9 += parseInt(eval(`drive${i + 1}`).innerHTML);
      countFront9 += 1;
      sumAll += parseInt(eval(`drive${i + 1}`).innerHTML);
      countAll += 1;
    }
  }
  for (let i = 0; i < driveClubsBack9.length; i += 1) {
    if (driveClubsBack9[i].value === "DR") {
      sumBack9 += parseInt(eval(`drive${i + 10}`).innerHTML);
      countBack9 += 1;
      sumAll += parseInt(eval(`drive${i + 10}`).innerHTML);
      countAll += 1;
    }
  }

  if (countFront9 > 0) {
    document.getElementById("aveDriverDistFront9").innerHTML = Math.round(sumFront9/countFront9 * 1000) / 1000;
  }
  if (countBack9 > 0) {
    document.getElementById("aveDriverDistBack9").innerHTML = Math.round(sumBack9/countBack9 * 1000) / 1000;
  }
  document.getElementById("aveDriverDistAll").innerHTML = Math.round(sumAll/countAll * 1000) / 1000;
}

function postDatabase(str, obj) {
  let url = "";
  if (str === "course") {
    url = "https://simple-golf-app.firebaseio.com/courses.json";
  } else if (str === "scores") {
    url = "https://simple-golf-app.firebaseio.com/scores.json";
  } else {
    console.log("Error with postDatabase() url call.")
  } 
  var networkDataReceived = false;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    }, 
    /* body: JSON.stringify({
      course: "St Norman's",
      competition: "Goose Salver"
    }) */
    body: JSON.stringify(obj)
  })
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      networkDataReceived = true;
      alert("Data successfully submitted!");
    });
}

//postNewCourse();

/* function letsGeolocate() {
  var output = document.getElementById("mapholder");  // the div where messages will appear
  var options = {
  };
  function geolocationSuccess(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      output.innerHTML = 'Latitude: ' + latitude + '<br/>Longitude: ' + longitude
  }

  function geolocationError() {
      output.innerHTML = "Unable to retrieve your location";
  }

  function geoprogress() {
      output.innerHTML = '<p>Locating in progress</p>';
  }
  navigator.geolocation.getAccurateCurrentPosition(geolocationSuccess, geolocationError, geoprogress, options);
} */

function geoprogress() {
  document.getElementById("mapholder").innerHTML = '<p>Locating in progress</p>';
}

//navigator.geolocation.getAccurateCurrentPosition = function (geolocationSuccess, geolocationError, geoprogress, options) {
navigator.geolocation.getAccurateCurrentPosition = function (success, error, geoprogress, options) {

    var lastCheckedPosition,
        locationEventCount = 0,
        watchID,
        timerID;

    options = options || {};

    var checkLocation = function (position) {
        lastCheckedPosition = position;
        locationEventCount = locationEventCount + 1;
        // We ignore the first event unless it's the only one received because some devices seem to send a cached
        // location even when maxaimumAge is set to zero
        if ((position.coords.accuracy <= options.desiredAccuracy) && (locationEventCount > 1)) {
            clearTimeout(timerID);
            navigator.geolocation.clearWatch(watchID);
            foundPosition(position);
        } else {
            geoprogress(position);
        }
    };

    var stopTrying = function () {
        navigator.geolocation.clearWatch(watchID);
        foundPosition(lastCheckedPosition);
    };

    var onError = function (err) {
        clearTimeout(timerID);
        navigator.geolocation.clearWatch(watchID);
        //geolocationError(error);
        error(err);
    };

    var foundPosition = function (position) {
        //geolocationSuccess(position);
        success(position);
        document.getElementById("mapholder").innerHTML = '<p>Location complete</p>';
    };

    // Inserting success, error and geoprogress here so they are within the scope of this function
    var success = function (position) {
      let crd = position.coords;
    
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    
      //showPosition(pos);
    
      if (holeStarted === false) {
        array.push(crd.latitude, crd.longitude, crd.accuracy, 0);
        /* document.getElementById("startLat").innerHTML = Math.round(crd.latitude * 10000) / 10000 + "\xB0";
        document.getElementById("startLon").innerHTML = Math.round(crd.longitude * 10000) / 10000 + "\xB0";
        document.getElementById("startAcc").innerHTML = Math.round(crd.accuracy * 10000) / 10000; */
        //holeStarted = true;
        distTable.lastChild.innerHTML = `<td>${hole} Tee</td>
                                        <td>${Math.round(array[array.length - 4] * 10000)/10000}\xB0</td>
                                        <td>${Math.round(array[array.length - 3] * 10000)/10000}\xB0</td>
                                        <td>${Math.round(array[array.length - 2] * 10000)/10000}</td>
                                        <td>-</td>
                                        <td>-</td>`;
        holeStarted = true;
        shots = 0;
      } else {
        array.push(crd.latitude, crd.longitude, crd.accuracy);
        getDist(array);
      }
      shots++;
      console.log("The current array is: " + array);
    }
    
    var error = function(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    var geoprogress = function () {
      document.getElementById("mapholder").innerHTML = '<p>Locating in progress</p>';
    }

    if (!options.maxWait)            options.maxWait = 10000; // Default 10 seconds
    if (!options.desiredAccuracy)    options.desiredAccuracy = 10; // Default 20 meters
    if (!options.timeout)            options.timeout = options.maxWait; // Default to maxWait

    options.maximumAge = 0; // Force current locations only
    options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)

    watchID = navigator.geolocation.watchPosition(checkLocation, onError, options);
    timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop
};

function setFormat() {
  let formatBtn = document.getElementById("format");
  let pointsColumn = document.getElementsByClassName("stablefordColumn");
  if (formatBtn.value === "strokeplay") {
    for (let i = 0; i < pointsColumn.length; i += 1) {
      pointsColumn[i].style.display = "none";
    }
  } else if (formatBtn.value === "stableford") {
    for (let i = 0; i < pointsColumn.length; i += 1) {
      pointsColumn[i].style.display = "table-cell";
    }
  }
}

function calcStableford() {
  console.log("???");
  let handicap = document.getElementById("handicap").value;
  let shots = 0; // Handicap shots per hole
  let holeSI = 0;
  let holePar = 0;
  let holeGrossScore = 0;
  let holeNetScore = 0;
  console.log("Handicap is " + handicap);

  // Assuming scratch or worse handicap
  for (let i = 0; i < 18; i += 1) { 
    holeSI = parseInt(document.getElementById(`si${i + 1}`).innerHTML);
    if (handicap <= 18) {
      if (holeSI <= handicap) {
        shots = 1;
      } else {
        shots = 0;
      }
    } else if (handicap > 18 && handicap <= 36) {
      if (holeSI <= handicap - 18) {
        shots = 2;
      } else {
        shots = 1;
      }
    };
    /* if (handicap <= 18 && holeSI <= handicap) {
      shots = 1;
    } else if (handicap <= 18 && holeSI > handicap) {
      shots = 0;
    } */
    holePar = parseInt(document.getElementById(`par${i + 1}`).innerHTML);
    holeGrossScore = parseInt(document.getElementById(`score${i + 1}`).firstChild.value);
    if (holeGrossScore !== 0) {
      holeNetScore = holeGrossScore - shots;
      document.getElementById(`stableford${i + 1}`).innerHTML = Math.max(2 + holePar - holeNetScore, 0);
    }
  }
  sumScoresPutts("stableford");
}

function setCourseDropdown() {
  let coursesCell = document.getElementById("coursesList");
  const url = "https://simple-golf-app.firebaseio.com/courses.json"; 
  let networkDataReceived = false;
  let coursesSet = new Set(); // Avoiding duplicate names
  let coursesList = []; // For list of courses in database - cannot sort() set so do so with array
  let coursesCellString = ""

  fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    //let setKey = "";
    for (let key in data) {
      console.log("key name: " + data[key].name + ", data: " + data[key]);
      coursesSet.add(data[key].name);
      coursesList = Array.from(coursesSet).sort();
      //coursesList.sort();
      //console.log("Seeing if key name prints: " + dataObj[key].name);
      /* if (data[key].name === courseTeesArray[0] && data[key].tees === courseTeesArray[1]) {
        setKey = key;
        console.log("setKey is: " + setKey);
      } */
    }
    //coursesList = 
    coursesCellString = `<select id="course" onchange="setCourse()">
                          <option disabled selected value="nil">--select--</option>`;
    for (let i = 0; i < coursesList.length; i += 1) {
      coursesCellString += `<option>${coursesList[i]}</option>`;
    }
    coursesCellString += `<option value="other">Other</option>
                          </select>`;
    /* coursesCell.innerHTML = `<select id="course" onchange="setCourse()">
                                <option disabled selected value="nil">--select--</option>
                                <option value="gx">Gerrards Cross</option>
                                <option value="other">Other</option>
                            </select>`; */
    coursesCell.innerHTML = coursesCellString;

  });
}

setCourseDropdown();

function setTees() {
  let teesCell = document.getElementById("teesList");
  let selectedCourseIndex = document.getElementById("course").selectedIndex;
  let selectedCourse = document.getElementById("course")[selectedCourseIndex].innerHTML;
  console.log("The selected course is " + selectedCourse);

  // I am calling the data too often, should combine with setCourseDropdown() function;
  const url = "https://simple-golf-app.firebaseio.com/courses.json"; 
  let networkDataReceived = false;
  let teesList = [];
  let teesCellString = "";

  fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    //let setKey = "";
    for (let key in data) {
      console.log("key name: " + data[key].name + ", tees: " + data[key].tees);
      if (data[key].name === selectedCourse) {
        teesList.push(data[key].tees);
      }
      teesList.sort();
    }
    
    teesCellString = `<select id="tees" onchange="setCourse()">
                          <option disabled selected value="nil">--select--</option>`;
    for (let i = 0; i < teesList.length; i += 1) {
      teesCellString += `<option>${teesList[i]}</option>`;
    }
    teesCellString += `<option value="other">Other</option>
                          </select>`;
    teesCell.innerHTML = teesCellString;
  })
}