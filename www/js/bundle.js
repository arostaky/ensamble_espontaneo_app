/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var container, stats, camera, scene, renderer, group, particle = [], mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, watchID = null, XX = 0, YY = 0, ZZ = 0, accX = 1, accY = 2, accZ = 3, countmsg = 1, material, program, mysid, connectStatus = false, alldataballs, deviceisReady = false;
var othersid = new Set();
var counter = 0, change = false, localCounter = localStorage.getItem('count');
function setCounter(val) {
    if (localCounter == null) {
        localStorage.setItem('count', val);
        counter = val;
    }
    else {
        counter = localCounter;
        // if (counter != parseInt(localCounter)) {
        //     counter = parseInt(localCounter);
        //     change = true;
        // }
    }
}
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("menubutton", onMenuKeyDown, false);
        document.addEventListener("pause", onPause, false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        console.log('device is ready');
        getCurrentSSID();
        startWatch();
        deviceisReady = true;
        //navigator.gyroscope.watch(onSuccess, onError, options);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
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
function onBackKeyDown() {
    console.log('back key pressed!');
    socket.emit('disconnect request');
    localStorage.clear();
    navigator.app.exitApp();
}
function onMenuKeyDown() {
    console.log('menu key pressed');
    socket.emit('disconnect request');
    localStorage.clear();
}
function onPause() {
    console.log('app on pause');
    socket.emit('disconnect request');
    localStorage.clear();
}
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
    //camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //camera.position.z = 1000;
    scene = new THREE.Scene();
    var PI2 = Math.PI * 2;
    program = function (context) {
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
    //stats = new Stats();
    //container.appendChild(stats.dom);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);
    //window.addEventListener("deviceorientation", ondevicemotion, false);
}
function updateBalls(valX, valY, valZ) {
    if (countmsg < 2) {
        //console.log('balls added!');
        var PI2 = Math.PI * 2;
        program = function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        };
        material = new THREE.SpriteCanvasMaterial({
            color: Math.random() * 0x808008 + 0x808080,
            program: program
        });
        particle = new THREE.Sprite(material);
        particle.position.x = valX * 2000 - 500;
        particle.position.y = valY * 2000 - 500;
        particle.position.z = Math.random() * 2000 - 500;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add(particle);
    }
    else {
        //moveBalls(valX, valY, valZ);
    }
}
function moveBalls(valX, valY, valZ) {
    group.scale.x = valX;
    group.scale.y = valY;
}
function otherBalls(valX, valY, valZ) {
    console.log('data for ballsX:' + valX);
    console.log('data for ballsY:' + valY);
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // scene = new THREE.Scene();
    // // Create a circle around the mouse and move it
    // // The sphere has opacity 0
    // var mouseGeometry = new THREE.SphereGeometry(1, 0, 0);
    // var mouseMaterial = new THREE.MeshBasicMaterial({
    //     color: 0x0000ff
    // });
    // mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
    // mouseMesh.position.z = -5;
    // scene.add(mouseMesh);
    // // Make the sphere follow the mouse
    // var vector = new THREE.Vector3(valX, valY, 0.5);
    // vector.unproject(camera);
    // var dir = vector.sub(camera.position).normalize();
    // var distance = -camera.position.z / dir.z;
    // var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    // mouseMesh.position.copy(pos);
    // particle.position.x = valX * 2000 - 500;
    // particle.position.y = valY * 2000 - 500;
    // particle.position.z = Math.random() * 2000 - 500;
    // particle.scale.x = particle.scale.y = Math.random() * 200 + 100;
    // group.add(particle);
}
function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length === 1 && connectStatus == true) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
        // console.log('mouseX:' + mouseX);
        // console.log('mouseY: ' + mouseY);
        //socket.emit('my room event', { room: 'ensamble', data: mouseX * XX + ' ' + mouseY * YY + ' ' + ZZ, counter: counter });
        socket.emit('my room event', { room: 'ensamble', data: mouseX + ' ' + mouseY + ' ' + XX + ' ' + YY + ' ' + ZZ, counter: counter });
        //updateBalls(mouseX, mouseY, XX, YY, ZZ);
    }
}
function onDocumentTouchEnd(event) {
    if (event.touches.length === 0 && connectStatus == true) {
        socket.emit('my room event', { room: 'ensamble', data: 0 + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + 0, counter: counter });
    }
}
// window.ondevicemotion = function(event) {
//         accX = event.accelerationIncludingGravity.x;
//         accY = event.accelerationIncludingGravity.y;
//         accZ = event.accelerationIncludingGravity.z;
//     }
//
function render() {
    renderer.autoClear = false;
    renderer.clear();
    //camera.position.set(0, 0, 5);
    // camera.position.x += (Math.round(XX) - camera.position.x) * 0.05;
    // camera.position.y += (-Math.round(YY) - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    group.rotation.x += XX / 1000;
    group.rotation.y += YY / 1000;
    group.position.x += XX / 500;
    group.position.y += YY / 500;
    renderer.render(scene, camera);
}
//console.log('accX:' + accX);
//$(document).ready(function() {
var namespace = '/test';
var socket = io.connect('http://192.168.0.1:5000' + namespace);
socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m connected!' });
    connectStatus = true;
    $('#conectar').hide();
    if (deviceisReady == true) {
        window.plugins.toast.showShortTop('Conectado', function (a) {
            console.log('toast success: ' + a);
        }, function (b) {
            //alert('toast error: ' + b)
        });
    }
});
socket.on('disconnect', function () {
    window.plugins.toast.showShortTop('Desconectado', function (a) {
        console.log('toast success: ' + a);
    }, function (b) {
        //alert('toast error: ' + b)
    });
    $('#conectar').show();
    //$('#log').append('<br>Disconnected');
});
socket.on('my response', function (msg) {
    // $('#log').append('<br>Received: ' + msg.data);
    //console.log('countmsg: ' + countmsg);
});
socket.on('my response count', function (msg) {
    //$('#log').append('<br>Received: ' + msg.data + msg.count);
    setCounter(msg.count);
});
socket.on('joinroom', function (val) {
    //console.log('sid: ' + JSON.stringify(val.sid));
    mysid = val.sid;
});
socket.on('ensamble', function (msg) {
    //$('#log').append('<br>Received: ' + msg.data);
    countmsg++;
    updateBalls(XX, YY, ZZ);
    //console.log('data XYZ: ' + JSON.stringify(msg.data));
    //console.log('sid' + JSON.stringify(msg.sid));
    if (mysid != msg.sid) {
        //console.log('msg id:' + msg.sid);
        var msgsid = msg.sid;
        var msgdata = msg.data;
        var otherdata = { 'msgsid': msgsid, 'msgdata': msgdata };
        othersid.add(otherdata);
        //console.log('otherdata: ' + JSON.stringify(otherdata));
        //console.log('othersid: ' + JSON.stringify(othersid));
        //for (let item of othersid) console.log('othersid:' + item.msgsid + item.msgdata);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        var item;
        try {
            for (var _iterator = othersid[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                item = _step.value;
                //console.log('othersid:' + item.msgsid + item.msgdata);
            }
        }
        catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        }
        finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            }
            finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        alldataballs = item.msgdata;
        alldataballs = alldataballs.split(' ');
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
    //stats.update();
}
// $(document).ready(function() {
// $('#conectar').click(function() {
//     try {
//         WifiWizard.isWifiEnabled(win, fail);
//     } catch (err) {
//         alert("Plugin Error - " + err.message);
//     }
// });
$('#conectar').click(function () {
    console.log('tap on conectar!!');
    getCurrentSSID();
    socket.connect();
    socket.emit('join', { room: 'ensamble' });
});
function win(e) {
    var config = WifiWizard.formatWPAConfig("Ensamble", "Ensamble123");
    if (e) {
        console.log("Wifi enabled already");
        WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork("Ensamble");
        });
    }
    else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork("Ensamble");
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
    if (s == '"Ensamble"') {
        console.log('Ensamble found!');
        socket.emit('join', { room: 'ensamble' });
    }
    else {
        try {
            WifiWizard.isWifiEnabled(win, fail);
            var config = WifiWizard.formatWPAConfig("Ensamble", "Ensamble123");
            WifiWizard.addNetwork(config, function () {
                WifiWizard.connectNetwork("Ensamble");
            });
        }
        catch (err) {
            console.log('Plugin Error -' + err.message);
            //alert("Plugin Error - " + err.message);
        }
    }
}
function fail(e) {
    //alert("Failed" + e);
    console.log('wifi disabled');
}
function getCurrentSSID() {
    WifiWizard.getCurrentSSID(ssidHandler, fail);
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmI0OTVkMWIxZDZiMzgwZTJkMTAiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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QUMsT0FBTyxDQUFDLENBQUM7WUFDNUMseUNBQXlDO1FBQzdDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQWMsQ0FBQztJQUNYLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDtJQUNJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmI0OTVkMWIxZDZiMzgwZTJkMTAiLCJ2YXIgY29udGFpbmVyLCBzdGF0cywgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXIsIGdyb3VwLCBwYXJ0aWNsZSA9IFtdLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMixcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIsXG4gICAgd2F0Y2hJRCA9IG51bGwsXG4gICAgWFggPSAwLFxuICAgIFlZID0gMCxcbiAgICBaWiA9IDAsXG4gICAgYWNjWCA9IDEsXG4gICAgYWNjWSA9IDIsXG4gICAgYWNjWiA9IDMsXG4gICAgY291bnRtc2cgPSAxLFxuICAgIG1hdGVyaWFsLCBwcm9ncmFtLCBteXNpZCxcbiAgICBjb25uZWN0U3RhdHVzID0gZmFsc2UsXG4gICAgYWxsZGF0YWJhbGxzLFxuICAgIGRldmljZWlzUmVhZHkgPSBmYWxzZTtcbmNvbnN0IG90aGVyc2lkID0gbmV3IFNldCgpO1xudmFyIGNvdW50ZXIgPSAwLFxuICAgIGNoYW5nZSA9IGZhbHNlLFxuICAgIGxvY2FsQ291bnRlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb3VudCcpO1xuXG5mdW5jdGlvbiBzZXRDb3VudGVyKHZhbCkge1xuICAgIGlmIChsb2NhbENvdW50ZXIgPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY291bnQnLCB2YWwpO1xuICAgICAgICBjb3VudGVyID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvdW50ZXIgPSBsb2NhbENvdW50ZXI7XG4gICAgICAgIC8vIGlmIChjb3VudGVyICE9IHBhcnNlSW50KGxvY2FsQ291bnRlcikpIHtcbiAgICAgICAgLy8gICAgIGNvdW50ZXIgPSBwYXJzZUludChsb2NhbENvdW50ZXIpO1xuICAgICAgICAvLyAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxufVxudmFyIGFwcCA9IHtcbiAgICAvLyBBcHBsaWNhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkRXZlbnQoJ2RldmljZXJlYWR5Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2UgaXMgcmVhZHknKTtcbiAgICAgICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgICAgICBkZXZpY2Vpc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy9uYXZpZ2F0b3IuZ3lyb3Njb3BlLndhdGNoKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBET00gb24gYSBSZWNlaXZlZCBFdmVudFxuICAgIHJlY2VpdmVkRXZlbnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIC8vIHZhciBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvL3ZhciBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJyk7XG4gICAgICAgIC8vdmFyIHJlY2VpdmVkRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2VpdmVkJyk7XG5cbiAgICAgICAgLy8gbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICAgICAgLy8gcmVjZWl2ZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jazsnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgRXZlbnQ6ICcgKyBpZCk7XG4gICAgfVxufTtcbmFwcC5pbml0aWFsaXplKCk7XG4vLyBTdGFydCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25CYWNrS2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnYmFjayBrZXkgcHJlc3NlZCEnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgbmF2aWdhdG9yLmFwcC5leGl0QXBwKCk7XG59XG5cbmZ1bmN0aW9uIG9uTWVudUtleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ21lbnUga2V5IHByZXNzZWQnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIG9uUGF1c2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCBvbiBwYXVzZScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgICAvLyBVcGRhdGUgYWNjZWxlcmF0aW9uIGV2ZXJ5IDEwMCBtaWxsaXNlY29uZHNcbiAgICB2YXIgb3B0aW9ucyA9IHsgZnJlcXVlbmN5OiAxMDAgfTtcbiAgICB3YXRjaElEID0gbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIud2F0Y2hBY2NlbGVyYXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbn1cbi8vIFN0b3Agd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIHN0b3BXYXRjaCgpIHtcbiAgICBpZiAod2F0Y2hJRCkge1xuICAgICAgICBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci5jbGVhcldhdGNoKHdhdGNoSUQpO1xuICAgICAgICB3YXRjaElEID0gbnVsbDtcbiAgICB9XG59XG4vLyBvblN1Y2Nlc3M6IEdldCBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uU3VjY2VzcyhhY2NlbGVyYXRpb24pIHtcblxuICAgIFhYID0gYWNjZWxlcmF0aW9uLng7XG4gICAgWVkgPSBhY2NlbGVyYXRpb24ueTtcbiAgICBaWiA9IGFjY2VsZXJhdGlvbi56O1xuICAgIC8vIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBYWCArICcgJyArIFlZICsgJyAnICsgWlogfSk7XG59XG4vLyBvbkVycm9yOiBGYWlsZWQgdG8gZ2V0IHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkVycm9yKCkge1xuICAgIGFsZXJ0KCdvbkVycm9yIScpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICQoJy5jb250YWluZXInKS5hcHBlbmQoY29udGFpbmVyKTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAzMDAwKTtcbiAgICAvL2NhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG4gICAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9O1xuICAgIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgc2NlbmUuYWRkKGdyb3VwKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY3JlYXRpbmcgYmFsbHMhJyk7XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHNvcnQ6IHRydWUsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH1cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5DYW52YXNSZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIC8vc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2hTdGFydCwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uRG9jdW1lbnRUb3VjaE1vdmUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uRG9jdW1lbnRUb3VjaEVuZCwgZmFsc2UpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBvbmRldmljZW1vdGlvbiwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgaWYgKGNvdW50bXNnIDwgMikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdiYWxscyBhZGRlZCEnKTtcbiAgICAgICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgICAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSB2YWxZICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBncm91cC5zY2FsZS54ID0gdmFsWDtcbiAgICBncm91cC5zY2FsZS55ID0gdmFsWTtcbn1cblxuZnVuY3Rpb24gb3RoZXJCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWDonICsgdmFsWCk7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWTonICsgdmFsWSk7XG4gICAgLy8gY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAvLyBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIC8vIC8vIENyZWF0ZSBhIGNpcmNsZSBhcm91bmQgdGhlIG1vdXNlIGFuZCBtb3ZlIGl0XG4gICAgLy8gLy8gVGhlIHNwaGVyZSBoYXMgb3BhY2l0eSAwXG4gICAgLy8gdmFyIG1vdXNlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgMCwgMCk7XG4gICAgLy8gdmFyIG1vdXNlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIC8vICAgICBjb2xvcjogMHgwMDAwZmZcbiAgICAvLyB9KTtcbiAgICAvLyBtb3VzZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChtb3VzZUdlb21ldHJ5LCBtb3VzZU1hdGVyaWFsKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24ueiA9IC01O1xuICAgIC8vIHNjZW5lLmFkZChtb3VzZU1lc2gpO1xuICAgIC8vIC8vIE1ha2UgdGhlIHNwaGVyZSBmb2xsb3cgdGhlIG1vdXNlXG4gICAgLy8gdmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKHZhbFgsIHZhbFksIDAuNSk7XG4gICAgLy8gdmVjdG9yLnVucHJvamVjdChjYW1lcmEpO1xuICAgIC8vIHZhciBkaXIgPSB2ZWN0b3Iuc3ViKGNhbWVyYS5wb3NpdGlvbikubm9ybWFsaXplKCk7XG4gICAgLy8gdmFyIGRpc3RhbmNlID0gLWNhbWVyYS5wb3NpdGlvbi56IC8gZGlyLno7XG4gICAgLy8gdmFyIHBvcyA9IGNhbWVyYS5wb3NpdGlvbi5jbG9uZSgpLmFkZChkaXIubXVsdGlwbHlTY2FsYXIoZGlzdGFuY2UpKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24uY29weShwb3MpO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnggPSB2YWxYICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWSAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwMCArIDEwMDtcbiAgICAvLyBncm91cC5hZGQocGFydGljbGUpO1xufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hTdGFydChldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgJiYgY29ubmVjdFN0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VYOicgKyBtb3VzZVgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VZOiAnICsgbW91c2VZKTtcbiAgICAgICAgLy9zb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogbW91c2VYICogWFggKyAnICcgKyBtb3VzZVkgKiBZWSArICcgJyArIFpaLCBjb3VudGVyOiBjb3VudGVyIH0pO1xuICAgICAgICBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogbW91c2VYICsgJyAnICsgbW91c2VZICsgJyAnICsgWFggKyAnICcgKyBZWSArICcgJyArIFpaLCBjb3VudGVyOiBjb3VudGVyIH0pO1xuICAgICAgICAvL3VwZGF0ZUJhbGxzKG1vdXNlWCwgbW91c2VZLCBYWCwgWVksIFpaKTtcbiAgICB9XG59XG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hFbmQoZXZlbnQpe1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMCAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpe1xuICAgIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiAwICsgJyAnICsgMCArICcgJyArIDAgKyAnICcgKyAwICsgJyAnICsgMCwgY291bnRlcjogY291bnRlciB9KTtcbiAgICB9XG59XG5cbi8vIHdpbmRvdy5vbmRldmljZW1vdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgIGFjY1ggPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4vLyAgICAgICAgIGFjY1kgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4vLyAgICAgICAgIGFjY1ogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4vLyAgICAgfVxuLy9cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHJlbmRlcmVyLmNsZWFyKCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24uc2V0KDAsIDAsIDUpO1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi54ICs9IChNYXRoLnJvdW5kKFhYKSAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDU7XG4gICAgLy8gY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1NYXRoLnJvdW5kKFlZKSAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgZ3JvdXAucm90YXRpb24ueCArPSBYWCAvIDEwMDA7XG4gICAgZ3JvdXAucm90YXRpb24ueSArPSBZWSAvIDEwMDA7XG4gICAgZ3JvdXAucG9zaXRpb24ueCArPSBYWCAvIDUwMDtcbiAgICBncm91cC5wb3NpdGlvbi55ICs9IFlZIC8gNTAwO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn1cblxuLy9jb25zb2xlLmxvZygnYWNjWDonICsgYWNjWCk7XG5cbi8vJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG52YXIgbmFtZXNwYWNlID0gJy90ZXN0JztcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vMTkyLjE2OC4wLjE6NTAwMCcgKyBuYW1lc3BhY2UpO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICBzb2NrZXQuZW1pdCgnbXkgZXZlbnQnLCB7IGRhdGE6ICdJXFwnbSBjb25uZWN0ZWQhJyB9KTtcbiAgICBjb25uZWN0U3RhdHVzID0gdHJ1ZTtcbiAgICAkKCcjY29uZWN0YXInKS5oaWRlKCk7XG4gICAgaWYgKGRldmljZWlzUmVhZHkgPT0gdHJ1ZSkge1xuICAgICAgICB3aW5kb3cucGx1Z2lucy50b2FzdC5zaG93U2hvcnRUb3AoJ0NvbmVjdGFkbycsIGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICAgICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbnNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnRGVzY29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICBjb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgfSk7XG4gICAgJCgnI2NvbmVjdGFyJykuc2hvdygpO1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPkRpc2Nvbm5lY3RlZCcpO1xufSk7XG5zb2NrZXQub24oJ215IHJlc3BvbnNlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEpO1xuICAgIC8vY29uc29sZS5sb2coJ2NvdW50bXNnOiAnICsgY291bnRtc2cpO1xuXG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UgY291bnQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhICsgbXNnLmNvdW50KTtcbiAgICBzZXRDb3VudGVyKG1zZy5jb3VudCk7XG59KTtcbnNvY2tldC5vbignam9pbnJvb20nLCBmdW5jdGlvbih2YWwpIHtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeSh2YWwuc2lkKSk7XG4gICAgbXlzaWQgPSB2YWwuc2lkO1xufSk7XG5zb2NrZXQub24oJ2Vuc2FtYmxlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgY291bnRtc2crKztcbiAgICB1cGRhdGVCYWxscyhYWCwgWVksIFpaKTtcbiAgICAvL2NvbnNvbGUubG9nKCdkYXRhIFhZWjogJyArIEpTT04uc3RyaW5naWZ5KG1zZy5kYXRhKSk7XG4gICAgLy9jb25zb2xlLmxvZygnc2lkJyArIEpTT04uc3RyaW5naWZ5KG1zZy5zaWQpKTtcbiAgICBpZiAobXlzaWQgIT0gbXNnLnNpZCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdtc2cgaWQ6JyArIG1zZy5zaWQpO1xuICAgICAgICB2YXIgbXNnc2lkID0gbXNnLnNpZDtcbiAgICAgICAgdmFyIG1zZ2RhdGEgPSBtc2cuZGF0YTtcbiAgICAgICAgdmFyIG90aGVyZGF0YSA9IHsgJ21zZ3NpZCc6IG1zZ3NpZCwgJ21zZ2RhdGEnOiBtc2dkYXRhIH1cbiAgICAgICAgb3RoZXJzaWQuYWRkKG90aGVyZGF0YSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KG90aGVyZGF0YSkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcnNpZDogJyArIEpTT04uc3RyaW5naWZ5KG90aGVyc2lkKSk7XG4gICAgICAgIC8vZm9yIChsZXQgaXRlbSBvZiBvdGhlcnNpZCkgY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGl0ZW07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvdGhlcnNpZFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhbGxkYXRhYmFsbHMgPSBpdGVtLm1zZ2RhdGE7XG4gICAgICAgIGFsbGRhdGFiYWxscyA9IGFsbGRhdGFiYWxscy5zcGxpdCgnICcpO1xuICAgICAgICBvdGhlckJhbGxzKGFsbGRhdGFiYWxsc1swXSwgYWxsZGF0YWJhbGxzWzFdKTtcbiAgICAgICAgLy9wdXQgYSBiYWxsIHdpdGggbmFtZSBhbmQgbW92ZSBpdDpcblxuICAgIH1cblxufSk7XG4vLyAkKCcjY29uZWN0YXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuLy8gfSk7XG4vLyAkKCcjaG9sYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyAgICAgc3RhcnRXYXRjaCgpO1xuLy8gfSk7XG5pbml0KCk7XG5hbmltYXRlKCk7XG4vL3N0YXJ0V2F0Y2goKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgcmVuZGVyKCk7XG4gICAgLy9zdGF0cy51cGRhdGUoKTtcbn1cblxuLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4vLyAkKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbi8vICAgICB9IGNhdGNoIChlcnIpIHtcbi8vICAgICAgICAgYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbi8vICAgICB9XG5cbi8vIH0pO1xuXG4kKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygndGFwIG9uIGNvbmVjdGFyISEnKTtcbiAgICBnZXRDdXJyZW50U1NJRCgpO1xuICAgIHNvY2tldC5jb25uZWN0KCk7XG4gICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiB3aW4oZSkge1xuICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgaWYgKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgYWxyZWFkeVwiKTtcbiAgICAgICAgXG4gICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFdpZmlXaXphcmQuc2V0V2lmaUVuYWJsZWQodHJ1ZSwgd2luRW5hYmxlLCBmYWlsRW5hYmxlKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9PSAnXCJFbnNhbWJsZVwiJykge1xuICAgICAgICBjb25zb2xlLmxvZygnRW5zYW1ibGUgZm91bmQhJyk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG4gICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIEVycm9yIC0nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgLy9hbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICAvL2FsZXJ0KFwiRmFpbGVkXCIgKyBlKTtcbiAgICBjb25zb2xlLmxvZygnd2lmaSBkaXNhYmxlZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U1NJRCgpIHtcbiAgICBXaWZpV2l6YXJkLmdldEN1cnJlbnRTU0lEKHNzaWRIYW5kbGVyLCBmYWlsKTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=