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
        //socket.emit('my room event', { room: 'ensamble', data: mouseX * XX + ' ' + mouseY * YY + ' ' + ZZ, counter: counter });
        socket.emit('my room event', { room: 'ensamble', data: mouseX + ' ' + mouseY + ' ' + XX + ' ' + YY + ' ' + ZZ, counter: counter });
        //updateBalls(mouseX, mouseY, XX, YY, ZZ);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzAyZTM2NTA0NTAxYzYwZTVhNmMiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNaLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQ1gsTUFBTSxHQUFHLEtBQUssRUFDZCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVqRCxvQkFBb0IsR0FBRztJQUNuQixJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7UUFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkMsT0FBTyxHQUFHLEdBQUcsQ0FBQztLQUNqQjtTQUFNO1FBQ0gsT0FBTyxHQUFHLFlBQVksQ0FBQztRQUN2QiwyQ0FBMkM7UUFDM0Msd0NBQXdDO1FBQ3hDLHFCQUFxQjtRQUNyQixJQUFJO0tBQ1A7QUFFTCxDQUFDO0FBQ0QsSUFBSSxHQUFHLEdBQUc7SUFDTiwwQkFBMEI7SUFDMUIsVUFBVSxFQUFFO1FBQ1IsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLEVBQUU7SUFDRixtREFBbUQ7SUFDbkQsMEJBQTBCO0lBQzFCLGFBQWEsRUFBRTtRQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9CLGNBQWMsRUFBRSxDQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDO1FBQ2IsYUFBYSxHQUFHLElBQUksQ0FBQztRQUNyQix5REFBeUQ7SUFDN0QsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxhQUFhLEVBQUUsVUFBUyxFQUFFO1FBQ3RCLG1EQUFtRDtRQUNuRCxtRUFBbUU7UUFDbkUsaUVBQWlFO1FBRWpFLDJEQUEyRDtRQUMzRCwyREFBMkQ7UUFFM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0osQ0FBQztBQUNGLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNqQixrQ0FBa0M7QUFDbEMsRUFBRTtBQUNGO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBRUQ7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBRUQ7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekIsQ0FBQztBQUVEO0lBQ0ksNkNBQTZDO0lBQzdDLElBQUksT0FBTyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUNELGlDQUFpQztBQUNqQyxFQUFFO0FBQ0Y7SUFDSSxJQUFJLE9BQU8sRUFBRTtRQUNULFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDbEI7QUFDTCxDQUFDO0FBQ0Qsd0RBQXdEO0FBQ3hELEVBQUU7QUFDRixtQkFBbUIsWUFBWTtJQUUzQixFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwQixFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwQixFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwQixzRkFBc0Y7QUFDMUYsQ0FBQztBQUNELDBDQUEwQztBQUMxQyxFQUFFO0FBQ0Y7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUVEO0lBQ0ksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsQyx1Q0FBdUM7SUFDdkMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFGLDhGQUE4RjtJQUM5RiwyQkFBMkI7SUFDM0IsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sR0FBRyxVQUFTLE9BQU87UUFDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDO0lBQ0YsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QixpQ0FBaUM7UUFDakMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLFFBQVE7WUFDMUMsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7UUFDSCxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xELFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xELFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQzlELEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkI7SUFDRCxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNoRCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hELFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQ3BCLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRSxzRUFBc0U7QUFDMUUsQ0FBQztBQUVELHFCQUFxQixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7SUFDakMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO1FBQ2QsOEJBQThCO1FBQzlCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxVQUFTLE9BQU87WUFDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBQ0YsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLFFBQVE7WUFDMUMsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUN4QyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUN4QyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNqRCxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUM5RCxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZCO1NBQU07UUFDSCw4QkFBOEI7S0FDakM7QUFDTCxDQUFDO0FBRUQsbUJBQW1CLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtJQUMvQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDckIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLENBQUM7QUFFRCxvQkFBb0IsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN2QywrRkFBK0Y7SUFDL0YsNkJBQTZCO0lBQzdCLGtEQUFrRDtJQUNsRCw4QkFBOEI7SUFDOUIseURBQXlEO0lBQ3pELG9EQUFvRDtJQUNwRCxzQkFBc0I7SUFDdEIsTUFBTTtJQUNOLDREQUE0RDtJQUM1RCw2QkFBNkI7SUFDN0Isd0JBQXdCO0lBQ3hCLHNDQUFzQztJQUN0QyxtREFBbUQ7SUFDbkQsNEJBQTRCO0lBQzVCLHFEQUFxRDtJQUNyRCw2Q0FBNkM7SUFDN0MsdUVBQXVFO0lBQ3ZFLGdDQUFnQztJQUNoQywyQ0FBMkM7SUFDM0MsMkNBQTJDO0lBQzNDLG9EQUFvRDtJQUNwRCxtRUFBbUU7SUFDbkUsdUJBQXVCO0FBQzNCLENBQUM7QUFFRCw4QkFBOEIsS0FBSztJQUMvQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM1QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztRQUM5QyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0tBQ2pEO0FBQ0wsQ0FBQztBQUVELDZCQUE2QixLQUFLO0lBQzlCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7UUFDckQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7UUFDOUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztRQUM5QyxtQ0FBbUM7UUFDbkMsb0NBQW9DO1FBQ3BDLHlIQUF5SDtRQUN6SCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ25JLDBDQUEwQztLQUM3QztBQUNMLENBQUM7QUFFRCw0Q0FBNEM7QUFDNUMsdURBQXVEO0FBQ3ZELHVEQUF1RDtBQUN2RCx1REFBdUQ7QUFDdkQsUUFBUTtBQUNSLEVBQUU7QUFFRjtJQUNJLFFBQVEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQiwrQkFBK0I7SUFDL0Isb0VBQW9FO0lBQ3BFLHFFQUFxRTtJQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDOUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUM3QixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQzdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCw4QkFBOEI7QUFFOUIsZ0NBQWdDO0FBQ2hDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUN4QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO0lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNyRCxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixJQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7UUFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFTLENBQUM7WUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxFQUFFLFVBQVMsQ0FBQztZQUNULDRCQUE0QjtRQUNoQyxDQUFDLENBQUMsQ0FBQztLQUNOO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRTtJQUNwQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFVBQVMsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDLEVBQUUsVUFBUyxDQUFDO1FBQ1QsNEJBQTRCO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLHVDQUF1QztBQUMzQyxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVMsR0FBRztJQUNqQyxpREFBaUQ7SUFDakQsdUNBQXVDO0FBRTNDLENBQUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFTLEdBQUc7SUFDdkMsNERBQTREO0lBQzVELFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFTLEdBQUc7SUFDOUIsaURBQWlEO0lBQ2pELEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBUyxHQUFHO0lBQzlCLGdEQUFnRDtJQUNoRCxRQUFRLEVBQUUsQ0FBQztJQUNYLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLHVEQUF1RDtJQUN2RCwrQ0FBK0M7SUFDL0MsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtRQUNsQixtQ0FBbUM7UUFDbkMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksU0FBUyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO1FBQ3hELFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIseURBQXlEO1FBQ3pELHVEQUF1RDtRQUN2RCxtRkFBbUY7UUFDbkYsSUFBSSx5QkFBeUIsR0FBRyxJQUFJLENBQUM7UUFDckMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxjQUFjLEdBQUcsU0FBUyxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSTtZQUNBLEtBQUssSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMseUJBQXlCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUseUJBQXlCLEdBQUcsSUFBSSxFQUFFO2dCQUN2SixJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDbkIsd0RBQXdEO2FBQzNEO1NBQ0o7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUN6QixjQUFjLEdBQUcsR0FBRyxDQUFDO1NBQ3hCO2dCQUFTO1lBQ04sSUFBSTtnQkFDQSxJQUFJLENBQUMseUJBQXlCLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtvQkFDaEQsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUN0QjthQUNKO29CQUFTO2dCQUNOLElBQUksaUJBQWlCLEVBQUU7b0JBQ25CLE1BQU0sY0FBYyxDQUFDO2lCQUN4QjthQUNKO1NBQ0o7UUFDRCxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixZQUFZLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLG1DQUFtQztLQUV0QztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0gsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUNqRCxNQUFNO0FBQ04sMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCxvQkFBb0I7QUFDcEIsTUFBTTtBQUNOLElBQUksRUFBRSxDQUFDO0FBQ1AsT0FBTyxFQUFFLENBQUM7QUFDVixlQUFlO0FBRWY7SUFDSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixNQUFNLEVBQUUsQ0FBQztJQUNULEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQixDQUFDO0FBRUQsaUNBQWlDO0FBQ2pDLG9DQUFvQztBQUNwQyxZQUFZO0FBQ1osK0NBQStDO0FBQy9DLHNCQUFzQjtBQUN0QixrREFBa0Q7QUFDbEQsUUFBUTtBQUVSLE1BQU07QUFFTixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNqQyxjQUFjLEVBQUUsQ0FBQztJQUNqQixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUU5QyxDQUFDLENBQUMsQ0FBQztBQUVILGFBQWEsQ0FBQztJQUNWLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQyxFQUFFO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRXBDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQzFCLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUMsQ0FBQyxDQUFDLENBQUM7S0FDTjtTQUFNO1FBQ0gsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQzFCLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFMUMsQ0FBQyxDQUFDLENBQUM7S0FDTjtBQUVMLENBQUM7QUFFRCxjQUFjLENBQUM7SUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVELG1CQUFtQixDQUFDO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsb0JBQW9CLENBQUM7SUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxxQkFBcUIsQ0FBQztJQUNsQiw0QkFBNEI7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDMUIsSUFBSSxDQUFDLElBQUksWUFBWSxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQzdDO1NBQU07UUFDSCxJQUFJO1lBQ0EsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFMUMsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMseUNBQXlDO1NBQzVDO0tBQ0o7QUFDTCxDQUFDO0FBRUQsY0FBYyxDQUFDO0lBQ1gsc0JBQXNCO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVEO0lBQ0ksVUFBVSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsQ0FBQyIsImZpbGUiOiJqcy9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjMDJlMzY1MDQ1MDFjNjBlNWE2YyIsInZhciBjb250YWluZXIsIHN0YXRzLCBjYW1lcmEsIHNjZW5lLCByZW5kZXJlciwgZ3JvdXAsIHBhcnRpY2xlID0gW10sXG4gICAgbW91c2VYID0gMCxcbiAgICBtb3VzZVkgPSAwLFxuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyLFxuICAgIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMixcbiAgICB3YXRjaElEID0gbnVsbCxcbiAgICBYWCA9IDAsXG4gICAgWVkgPSAwLFxuICAgIFpaID0gMCxcbiAgICBhY2NYID0gMSxcbiAgICBhY2NZID0gMixcbiAgICBhY2NaID0gMyxcbiAgICBjb3VudG1zZyA9IDEsXG4gICAgbWF0ZXJpYWwsIHByb2dyYW0sIG15c2lkLFxuICAgIGNvbm5lY3RTdGF0dXMgPSBmYWxzZSxcbiAgICBhbGxkYXRhYmFsbHMsXG4gICAgZGV2aWNlaXNSZWFkeSA9IGZhbHNlO1xuY29uc3Qgb3RoZXJzaWQgPSBuZXcgU2V0KCk7XG52YXIgY291bnRlciA9IDAsXG4gICAgY2hhbmdlID0gZmFsc2UsXG4gICAgbG9jYWxDb3VudGVyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvdW50Jyk7XG5cbmZ1bmN0aW9uIHNldENvdW50ZXIodmFsKSB7XG4gICAgaWYgKGxvY2FsQ291bnRlciA9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjb3VudCcsIHZhbCk7XG4gICAgICAgIGNvdW50ZXIgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY291bnRlciA9IGxvY2FsQ291bnRlcjtcbiAgICAgICAgLy8gaWYgKGNvdW50ZXIgIT0gcGFyc2VJbnQobG9jYWxDb3VudGVyKSkge1xuICAgICAgICAvLyAgICAgY291bnRlciA9IHBhcnNlSW50KGxvY2FsQ291bnRlcik7XG4gICAgICAgIC8vICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG59XG52YXIgYXBwID0ge1xuICAgIC8vIEFwcGxpY2F0aW9uIENvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5JywgdGhpcy5vbkRldmljZVJlYWR5LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJhY2tidXR0b25cIiwgb25CYWNrS2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibWVudWJ1dHRvblwiLCBvbk1lbnVLZXlEb3duLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXVzZVwiLCBvblBhdXNlLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIC8vIGRldmljZXJlYWR5IEV2ZW50IEhhbmRsZXJcbiAgICAvL1xuICAgIC8vIEJpbmQgYW55IGNvcmRvdmEgZXZlbnRzIGhlcmUuIENvbW1vbiBldmVudHMgYXJlOlxuICAgIC8vICdwYXVzZScsICdyZXN1bWUnLCBldGMuXG4gICAgb25EZXZpY2VSZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRFdmVudCgnZGV2aWNlcmVhZHknKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2RldmljZSBpcyByZWFkeScpO1xuICAgICAgICBnZXRDdXJyZW50U1NJRCgpO1xuICAgICAgICBzdGFydFdhdGNoKCk7XG4gICAgICAgIGRldmljZWlzUmVhZHkgPSB0cnVlO1xuICAgICAgICAvL25hdmlnYXRvci5neXJvc2NvcGUud2F0Y2gob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gVXBkYXRlIERPTSBvbiBhIFJlY2VpdmVkIEV2ZW50XG4gICAgcmVjZWl2ZWRFdmVudDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIC8vdmFyIGxpc3RlbmluZ0VsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0ZW5pbmcnKTtcbiAgICAgICAgLy92YXIgcmVjZWl2ZWRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmVjZWl2ZWQnKTtcblxuICAgICAgICAvLyBsaXN0ZW5pbmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lOycpO1xuICAgICAgICAvLyByZWNlaXZlZEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OmJsb2NrOycpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBFdmVudDogJyArIGlkKTtcbiAgICB9XG59O1xuYXBwLmluaXRpYWxpemUoKTtcbi8vIFN0YXJ0IHdhdGNoaW5nIHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkJhY2tLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdiYWNrIGtleSBwcmVzc2VkIScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICBuYXZpZ2F0b3IuYXBwLmV4aXRBcHAoKTtcbn1cblxuZnVuY3Rpb24gb25NZW51S2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnbWVudSBrZXkgcHJlc3NlZCcpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gb25QYXVzZSgpIHtcbiAgICBjb25zb2xlLmxvZygnYXBwIG9uIHBhdXNlJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBzdGFydFdhdGNoKCkge1xuICAgIC8vIFVwZGF0ZSBhY2NlbGVyYXRpb24gZXZlcnkgMTAwIG1pbGxpc2Vjb25kc1xuICAgIHZhciBvcHRpb25zID0geyBmcmVxdWVuY3k6IDEwMCB9O1xuICAgIHdhdGNoSUQgPSBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci53YXRjaEFjY2VsZXJhdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xufVxuLy8gU3RvcCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gc3RvcFdhdGNoKCkge1xuICAgIGlmICh3YXRjaElEKSB7XG4gICAgICAgIG5hdmlnYXRvci5hY2NlbGVyb21ldGVyLmNsZWFyV2F0Y2god2F0Y2hJRCk7XG4gICAgICAgIHdhdGNoSUQgPSBudWxsO1xuICAgIH1cbn1cbi8vIG9uU3VjY2VzczogR2V0IGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25TdWNjZXNzKGFjY2VsZXJhdGlvbikge1xuXG4gICAgWFggPSBhY2NlbGVyYXRpb24ueDtcbiAgICBZWSA9IGFjY2VsZXJhdGlvbi55O1xuICAgIFpaID0gYWNjZWxlcmF0aW9uLno7XG4gICAgLy8gc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IFhYICsgJyAnICsgWVkgKyAnICcgKyBaWiB9KTtcbn1cbi8vIG9uRXJyb3I6IEZhaWxlZCB0byBnZXQgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uRXJyb3IoKSB7XG4gICAgYWxlcnQoJ29uRXJyb3IhJyk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgJCgnLmNvbnRhaW5lcicpLmFwcGVuZChjb250YWluZXIpO1xuICAgIC8vZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDMwMDApO1xuICAgIC8vY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAvL2NhbWVyYS5wb3NpdGlvbi56ID0gMTAwMDtcbiAgICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHZhciBQSTIgPSBNYXRoLlBJICogMjtcbiAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAwLjUsIDAsIFBJMiwgdHJ1ZSk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIH07XG4gICAgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICBzY2VuZS5hZGQoZ3JvdXApO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjcmVhdGluZyBiYWxscyEnKTtcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlQ2FudmFzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IE1hdGgucmFuZG9tKCkgKiAweDgwODAwOCArIDB4ODA4MDgwLFxuICAgICAgICAgICAgc29ydDogdHJ1ZSxcbiAgICAgICAgICAgIHByb2dyYW06IHByb2dyYW1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnRpY2xlID0gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbCk7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwICsgMTA7XG4gICAgICAgIGdyb3VwLmFkZChwYXJ0aWNsZSk7XG4gICAgfVxuICAgIHJlbmRlcmVyID0gbmV3IFRIUkVFLkNhbnZhc1JlbmRlcmVyKCk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Eb2N1bWVudFRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvbkRvY3VtZW50VG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgLy93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIG9uZGV2aWNlbW90aW9uLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBpZiAoY291bnRtc2cgPCAyKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2JhbGxzIGFkZGVkIScpO1xuICAgICAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgICAgIHByb2dyYW0gPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIH07XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHByb2dyYW06IHByb2dyYW1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnRpY2xlID0gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbCk7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSB2YWxYICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHZhbFkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwICsgMTA7XG4gICAgICAgIGdyb3VwLmFkZChwYXJ0aWNsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9tb3ZlQmFsbHModmFsWCwgdmFsWSwgdmFsWik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGdyb3VwLnNjYWxlLnggPSB2YWxYO1xuICAgIGdyb3VwLnNjYWxlLnkgPSB2YWxZO1xufVxuXG5mdW5jdGlvbiBvdGhlckJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBjb25zb2xlLmxvZygnZGF0YSBmb3IgYmFsbHNYOicgKyB2YWxYKTtcbiAgICBjb25zb2xlLmxvZygnZGF0YSBmb3IgYmFsbHNZOicgKyB2YWxZKTtcbiAgICAvLyBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgIC8vIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgLy8gLy8gQ3JlYXRlIGEgY2lyY2xlIGFyb3VuZCB0aGUgbW91c2UgYW5kIG1vdmUgaXRcbiAgICAvLyAvLyBUaGUgc3BoZXJlIGhhcyBvcGFjaXR5IDBcbiAgICAvLyB2YXIgbW91c2VHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxLCAwLCAwKTtcbiAgICAvLyB2YXIgbW91c2VNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gICAgIGNvbG9yOiAweDAwMDBmZlxuICAgIC8vIH0pO1xuICAgIC8vIG1vdXNlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1vdXNlR2VvbWV0cnksIG1vdXNlTWF0ZXJpYWwpO1xuICAgIC8vIG1vdXNlTWVzaC5wb3NpdGlvbi56ID0gLTU7XG4gICAgLy8gc2NlbmUuYWRkKG1vdXNlTWVzaCk7XG4gICAgLy8gLy8gTWFrZSB0aGUgc3BoZXJlIGZvbGxvdyB0aGUgbW91c2VcbiAgICAvLyB2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjModmFsWCwgdmFsWSwgMC41KTtcbiAgICAvLyB2ZWN0b3IudW5wcm9qZWN0KGNhbWVyYSk7XG4gICAgLy8gdmFyIGRpciA9IHZlY3Rvci5zdWIoY2FtZXJhLnBvc2l0aW9uKS5ub3JtYWxpemUoKTtcbiAgICAvLyB2YXIgZGlzdGFuY2UgPSAtY2FtZXJhLnBvc2l0aW9uLnogLyBkaXIuejtcbiAgICAvLyB2YXIgcG9zID0gY2FtZXJhLnBvc2l0aW9uLmNsb25lKCkuYWRkKGRpci5tdWx0aXBseVNjYWxhcihkaXN0YW5jZSkpO1xuICAgIC8vIG1vdXNlTWVzaC5wb3NpdGlvbi5jb3B5KHBvcyk7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueCA9IHZhbFggKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSB2YWxZICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUuc2NhbGUueCA9IHBhcnRpY2xlLnNjYWxlLnkgPSBNYXRoLnJhbmRvbSgpICogMjAwICsgMTAwO1xuICAgIC8vIGdyb3VwLmFkZChwYXJ0aWNsZSk7XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoTW92ZShldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3VzZVg6JyArIG1vdXNlWCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3VzZVk6ICcgKyBtb3VzZVkpO1xuICAgICAgICAvL3NvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBtb3VzZVggKiBYWCArICcgJyArIG1vdXNlWSAqIFlZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBtb3VzZVggKyAnICcgKyBtb3VzZVkgKyAnICcgKyBYWCArICcgJyArIFlZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIC8vdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFhYLCBZWSwgWlopO1xuICAgIH1cbn1cblxuLy8gd2luZG93Lm9uZGV2aWNlbW90aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgYWNjWCA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbi8vICAgICAgICAgYWNjWSA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbi8vICAgICAgICAgYWNjWiA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbi8vICAgICB9XG4vL1xuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgcmVuZGVyZXIuY2xlYXIoKTtcbiAgICAvL2NhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMCwgNSk7XG4gICAgLy8gY2FtZXJhLnBvc2l0aW9uLnggKz0gKE1hdGgucm91bmQoWFgpIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wNTtcbiAgICAvLyBjYW1lcmEucG9zaXRpb24ueSArPSAoLU1hdGgucm91bmQoWVkpIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wNTtcbiAgICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgICBncm91cC5yb3RhdGlvbi54ICs9IFhYIC8gMTAwMDtcbiAgICBncm91cC5yb3RhdGlvbi55ICs9IFlZIC8gMTAwMDtcbiAgICBncm91cC5wb3NpdGlvbi54ICs9IFhYIC8gNTAwO1xuICAgIGdyb3VwLnBvc2l0aW9uLnkgKz0gWVkgLyA1MDA7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xufVxuXG4vL2NvbnNvbGUubG9nKCdhY2NYOicgKyBhY2NYKTtcblxuLy8kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbnZhciBuYW1lc3BhY2UgPSAnL3Rlc3QnO1xudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly8xOTIuMTY4LjAuMTo1MDAwJyArIG5hbWVzcGFjZSk7XG5cbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHNvY2tldC5lbWl0KCdteSBldmVudCcsIHsgZGF0YTogJ0lcXCdtIGNvbm5lY3RlZCEnIH0pO1xuICAgIGNvbm5lY3RTdGF0dXMgPSB0cnVlO1xuICAgICQoJyNjb25lY3RhcicpLmhpZGUoKTtcbiAgICBpZiAoZGV2aWNlaXNSZWFkeSA9PSB0cnVlKSB7XG4gICAgICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnQ29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKVxuICAgICAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvd1Nob3J0VG9wKCdEZXNjb25lY3RhZG8nLCBmdW5jdGlvbihhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICAgIC8vYWxlcnQoJ3RvYXN0IGVycm9yOiAnICsgYilcbiAgICB9KTtcbiAgICAkKCcjY29uZWN0YXInKS5zaG93KCk7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+RGlzY29ubmVjdGVkJyk7XG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyAkKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZygnY291bnRtc2c6ICcgKyBjb3VudG1zZyk7XG5cbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZSBjb3VudCcsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEgKyBtc2cuY291bnQpO1xuICAgIHNldENvdW50ZXIobXNnLmNvdW50KTtcbn0pO1xuc29ja2V0Lm9uKCdqb2lucm9vbScsIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vY29uc29sZS5sb2coJ3NpZDogJyArIEpTT04uc3RyaW5naWZ5KHZhbC5zaWQpKTtcbiAgICBteXNpZCA9IHZhbC5zaWQ7XG59KTtcbnNvY2tldC5vbignZW5zYW1ibGUnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICBjb3VudG1zZysrO1xuICAgIHVwZGF0ZUJhbGxzKFhYLCBZWSwgWlopO1xuICAgIC8vY29uc29sZS5sb2coJ2RhdGEgWFlaOiAnICsgSlNPTi5zdHJpbmdpZnkobXNnLmRhdGEpKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQnICsgSlNPTi5zdHJpbmdpZnkobXNnLnNpZCkpO1xuICAgIGlmIChteXNpZCAhPSBtc2cuc2lkKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ21zZyBpZDonICsgbXNnLnNpZCk7XG4gICAgICAgIHZhciBtc2dzaWQgPSBtc2cuc2lkO1xuICAgICAgICB2YXIgbXNnZGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICB2YXIgb3RoZXJkYXRhID0geyAnbXNnc2lkJzogbXNnc2lkLCAnbXNnZGF0YSc6IG1zZ2RhdGEgfVxuICAgICAgICBvdGhlcnNpZC5hZGQob3RoZXJkYXRhKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJkYXRhOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJkYXRhKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJzaWQpKTtcbiAgICAgICAgLy9mb3IgKGxldCBpdGVtIG9mIG90aGVyc2lkKSBjb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG90aGVyc2lkW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFsbGRhdGFiYWxscyA9IGl0ZW0ubXNnZGF0YTtcbiAgICAgICAgYWxsZGF0YWJhbGxzID0gYWxsZGF0YWJhbGxzLnNwbGl0KCcgJyk7XG4gICAgICAgIG90aGVyQmFsbHMoYWxsZGF0YWJhbGxzWzBdLCBhbGxkYXRhYmFsbHNbMV0pO1xuICAgICAgICAvL3B1dCBhIGJhbGwgd2l0aCBuYW1lIGFuZCBtb3ZlIGl0OlxuXG4gICAgfVxuXG59KTtcbi8vICQoJyNjb25lY3RhcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyB9KTtcbi8vICQoJyNob2xhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbi8vICAgICBzdGFydFdhdGNoKCk7XG4vLyB9KTtcbmluaXQoKTtcbmFuaW1hdGUoKTtcbi8vc3RhcnRXYXRjaCgpO1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICByZW5kZXIoKTtcbiAgICBzdGF0cy51cGRhdGUoKTtcbn1cblxuLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4vLyAkKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbi8vICAgICB9IGNhdGNoIChlcnIpIHtcbi8vICAgICAgICAgYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbi8vICAgICB9XG5cbi8vIH0pO1xuXG4kKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygndGFwIG9uIGNvbmVjdGFyISEnKTtcbiAgICBnZXRDdXJyZW50U1NJRCgpO1xuICAgIHNvY2tldC5jb25uZWN0KCk7XG4gICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiB3aW4oZSkge1xuICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgaWYgKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgYWxyZWFkeVwiKTtcbiAgICAgICAgXG4gICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFdpZmlXaXphcmQuc2V0V2lmaUVuYWJsZWQodHJ1ZSwgd2luRW5hYmxlLCBmYWlsRW5hYmxlKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9PSAnXCJFbnNhbWJsZVwiJykge1xuICAgICAgICBjb25zb2xlLmxvZygnRW5zYW1ibGUgZm91bmQhJyk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG4gICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIEVycm9yIC0nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgLy9hbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICAvL2FsZXJ0KFwiRmFpbGVkXCIgKyBlKTtcbiAgICBjb25zb2xlLmxvZygnd2lmaSBkaXNhYmxlZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U1NJRCgpIHtcbiAgICBXaWZpV2l6YXJkLmdldEN1cnJlbnRTU0lEKHNzaWRIYW5kbGVyLCBmYWlsKTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=