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
        socket.emit('my room event', { room: 'ensamble', data: mouseX * XX + ' ' + mouseY * YY + ' ' + ZZ, counter: counter });
        updateBalls(mouseX, mouseY, ZZ);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjhiNjg1MDBiZjdiMDhkNjkwZTUiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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QUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUxQyxDQUFDLENBQUMsQ0FBQztTQUNOO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1Qyx5Q0FBeUM7U0FDNUM7S0FDSjtBQUNMLENBQUM7QUFFRCxjQUFjLENBQUM7SUFDWCxzQkFBc0I7SUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQ7SUFDSSxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwiZmlsZSI6ImpzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY4YjY4NTAwYmY3YjA4ZDY5MGU1IiwidmFyIGNvbnRhaW5lciwgc3RhdHMsIGNhbWVyYSwgc2NlbmUsIHJlbmRlcmVyLCBncm91cCwgcGFydGljbGUgPSBbXSxcbiAgICBtb3VzZVggPSAwLFxuICAgIG1vdXNlWSA9IDAsXG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsXG4gICAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLFxuICAgIHdhdGNoSUQgPSBudWxsLFxuICAgIFhYID0gMCxcbiAgICBZWSA9IDAsXG4gICAgWlogPSAwLFxuICAgIGFjY1ggPSAxLFxuICAgIGFjY1kgPSAyLFxuICAgIGFjY1ogPSAzLFxuICAgIGNvdW50bXNnID0gMSxcbiAgICBtYXRlcmlhbCwgcHJvZ3JhbSwgbXlzaWQsXG4gICAgY29ubmVjdFN0YXR1cyA9IGZhbHNlLFxuICAgIGFsbGRhdGFiYWxscyxcbiAgICBkZXZpY2Vpc1JlYWR5ID0gZmFsc2U7XG5jb25zdCBvdGhlcnNpZCA9IG5ldyBTZXQoKTtcbnZhciBjb3VudGVyID0gMCxcbiAgICBjaGFuZ2UgPSBmYWxzZSxcbiAgICBsb2NhbENvdW50ZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY291bnQnKTtcblxuZnVuY3Rpb24gc2V0Q291bnRlcih2YWwpIHtcbiAgICBpZiAobG9jYWxDb3VudGVyID09IG51bGwpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NvdW50JywgdmFsKTtcbiAgICAgICAgY291bnRlciA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb3VudGVyID0gbG9jYWxDb3VudGVyO1xuICAgICAgICAvLyBpZiAoY291bnRlciAhPSBwYXJzZUludChsb2NhbENvdW50ZXIpKSB7XG4gICAgICAgIC8vICAgICBjb3VudGVyID0gcGFyc2VJbnQobG9jYWxDb3VudGVyKTtcbiAgICAgICAgLy8gICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbn1cbnZhciBhcHAgPSB7XG4gICAgLy8gQXBwbGljYXRpb24gQ29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCB0aGlzLm9uRGV2aWNlUmVhZHkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmFja2J1dHRvblwiLCBvbkJhY2tLZXlEb3duLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtZW51YnV0dG9uXCIsIG9uTWVudUtleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIG9uUGF1c2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gZGV2aWNlcmVhZHkgRXZlbnQgSGFuZGxlclxuICAgIC8vXG4gICAgLy8gQmluZCBhbnkgY29yZG92YSBldmVudHMgaGVyZS4gQ29tbW9uIGV2ZW50cyBhcmU6XG4gICAgLy8gJ3BhdXNlJywgJ3Jlc3VtZScsIGV0Yy5cbiAgICBvbkRldmljZVJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZEV2ZW50KCdkZXZpY2VyZWFkeScpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlIGlzIHJlYWR5Jyk7XG4gICAgICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgICAgIHN0YXJ0V2F0Y2goKTtcbiAgICAgICAgZGV2aWNlaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIC8vbmF2aWdhdG9yLmd5cm9zY29wZS53YXRjaChvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBVcGRhdGUgRE9NIG9uIGEgUmVjZWl2ZWQgRXZlbnRcbiAgICByZWNlaXZlZEV2ZW50OiBmdW5jdGlvbihpZCkge1xuICAgICAgICAvLyB2YXIgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgLy92YXIgbGlzdGVuaW5nRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxpc3RlbmluZycpO1xuICAgICAgICAvL3ZhciByZWNlaXZlZEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWNlaXZlZCcpO1xuXG4gICAgICAgIC8vIGxpc3RlbmluZ0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmU7Jyk7XG4gICAgICAgIC8vIHJlY2VpdmVkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6YmxvY2s7Jyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIEV2ZW50OiAnICsgaWQpO1xuICAgIH1cbn07XG5hcHAuaW5pdGlhbGl6ZSgpO1xuLy8gU3RhcnQgd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uQmFja0tleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ2JhY2sga2V5IHByZXNzZWQhJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIG5hdmlnYXRvci5hcHAuZXhpdEFwcCgpO1xufVxuXG5mdW5jdGlvbiBvbk1lbnVLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdtZW51IGtleSBwcmVzc2VkJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBvblBhdXNlKCkge1xuICAgIGNvbnNvbGUubG9nKCdhcHAgb24gcGF1c2UnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0V2F0Y2goKSB7XG4gICAgLy8gVXBkYXRlIGFjY2VsZXJhdGlvbiBldmVyeSAxMDAgbWlsbGlzZWNvbmRzXG4gICAgdmFyIG9wdGlvbnMgPSB7IGZyZXF1ZW5jeTogMTAwIH07XG4gICAgd2F0Y2hJRCA9IG5hdmlnYXRvci5hY2NlbGVyb21ldGVyLndhdGNoQWNjZWxlcmF0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG59XG4vLyBTdG9wIHdhdGNoaW5nIHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBzdG9wV2F0Y2goKSB7XG4gICAgaWYgKHdhdGNoSUQpIHtcbiAgICAgICAgbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIuY2xlYXJXYXRjaCh3YXRjaElEKTtcbiAgICAgICAgd2F0Y2hJRCA9IG51bGw7XG4gICAgfVxufVxuLy8gb25TdWNjZXNzOiBHZXQgYSBzbmFwc2hvdCBvZiB0aGUgY3VycmVudCBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvblN1Y2Nlc3MoYWNjZWxlcmF0aW9uKSB7XG5cbiAgICBYWCA9IGFjY2VsZXJhdGlvbi54O1xuICAgIFlZID0gYWNjZWxlcmF0aW9uLnk7XG4gICAgWlogPSBhY2NlbGVyYXRpb24uejtcbiAgICAvLyBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogWFggKyAnICcgKyBZWSArICcgJyArIFpaIH0pO1xufVxuLy8gb25FcnJvcjogRmFpbGVkIHRvIGdldCB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25FcnJvcigpIHtcbiAgICBhbGVydCgnb25FcnJvciEnKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkKCcuY29udGFpbmVyJykuYXBwZW5kKGNvbnRhaW5lcik7XG4gICAgLy9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMzAwMCk7XG4gICAgLy9jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgIC8vY2FtZXJhLnBvc2l0aW9uLnogPSAxMDAwO1xuICAgIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgIHByb2dyYW0gPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgfTtcbiAgICBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIHNjZW5lLmFkZChncm91cCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NyZWF0aW5nIGJhbGxzIScpO1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBzb3J0OiB0cnVlLFxuICAgICAgICAgICAgcHJvZ3JhbTogcHJvZ3JhbVxuICAgICAgICB9KTtcbiAgICAgICAgcGFydGljbGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gMTAwMDtcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IHBhcnRpY2xlLnNjYWxlLnkgPSBNYXRoLnJhbmRvbSgpICogMjAgKyAxMDtcbiAgICAgICAgZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbiAgICB9XG4gICAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuQ2FudmFzUmVuZGVyZXIoKTtcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2hTdGFydCwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uRG9jdW1lbnRUb3VjaE1vdmUsIGZhbHNlKTtcbiAgICAvL3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgb25kZXZpY2Vtb3Rpb24sIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGlmIChjb3VudG1zZyA8IDIpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYmFsbHMgYWRkZWQhJyk7XG4gICAgICAgIHZhciBQSTIgPSBNYXRoLlBJICogMjtcbiAgICAgICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAwLjUsIDAsIFBJMiwgdHJ1ZSk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlQ2FudmFzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IE1hdGgucmFuZG9tKCkgKiAweDgwODAwOCArIDB4ODA4MDgwLFxuICAgICAgICAgICAgcHJvZ3JhbTogcHJvZ3JhbVxuICAgICAgICB9KTtcbiAgICAgICAgcGFydGljbGUgPSBuZXcgVEhSRUUuU3ByaXRlKG1hdGVyaWFsKTtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCA9IHZhbFggKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWSAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IHBhcnRpY2xlLnNjYWxlLnkgPSBNYXRoLnJhbmRvbSgpICogMjAgKyAxMDtcbiAgICAgICAgZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL21vdmVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgZ3JvdXAuc2NhbGUueCA9IHZhbFg7XG4gICAgZ3JvdXAuc2NhbGUueSA9IHZhbFk7XG59XG5cbmZ1bmN0aW9uIG90aGVyQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGNvbnNvbGUubG9nKCdkYXRhIGZvciBiYWxsc1g6JyArIHZhbFgpO1xuICAgIGNvbnNvbGUubG9nKCdkYXRhIGZvciBiYWxsc1k6JyArIHZhbFkpO1xuICAgIC8vIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgLy8gc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAvLyAvLyBDcmVhdGUgYSBjaXJjbGUgYXJvdW5kIHRoZSBtb3VzZSBhbmQgbW92ZSBpdFxuICAgIC8vIC8vIFRoZSBzcGhlcmUgaGFzIG9wYWNpdHkgMFxuICAgIC8vIHZhciBtb3VzZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEsIDAsIDApO1xuICAgIC8vIHZhciBtb3VzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyAgICAgY29sb3I6IDB4MDAwMGZmXG4gICAgLy8gfSk7XG4gICAgLy8gbW91c2VNZXNoID0gbmV3IFRIUkVFLk1lc2gobW91c2VHZW9tZXRyeSwgbW91c2VNYXRlcmlhbCk7XG4gICAgLy8gbW91c2VNZXNoLnBvc2l0aW9uLnogPSAtNTtcbiAgICAvLyBzY2VuZS5hZGQobW91c2VNZXNoKTtcbiAgICAvLyAvLyBNYWtlIHRoZSBzcGhlcmUgZm9sbG93IHRoZSBtb3VzZVxuICAgIC8vIHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMyh2YWxYLCB2YWxZLCAwLjUpO1xuICAgIC8vIHZlY3Rvci51bnByb2plY3QoY2FtZXJhKTtcbiAgICAvLyB2YXIgZGlyID0gdmVjdG9yLnN1YihjYW1lcmEucG9zaXRpb24pLm5vcm1hbGl6ZSgpO1xuICAgIC8vIHZhciBkaXN0YW5jZSA9IC1jYW1lcmEucG9zaXRpb24ueiAvIGRpci56O1xuICAgIC8vIHZhciBwb3MgPSBjYW1lcmEucG9zaXRpb24uY2xvbmUoKS5hZGQoZGlyLm11bHRpcGx5U2NhbGFyKGRpc3RhbmNlKSk7XG4gICAgLy8gbW91c2VNZXNoLnBvc2l0aW9uLmNvcHkocG9zKTtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueSA9IHZhbFkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAgKyAxMDA7XG4gICAgLy8gZ3JvdXAuYWRkKHBhcnRpY2xlKTtcbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICYmIGNvbm5lY3RTdGF0dXMgPT0gdHJ1ZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21vdXNlWDonICsgbW91c2VYKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ21vdXNlWTogJyArIG1vdXNlWSk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBtb3VzZVggKiBYWCArICcgJyArIG1vdXNlWSAqIFlZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIHVwZGF0ZUJhbGxzKG1vdXNlWCwgbW91c2VZLCBaWik7XG4gICAgfVxufVxuXG4vLyB3aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICBhY2NYID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuLy8gICAgICAgICBhY2NZID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuLy8gICAgICAgICBhY2NaID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuLy8gICAgIH1cbi8vXG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICByZW5kZXJlci5jbGVhcigpO1xuICAgIC8vY2FtZXJhLnBvc2l0aW9uLnNldCgwLCAwLCA1KTtcbiAgICAvLyBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5yb3VuZChYWCkgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjA1O1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtTWF0aC5yb3VuZChZWSkgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjA1O1xuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGdyb3VwLnJvdGF0aW9uLnggKz0gWFggLyAxMDAwO1xuICAgIGdyb3VwLnJvdGF0aW9uLnkgKz0gWVkgLyAxMDAwO1xuICAgIGdyb3VwLnBvc2l0aW9uLnggKz0gWFggLyA1MDA7XG4gICAgZ3JvdXAucG9zaXRpb24ueSArPSBZWSAvIDUwMDtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG59XG5cbi8vY29uc29sZS5sb2coJ2FjY1g6JyArIGFjY1gpO1xuXG4vLyQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xudmFyIG5hbWVzcGFjZSA9ICcvdGVzdCc7XG52YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovLzE5Mi4xNjguMC4xOjUwMDAnICsgbmFtZXNwYWNlKTtcblxuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgc29ja2V0LmVtaXQoJ215IGV2ZW50JywgeyBkYXRhOiAnSVxcJ20gY29ubmVjdGVkIScgfSk7XG4gICAgY29ubmVjdFN0YXR1cyA9IHRydWU7XG4gICAgJCgnI2NvbmVjdGFyJykuaGlkZSgpO1xuICAgIGlmIChkZXZpY2Vpc1JlYWR5ID09IHRydWUpIHtcbiAgICAgICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvd1Nob3J0VG9wKCdDb25lY3RhZG8nLCBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgICAgIC8vYWxlcnQoJ3RvYXN0IGVycm9yOiAnICsgYilcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cucGx1Z2lucy50b2FzdC5zaG93U2hvcnRUb3AoJ0Rlc2NvbmVjdGFkbycsIGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKVxuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgIH0pO1xuICAgICQoJyNjb25lY3RhcicpLnNob3coKTtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5EaXNjb25uZWN0ZWQnKTtcbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZScsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vICQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICAvL2NvbnNvbGUubG9nKCdjb3VudG1zZzogJyArIGNvdW50bXNnKTtcblxufSk7XG5zb2NrZXQub24oJ215IHJlc3BvbnNlIGNvdW50JywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSArIG1zZy5jb3VudCk7XG4gICAgc2V0Q291bnRlcihtc2cuY291bnQpO1xufSk7XG5zb2NrZXQub24oJ2pvaW5yb29tJywgZnVuY3Rpb24odmFsKSB7XG4gICAgLy9jb25zb2xlLmxvZygnc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsLnNpZCkpO1xuICAgIG15c2lkID0gdmFsLnNpZDtcbn0pO1xuc29ja2V0Lm9uKCdlbnNhbWJsZScsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEpO1xuICAgIGNvdW50bXNnKys7XG4gICAgdXBkYXRlQmFsbHMoWFgsIFlZLCBaWik7XG4gICAgLy9jb25zb2xlLmxvZygnZGF0YSBYWVo6ICcgKyBKU09OLnN0cmluZ2lmeShtc2cuZGF0YSkpO1xuICAgIC8vY29uc29sZS5sb2coJ3NpZCcgKyBKU09OLnN0cmluZ2lmeShtc2cuc2lkKSk7XG4gICAgaWYgKG15c2lkICE9IG1zZy5zaWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbXNnIGlkOicgKyBtc2cuc2lkKTtcbiAgICAgICAgdmFyIG1zZ3NpZCA9IG1zZy5zaWQ7XG4gICAgICAgIHZhciBtc2dkYXRhID0gbXNnLmRhdGE7XG4gICAgICAgIHZhciBvdGhlcmRhdGEgPSB7ICdtc2dzaWQnOiBtc2dzaWQsICdtc2dkYXRhJzogbXNnZGF0YSB9XG4gICAgICAgIG90aGVyc2lkLmFkZChvdGhlcmRhdGEpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcmRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcmRhdGEpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcnNpZCkpO1xuICAgICAgICAvL2ZvciAobGV0IGl0ZW0gb2Ygb3RoZXJzaWQpIGNvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb3RoZXJzaWRbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYWxsZGF0YWJhbGxzID0gaXRlbS5tc2dkYXRhO1xuICAgICAgICBhbGxkYXRhYmFsbHMgPSBhbGxkYXRhYmFsbHMuc3BsaXQoJyAnKTtcbiAgICAgICAgb3RoZXJCYWxscyhhbGxkYXRhYmFsbHNbMF0sIGFsbGRhdGFiYWxsc1sxXSk7XG4gICAgICAgIC8vcHV0IGEgYmFsbCB3aXRoIG5hbWUgYW5kIG1vdmUgaXQ6XG5cbiAgICB9XG5cbn0pO1xuLy8gJCgnI2NvbmVjdGFyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbi8vIH0pO1xuLy8gJCgnI2hvbGEnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuLy8gICAgIHN0YXJ0V2F0Y2goKTtcbi8vIH0pO1xuaW5pdCgpO1xuYW5pbWF0ZSgpO1xuLy9zdGFydFdhdGNoKCk7XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIHJlbmRlcigpO1xuICAgIHN0YXRzLnVwZGF0ZSgpO1xufVxuXG4vLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbi8vICQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuLy8gICAgIH0gY2F0Y2ggKGVycikge1xuLy8gICAgICAgICBhbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuLy8gICAgIH1cblxuLy8gfSk7XG5cbiQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCd0YXAgb24gY29uZWN0YXIhIScpO1xuICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgc29ja2V0LmNvbm5lY3QoKTtcbiAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcblxufSk7XG5cbmZ1bmN0aW9uIHdpbihlKSB7XG4gICAgdmFyIGNvbmZpZyA9IFdpZmlXaXphcmQuZm9ybWF0V1BBQ29uZmlnKFwiRW5zYW1ibGVcIiwgXCJFbnNhbWJsZTEyM1wiKTtcbiAgICBpZiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIldpZmkgZW5hYmxlZCBhbHJlYWR5XCIpO1xuICAgICAgICBcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgV2lmaVdpemFyZC5zZXRXaWZpRW5hYmxlZCh0cnVlLCB3aW5FbmFibGUsIGZhaWxFbmFibGUpO1xuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuY29ubmVjdE5ldHdvcmsoXCJFbnNhbWJsZVwiKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciBjaGVja2luZyBXaWZpIHN0YXR1c1wiKTtcbn1cblxuZnVuY3Rpb24gd2luRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIldpZmkgZW5hYmxlZCBzdWNjZXNzZnVsbHlcIik7XG59XG5cbmZ1bmN0aW9uIGZhaWxFbmFibGUoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZW5hYmxpbmcgV2lmaSBcIik7XG59XG5cbmZ1bmN0aW9uIHNzaWRIYW5kbGVyKHMpIHtcbiAgICAvL2FsZXJ0KFwiQ3VycmVudCBTU0lEXCIgKyBzKTtcbiAgICBjb25zb2xlLmxvZygnc3NpZDogJyArIHMpO1xuICAgIGlmIChzID09ICdcIkVuc2FtYmxlXCInKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFbnNhbWJsZSBmb3VuZCEnKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IFdpZmlXaXphcmQuZm9ybWF0V1BBQ29uZmlnKFwiRW5zYW1ibGVcIiwgXCJFbnNhbWJsZTEyM1wiKTtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFdpZmlXaXphcmQuY29ubmVjdE5ldHdvcmsoXCJFbnNhbWJsZVwiKTtcbiAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gRXJyb3IgLScgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAvL2FsZXJ0KFwiUGx1Z2luIEVycm9yIC0gXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIC8vYWxlcnQoXCJGYWlsZWRcIiArIGUpO1xuICAgIGNvbnNvbGUubG9nKCd3aWZpIGRpc2FibGVkJyk7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRTU0lEKCkge1xuICAgIFdpZmlXaXphcmQuZ2V0Q3VycmVudFNTSUQoc3NpZEhhbmRsZXIsIGZhaWwpO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==