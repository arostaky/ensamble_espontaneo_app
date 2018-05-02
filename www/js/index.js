var container, stats, camera, scene, renderer, group, particle, mouseX = 0,
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
    material, program;
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
// Start watching the acceleration
//
function startWatch() {
    // Update acceleration every 100 milliseconds
    var options = { frequency: 250 };
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
    socket.emit('my room event', { room: 'ensamble', data: XX + ' ' + YY + ' ' + ZZ });
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
    for (var i = 0; i < 5; i++) {
        console.log('creating balls!');
        material = new THREE.SpriteCanvasMaterial({
            color: Math.random() * 0x808008 + 0x808080,
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
    console.log('balls added!');
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
    particle.position.x = Math.round(valX) * 2000 - 1000;
    particle.position.y = Math.round(valY) * 2000 - 1000;
    particle.position.z = Math.round(valZ) * 2000 - 1000;
    particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
    group.add(particle);
    if (countmsg > 250) {
        group.remove(particle);
        countmsg = 50;
        console.log('mas de 250');
    }
}

//document.addEventListener('mousemove', onDocumentMouseMove, false);

//
//window.addEventListener('resize', onWindowResize, false);

// function onWindowResize() {
//     windowHalfX = window.innerWidth / 2;
//     windowHalfY = window.innerHeight / 2;
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// }
//
// function onDocumentMouseMove(event) {
//     mouseX = event.clientX - windowHalfX;
//     mouseY = event.clientY - windowHalfY;
// }

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
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
    group.rotation.x += 0.01;
    group.rotation.y += 0.02;
    renderer.render(scene, camera);
}

//console.log('accX:' + accX);

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
    //console.log('countmsg: ' + countmsg);

});
socket.on('ensamble', function(msg) {
    //$('#log').append('<br>Received: ' + msg.data);
    countmsg++;
    //updateMatrix(XX, YY, ZZ);
});
// $('#conectar').on('click', function(event) {
//     socket.emit('join', { room: 'ensamble' });
// });
$('#hola').on('click', function(event) {
    socket.emit('join', { room: 'ensamble' });
    //startWatch();
});
init();
animate();

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
    try {
        WifiWizard.isWifiEnabled(win, fail);
    } catch (err) {
        alert("Plugin Error - " + err.message);
    }

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