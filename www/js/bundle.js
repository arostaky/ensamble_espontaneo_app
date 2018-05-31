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
    if (e) {
        console.log("Wifi enabled already");
        var config = WifiWizard.formatWPAConfig("Mr_Robot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork("Mr_Robot");
        });
    }
    else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        var config = WifiWizard.formatWPAConfig("Mr_Robot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork("Mr_Robot");
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
    if (s = '"Mr_Robot"') {
        console.log('Mr_Robot found!');
        socket.emit('join', { room: 'ensamble' });
    }
    else {
        try {
            WifiWizard.isWifiEnabled(win, fail);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTM3M2RiZGFiNjlhY2JlMGQzOWUiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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LENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLHlDQUF5QztTQUM1QztLQUNKO0FBQ0wsQ0FBQztBQUVELGNBQWMsQ0FBQztJQUNYLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDtJQUNJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTM3M2RiZGFiNjlhY2JlMGQzOWUiLCJ2YXIgY29udGFpbmVyLCBzdGF0cywgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXIsIGdyb3VwLCBwYXJ0aWNsZSA9IFtdLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMixcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIsXG4gICAgd2F0Y2hJRCA9IG51bGwsXG4gICAgWFggPSAwLFxuICAgIFlZID0gMCxcbiAgICBaWiA9IDAsXG4gICAgYWNjWCA9IDEsXG4gICAgYWNjWSA9IDIsXG4gICAgYWNjWiA9IDMsXG4gICAgY291bnRtc2cgPSAxLFxuICAgIG1hdGVyaWFsLCBwcm9ncmFtLCBteXNpZCxcbiAgICBjb25uZWN0U3RhdHVzID0gZmFsc2UsXG4gICAgYWxsZGF0YWJhbGxzLFxuICAgIGRldmljZWlzUmVhZHkgPSBmYWxzZTtcbmNvbnN0IG90aGVyc2lkID0gbmV3IFNldCgpO1xudmFyIGNvdW50ZXIgPSAwLFxuICAgIGNoYW5nZSA9IGZhbHNlLFxuICAgIGxvY2FsQ291bnRlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb3VudCcpO1xuXG5mdW5jdGlvbiBzZXRDb3VudGVyKHZhbCkge1xuICAgIGlmIChsb2NhbENvdW50ZXIgPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY291bnQnLCB2YWwpO1xuICAgICAgICBjb3VudGVyID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvdW50ZXIgPSBsb2NhbENvdW50ZXI7XG4gICAgICAgIC8vIGlmIChjb3VudGVyICE9IHBhcnNlSW50KGxvY2FsQ291bnRlcikpIHtcbiAgICAgICAgLy8gICAgIGNvdW50ZXIgPSBwYXJzZUludChsb2NhbENvdW50ZXIpO1xuICAgICAgICAvLyAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxufVxudmFyIGFwcCA9IHtcbiAgICAvLyBBcHBsaWNhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkRXZlbnQoJ2RldmljZXJlYWR5Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2UgaXMgcmVhZHknKTtcbiAgICAgICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgICAgICBkZXZpY2Vpc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy9uYXZpZ2F0b3IuZ3lyb3Njb3BlLndhdGNoKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBET00gb24gYSBSZWNlaXZlZCBFdmVudFxuICAgIHJlY2VpdmVkRXZlbnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIC8vIHZhciBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvL3ZhciBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJyk7XG4gICAgICAgIC8vdmFyIHJlY2VpdmVkRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2VpdmVkJyk7XG5cbiAgICAgICAgLy8gbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICAgICAgLy8gcmVjZWl2ZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jazsnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgRXZlbnQ6ICcgKyBpZCk7XG4gICAgfVxufTtcbmFwcC5pbml0aWFsaXplKCk7XG4vLyBTdGFydCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25CYWNrS2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnYmFjayBrZXkgcHJlc3NlZCEnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgbmF2aWdhdG9yLmFwcC5leGl0QXBwKCk7XG59XG5cbmZ1bmN0aW9uIG9uTWVudUtleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ21lbnUga2V5IHByZXNzZWQnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIG9uUGF1c2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCBvbiBwYXVzZScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgICAvLyBVcGRhdGUgYWNjZWxlcmF0aW9uIGV2ZXJ5IDEwMCBtaWxsaXNlY29uZHNcbiAgICB2YXIgb3B0aW9ucyA9IHsgZnJlcXVlbmN5OiAxMDAgfTtcbiAgICB3YXRjaElEID0gbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIud2F0Y2hBY2NlbGVyYXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbn1cbi8vIFN0b3Agd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIHN0b3BXYXRjaCgpIHtcbiAgICBpZiAod2F0Y2hJRCkge1xuICAgICAgICBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci5jbGVhcldhdGNoKHdhdGNoSUQpO1xuICAgICAgICB3YXRjaElEID0gbnVsbDtcbiAgICB9XG59XG4vLyBvblN1Y2Nlc3M6IEdldCBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uU3VjY2VzcyhhY2NlbGVyYXRpb24pIHtcblxuICAgIFhYID0gYWNjZWxlcmF0aW9uLng7XG4gICAgWVkgPSBhY2NlbGVyYXRpb24ueTtcbiAgICBaWiA9IGFjY2VsZXJhdGlvbi56O1xuICAgIC8vIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBYWCArICcgJyArIFlZICsgJyAnICsgWlogfSk7XG59XG4vLyBvbkVycm9yOiBGYWlsZWQgdG8gZ2V0IHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkVycm9yKCkge1xuICAgIGFsZXJ0KCdvbkVycm9yIScpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICQoJy5jb250YWluZXInKS5hcHBlbmQoY29udGFpbmVyKTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAzMDAwKTtcbiAgICAvL2NhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG4gICAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9O1xuICAgIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgc2NlbmUuYWRkKGdyb3VwKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY3JlYXRpbmcgYmFsbHMhJyk7XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHNvcnQ6IHRydWUsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH1cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5DYW52YXNSZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Eb2N1bWVudFRvdWNoTW92ZSwgZmFsc2UpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBvbmRldmljZW1vdGlvbiwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgaWYgKGNvdW50bXNnIDwgMikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdiYWxscyBhZGRlZCEnKTtcbiAgICAgICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgICAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSB2YWxZICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBncm91cC5zY2FsZS54ID0gdmFsWDtcbiAgICBncm91cC5zY2FsZS55ID0gdmFsWTtcbn1cblxuZnVuY3Rpb24gb3RoZXJCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWDonICsgdmFsWCk7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWTonICsgdmFsWSk7XG4gICAgLy8gY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAvLyBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIC8vIC8vIENyZWF0ZSBhIGNpcmNsZSBhcm91bmQgdGhlIG1vdXNlIGFuZCBtb3ZlIGl0XG4gICAgLy8gLy8gVGhlIHNwaGVyZSBoYXMgb3BhY2l0eSAwXG4gICAgLy8gdmFyIG1vdXNlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgMCwgMCk7XG4gICAgLy8gdmFyIG1vdXNlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIC8vICAgICBjb2xvcjogMHgwMDAwZmZcbiAgICAvLyB9KTtcbiAgICAvLyBtb3VzZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChtb3VzZUdlb21ldHJ5LCBtb3VzZU1hdGVyaWFsKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24ueiA9IC01O1xuICAgIC8vIHNjZW5lLmFkZChtb3VzZU1lc2gpO1xuICAgIC8vIC8vIE1ha2UgdGhlIHNwaGVyZSBmb2xsb3cgdGhlIG1vdXNlXG4gICAgLy8gdmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKHZhbFgsIHZhbFksIDAuNSk7XG4gICAgLy8gdmVjdG9yLnVucHJvamVjdChjYW1lcmEpO1xuICAgIC8vIHZhciBkaXIgPSB2ZWN0b3Iuc3ViKGNhbWVyYS5wb3NpdGlvbikubm9ybWFsaXplKCk7XG4gICAgLy8gdmFyIGRpc3RhbmNlID0gLWNhbWVyYS5wb3NpdGlvbi56IC8gZGlyLno7XG4gICAgLy8gdmFyIHBvcyA9IGNhbWVyYS5wb3NpdGlvbi5jbG9uZSgpLmFkZChkaXIubXVsdGlwbHlTY2FsYXIoZGlzdGFuY2UpKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24uY29weShwb3MpO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnggPSB2YWxYICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWSAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwMCArIDEwMDtcbiAgICAvLyBncm91cC5hZGQocGFydGljbGUpO1xufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hTdGFydChldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgJiYgY29ubmVjdFN0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VYOicgKyBtb3VzZVgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VZOiAnICsgbW91c2VZKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IG1vdXNlWCAqIFhYICsgJyAnICsgbW91c2VZICogWVkgKyAnICcgKyBaWiwgY291bnRlcjogY291bnRlciB9KTtcbiAgICAgICAgdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFpaKTtcbiAgICB9XG59XG5cbi8vIHdpbmRvdy5vbmRldmljZW1vdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgIGFjY1ggPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4vLyAgICAgICAgIGFjY1kgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4vLyAgICAgICAgIGFjY1ogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4vLyAgICAgfVxuLy9cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHJlbmRlcmVyLmNsZWFyKCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24uc2V0KDAsIDAsIDUpO1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi54ICs9IChNYXRoLnJvdW5kKFhYKSAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDU7XG4gICAgLy8gY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1NYXRoLnJvdW5kKFlZKSAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgZ3JvdXAucm90YXRpb24ueCArPSBYWCAvIDEwMDA7XG4gICAgZ3JvdXAucm90YXRpb24ueSArPSBZWSAvIDEwMDA7XG4gICAgZ3JvdXAucG9zaXRpb24ueCArPSBYWCAvIDUwMDtcbiAgICBncm91cC5wb3NpdGlvbi55ICs9IFlZIC8gNTAwO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn1cblxuLy9jb25zb2xlLmxvZygnYWNjWDonICsgYWNjWCk7XG5cbi8vJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG52YXIgbmFtZXNwYWNlID0gJy90ZXN0JztcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vMTkyLjE2OC4wLjE6NTAwMCcgKyBuYW1lc3BhY2UpO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICBzb2NrZXQuZW1pdCgnbXkgZXZlbnQnLCB7IGRhdGE6ICdJXFwnbSBjb25uZWN0ZWQhJyB9KTtcbiAgICBjb25uZWN0U3RhdHVzID0gdHJ1ZTtcbiAgICAkKCcjY29uZWN0YXInKS5oaWRlKCk7XG4gICAgaWYgKGRldmljZWlzUmVhZHkgPT0gdHJ1ZSkge1xuICAgICAgICB3aW5kb3cucGx1Z2lucy50b2FzdC5zaG93U2hvcnRUb3AoJ0NvbmVjdGFkbycsIGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICAgICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbnNvY2tldC5vbignZGlzY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnRGVzY29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICBjb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgfSk7XG4gICAgJCgnI2NvbmVjdGFyJykuc2hvdygpO1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPkRpc2Nvbm5lY3RlZCcpO1xufSk7XG5zb2NrZXQub24oJ215IHJlc3BvbnNlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEpO1xuICAgIC8vY29uc29sZS5sb2coJ2NvdW50bXNnOiAnICsgY291bnRtc2cpO1xuXG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UgY291bnQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhICsgbXNnLmNvdW50KTtcbiAgICBzZXRDb3VudGVyKG1zZy5jb3VudCk7XG59KTtcbnNvY2tldC5vbignam9pbnJvb20nLCBmdW5jdGlvbih2YWwpIHtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeSh2YWwuc2lkKSk7XG4gICAgbXlzaWQgPSB2YWwuc2lkO1xufSk7XG5zb2NrZXQub24oJ2Vuc2FtYmxlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgY291bnRtc2crKztcbiAgICB1cGRhdGVCYWxscyhYWCwgWVksIFpaKTtcbiAgICAvL2NvbnNvbGUubG9nKCdkYXRhIFhZWjogJyArIEpTT04uc3RyaW5naWZ5KG1zZy5kYXRhKSk7XG4gICAgLy9jb25zb2xlLmxvZygnc2lkJyArIEpTT04uc3RyaW5naWZ5KG1zZy5zaWQpKTtcbiAgICBpZiAobXlzaWQgIT0gbXNnLnNpZCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdtc2cgaWQ6JyArIG1zZy5zaWQpO1xuICAgICAgICB2YXIgbXNnc2lkID0gbXNnLnNpZDtcbiAgICAgICAgdmFyIG1zZ2RhdGEgPSBtc2cuZGF0YTtcbiAgICAgICAgdmFyIG90aGVyZGF0YSA9IHsgJ21zZ3NpZCc6IG1zZ3NpZCwgJ21zZ2RhdGEnOiBtc2dkYXRhIH1cbiAgICAgICAgb3RoZXJzaWQuYWRkKG90aGVyZGF0YSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KG90aGVyZGF0YSkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcnNpZDogJyArIEpTT04uc3RyaW5naWZ5KG90aGVyc2lkKSk7XG4gICAgICAgIC8vZm9yIChsZXQgaXRlbSBvZiBvdGhlcnNpZCkgY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGl0ZW07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvdGhlcnNpZFtTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhbGxkYXRhYmFsbHMgPSBpdGVtLm1zZ2RhdGE7XG4gICAgICAgIGFsbGRhdGFiYWxscyA9IGFsbGRhdGFiYWxscy5zcGxpdCgnICcpO1xuICAgICAgICBvdGhlckJhbGxzKGFsbGRhdGFiYWxsc1swXSwgYWxsZGF0YWJhbGxzWzFdKTtcbiAgICAgICAgLy9wdXQgYSBiYWxsIHdpdGggbmFtZSBhbmQgbW92ZSBpdDpcblxuICAgIH1cblxufSk7XG4vLyAkKCcjY29uZWN0YXInKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuLy8gfSk7XG4vLyAkKCcjaG9sYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyAgICAgc3RhcnRXYXRjaCgpO1xuLy8gfSk7XG5pbml0KCk7XG5hbmltYXRlKCk7XG4vL3N0YXJ0V2F0Y2goKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgcmVuZGVyKCk7XG4gICAgc3RhdHMudXBkYXRlKCk7XG59XG5cbi8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuLy8gJCgnI2NvbmVjdGFyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgICAgV2lmaVdpemFyZC5pc1dpZmlFbmFibGVkKHdpbiwgZmFpbCk7XG4vLyAgICAgfSBjYXRjaCAoZXJyKSB7XG4vLyAgICAgICAgIGFsZXJ0KFwiUGx1Z2luIEVycm9yIC0gXCIgKyBlcnIubWVzc2FnZSk7XG4vLyAgICAgfVxuXG4vLyB9KTtcblxuJCgnI2NvbmVjdGFyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ3RhcCBvbiBjb25lY3RhciEhJyk7XG4gICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICBzb2NrZXQuY29ubmVjdCgpO1xuICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gd2luKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIldpZmkgZW5hYmxlZCBhbHJlYWR5XCIpO1xuICAgICAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJNcl9Sb2JvdFwiLCBcInNheWgzbGwwdG9teWxpdHRsZWZyaWVuZFwiKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiTXJfUm9ib3RcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgV2lmaVdpemFyZC5zZXRXaWZpRW5hYmxlZCh0cnVlLCB3aW5FbmFibGUsIGZhaWxFbmFibGUpO1xuICAgICAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJNcl9Sb2JvdFwiLCBcInNheWgzbGwwdG9teWxpdHRsZWZyaWVuZFwiKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiTXJfUm9ib3RcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9ICdcIk1yX1JvYm90XCInKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNcl9Sb2JvdCBmb3VuZCEnKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gRXJyb3IgLScgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAvL2FsZXJ0KFwiUGx1Z2luIEVycm9yIC0gXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIC8vYWxlcnQoXCJGYWlsZWRcIiArIGUpO1xuICAgIGNvbnNvbGUubG9nKCd3aWZpIGRpc2FibGVkJyk7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRTU0lEKCkge1xuICAgIFdpZmlXaXphcmQuZ2V0Q3VycmVudFNTSUQoc3NpZEhhbmRsZXIsIGZhaWwpO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==