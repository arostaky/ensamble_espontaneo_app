/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        console.log('device is ready run gyroscope');
        //startWatch();
        //navigator.gyroscope.watch(onSuccess, onError, options);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
app.initialize();

// function OnOff() {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.addEventListener("readystatechange", function() {
//         // console.log(this.readyState);
//         if (this.readyState === 4) {
//             $('#alert').fadeIn();
//         }
//         if (this.readyState === 404) {
//             alert('Error de conexión');
//         }
//     });
//     xmlhttp.open("GET", "http://192.168.4.1/LED=ONOFF");
//     xmlhttp.send();
// }

var options = { frequency: 300 }; // Update every 3 seconds
var canvas = document.getElementById('canvas'),
    xmax = document.getElementById("canvas").getAttribute("width"),
    ymax = document.getElementById("canvas").getAttribute("height"),
    context = canvas.getContext('2d');
var watchID = null;
var XX, YY, ZZ;
// Start watching the acceleration
//
function startWatch() {
    // Update acceleration every 100 milliseconds
    var options = { frequency: 100 };
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}
// Stop watching the acceleration
//
function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}
// onSuccess: Get a snapshot of the current acceleration
//
function onSuccess(acceleration) {
    var element = document.getElementById('accelerometer');
    element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
        'Acceleration Y: ' + acceleration.y + '<br />' +
        'Acceleration Z: ' + acceleration.z;
    XX = acceleration.x;
    YY = acceleration.y;
    ZZ = acceleration.z;
    // draw the instantaneous acceleration vector on screen
    drawArrow(acceleration.x, acceleration.y, acceleration.z);
    socket.emit('my room event', { room: 'ensamble', data: XX + ' ' + YY + ' ' + ZZ });
    // socket.emit('my room event', { room: 'ensamble', data: YY + ' ' });
    // socket.emit('my room event', { room: 'ensamble', data: ZZ });
}
// onError: Failed to get the acceleration
//
function onError() {
    alert('onError!');
}

function drawArrow(ax, ay, az) {
    // paint canvas black
    context.fillStyle = "black";
    context.fillRect(0, 0, xmax, ymax);
    // draw vertical centerline
    context.beginPath();
    context.moveTo(xmax / 2, 0);
    context.lineTo(xmax / 2, ymax);
    context.strokeStyle = "white";
    context.lineWidth = 0.5;
    context.stroke();
    // draw horizontal centerline
    context.beginPath();
    context.moveTo(0, ymax / 2);
    context.lineTo(xmax, ymax / 2);
    context.strokeStyle = "white";
    context.lineWidth = 0.5;
    context.stroke();
    // draw "X"
    context.font = '20pt Arial';
    context.lineWidth = 2;
    context.strokeStyle = 'yellow';
    context.strokeText("X", canvas.width / 2 + 120, canvas.height / 2 + 10);
    // draw "Y"
    context.font = '20pt Arial';
    context.lineWidth = 2;
    context.strokeStyle = 'yellow';
    context.strokeText("Y", canvas.width / 2 - 10, 25);
    // circe of gravitational acceleration
    context.beginPath();
    context.arc(xmax / 2, ymax / 2, 0.4 * xmax, 0, 2 * Math.PI, false);
    context.strokeStyle = "blue";
    context.lineWidth = 0.5;
    context.stroke();
    // draw yellow acceleration vector
    context.beginPath();
    context.moveTo(xmax / 2, ymax / 2);
    context.lineTo(xmax / 2 + 0.4 * xmax * ax / 9.81, ymax / 2 - 0.4 * ymax * ay / 9.81);
    context.strokeStyle = "yellow";
    context.lineWidth = 5.0;
    context.stroke();
}
//$(document).ready(function() {
var namespace = '/test';
var socket = io.connect('http://192.168.0.159:5000' + namespace);

