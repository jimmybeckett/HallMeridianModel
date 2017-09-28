document.addEventListener("DOMContentLoaded", function () {
    var clock = document.getElementById("clock");
    var arrow = document.getElementById("arrow");
    clock.style.width = window.innerHeight * .8 + "px";
    arrow.style.width = window.innerHeight * .15 + "px";
    setInterval(rotateTime, 10);
    window.addEventListener("resize", function () {
        clock.style.width = window.innerHeight * .8 + "px";
        arrow.style.width = window.innerHeight * .15 + "px";
    });
    getTimes("TX", "Austin", Date.now(), rotateSun);
    generateOuterCircle();
});


var times;
var sunInt;

function getTimes(state, city, millis, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://hallmeridianmodel.herokuapp.com//getSSTimes", true);
    var date = new Date();
    xhr.setRequestHeader("state", state);
    xhr.setRequestHeader("city", city);
    xhr.setRequestHeader("millis", millis);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                times = new SSTime(JSON.parse(xhr.responseText));
                var d = date.getMonth() * 100 + date.getDate() + date.getHours() / 10;
                if (d > 212.2 && d < 1005.2) { //check for daylight savings time
                    times.yesterday.sunrise += 100;
                    times.yesterday.sunset += 100;
                    times.today.sunrise += 100;
                    times.today.sunset += 100;
                    times.tomorrow.sunrise += 100;
                    times.tomorrow.sunset += 100;
                }
                sunInt = setInterval(callback, 10);
            } else {
                console.error(xhr.status);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

var SSTime = function (arr) {
    this.yesterday = arr[0];
    this.today = arr[1];
    this.tomorrow = arr[2];
}


var start = Date.now();
function rotateSun() {
    var date = new Date();
    var decTime = date.getHours() * 100 + date.getMinutes() + date.getMilliseconds() / 1000;
    var t1;
    var t2;
    var offset = false;
    var dSec;
    if (decTime < times.today.sunrise) {
        t1 = times.yesterday.sunset;
        t2 = times.today.sunrise;
        dSec = 86400 - convertToSeconds(t1) + convertToSeconds(t2);
    } else if (decTime > times.today.sunrise && decTime < times.today.sunset) {
        t1 = times.today.sunrise;
        t2 = times.today.sunset;
        dSec = convertToSeconds(t2) - convertToSeconds(t1);
        offset = true;
    } else if (decTime > times.today.sunrise) {
        t1 = times.today.sunset;
        t2 = times.tomorrow.sunrise;
        dSec = 86400 - convertToSeconds(t1) + convertToSeconds(t2);
    }
    var t1Sec = convertToSeconds(t1);
    var degree = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() - t1Sec) / dSec * 180;
    console.log(degree);
    degree += !offset ? 180 : 0;

    for (var i = 0; i < 2; i++) {
        document.getElementsByClassName("dayNightCircle")[i].setAttribute("transform", "rotate(" + degree + " 60 60)");
    }
    document.getElementById("dayNightBar").setAttribute("transform", "rotate(" + degree + " 60 60)");
    if (Date.now() > start + 1000 * 60 * 60 * 24) {
        clearInterval(sunInt);
        getTimes("TX", "Austin", Date.now(), rotateSun);
    }
}

function convertToSeconds(num) {
    var str = "0" + num.toString();
    var hour = Number.parseInt(str[str.length - 4] + str[str.length - 3]);
    var minute = Number.parseInt(str[str.length - 2] + str[str.length - 1]);
    return hour * 3600 + minute * 60;
}

function generateOuterCircle() {
    for (var i = 0; i < 6; i++) {
        var tri = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        tri.setAttribute("points", "60 60, " + (60 - 60 * Math.tan(30 * Math.PI / 180)) + " 120 " + (60 + 60 * Math.tan(30 * Math.PI / 180)) + " 120");
        tri.setAttribute("transform", "rotate(" + (60 * i) + " 60, 60)");
        tri.setAttribute("clip-path", "url(#clipInner)");
        tri.setAttribute("class", "outer");
        var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", "outerGradient" + i);
        gradient.setAttribute("x1", 0, );
        gradient.setAttribute("x2", 1);
        gradient.setAttribute("y1", 0);
        gradient.setAttribute("y2", 0);
        document.getElementsByTagName("defs")[0].appendChild(gradient);
        tri.setAttribute("fill", "url(#outerGradient" + i + ")");
        var stops = [];
        var colors = [];
        switch (i) {
            case 0: { //bottom
                colors[0] = "#a2a2af";
                colors[1] = "#4666c1";
                colors[2] = "#a2a2af";
                break;
            }
            case 1: {
                colors[2] = "#a2a2af";
                colors[1] = "#feab75";
                colors[0] = "#a2a2af";
                break;
            }
            case 2: {
                colors[0] = "#3e3e54";
                colors[1] = "#636377";
                // colors[2] = "#a2a2af";
                colors[2] = "#3e3e54";
                break;
            }
            case 3: {
                colors[0] = "#3e3e54";
                colors[1] = "#242430";
                colors[2] = "#3e3e54";
                break;
            }
            case 4: {
                colors[0] = "#3e3e54";
                colors[1] = "#636377";
                // colors[2] = "#a2a2af";
                colors[2] = "#3e3e54";
                break;
            }
            case 5: {
                colors[0] = "#cb8e86";
                colors[1] = "#feab75";
                colors[2] = "#a2a2af";
                break;
            }
        }
        for (var j = 0; j < colors.length; j++) {
            stops[j] = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stops[j].setAttribute("offset", j / (colors.length - 1));
            stops[j].setAttribute("stop-color", colors[j]);
            gradient.appendChild(stops[j]);
        }
        document.getElementById("clock").appendChild(tri);
    }
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", 60);
    circle.setAttribute("cy", 60);
    circle.setAttribute("r", 70);
    circle.setAttribute("stroke-width", 20);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("fill-opacity", 0);
    document.getElementById("clock").appendChild(circle);
}

function rotateTime() {
    var date = new Date();
    var degree;
    for (var i = 0; i < 2; i++) {
        degree = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 240;
        document.getElementsByClassName("afternoonMorningCircle")[i].setAttribute("transform", "rotate(" + (degree + 90) + " 60 60)");
    }
    for (var i = 0; i < 6; i++) {
        document.getElementsByClassName("outer")[i].setAttribute("transform", "rotate(" + (degree + 60 * i) + " 60 60)");
    }
}

