var container, stats, camera, scene, renderer, group, particle = [],
    mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    watchID = null,
    XX = 0,
    YY = 0,
    ZZ = 0,
    accX = 1,
    accY = 2,
    accZ = 3,
    countmsg = 1,
    material, program, mysid, othersid = new Set([]),
    connectStatus = false;
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
        console.log('device is ready');
        getCurrentSSID();
        startWatch();
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

    XX = acceleration.x;
    YY = acceleration.y;
    ZZ = acceleration.z;
    // socket.emit('my room event', { room: 'ensamble', data: XX + ' ' + YY + ' ' + ZZ });
}
// onError: Failed to get the acceleration
//
function onError() {
    alert('onError!');
}

function init() {
    container = document.createElement('div');
    $('.container').append(container);
    //document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    var PI2 = Math.PI * 2;
    program = function(context) {
        context.beginPath();
        context.arc(0, 0, 0.5, 0, PI2, true);
        context.fill();
    };
    group = new THREE.Group();
    scene.add(group);
    for (var i = 0; i < 50; i++) {
        //console.log('creating balls!');
        material = new THREE.SpriteCanvasMaterial({
            color: Math.random() * 0x808008 + 0x808080,
            sort: true,
            program: program
        });
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add(particle);
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    container.appendChild(stats.dom);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    //window.addEventListener("deviceorientation", ondevicemotion, false);
}

function updateBalls(valX, valY, valZ) {
    if (countmsg < 2) {
        //console.log('balls added!');
        var PI2 = Math.PI * 2;
        program = function(context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        };
        material = new THREE.SpriteCanvasMaterial({
            color: Math.random() * 0x808008 + 0x808080,
            program: program
        });
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2000 - 500;
        particle.position.y = Math.random() * 2000 - 500;
        particle.position.z = Math.random() * 2000 - 500;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add(particle);
    } else {
        //moveBalls(valX, valY, valZ);
    }
}

function moveBalls(valX, valY, valZ) {
    group.scale.x = valX;
    group.scale.y = valY;
}

function otherBalls(valX, valY, valZ) {
    particle.position.x = valX * 1000;
    particle.position.y = valY * 1000;
    particle.position.z = 0;
    particle.scale.x = particle.scale.y = valX * 750 + 200;
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1 && connectStatus == true) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
        socket.emit('my room event', { room: 'ensamble', data: XX + ' ' + YY + ' ' + ZZ });
        updateBalls(mouseX, mouseY, ZZ);
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

// window.ondevicemotion = function(event) {
//         accX = event.accelerationIncludingGravity.x;
//         accY = event.accelerationIncludingGravity.y;
//         accZ = event.accelerationIncludingGravity.z;
//     }
//

function render() {
    camera.position.x += (Math.round(XX) - camera.position.x) * 0.05;
    camera.position.y += (-Math.round(YY) - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    group.rotation.x += XX / 1000;
    group.rotation.y += YY / 1000;
    group.position.x = XX / 500;
    group.position.y = YY / 500;
    renderer.render(scene, camera);
}

//console.log('accX:' + accX);

//$(document).ready(function() {
var namespace = '/test';
var socket = io.connect('http://192.168.0.159:5000' + namespace);

socket.on('connect', function() {
    socket.emit('my event', { data: 'I\'m connected!' });
    connectStatus = true;
    $('#conectar').hide();
});
socket.on('disconnect', function() {
    $('#conectar').show();
    //$('#log').append('<br>Disconnected');
});
socket.on('my response', function(msg) {
    // $('#log').append('<br>Received: ' + msg.data);
    //console.log('countmsg: ' + countmsg);

});
socket.on('joinroom', function(val) {
    //console.log('sid: ' + JSON.stringify(val.sid));
    mysid = val.sid;
});
socket.on('ensamble', function(msg) {
    //$('#log').append('<br>Received: ' + msg.data);
    countmsg++;
    updateBalls(XX, YY, ZZ);
    //console.log('data XYZ: ' + JSON.stringify(msg.data));
    //console.log('sid' + JSON.stringify(msg.sid));
    if (mysid != msg.sid) {
        console.log('msg id:' + msg.sid);
        var msgsid = msg.sid;
        var msgdata = msg.data;
        var otherdata = { msgsid: msgsid, msgdata: msgdata }
        othersid.add(otherdata);
        //console.log('othersid: ' + JSON.stringify(othersid));
        for (let item of othersid) console.log('othersid:' + item.msgsid + item.msgdata);
        console.log('msgid othersid: ' + item.msgsid);
        console.log('data othersid: ' + item.msgdata);
        var alldataballs = item.msgdata;
        alldataballs = alldataballs.split(' ');
        console.log('data for ballsX:' + alldataballs[0]);
        console.log('data for ballsY:' + alldataballs[1]);
        otherBalls(alldataballs[0], alldataballs[1]);
        //put a ball with name and move it:

    }

});
// $('#conectar').on('click', function(event) {
//     socket.emit('join', { room: 'ensamble' });
// });
// $('#hola').on('click', function(event) {
//     socket.emit('join', { room: 'ensamble' });
//     startWatch();
// });
init();
animate();
//startWatch();

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

// $(document).ready(function() {
// $('#conectar').click(function() {
//     try {
//         WifiWizard.isWifiEnabled(win, fail);
//     } catch (err) {
//         alert("Plugin Error - " + err.message);
//     }

// });

$('#conectar').click(function() {
    getCurrentSSID()

});

function win(e) {
    if (e) {
        console.log("Wifi enabled already");
        var config = WifiWizard.formatWPAConfig("MrRobot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function() {
            WifiWizard.connectNetwork("MrRobot");

        });
    } else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        var config = WifiWizard.formatWPAConfig("MrRobot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function() {
            WifiWizard.connectNetwork("MrRobot");

        });
    }

}

function fail(e) {
    console.log("Error checking Wifi status");
}

function winEnable(e) {
    console.log("Wifi enabled successfully");
}

function failEnable(e) {
    console.log("Error enabling Wifi ");
}

function ssidHandler(s) {
    //alert("Current SSID" + s);
    console.log('ssid: ' + s);
    if (s = '"MrRobot"') {
        console.log('MrRobot found!');
        socket.emit('join', { room: 'ensamble' });
    } else {
        try {
            WifiWizard.isWifiEnabled(win, fail);
        } catch (err) {
            alert("Plugin Error - " + err.message);
        }
    }
}

function fail(e) {
    alert("Failed" + e);
}

function getCurrentSSID() {
    WifiWizard.getCurrentSSID(ssidHandler, fail);
}