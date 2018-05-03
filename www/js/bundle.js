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

var container, stats, camera, scene, renderer, group, particle = [], mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, watchID = null, XX = 0, YY = 0, ZZ = 0, accX = 1, accY = 2, accZ = 3, countmsg = 1, material, program, mysid, othersid = new Set([]), connectStatus = false, alldataballs;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
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
        particle.position.x = Math.random() * 2000 - 500;
        particle.position.y = Math.random() * 2000 - 500;
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
socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m connected!' });
    connectStatus = true;
    $('#conectar').hide();
});
socket.on('disconnect', function () {
    $('#conectar').show();
    //$('#log').append('<br>Disconnected');
});
socket.on('my response', function (msg) {
    // $('#log').append('<br>Received: ' + msg.data);
    //console.log('countmsg: ' + countmsg);
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
        console.log('msg id:' + msg.sid);
        var msgsid = msg.sid;
        var msgdata = msg.data;
        var otherdata = { msgsid: msgsid, msgdata: msgdata };
        othersid.add(otherdata);
        //console.log('othersid: ' + JSON.stringify(othersid));
        for (var _i = 0, othersid_1 = othersid; _i < othersid_1.length; _i++) {
            var item = othersid_1[_i];
            console.log('othersid:' + item.msgsid + item.msgdata);
            alldataballs = item.msgdata;
        }
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
$('#conectar').click(function () {
    getCurrentSSID();
});
function win(e) {
    if (e) {
        console.log("Wifi enabled already");
        var config = WifiWizard.formatWPAConfig("MrRobot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork("MrRobot");
        });
    }
    else {
        WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        var config = WifiWizard.formatWPAConfig("MrRobot", "sayh3ll0tomylittlefriend");
        WifiWizard.addNetwork(config, function () {
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
    }
    else {
        try {
            WifiWizard.isWifiEnabled(win, fail);
        }
        catch (err) {
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzgxNTU0YTk1ZjJkNTBmNGZkM2QiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxD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LGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxLQUFLLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQWMsQ0FBQztJQUNYLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVEO0lBQ0ksVUFBVSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsQ0FBQyIsImZpbGUiOiJqcy9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjODE1NTRhOTVmMmQ1MGY0ZmQzZCIsInZhciBjb250YWluZXIsIHN0YXRzLCBjYW1lcmEsIHNjZW5lLCByZW5kZXJlciwgZ3JvdXAsIHBhcnRpY2xlID0gW10sXG4gICAgbW91c2VYID0gMCxcbiAgICBtb3VzZVkgPSAwLFxuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyLFxuICAgIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMixcbiAgICB3YXRjaElEID0gbnVsbCxcbiAgICBYWCA9IDAsXG4gICAgWVkgPSAwLFxuICAgIFpaID0gMCxcbiAgICBhY2NYID0gMSxcbiAgICBhY2NZID0gMixcbiAgICBhY2NaID0gMyxcbiAgICBjb3VudG1zZyA9IDEsXG4gICAgbWF0ZXJpYWwsIHByb2dyYW0sIG15c2lkLCBvdGhlcnNpZCA9IG5ldyBTZXQoW10pLFxuICAgIGNvbm5lY3RTdGF0dXMgPSBmYWxzZSxcbiAgICBhbGxkYXRhYmFsbHM7XG52YXIgYXBwID0ge1xuICAgIC8vIEFwcGxpY2F0aW9uIENvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5JywgdGhpcy5vbkRldmljZVJlYWR5LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gZGV2aWNlcmVhZHkgRXZlbnQgSGFuZGxlclxuICAgIC8vXG4gICAgLy8gQmluZCBhbnkgY29yZG92YSBldmVudHMgaGVyZS4gQ29tbW9uIGV2ZW50cyBhcmU6XG4gICAgLy8gJ3BhdXNlJywgJ3Jlc3VtZScsIGV0Yy5cbiAgICBvbkRldmljZVJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZEV2ZW50KCdkZXZpY2VyZWFkeScpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlIGlzIHJlYWR5Jyk7XG4gICAgICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgICAgIHN0YXJ0V2F0Y2goKTtcbiAgICAgICAgLy9uYXZpZ2F0b3IuZ3lyb3Njb3BlLndhdGNoKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBET00gb24gYSBSZWNlaXZlZCBFdmVudFxuICAgIHJlY2VpdmVkRXZlbnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIC8vIHZhciBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvL3ZhciBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJyk7XG4gICAgICAgIC8vdmFyIHJlY2VpdmVkRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2VpdmVkJyk7XG5cbiAgICAgICAgLy8gbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICAgICAgLy8gcmVjZWl2ZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jazsnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgRXZlbnQ6ICcgKyBpZCk7XG4gICAgfVxufTtcbmFwcC5pbml0aWFsaXplKCk7XG4vLyBTdGFydCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgICAvLyBVcGRhdGUgYWNjZWxlcmF0aW9uIGV2ZXJ5IDEwMCBtaWxsaXNlY29uZHNcbiAgICB2YXIgb3B0aW9ucyA9IHsgZnJlcXVlbmN5OiAxMDAgfTtcbiAgICB3YXRjaElEID0gbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIud2F0Y2hBY2NlbGVyYXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbn1cbi8vIFN0b3Agd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIHN0b3BXYXRjaCgpIHtcbiAgICBpZiAod2F0Y2hJRCkge1xuICAgICAgICBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci5jbGVhcldhdGNoKHdhdGNoSUQpO1xuICAgICAgICB3YXRjaElEID0gbnVsbDtcbiAgICB9XG59XG4vLyBvblN1Y2Nlc3M6IEdldCBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uU3VjY2VzcyhhY2NlbGVyYXRpb24pIHtcblxuICAgIFhYID0gYWNjZWxlcmF0aW9uLng7XG4gICAgWVkgPSBhY2NlbGVyYXRpb24ueTtcbiAgICBaWiA9IGFjY2VsZXJhdGlvbi56O1xuICAgIC8vIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBYWCArICcgJyArIFlZICsgJyAnICsgWlogfSk7XG59XG4vLyBvbkVycm9yOiBGYWlsZWQgdG8gZ2V0IHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkVycm9yKCkge1xuICAgIGFsZXJ0KCdvbkVycm9yIScpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICQoJy5jb250YWluZXInKS5hcHBlbmQoY29udGFpbmVyKTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAzMDAwKTtcbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG4gICAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9O1xuICAgIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgc2NlbmUuYWRkKGdyb3VwKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY3JlYXRpbmcgYmFsbHMhJyk7XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHNvcnQ6IHRydWUsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH1cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5DYW52YXNSZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Eb2N1bWVudFRvdWNoTW92ZSwgZmFsc2UpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBvbmRldmljZW1vdGlvbiwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgaWYgKGNvdW50bXNnIDwgMikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdiYWxscyBhZGRlZCEnKTtcbiAgICAgICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgICAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBncm91cC5zY2FsZS54ID0gdmFsWDtcbiAgICBncm91cC5zY2FsZS55ID0gdmFsWTtcbn1cblxuZnVuY3Rpb24gb3RoZXJCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgcGFydGljbGUucG9zaXRpb24ueCA9IHZhbFggKiAxMDAwO1xuICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSB2YWxZICogMTAwMDtcbiAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gMDtcbiAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IHZhbFggKiA3NTAgKyAyMDA7XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICYmIGNvbm5lY3RTdGF0dXMgPT0gdHJ1ZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IFhYICsgJyAnICsgWVkgKyAnICcgKyBaWiB9KTtcbiAgICAgICAgdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFpaKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgfVxufVxuXG4vLyB3aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBmdW5jdGlvbihldmVudCkge1xuLy8gICAgICAgICBhY2NYID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuLy8gICAgICAgICBhY2NZID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuLy8gICAgICAgICBhY2NaID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuLy8gICAgIH1cbi8vXG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5yb3VuZChYWCkgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjA1O1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtTWF0aC5yb3VuZChZWSkgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjA1O1xuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGdyb3VwLnJvdGF0aW9uLnggKz0gWFggLyAxMDAwO1xuICAgIGdyb3VwLnJvdGF0aW9uLnkgKz0gWVkgLyAxMDAwO1xuICAgIGdyb3VwLnBvc2l0aW9uLnggPSBYWCAvIDUwMDtcbiAgICBncm91cC5wb3NpdGlvbi55ID0gWVkgLyA1MDA7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xufVxuXG4vL2NvbnNvbGUubG9nKCdhY2NYOicgKyBhY2NYKTtcblxuLy8kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbnZhciBuYW1lc3BhY2UgPSAnL3Rlc3QnO1xudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly8xOTIuMTY4LjAuMTU5OjUwMDAnICsgbmFtZXNwYWNlKTtcblxuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgc29ja2V0LmVtaXQoJ215IGV2ZW50JywgeyBkYXRhOiAnSVxcJ20gY29ubmVjdGVkIScgfSk7XG4gICAgY29ubmVjdFN0YXR1cyA9IHRydWU7XG4gICAgJCgnI2NvbmVjdGFyJykuaGlkZSgpO1xufSk7XG5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAkKCcjY29uZWN0YXInKS5zaG93KCk7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+RGlzY29ubmVjdGVkJyk7XG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyAkKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZygnY291bnRtc2c6ICcgKyBjb3VudG1zZyk7XG5cbn0pO1xuc29ja2V0Lm9uKCdqb2lucm9vbScsIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vY29uc29sZS5sb2coJ3NpZDogJyArIEpTT04uc3RyaW5naWZ5KHZhbC5zaWQpKTtcbiAgICBteXNpZCA9IHZhbC5zaWQ7XG59KTtcbnNvY2tldC5vbignZW5zYW1ibGUnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICBjb3VudG1zZysrO1xuICAgIHVwZGF0ZUJhbGxzKFhYLCBZWSwgWlopO1xuICAgIC8vY29uc29sZS5sb2coJ2RhdGEgWFlaOiAnICsgSlNPTi5zdHJpbmdpZnkobXNnLmRhdGEpKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQnICsgSlNPTi5zdHJpbmdpZnkobXNnLnNpZCkpO1xuICAgIGlmIChteXNpZCAhPSBtc2cuc2lkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtc2cgaWQ6JyArIG1zZy5zaWQpO1xuICAgICAgICB2YXIgbXNnc2lkID0gbXNnLnNpZDtcbiAgICAgICAgdmFyIG1zZ2RhdGEgPSBtc2cuZGF0YTtcbiAgICAgICAgdmFyIG90aGVyZGF0YSA9IHsgbXNnc2lkOiBtc2dzaWQsIG1zZ2RhdGE6IG1zZ2RhdGEgfVxuICAgICAgICBvdGhlcnNpZC5hZGQob3RoZXJkYXRhKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcnNpZCkpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG90aGVyc2lkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgICAgIGFsbGRhdGFiYWxscyA9IGl0ZW0ubXNnZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBhbGxkYXRhYmFsbHMgPSBhbGxkYXRhYmFsbHMuc3BsaXQoJyAnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWDonICsgYWxsZGF0YWJhbGxzWzBdKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWTonICsgYWxsZGF0YWJhbGxzWzFdKTtcbiAgICAgICAgb3RoZXJCYWxscyhhbGxkYXRhYmFsbHNbMF0sIGFsbGRhdGFiYWxsc1sxXSk7XG4gICAgICAgIC8vcHV0IGEgYmFsbCB3aXRoIG5hbWUgYW5kIG1vdmUgaXQ6XG5cbiAgICB9XG5cbn0pO1xuLy8gJCgnI2NvbmVjdGFyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbi8vIH0pO1xuLy8gJCgnI2hvbGEnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuLy8gICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuLy8gICAgIHN0YXJ0V2F0Y2goKTtcbi8vIH0pO1xuaW5pdCgpO1xuYW5pbWF0ZSgpO1xuLy9zdGFydFdhdGNoKCk7XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIHJlbmRlcigpO1xuICAgIHN0YXRzLnVwZGF0ZSgpO1xufVxuXG4vLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbi8vICQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuLy8gICAgIH0gY2F0Y2ggKGVycikge1xuLy8gICAgICAgICBhbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuLy8gICAgIH1cblxuLy8gfSk7XG5cbiQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIGdldEN1cnJlbnRTU0lEKClcblxufSk7XG5cbmZ1bmN0aW9uIHdpbihlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgYWxyZWFkeVwiKTtcbiAgICAgICAgdmFyIGNvbmZpZyA9IFdpZmlXaXphcmQuZm9ybWF0V1BBQ29uZmlnKFwiTXJSb2JvdFwiLCBcInNheWgzbGwwdG9teWxpdHRsZWZyaWVuZFwiKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiTXJSb2JvdFwiKTtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBXaWZpV2l6YXJkLnNldFdpZmlFbmFibGVkKHRydWUsIHdpbkVuYWJsZSwgZmFpbEVuYWJsZSk7XG4gICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIk1yUm9ib3RcIiwgXCJzYXloM2xsMHRvbXlsaXR0bGVmcmllbmRcIik7XG4gICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIk1yUm9ib3RcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9ICdcIk1yUm9ib3RcIicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ01yUm9ib3QgZm91bmQhJyk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICBhbGVydChcIkZhaWxlZFwiICsgZSk7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRTU0lEKCkge1xuICAgIFdpZmlXaXphcmQuZ2V0Q3VycmVudFNTSUQoc3NpZEhhbmRsZXIsIGZhaWwpO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==