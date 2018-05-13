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

var container, stats, camera, scene, renderer, group, particle = [], mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, watchID = null, XX = 0, YY = 0, ZZ = 0, accX = 1, accY = 2, accZ = 3, countmsg = 1, material, program, mysid, connectStatus = false, alldataballs;
var othersid = new Set();
var counter = 0, change = false, localCounter = localStorage.getItem('count');
function setCounter(val) {
    if (localCounter == null) {
        localStorage.setItem('count', val);
    }
    else {
        counter = val;
        if (counter != parseInt(localCounter)) {
            change = true;
        }
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
}
function onMenuKeyDown() {
    console.log('menu key pressed');
}
function onPause() {
    console.log('app on pause');
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
    // particle.position.x = valX * 2000 - 500;
    // particle.position.y = valX * 2000 - 500;
    // particle.position.z = Math.random() * 2000 - 500;
    // particle.scale.x = particle.scale.y = Math.random() * 200 + 100;
    //group.add(particle);
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
        console.log('mouseX:' + mouseX);
        console.log('mouseY: ' + mouseY);
        socket.emit('my room event', { room: 'ensamble', data: mouseX + ' ' + mouseY + ' ' + ZZ, counter: counter });
        //updateBalls(mouseX, mouseY, ZZ);
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
    camera.position.x += (Math.round(XX) - camera.position.x) * 0.05;
    camera.position.y += (-Math.round(YY) - camera.position.y) * 0.05;
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
var socket = io.connect('http://192.168.0.159:5000' + namespace);
socket.on('connect', function () {
    socket.emit('my event', { data: 'I\'m connected!' });
    connectStatus = true;
    $('#conectar').hide();
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
        //console.log('data for ballsX:' + alldataballs[0]);
        //console.log('data for ballsY:' + alldataballs[1]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTljNGJmZjFlYzc2YjdjOWY5ZDgiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxDQUFD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Q0FBQyxDQUFDO0FBQ2pELENBQUMiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTljNGJmZjFlYzc2YjdjOWY5ZDgiLCJ2YXIgY29udGFpbmVyLCBzdGF0cywgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXIsIGdyb3VwLCBwYXJ0aWNsZSA9IFtdLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMixcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIsXG4gICAgd2F0Y2hJRCA9IG51bGwsXG4gICAgWFggPSAwLFxuICAgIFlZID0gMCxcbiAgICBaWiA9IDAsXG4gICAgYWNjWCA9IDEsXG4gICAgYWNjWSA9IDIsXG4gICAgYWNjWiA9IDMsXG4gICAgY291bnRtc2cgPSAxLFxuICAgIG1hdGVyaWFsLCBwcm9ncmFtLCBteXNpZCxcbiAgICBjb25uZWN0U3RhdHVzID0gZmFsc2UsXG4gICAgYWxsZGF0YWJhbGxzO1xuY29uc3Qgb3RoZXJzaWQgPSBuZXcgU2V0KCk7XG52YXIgY291bnRlciA9IDAsXG4gICAgY2hhbmdlID0gZmFsc2UsXG4gICAgbG9jYWxDb3VudGVyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvdW50Jyk7XG5cbmZ1bmN0aW9uIHNldENvdW50ZXIodmFsKSB7XG4gICAgaWYgKGxvY2FsQ291bnRlciA9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjb3VudCcsIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY291bnRlciA9IHZhbDtcbiAgICAgICAgaWYgKGNvdW50ZXIgIT0gcGFyc2VJbnQobG9jYWxDb3VudGVyKSkge1xuICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufVxudmFyIGFwcCA9IHtcbiAgICAvLyBBcHBsaWNhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkRXZlbnQoJ2RldmljZXJlYWR5Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2UgaXMgcmVhZHknKTtcbiAgICAgICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgICAgICAvL25hdmlnYXRvci5neXJvc2NvcGUud2F0Y2gob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gVXBkYXRlIERPTSBvbiBhIFJlY2VpdmVkIEV2ZW50XG4gICAgcmVjZWl2ZWRFdmVudDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIC8vdmFyIGxpc3RlbmluZ0VsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0ZW5pbmcnKTtcbiAgICAgICAgLy92YXIgcmVjZWl2ZWRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmVjZWl2ZWQnKTtcblxuICAgICAgICAvLyBsaXN0ZW5pbmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lOycpO1xuICAgICAgICAvLyByZWNlaXZlZEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OmJsb2NrOycpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBFdmVudDogJyArIGlkKTtcbiAgICB9XG59O1xuYXBwLmluaXRpYWxpemUoKTtcbi8vIFN0YXJ0IHdhdGNoaW5nIHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkJhY2tLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdiYWNrIGtleSBwcmVzc2VkIScpO1xufVxuXG5mdW5jdGlvbiBvbk1lbnVLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdtZW51IGtleSBwcmVzc2VkJyk7XG59XG5cbmZ1bmN0aW9uIG9uUGF1c2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCBvbiBwYXVzZScpO1xufVxuXG5mdW5jdGlvbiBzdGFydFdhdGNoKCkge1xuICAgIC8vIFVwZGF0ZSBhY2NlbGVyYXRpb24gZXZlcnkgMTAwIG1pbGxpc2Vjb25kc1xuICAgIHZhciBvcHRpb25zID0geyBmcmVxdWVuY3k6IDEwMCB9O1xuICAgIHdhdGNoSUQgPSBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci53YXRjaEFjY2VsZXJhdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xufVxuLy8gU3RvcCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gc3RvcFdhdGNoKCkge1xuICAgIGlmICh3YXRjaElEKSB7XG4gICAgICAgIG5hdmlnYXRvci5hY2NlbGVyb21ldGVyLmNsZWFyV2F0Y2god2F0Y2hJRCk7XG4gICAgICAgIHdhdGNoSUQgPSBudWxsO1xuICAgIH1cbn1cbi8vIG9uU3VjY2VzczogR2V0IGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25TdWNjZXNzKGFjY2VsZXJhdGlvbikge1xuXG4gICAgWFggPSBhY2NlbGVyYXRpb24ueDtcbiAgICBZWSA9IGFjY2VsZXJhdGlvbi55O1xuICAgIFpaID0gYWNjZWxlcmF0aW9uLno7XG4gICAgLy8gc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IFhYICsgJyAnICsgWVkgKyAnICcgKyBaWiB9KTtcbn1cbi8vIG9uRXJyb3I6IEZhaWxlZCB0byBnZXQgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uRXJyb3IoKSB7XG4gICAgYWxlcnQoJ29uRXJyb3IhJyk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgJCgnLmNvbnRhaW5lcicpLmFwcGVuZChjb250YWluZXIpO1xuICAgIC8vZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDMwMDApO1xuICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gMTAwMDtcbiAgICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHZhciBQSTIgPSBNYXRoLlBJICogMjtcbiAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCAwLjUsIDAsIFBJMiwgdHJ1ZSk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIH07XG4gICAgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICBzY2VuZS5hZGQoZ3JvdXApO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjcmVhdGluZyBiYWxscyEnKTtcbiAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlQ2FudmFzTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IE1hdGgucmFuZG9tKCkgKiAweDgwODAwOCArIDB4ODA4MDgwLFxuICAgICAgICAgICAgc29ydDogdHJ1ZSxcbiAgICAgICAgICAgIHByb2dyYW06IHByb2dyYW1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnRpY2xlID0gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbCk7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDEwMDA7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwICsgMTA7XG4gICAgICAgIGdyb3VwLmFkZChwYXJ0aWNsZSk7XG4gICAgfVxuICAgIHJlbmRlcmVyID0gbmV3IFRIUkVFLkNhbnZhc1JlbmRlcmVyKCk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Eb2N1bWVudFRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvbkRvY3VtZW50VG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgLy93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIG9uZGV2aWNlbW90aW9uLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBpZiAoY291bnRtc2cgPCAyKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2JhbGxzIGFkZGVkIScpO1xuICAgICAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgICAgIHByb2dyYW0gPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIH07XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHByb2dyYW06IHByb2dyYW1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcnRpY2xlID0gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbCk7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwICsgMTA7XG4gICAgICAgIGdyb3VwLmFkZChwYXJ0aWNsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9tb3ZlQmFsbHModmFsWCwgdmFsWSwgdmFsWik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlQmFsbHModmFsWCwgdmFsWSwgdmFsWikge1xuICAgIGdyb3VwLnNjYWxlLnggPSB2YWxYO1xuICAgIGdyb3VwLnNjYWxlLnkgPSB2YWxZO1xufVxuXG5mdW5jdGlvbiBvdGhlckJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcblxuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnggPSB2YWxYICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwMCArIDEwMDtcbiAgICAvL2dyb3VwLmFkZChwYXJ0aWNsZSk7XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoTW92ZShldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3VzZVg6JyArIG1vdXNlWCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3VzZVk6ICcgKyBtb3VzZVkpO1xuICAgICAgICBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogbW91c2VYICsgJyAnICsgbW91c2VZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIC8vdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFpaKTtcbiAgICB9XG59XG5cbi8vIHdpbmRvdy5vbmRldmljZW1vdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgIGFjY1ggPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4vLyAgICAgICAgIGFjY1kgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4vLyAgICAgICAgIGFjY1ogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4vLyAgICAgfVxuLy9cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHJlbmRlcmVyLmNsZWFyKCk7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggKz0gKE1hdGgucm91bmQoWFgpIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wNTtcbiAgICBjYW1lcmEucG9zaXRpb24ueSArPSAoLU1hdGgucm91bmQoWVkpIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wNTtcbiAgICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgICBncm91cC5yb3RhdGlvbi54ICs9IFhYIC8gMTAwMDtcbiAgICBncm91cC5yb3RhdGlvbi55ICs9IFlZIC8gMTAwMDtcbiAgICBncm91cC5wb3NpdGlvbi54ICs9IFhYIC8gNTAwO1xuICAgIGdyb3VwLnBvc2l0aW9uLnkgKz0gWVkgLyA1MDA7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xufVxuXG4vL2NvbnNvbGUubG9nKCdhY2NYOicgKyBhY2NYKTtcblxuLy8kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbnZhciBuYW1lc3BhY2UgPSAnL3Rlc3QnO1xudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly8xOTIuMTY4LjAuMTU5OjUwMDAnICsgbmFtZXNwYWNlKTtcblxuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgc29ja2V0LmVtaXQoJ215IGV2ZW50JywgeyBkYXRhOiAnSVxcJ20gY29ubmVjdGVkIScgfSk7XG4gICAgY29ubmVjdFN0YXR1cyA9IHRydWU7XG4gICAgJCgnI2NvbmVjdGFyJykuaGlkZSgpO1xufSk7XG5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cucGx1Z2lucy50b2FzdC5zaG93U2hvcnRUb3AoJ0Rlc2NvbmVjdGFkbycsIGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKVxuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgIH0pO1xuICAgICQoJyNjb25lY3RhcicpLnNob3coKTtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5EaXNjb25uZWN0ZWQnKTtcbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZScsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vICQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICAvL2NvbnNvbGUubG9nKCdjb3VudG1zZzogJyArIGNvdW50bXNnKTtcblxufSk7XG5zb2NrZXQub24oJ215IHJlc3BvbnNlIGNvdW50JywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSArIG1zZy5jb3VudCk7XG4gICAgc2V0Q291bnRlcihtc2cuY291bnQpO1xufSk7XG5zb2NrZXQub24oJ2pvaW5yb29tJywgZnVuY3Rpb24odmFsKSB7XG4gICAgLy9jb25zb2xlLmxvZygnc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsLnNpZCkpO1xuICAgIG15c2lkID0gdmFsLnNpZDtcbn0pO1xuc29ja2V0Lm9uKCdlbnNhbWJsZScsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEpO1xuICAgIGNvdW50bXNnKys7XG4gICAgdXBkYXRlQmFsbHMoWFgsIFlZLCBaWik7XG4gICAgLy9jb25zb2xlLmxvZygnZGF0YSBYWVo6ICcgKyBKU09OLnN0cmluZ2lmeShtc2cuZGF0YSkpO1xuICAgIC8vY29uc29sZS5sb2coJ3NpZCcgKyBKU09OLnN0cmluZ2lmeShtc2cuc2lkKSk7XG4gICAgaWYgKG15c2lkICE9IG1zZy5zaWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbXNnIGlkOicgKyBtc2cuc2lkKTtcbiAgICAgICAgdmFyIG1zZ3NpZCA9IG1zZy5zaWQ7XG4gICAgICAgIHZhciBtc2dkYXRhID0gbXNnLmRhdGE7XG4gICAgICAgIHZhciBvdGhlcmRhdGEgPSB7ICdtc2dzaWQnOiBtc2dzaWQsICdtc2dkYXRhJzogbXNnZGF0YSB9XG4gICAgICAgIG90aGVyc2lkLmFkZChvdGhlcmRhdGEpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcmRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcmRhdGEpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcnNpZCkpO1xuICAgICAgICAvL2ZvciAobGV0IGl0ZW0gb2Ygb3RoZXJzaWQpIGNvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb3RoZXJzaWRbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYWxsZGF0YWJhbGxzID0gaXRlbS5tc2dkYXRhO1xuICAgICAgICBhbGxkYXRhYmFsbHMgPSBhbGxkYXRhYmFsbHMuc3BsaXQoJyAnKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGF0YSBmb3IgYmFsbHNYOicgKyBhbGxkYXRhYmFsbHNbMF0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhIGZvciBiYWxsc1k6JyArIGFsbGRhdGFiYWxsc1sxXSk7XG4gICAgICAgIG90aGVyQmFsbHMoYWxsZGF0YWJhbGxzWzBdLCBhbGxkYXRhYmFsbHNbMV0pO1xuICAgICAgICAvL3B1dCBhIGJhbGwgd2l0aCBuYW1lIGFuZCBtb3ZlIGl0OlxuXG4gICAgfVxuXG59KTtcbi8vICQoJyNjb25lY3RhcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyB9KTtcbi8vICQoJyNob2xhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbi8vICAgICBzdGFydFdhdGNoKCk7XG4vLyB9KTtcbmluaXQoKTtcbmFuaW1hdGUoKTtcbi8vc3RhcnRXYXRjaCgpO1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICByZW5kZXIoKTtcbiAgICBzdGF0cy51cGRhdGUoKTtcbn1cblxuLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4vLyAkKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbi8vICAgICB9IGNhdGNoIChlcnIpIHtcbi8vICAgICAgICAgYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbi8vICAgICB9XG5cbi8vIH0pO1xuXG4kKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBnZXRDdXJyZW50U1NJRCgpO1xuXG59KTtcblxuZnVuY3Rpb24gd2luKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIldpZmkgZW5hYmxlZCBhbHJlYWR5XCIpO1xuICAgICAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJNcl9Sb2JvdFwiLCBcInNheWgzbGwwdG9teWxpdHRsZWZyaWVuZFwiKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiTXJfUm9ib3RcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgV2lmaVdpemFyZC5zZXRXaWZpRW5hYmxlZCh0cnVlLCB3aW5FbmFibGUsIGZhaWxFbmFibGUpO1xuICAgICAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJNcl9Sb2JvdFwiLCBcInNheWgzbGwwdG9teWxpdHRsZWZyaWVuZFwiKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiTXJfUm9ib3RcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9ICdcIk1yX1JvYm90XCInKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNcl9Sb2JvdCBmb3VuZCEnKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gRXJyb3IgLScgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAvL2FsZXJ0KFwiUGx1Z2luIEVycm9yIC0gXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIC8vYWxlcnQoXCJGYWlsZWRcIiArIGUpO1xuICAgIGNvbnNvbGUubG9nKCd3aWZpIGRpc2FibGVkJyk7XG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRTU0lEKCkge1xuICAgIFdpZmlXaXphcmQuZ2V0Q3VycmVudFNTSUQoc3NpZEhhbmRsZXIsIGZhaWwpO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2VzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==