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
    //stats = new Stats();
    //container.appendChild(stats.dom);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);
    //window.addEventListener("deviceorientation", ondevicemotion, false);
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
        //console.log('sigue?' + XX);
    }
}
// window.ondevicemotion = function(event) {
//         accX = event.accelerationIncludingGravity.x;
//         accY = event.accelerationIncludingGravity.y;
//         accZ = event.accelerationIncludingGravity.z;
//     }
//
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
init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjM5MzYzMDdhZWE0OWFmYzJhMGIiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixJQUFJLENBQUM7WUFDRCxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNuRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDMUIsVUFBVSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUxQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMseUNBQXlDO1FBQzdDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQWMsQ0FBQztJQUNYLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDtJQUNJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjM5MzYzMDdhZWE0OWFmYzJhMGIiLCJ2YXIgY29udGFpbmVyLCBzdGF0cywgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXIsIGdyb3VwLCBwYXJ0aWNsZSA9IFtdLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMixcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIsXG4gICAgd2F0Y2hJRCA9IG51bGwsXG4gICAgWFggPSAwLFxuICAgIFlZID0gMCxcbiAgICBaWiA9IDAsXG4gICAgYWNjWCA9IDEsXG4gICAgYWNjWSA9IDIsXG4gICAgYWNjWiA9IDMsXG4gICAgY291bnRtc2cgPSAxLFxuICAgIG1hdGVyaWFsLCBwcm9ncmFtLCBteXNpZCxcbiAgICBjb25uZWN0U3RhdHVzID0gZmFsc2UsXG4gICAgYWxsZGF0YWJhbGxzLFxuICAgIGRldmljZWlzUmVhZHkgPSBmYWxzZTtcbmNvbnN0IG90aGVyc2lkID0gbmV3IFNldCgpO1xudmFyIGNvdW50ZXIgPSAwLFxuICAgIGNoYW5nZSA9IGZhbHNlLFxuICAgIGxvY2FsQ291bnRlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb3VudCcpO1xuXG5mdW5jdGlvbiBzZXRDb3VudGVyKHZhbCkge1xuICAgIGlmIChsb2NhbENvdW50ZXIgPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY291bnQnLCB2YWwpO1xuICAgICAgICBjb3VudGVyID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvdW50ZXIgPSBsb2NhbENvdW50ZXI7XG4gICAgICAgIC8vIGlmIChjb3VudGVyICE9IHBhcnNlSW50KGxvY2FsQ291bnRlcikpIHtcbiAgICAgICAgLy8gICAgIGNvdW50ZXIgPSBwYXJzZUludChsb2NhbENvdW50ZXIpO1xuICAgICAgICAvLyAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxufVxudmFyIGFwcCA9IHtcbiAgICAvLyBBcHBsaWNhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkRXZlbnQoJ2RldmljZXJlYWR5Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2UgaXMgcmVhZHknKTtcbiAgICAgICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgICAgICBkZXZpY2Vpc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy9uYXZpZ2F0b3IuZ3lyb3Njb3BlLndhdGNoKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBET00gb24gYSBSZWNlaXZlZCBFdmVudFxuICAgIHJlY2VpdmVkRXZlbnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIC8vIHZhciBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvL3ZhciBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJyk7XG4gICAgICAgIC8vdmFyIHJlY2VpdmVkRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2VpdmVkJyk7XG5cbiAgICAgICAgLy8gbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICAgICAgLy8gcmVjZWl2ZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jazsnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgRXZlbnQ6ICcgKyBpZCk7XG4gICAgfVxufTtcbmFwcC5pbml0aWFsaXplKCk7XG4vLyBTdGFydCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25CYWNrS2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnYmFjayBrZXkgcHJlc3NlZCEnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgbmF2aWdhdG9yLmFwcC5leGl0QXBwKCk7XG59XG5cbmZ1bmN0aW9uIG9uTWVudUtleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ21lbnUga2V5IHByZXNzZWQnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIG9uUGF1c2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCBvbiBwYXVzZScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgICAvLyBVcGRhdGUgYWNjZWxlcmF0aW9uIGV2ZXJ5IDEwMCBtaWxsaXNlY29uZHNcbiAgICB2YXIgb3B0aW9ucyA9IHsgZnJlcXVlbmN5OiAxMDAgfTtcbiAgICB3YXRjaElEID0gbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIud2F0Y2hBY2NlbGVyYXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbn1cbi8vIFN0b3Agd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIHN0b3BXYXRjaCgpIHtcbiAgICBpZiAod2F0Y2hJRCkge1xuICAgICAgICBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci5jbGVhcldhdGNoKHdhdGNoSUQpO1xuICAgICAgICB3YXRjaElEID0gbnVsbDtcbiAgICB9XG59XG4vLyBvblN1Y2Nlc3M6IEdldCBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uU3VjY2VzcyhhY2NlbGVyYXRpb24pIHtcblxuICAgIFhYID0gYWNjZWxlcmF0aW9uLng7XG4gICAgWVkgPSBhY2NlbGVyYXRpb24ueTtcbiAgICBaWiA9IGFjY2VsZXJhdGlvbi56O1xuICAgIC8vIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBYWCArICcgJyArIFlZICsgJyAnICsgWlogfSk7XG59XG4vLyBvbkVycm9yOiBGYWlsZWQgdG8gZ2V0IHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkVycm9yKCkge1xuICAgIGFsZXJ0KCdvbkVycm9yIScpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIC8vc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2hTdGFydCwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uRG9jdW1lbnRUb3VjaE1vdmUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uRG9jdW1lbnRUb3VjaEVuZCwgZmFsc2UpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBvbmRldmljZW1vdGlvbiwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hTdGFydChldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgICAgICBzdGFydFdhdGNoKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICYmIGNvbm5lY3RTdGF0dXMgPT0gdHJ1ZSkge1xuICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VYOicgKyBtb3VzZVgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VZOiAnICsgbW91c2VZKTtcbiAgICAgICAgLy9zb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogbW91c2VYICogWFggKyAnICcgKyBtb3VzZVkgKiBZWSArICcgJyArIFpaLCBjb3VudGVyOiBjb3VudGVyIH0pO1xuICAgICAgICBzb2NrZXQuZW1pdCgnbXkgcm9vbSBldmVudCcsIHsgcm9vbTogJ2Vuc2FtYmxlJywgZGF0YTogbW91c2VYICsgJyAnICsgbW91c2VZICsgJyAnICsgWFggKyAnICcgKyBZWSArICcgJyArIFpaLCBjb3VudGVyOiBjb3VudGVyIH0pO1xuICAgICAgICAvL3VwZGF0ZUJhbGxzKG1vdXNlWCwgbW91c2VZLCBYWCwgWVksIFpaKTtcbiAgICB9XG59XG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hFbmQoZXZlbnQpe1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMCAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpe1xuICAgIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiAwICsgJyAnICsgMCArICcgJyArIDAgKyAnICcgKyAwICsgJyAnICsgMCwgY291bnRlcjogY291bnRlciB9KTtcbiAgICBzdG9wV2F0Y2goKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWd1ZT8nICsgWFgpO1xuICAgIH1cbn1cblxuLy8gd2luZG93Lm9uZGV2aWNlbW90aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICAgICAgYWNjWCA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbi8vICAgICAgICAgYWNjWSA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbi8vICAgICAgICAgYWNjWiA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcbi8vICAgICB9XG4vL1xuXG4vL2NvbnNvbGUubG9nKCdhY2NYOicgKyBhY2NYKTtcblxuLy8kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbnZhciBuYW1lc3BhY2UgPSAnL3Rlc3QnO1xudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly8xOTIuMTY4LjAuMTo1MDAwJyArIG5hbWVzcGFjZSk7XG5cbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHNvY2tldC5lbWl0KCdteSBldmVudCcsIHsgZGF0YTogJ0lcXCdtIGNvbm5lY3RlZCEnIH0pO1xuICAgIGNvbm5lY3RTdGF0dXMgPSB0cnVlO1xuICAgICQoJyNjb25lY3RhcicpLmhpZGUoKTtcbiAgICBpZiAoZGV2aWNlaXNSZWFkeSA9PSB0cnVlKSB7XG4gICAgICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnQ29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgICAgIC8vYWxlcnQoJ3RvYXN0IGVycm9yOiAnICsgYilcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cucGx1Z2lucy50b2FzdC5zaG93U2hvcnRUb3AoJ0Rlc2NvbmVjdGFkbycsIGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgfSk7XG4gICAgJCgnI2NvbmVjdGFyJykuc2hvdygpO1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPkRpc2Nvbm5lY3RlZCcpO1xufSk7XG5zb2NrZXQub24oJ215IHJlc3BvbnNlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8gJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEpO1xuICAgIC8vY29uc29sZS5sb2coJ2NvdW50bXNnOiAnICsgY291bnRtc2cpO1xuXG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UgY291bnQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhICsgbXNnLmNvdW50KTtcbiAgICBzZXRDb3VudGVyKG1zZy5jb3VudCk7XG59KTtcbnNvY2tldC5vbignam9pbnJvb20nLCBmdW5jdGlvbih2YWwpIHtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeSh2YWwuc2lkKSk7XG4gICAgbXlzaWQgPSB2YWwuc2lkO1xufSk7XG5zb2NrZXQub24oJ2Vuc2FtYmxlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgY291bnRtc2crKztcbiAgICAvL3VwZGF0ZUJhbGxzKFhYLCBZWSwgWlopO1xuICAgIC8vY29uc29sZS5sb2coJ2RhdGEgWFlaOiAnICsgSlNPTi5zdHJpbmdpZnkobXNnLmRhdGEpKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQnICsgSlNPTi5zdHJpbmdpZnkobXNnLnNpZCkpO1xuICAgIGlmIChteXNpZCAhPSBtc2cuc2lkKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ21zZyBpZDonICsgbXNnLnNpZCk7XG4gICAgICAgIHZhciBtc2dzaWQgPSBtc2cuc2lkO1xuICAgICAgICB2YXIgbXNnZGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICB2YXIgb3RoZXJkYXRhID0geyAnbXNnc2lkJzogbXNnc2lkLCAnbXNnZGF0YSc6IG1zZ2RhdGEgfVxuICAgICAgICBvdGhlcnNpZC5hZGQob3RoZXJkYXRhKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJkYXRhOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJkYXRhKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJzaWQpKTtcbiAgICAgICAgLy9mb3IgKGxldCBpdGVtIG9mIG90aGVyc2lkKSBjb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG90aGVyc2lkW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFsbGRhdGFiYWxscyA9IGl0ZW0ubXNnZGF0YTtcbiAgICAgICAgYWxsZGF0YWJhbGxzID0gYWxsZGF0YWJhbGxzLnNwbGl0KCcgJyk7XG4gICAgICAgIC8vb3RoZXJCYWxscyhhbGxkYXRhYmFsbHNbMF0sIGFsbGRhdGFiYWxsc1sxXSk7XG4gICAgICAgIC8vcHV0IGEgYmFsbCB3aXRoIG5hbWUgYW5kIG1vdmUgaXQ6XG5cbiAgICB9XG5cbn0pO1xuXG5pbml0KCk7XG4vLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbi8vICQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAgIFdpZmlXaXphcmQuaXNXaWZpRW5hYmxlZCh3aW4sIGZhaWwpO1xuLy8gICAgIH0gY2F0Y2ggKGVycikge1xuLy8gICAgICAgICBhbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuLy8gICAgIH1cblxuLy8gfSk7XG5cbiQoJyNjb25lY3RhcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIC8vY29uc29sZS5sb2coJ3RhcCBvbiBjb25lY3RhciEhJyk7XG4gICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICBzb2NrZXQuY29ubmVjdCgpO1xuICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gd2luKGUpIHtcbiAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJFbnNhbWJsZVwiLCBcIkVuc2FtYmxlMTIzXCIpO1xuICAgIGlmIChlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgYWxyZWFkeVwiKTtcbiAgICAgICAgXG4gICAgICAgIFdpZmlXaXphcmQuYWRkTmV0d29yayhjb25maWcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFdpZmlXaXphcmQuc2V0V2lmaUVuYWJsZWQodHJ1ZSwgd2luRW5hYmxlLCBmYWlsRW5hYmxlKTtcbiAgICAgICAgV2lmaVdpemFyZC5hZGROZXR3b3JrKGNvbmZpZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9PSAnXCJFbnNhbWJsZVwiJykge1xuICAgICAgICBjb25zb2xlLmxvZygnRW5zYW1ibGUgZm91bmQhJyk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG4gICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIEVycm9yIC0nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgLy9hbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICAvL2FsZXJ0KFwiRmFpbGVkXCIgKyBlKTtcbiAgICBjb25zb2xlLmxvZygnd2lmaSBkaXNhYmxlZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U1NJRCgpIHtcbiAgICBXaWZpV2l6YXJkLmdldEN1cnJlbnRTU0lEKHNzaWRIYW5kbGVyLCBmYWlsKTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=