socket.on('connect', function() {
    socket.emit('my event', { data: 'I\'m connected!' });
});
socket.on('disconnect', function() {
    $('#log').append('<br>Disconnected');
});
socket.on('my response', function(msg) {
    $('#log').append('<br>Received: ' + msg.data);
});
$('#conectar').on('click', function(event) {
    socket.emit('join', { room: 'ensamble' });
});
$('#hola').on('click', function(event) {
    startWatch();
});
// $('form#emit').submit(function(event) {
//     socket.emit('my event', { data: $('#emit_data').val() });
//     return false;
// });
// $('form#broadcast').submit(function(event) {
//     socket.emit('my broadcast event', { data: $('#broadcast_data').val() });
//     return false;
// });
// $('form#join').submit(function(event) {
//     socket.emit('join', { room: $('#join_room').val() });
//     return false;
// });
// $('form#leave').submit(function(event) {
//     socket.emit('leave', { room: $('#leave_room').val() });
//     return false;
// });
// $('form#send_room').submit(function(event) {
//     socket.emit('my room event', { room: $('#room_name').val(), data: $('#room_data').val() });
//     return false;
// });
// $('form#close').submit(function(event) {
//     socket.emit('close room', { room: $('#close_room').val() });
//     return false;
// });
// $('form#disconnect').submit(function(event) {
//     socket.emit('disconnect request');
//     return false;
// });
//});
//var watchID = navigator.gyroscope.watchAngularSpeed(onSuccess, onError, options);

// function onSuccess(speed) {
//     // alert('AngularSpeed:\n' +
//     //     'x: ' + speed.x + '\n' +
//     //     'y: ' + speed.y + '\n' +
//     //     'z: ' + speed.z + '\n' +
//     //     'Timestamp: ' + speed.timestamp + '\n');
//     $('#gx').html(speed.x);
//     $('#gy').html(speed.y);
//     $('#gz').html(speed.z);
//     $('#mainpage').css('background-color', 'rgba(' + Math.round(speed.x) + ',' + Math.round(speed.y) + ',' + Math.round(speed.z) + ')');
//     // $('.newcol').css('top', speed.x);
//     // $('.shifted').css('top', speed.y);

// }

// function onError() {
//     alert('onError!');
// }
// $(document).ready(function() {
//     $('#wifi').click(function() {
//         try {
//             WifiWizard.isWifiEnabled(win, fail);
//         } catch (err) {
//             alert("Plugin Error - " + err.message);
//         }

//     });

//     function win(e) {
//         if (e) {
//             alert("Wifi enabled already");
//         } else {
//             WifiWizard.setWifiEnabled(true, winEnable, failEnable);
//         }

//     }

//     function fail(e) {
//         alert("Error checking Wifi status");
//     }

//     function winEnable(e) {
//         alert("Wifi enabled successfully");
//     }

//     function failEnable(e) {
//         alert("Error enabling Wifi ");
//     }

//     $('#search').click(function() {
//         try {
//             WifiWizard.listNetworks(listHandler, fail);
//         } catch (err) {
//             alert("Plugin Error - " + err.message);
//         }

//     });

//     function listHandler(a) {
//         alert(a);
//     }

//     $('#scan').click(function() {
//         try {
//             WifiWizard.getScanResults({ numLevels: 1 }, listHandler1, fail);
//         } catch (err) {
//             alert("Plugin Error - " + err.message);
//         }

//     });

//     function listHandler1(a) {
//         alert(JSON.stringify(a));
//     }

//     $('#connect').click(function() {
//         try {
//             var config = WifiWizard.formatWPAConfig("Invitados", "invitado123");
//             WifiWizard.addNetwork(config, function() {
//                 WifiWizard.connectNetwork("Invitados");
//             });
//         } catch (err) {
//             alert("Plugin Error - " + err.message);
//         }

//     });

//     function connectSuccess(e) {
//         alert("Connect success");
//     }
//     $('#onoff input').on('click', function() {
//         newOnoff();
//     });

// });