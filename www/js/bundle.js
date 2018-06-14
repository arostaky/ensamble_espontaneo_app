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
        //event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
        startWatch();
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length === 1 && connectStatus == true) {
        //event.preventDefault();
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
        stopWatch();
        console.log('sigue?' + XX);
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
            //console.log('toast success: ' + a)
        }, function (b) {
            //alert('toast error: ' + b)
        });
    }
});
socket.on('disconnect', function () {
    window.plugins.toast.showShortTop('Desconectado', function (a) {
        //console.log('toast success: ' + a)
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
    //updateBalls(XX, YY, ZZ);
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
        //otherBalls(alldataballs[0], alldataballs[1]);
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
    //console.log('tap on conectar!!');
    getCurrentSSID();
    socket.connect();
    socket.emit('join', { room: 'ensamble' });
});
function win(e) {
    var config = WifiWizard.formatWPAConfig("Ensamble", "Ensamble123");
    if (e) {
        //console.log("Wifi enabled already");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDg3MzU3N2ZjYTRhMzhmMGMwMjAiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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LFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwiZmlsZSI6ImpzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ4NzM1NzdmY2E0YTM4ZjBjMDIwIiwidmFyIGNvbnRhaW5lciwgc3RhdHMsIGNhbWVyYSwgc2NlbmUsIHJlbmRlcmVyLCBncm91cCwgcGFydGljbGUgPSBbXSxcbiAgICBtb3VzZVggPSAwLFxuICAgIG1vdXNlWSA9IDAsXG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsXG4gICAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLFxuICAgIHdhdGNoSUQgPSBudWxsLFxuICAgIFhYID0gMCxcbiAgICBZWSA9IDAsXG4gICAgWlogPSAwLFxuICAgIGFjY1ggPSAxLFxuICAgIGFjY1kgPSAyLFxuICAgIGFjY1ogPSAzLFxuICAgIGNvdW50bXNnID0gMSxcbiAgICBtYXRlcmlhbCwgcHJvZ3JhbSwgbXlzaWQsXG4gICAgY29ubmVjdFN0YXR1cyA9IGZhbHNlLFxuICAgIGFsbGRhdGFiYWxscyxcbiAgICBkZXZpY2Vpc1JlYWR5ID0gZmFsc2U7XG5jb25zdCBvdGhlcnNpZCA9IG5ldyBTZXQoKTtcbnZhciBjb3VudGVyID0gMCxcbiAgICBjaGFuZ2UgPSBmYWxzZSxcbiAgICBsb2NhbENvdW50ZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY291bnQnKTtcblxuZnVuY3Rpb24gc2V0Q291bnRlcih2YWwpIHtcbiAgICBpZiAobG9jYWxDb3VudGVyID09IG51bGwpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NvdW50JywgdmFsKTtcbiAgICAgICAgY291bnRlciA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb3VudGVyID0gbG9jYWxDb3VudGVyO1xuICAgICAgICAvLyBpZiAoY291bnRlciAhPSBwYXJzZUludChsb2NhbENvdW50ZXIpKSB7XG4gICAgICAgIC8vICAgICBjb3VudGVyID0gcGFyc2VJbnQobG9jYWxDb3VudGVyKTtcbiAgICAgICAgLy8gICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbn1cbnZhciBhcHAgPSB7XG4gICAgLy8gQXBwbGljYXRpb24gQ29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCB0aGlzLm9uRGV2aWNlUmVhZHkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmFja2J1dHRvblwiLCBvbkJhY2tLZXlEb3duLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtZW51YnV0dG9uXCIsIG9uTWVudUtleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIG9uUGF1c2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gZGV2aWNlcmVhZHkgRXZlbnQgSGFuZGxlclxuICAgIC8vXG4gICAgLy8gQmluZCBhbnkgY29yZG92YSBldmVudHMgaGVyZS4gQ29tbW9uIGV2ZW50cyBhcmU6XG4gICAgLy8gJ3BhdXNlJywgJ3Jlc3VtZScsIGV0Yy5cbiAgICBvbkRldmljZVJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZEV2ZW50KCdkZXZpY2VyZWFkeScpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlIGlzIHJlYWR5Jyk7XG4gICAgICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgICAgIHN0YXJ0V2F0Y2goKTtcbiAgICAgICAgZGV2aWNlaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIC8vbmF2aWdhdG9yLmd5cm9zY29wZS53YXRjaChvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBVcGRhdGUgRE9NIG9uIGEgUmVjZWl2ZWQgRXZlbnRcbiAgICByZWNlaXZlZEV2ZW50OiBmdW5jdGlvbihpZCkge1xuICAgICAgICAvLyB2YXIgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy92YXIgbGlzdGVuaW5nRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpc3RlbmluZycpO1xuICAgICAgICAvL3ZhciByZWNlaXZlZEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWNlaXZlZCcpO1xuXG4gICAgICAgIC8vIGxpc3RlbmluZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmU7Jyk7XG4gICAgICAgIC8vIHJlY2VpdmVkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6YmxvY2s7Jyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIEV2ZW50OiAnICsgaWQpO1xuICAgIH1cbn07XG5hcHAuaW5pdGlhbGl6ZSgpO1xuLy8gU3RhcnQgd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uQmFja0tleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ2JhY2sga2V5IHByZXNzZWQhJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIG5hdmlnYXRvci5hcHAuZXhpdEFwcCgpO1xufVxuXG5mdW5jdGlvbiBvbk1lbnVLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdtZW51IGtleSBwcmVzc2VkJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBvblBhdXNlKCkge1xuICAgIGNvbnNvbGUubG9nKCdhcHAgb24gcGF1c2UnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0V2F0Y2goKSB7XG4gICAgLy8gVXBkYXRlIGFjY2VsZXJhdGlvbiBldmVyeSAxMDAgbWlsbGlzZWNvbmRzXG4gICAgdmFyIG9wdGlvbnMgPSB7IGZyZXF1ZW5jeTogMTAwIH07XG4gICAgd2F0Y2hJRCA9IG5hdmlnYXRvci5hY2NlbGVyb21ldGVyLndhdGNoQWNjZWxlcmF0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG59XG4vLyBTdG9wIHdhdGNoaW5nIHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBzdG9wV2F0Y2goKSB7XG4gICAgaWYgKHdhdGNoSUQpIHtcbiAgICAgICAgbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIuY2xlYXJXYXRjaCh3YXRjaElEKTtcbiAgICAgICAgd2F0Y2hJRCA9IG51bGw7XG4gICAgfVxufVxuLy8gb25TdWNjZXNzOiBHZXQgYSBzbmFwc2hvdCBvZiB0aGUgY3VycmVudCBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvblN1Y2Nlc3MoYWNjZWxlcmF0aW9uKSB7XG5cbiAgICBYWCA9IGFjY2VsZXJhdGlvbi54O1xuICAgIFlZID0gYWNjZWxlcmF0aW9uLnk7XG4gICAgWlogPSBhY2NlbGVyYXRpb24uejtcbiAgICAvLyBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogWFggKyAnICcgKyBZWSArICcgJyArIFpaIH0pO1xufVxuLy8gb25FcnJvcjogRmFpbGVkIHRvIGdldCB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25FcnJvcigpIHtcbiAgICBhbGVydCgnb25FcnJvciEnKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkKCcuY29udGFpbmVyJykuYXBwZW5kKGNvbnRhaW5lcik7XG4gICAgLy9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMzAwMCk7XG4gICAgLy9jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgIC8vY2FtZXJhLnBvc2l0aW9uLnogPSAxMDAwO1xuICAgIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgIHByb2dyYW0gPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgfTtcbiAgICBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIHNjZW5lLmFkZChncm91cCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NyZWF0aW5nIGJhbGxzIScpO1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBzb3J0OiB0cnVlLFxuICAgICAgICAgICAgcHJvZ3JhbTogcHJvZ3JhbVxuICAgICAgICB9KTtcbiAgICAgICAgcGFydGljbGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IHBhcnRpY2xlLnNjYWxlLnkgPSBNYXRoLnJhbmRvbSgpICogMjAgKyAxMDtcbiAgICAgICAgZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbiAgICB9XG4gICAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuQ2FudmFzUmVuZGVyZXIoKTtcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAvL3N0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgLy9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Eb2N1bWVudFRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvbkRvY3VtZW50VG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkRvY3VtZW50VG91Y2hFbmQsIGZhbHNlKTtcbiAgICAvL3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgb25kZXZpY2Vtb3Rpb24sIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGlmIChjb3VudG1zZyA8IDIpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYmFsbHMgYWRkZWQhJyk7XG4gICAgICAgIHZhciBQSTIgPSBNYXRoLlBJICogMjtcbiAgICAgICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAwLjUsIDAsIFBJMiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlQ2FudmFzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IE1hdGgucmFuZG9tKCkgKiAweDgwODAwOCArIDB4ODA4MDgwLFxuICAgICAgICAgICAgcHJvZ3JhbTogcHJvZ3JhbVxuICAgICAgICB9KTtcbiAgICAgICAgcGFydGljbGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCA9IHZhbFggKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWSAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IHBhcnRpY2xlLnNjYWxlLnkgPSBNYXRoLnJhbmRvbSgpICogMjAgKyAxMDtcbiAgICAgICAgZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL21vdmVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgZ3JvdXAuc2NhbGUueCA9IHZhbFg7XG4gICAgZ3JvdXAuc2NhbGUueSA9IHZhbFk7XG59XG5cbmZ1bmN0aW9uIG90aGVyQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGNvbnNvbGUubG9nKCdkYXRhIGZvciBiYWxsc1g6JyArIHZhbFgpO1xuICAgIGNvbnNvbGUubG9nKCdkYXRhIGZvciBiYWxsc1k6JyArIHZhbFkpO1xuICAgIC8vIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgLy8gc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAvLyAvLyBDcmVhdGUgYSBjaXJjbGUgYXJvdW5kIHRoZSBtb3VzZSBhbmQgbW92ZSBpdFxuICAgIC8vIC8vIFRoZSBzcGhlcmUgaGFzIG9wYWNpdHkgMFxuICAgIC8vIHZhciBtb3VzZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDAsIDApO1xuICAgIC8vIHZhciBtb3VzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyAgICAgY29sb3I6IDB4MDAwMGZmXG4gICAgLy8gfSk7XG4gICAgLy8gbW91c2VNZXNoID0gbmV3IFRIUkVFLk1lc2gobW91c2VHZW9tZXRyeSwgbW91c2VNYXRlcmlhbCk7XG4gICAgLy8gbW91c2VNZXNoLnBvc2l0aW9uLnogPSAtNTtcbiAgICAvLyBzY2VuZS5hZGQobW91c2VNZXNoKTtcbiAgICAvLyAvLyBNYWtlIHRoZSBzcGhlcmUgZm9sbG93IHRoZSBtb3VzZVxuICAgIC8vIHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMyh2YWxYLCB2YWxZLCAwLjUpO1xuICAgIC8vIHZlY3Rvci51bnByb2plY3QoY2FtZXJhKTtcbiAgICAvLyB2YXIgZGlyID0gdmVjdG9yLnN1YihjYW1lcmEucG9zaXRpb24pLm5vcm1hbGl6ZSgpO1xuICAgIC8vIHZhciBkaXN0YW5jZSA9IC1jYW1lcmEucG9zaXRpb24ueiAvIGRpci56O1xuICAgIC8vIHZhciBwb3MgPSBjYW1lcmEucG9zaXRpb24uY2xvbmUoKS5hZGQoZGlyLm11bHRpcGx5U2NhbGFyKGRpc3RhbmNlKSk7XG4gICAgLy8gbW91c2VNZXNoLnBvc2l0aW9uLmNvcHkocG9zKTtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueSA9IHZhbFkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAgKyAxMDA7XG4gICAgLy8gZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoTW92ZShldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21vdXNlWDonICsgbW91c2VYKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21vdXNlWTogJyArIG1vdXNlWSk7XG4gICAgICAgIC8vc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IG1vdXNlWCAqIFhYICsgJyAnICsgbW91c2VZICogWVkgKyAnICcgKyBaWiwgY291bnRlcjogY291bnRlciB9KTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IG1vdXNlWCArICcgJyArIG1vdXNlWSArICcgJyArIFhYICsgJyAnICsgWVkgKyAnICcgKyBaWiwgY291bnRlcjogY291bnRlciB9KTtcbiAgICAgICAgLy91cGRhdGVCYWxscyhtb3VzZVgsIG1vdXNlWSwgWFgsIFlZLCBaWik7XG4gICAgfVxufVxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoRW5kKGV2ZW50KXtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDAgJiYgY29ubmVjdFN0YXR1cyA9PSB0cnVlKXtcbiAgICBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogMCArICcgJyArIDAgKyAnICcgKyAwICsgJyAnICsgMCArICcgJyArIDAsIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgc3RvcFdhdGNoKCk7XG4gICAgY29uc29sZS5sb2coJ3NpZ3VlPycgKyBYWCk7XG4gICAgfVxufVxuXG4vLyB3aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICBhY2NYID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuLy8gICAgICAgICBhY2NZID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuLy8gICAgICAgICBhY2NaID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuLy8gICAgIH1cbi8vXG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICByZW5kZXJlci5jbGVhcigpO1xuICAgIC8vY2FtZXJhLnBvc2l0aW9uLnNldCgwLCAwLCA1KTtcbiAgICAvLyBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5yb3VuZChYWCkgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjA1O1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtTWF0aC5yb3VuZChZWSkgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjA1O1xuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGdyb3VwLnJvdGF0aW9uLnggKz0gWFggLyAxMDAwO1xuICAgIGdyb3VwLnJvdGF0aW9uLnkgKz0gWVkgLyAxMDAwO1xuICAgIGdyb3VwLnBvc2l0aW9uLnggKz0gWFggLyA1MDA7XG4gICAgZ3JvdXAucG9zaXRpb24ueSArPSBZWSAvIDUwMDtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG59XG5cbi8vY29uc29sZS5sb2coJ2FjY1g6JyArIGFjY1gpO1xuXG4vLyQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xudmFyIG5hbWVzcGFjZSA9ICcvdGVzdCc7XG52YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovLzE5Mi4xNjguMC4xOjUwMDAnICsgbmFtZXNwYWNlKTtcblxuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgc29ja2V0LmVtaXQoJ215IGV2ZW50JywgeyBkYXRhOiAnSVxcJ20gY29ubmVjdGVkIScgfSk7XG4gICAgY29ubmVjdFN0YXR1cyA9IHRydWU7XG4gICAgJCgnI2NvbmVjdGFyJykuaGlkZSgpO1xuICAgIGlmIChkZXZpY2Vpc1JlYWR5ID09IHRydWUpIHtcbiAgICAgICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvd1Nob3J0VG9wKCdDb25lY3RhZG8nLCBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICAgICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbnNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnRGVzY29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICAgIC8vYWxlcnQoJ3RvYXN0IGVycm9yOiAnICsgYilcbiAgICB9KTtcbiAgICAkKCcjY29uZWN0YXInKS5zaG93KCk7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+RGlzY29ubmVjdGVkJyk7XG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyAkKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZygnY291bnRtc2c6ICcgKyBjb3VudG1zZyk7XG5cbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZSBjb3VudCcsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEgKyBtc2cuY291bnQpO1xuICAgIHNldENvdW50ZXIobXNnLmNvdW50KTtcbn0pO1xuc29ja2V0Lm9uKCdqb2lucm9vbScsIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vY29uc29sZS5sb2coJ3NpZDogJyArIEpTT04uc3RyaW5naWZ5KHZhbC5zaWQpKTtcbiAgICBteXNpZCA9IHZhbC5zaWQ7XG59KTtcbnNvY2tldC5vbignZW5zYW1ibGUnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICBjb3VudG1zZysrO1xuICAgIC8vdXBkYXRlQmFsbHMoWFgsIFlZLCBaWik7XG4gICAgLy9jb25zb2xlLmxvZygnZGF0YSBYWVo6ICcgKyBKU09OLnN0cmluZ2lmeShtc2cuZGF0YSkpO1xuICAgIC8vY29uc29sZS5sb2coJ3NpZCcgKyBKU09OLnN0cmluZ2lmeShtc2cuc2lkKSk7XG4gICAgaWYgKG15c2lkICE9IG1zZy5zaWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbXNnIGlkOicgKyBtc2cuc2lkKTtcbiAgICAgICAgdmFyIG1zZ3NpZCA9IG1zZy5zaWQ7XG4gICAgICAgIHZhciBtc2dkYXRhID0gbXNnLmRhdGE7XG4gICAgICAgIHZhciBvdGhlcmRhdGEgPSB7ICdtc2dzaWQnOiBtc2dzaWQsICdtc2dkYXRhJzogbXNnZGF0YSB9XG4gICAgICAgIG90aGVyc2lkLmFkZChvdGhlcmRhdGEpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcmRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcmRhdGEpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcnNpZCkpO1xuICAgICAgICAvL2ZvciAobGV0IGl0ZW0gb2Ygb3RoZXJzaWQpIGNvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb3RoZXJzaWRbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYWxsZGF0YWJhbGxzID0gaXRlbS5tc2dkYXRhO1xuICAgICAgICBhbGxkYXRhYmFsbHMgPSBhbGxkYXRhYmFsbHMuc3BsaXQoJyAnKTtcbiAgICAgICAgLy9vdGhlckJhbGxzKGFsbGRhdGFiYWxsc1swXSwgYWxsZGF0YWJhbGxzWzFdKTtcbiAgICAgICAgLy9wdXQgYSBiYWxsIHdpdGggbmFtZSBhbmQgbW92ZSBpdDpcblxuICAgIH1cblxufSk7XG4vLyAkKCcjY29uZWN0YXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuLy8gfSk7XG4vLyAkKCcjaG9sYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyAgICAgc3RhcnRXYXRjaCgpO1xuLy8gfSk7XG5pbml0KCk7XG5hbmltYXRlKCk7XG4vL3N0YXJ0V2F0Y2goKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgcmVuZGVyKCk7XG4gICAgLy9zdGF0cy51cGRhdGUoKTtcbn1cblxuLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4vLyAkKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbi8vICAgICB9IGNhdGNoIChlcnIpIHtcbi8vICAgICAgICAgYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbi8vICAgICB9XG5cbi8vIH0pO1xuXG4kKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAvL2NvbnNvbGUubG9nKCd0YXAgb24gY29uZWN0YXIhIScpO1xuICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgc29ja2V0LmNvbm5lY3QoKTtcbiAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcblxufSk7XG5cbmZ1bmN0aW9uIHdpbihlKSB7XG4gICAgdmFyIGNvbmZpZyA9IFdpZmlXaXphcmQuZm9ybWF0V1BBQ29uZmlnKFwiRW5zYW1ibGVcIiwgXCJFbnNhbWJsZTEyM1wiKTtcbiAgICBpZiAoZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiV2lmaSBlbmFibGVkIGFscmVhZHlcIik7XG4gICAgICAgIFxuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuY29ubmVjdE5ldHdvcmsoXCJFbnNhbWJsZVwiKTtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBXaWZpV2l6YXJkLnNldFdpZmlFbmFibGVkKHRydWUsIHdpbkVuYWJsZSwgZmFpbEVuYWJsZSk7XG4gICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNoZWNraW5nIFdpZmkgc3RhdHVzXCIpO1xufVxuXG5mdW5jdGlvbiB3aW5FbmFibGUoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiV2lmaSBlbmFibGVkIHN1Y2Nlc3NmdWxseVwiKTtcbn1cblxuZnVuY3Rpb24gZmFpbEVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciBlbmFibGluZyBXaWZpIFwiKTtcbn1cblxuZnVuY3Rpb24gc3NpZEhhbmRsZXIocykge1xuICAgIC8vYWxlcnQoXCJDdXJyZW50IFNTSURcIiArIHMpO1xuICAgIGNvbnNvbGUubG9nKCdzc2lkOiAnICsgcyk7XG4gICAgaWYgKHMgPT0gJ1wiRW5zYW1ibGVcIicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vuc2FtYmxlIGZvdW5kIScpO1xuICAgICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5pc1dpZmlFbmFibGVkKHdpbiwgZmFpbCk7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJFbnNhbWJsZVwiLCBcIkVuc2FtYmxlMTIzXCIpO1xuICAgICAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BsdWdpbiBFcnJvciAtJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIC8vYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgLy9hbGVydChcIkZhaWxlZFwiICsgZSk7XG4gICAgY29uc29sZS5sb2coJ3dpZmkgZGlzYWJsZWQnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFNTSUQoKSB7XG4gICAgV2lmaVdpemFyZC5nZXRDdXJyZW50U1NJRChzc2lkSGFuZGxlciwgZmFpbCk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9