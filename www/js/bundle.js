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

var mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, watchID = null, XX = 0, YY = 0, ZZ = 0, accX = 1, accY = 2, accZ = 3, countmsg = 1, material, program, mysid, connectStatus = false, alldataballs, deviceisReady = false;
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
//new canvas: 


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTA2YWU1ZjA0YjQ4NWUwN2YxNDIiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNaLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFJLE9BQU8sR0FB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QWlCLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQztZQUNELFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ25FLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUMxQixVQUFVLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTFDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1Qyx5Q0FBeUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBRUQsY0FBYyxDQUFDO0lBQ1gsc0JBQXNCO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVEO0lBQ0ksVUFBVSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUNELGFBQWEiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTA2YWU1ZjA0YjQ4NWUwN2YxNDIiLCJ2YXIgbW91c2VYID0gMCxcbiAgICBtb3VzZVkgPSAwLFxuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyLFxuICAgIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMixcbiAgICB3YXRjaElEID0gbnVsbCxcbiAgICBYWCA9IDAsXG4gICAgWVkgPSAwLFxuICAgIFpaID0gMCxcbiAgICBhY2NYID0gMSxcbiAgICBhY2NZID0gMixcbiAgICBhY2NaID0gMyxcbiAgICBjb3VudG1zZyA9IDEsXG4gICAgbWF0ZXJpYWwsIHByb2dyYW0sIG15c2lkLFxuICAgIGNvbm5lY3RTdGF0dXMgPSBmYWxzZSxcbiAgICBhbGxkYXRhYmFsbHMsXG4gICAgZGV2aWNlaXNSZWFkeSA9IGZhbHNlO1xuY29uc3Qgb3RoZXJzaWQgPSBuZXcgU2V0KCk7XG52YXIgY291bnRlciA9IDAsXG4gICAgY2hhbmdlID0gZmFsc2UsXG4gICAgbG9jYWxDb3VudGVyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvdW50Jyk7XG5cbmZ1bmN0aW9uIHNldENvdW50ZXIodmFsKSB7XG4gICAgaWYgKGxvY2FsQ291bnRlciA9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjb3VudCcsIHZhbCk7XG4gICAgICAgIGNvdW50ZXIgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY291bnRlciA9IGxvY2FsQ291bnRlcjtcbiAgICAgICAgLy8gaWYgKGNvdW50ZXIgIT0gcGFyc2VJbnQobG9jYWxDb3VudGVyKSkge1xuICAgICAgICAvLyAgICAgY291bnRlciA9IHBhcnNlSW50KGxvY2FsQ291bnRlcik7XG4gICAgICAgIC8vICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG59XG52YXIgYXBwID0ge1xuICAgIC8vIEFwcGxpY2F0aW9uIENvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZEV2ZW50KCdkZXZpY2VyZWFkeScpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGV2aWNlIGlzIHJlYWR5Jyk7XG4gICAgICAgIGdldEN1cnJlbnRTU0lEKCk7XG4gICAgICAgIHN0YXJ0V2F0Y2goKTtcbiAgICAgICAgZGV2aWNlaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIC8vbmF2aWdhdG9yLmd5cm9zY29wZS53YXRjaChvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBVcGRhdGUgRE9NIG9uIGEgUmVjZWl2ZWQgRXZlbnRcbiAgICByZWNlaXZlZEV2ZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIC8vdmFyIGxpc3RlbmluZ0VsZW1lbnQgPSBwYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0ZW5pbmcnKTtcbiAgICAgICAgLy92YXIgcmVjZWl2ZWRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmVjZWl2ZWQnKTtcblxuICAgICAgICAvLyBsaXN0ZW5pbmdFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lOycpO1xuICAgICAgICAvLyByZWNlaXZlZEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OmJsb2NrOycpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBFdmVudDogJyArIGlkKTtcbiAgICB9XG59O1xuYXBwLmluaXRpYWxpemUoKTtcbi8vIFN0YXJ0IHdhdGNoaW5nIHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkJhY2tLZXlEb3duKCkge1xuICAgIGNvbnNvbGUubG9nKCdiYWNrIGtleSBwcmVzc2VkIScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICBuYXZpZ2F0b3IuYXBwLmV4aXRBcHAoKTtcbn1cblxuZnVuY3Rpb24gb25NZW51S2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnbWVudSBrZXkgcHJlc3NlZCcpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gb25QYXVzZSgpIHtcbiAgICBjb25zb2xlLmxvZygnYXBwIG9uIHBhdXNlJyk7XG4gICAgc29ja2V0LmVtaXQoJ2Rpc2Nvbm5lY3QgcmVxdWVzdCcpO1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBzdGFydFdhdGNoKCkge1xuICAgIC8vIFVwZGF0ZSBhY2NlbGVyYXRpb24gZXZlcnkgMTAwIG1pbGxpc2Vjb25kc1xuICAgIHZhciBvcHRpb25zID0geyBmcmVxdWVuY3k6IDEwMCB9O1xuICAgIHdhdGNoSUQgPSBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci53YXRjaEFjY2VsZXJhdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIG9wdGlvbnMpO1xufVxuLy8gU3RvcCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gc3RvcFdhdGNoKCkge1xuICAgIGlmICh3YXRjaElEKSB7XG4gICAgICAgIG5hdmlnYXRvci5hY2NlbGVyb21ldGVyLmNsZWFyV2F0Y2god2F0Y2hJRCk7XG4gICAgICAgIHdhdGNoSUQgPSBudWxsO1xuICAgIH1cbn1cbi8vIG9uU3VjY2VzczogR2V0IGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25TdWNjZXNzKGFjY2VsZXJhdGlvbikge1xuXG4gICAgWFggPSBhY2NlbGVyYXRpb24ueDtcbiAgICBZWSA9IGFjY2VsZXJhdGlvbi55O1xuICAgIFpaID0gYWNjZWxlcmF0aW9uLno7XG4gICAgLy8gc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IFhYICsgJyAnICsgWVkgKyAnICcgKyBaWiB9KTtcbn1cbi8vIG9uRXJyb3I6IEZhaWxlZCB0byBnZXQgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uRXJyb3IoKSB7XG4gICAgYWxlcnQoJ29uRXJyb3IhJyk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy9zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIC8vY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Eb2N1bWVudFRvdWNoTW92ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Eb2N1bWVudFRvdWNoRW5kLCBmYWxzZSk7XG4gICAgLy93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW9yaWVudGF0aW9uXCIsIG9uZGV2aWNlbW90aW9uLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgICAgIHN0YXJ0V2F0Y2goKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgJiYgY29ubmVjdFN0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbW91c2VYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvd0hhbGZYO1xuICAgICAgICBtb3VzZVkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93SGFsZlk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3VzZVg6JyArIG1vdXNlWCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3VzZVk6ICcgKyBtb3VzZVkpO1xuICAgICAgICAvL3NvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBtb3VzZVggKiBYWCArICcgJyArIG1vdXNlWSAqIFlZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBtb3VzZVggKyAnICcgKyBtb3VzZVkgKyAnICcgKyBYWCArICcgJyArIFlZICsgJyAnICsgWlosIGNvdW50ZXI6IGNvdW50ZXIgfSk7XG4gICAgICAgIC8vdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFhYLCBZWSwgWlopO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaEVuZChldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMCAmJiBjb25uZWN0U3RhdHVzID09IHRydWUpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IDAgKyAnICcgKyAwICsgJyAnICsgMCArICcgJyArIDAgKyAnICcgKyAwLCBjb3VudGVyOiBjb3VudGVyIH0pO1xuICAgICAgICBzdG9wV2F0Y2goKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2lndWU/JyArIFhYKTtcbiAgICB9XG59XG5cbi8vIHdpbmRvdy5vbmRldmljZW1vdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgIGFjY1ggPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4vLyAgICAgICAgIGFjY1kgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4vLyAgICAgICAgIGFjY1ogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4vLyAgICAgfVxuLy9cblxuLy9jb25zb2xlLmxvZygnYWNjWDonICsgYWNjWCk7XG5cbi8vJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG52YXIgbmFtZXNwYWNlID0gJy90ZXN0JztcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vMTkyLjE2OC4wLjE6NTAwMCcgKyBuYW1lc3BhY2UpO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgc29ja2V0LmVtaXQoJ215IGV2ZW50JywgeyBkYXRhOiAnSVxcJ20gY29ubmVjdGVkIScgfSk7XG4gICAgY29ubmVjdFN0YXR1cyA9IHRydWU7XG4gICAgJCgnI2NvbmVjdGFyJykuaGlkZSgpO1xuICAgIGlmIChkZXZpY2Vpc1JlYWR5ID09IHRydWUpIHtcbiAgICAgICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvd1Nob3J0VG9wKCdDb25lY3RhZG8nLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgICAgIH0sIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnRGVzY29uZWN0YWRvJywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndG9hc3Qgc3VjY2VzczogJyArIGEpXG4gICAgfSwgZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgLy9hbGVydCgndG9hc3QgZXJyb3I6ICcgKyBiKVxuICAgIH0pO1xuICAgICQoJyNjb25lY3RhcicpLnNob3coKTtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5EaXNjb25uZWN0ZWQnKTtcbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAvLyAkKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZygnY291bnRtc2c6ICcgKyBjb3VudG1zZyk7XG5cbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZSBjb3VudCcsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhICsgbXNnLmNvdW50KTtcbiAgICBzZXRDb3VudGVyKG1zZy5jb3VudCk7XG59KTtcbnNvY2tldC5vbignam9pbnJvb20nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgLy9jb25zb2xlLmxvZygnc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsLnNpZCkpO1xuICAgIG15c2lkID0gdmFsLnNpZDtcbn0pO1xuc29ja2V0Lm9uKCdlbnNhbWJsZScsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICBjb3VudG1zZysrO1xuICAgIC8vdXBkYXRlQmFsbHMoWFgsIFlZLCBaWik7XG4gICAgLy9jb25zb2xlLmxvZygnZGF0YSBYWVo6ICcgKyBKU09OLnN0cmluZ2lmeShtc2cuZGF0YSkpO1xuICAgIC8vY29uc29sZS5sb2coJ3NpZCcgKyBKU09OLnN0cmluZ2lmeShtc2cuc2lkKSk7XG4gICAgaWYgKG15c2lkICE9IG1zZy5zaWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbXNnIGlkOicgKyBtc2cuc2lkKTtcbiAgICAgICAgdmFyIG1zZ3NpZCA9IG1zZy5zaWQ7XG4gICAgICAgIHZhciBtc2dkYXRhID0gbXNnLmRhdGE7XG4gICAgICAgIHZhciBvdGhlcmRhdGEgPSB7ICdtc2dzaWQnOiBtc2dzaWQsICdtc2dkYXRhJzogbXNnZGF0YSB9XG4gICAgICAgIG90aGVyc2lkLmFkZChvdGhlcmRhdGEpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcmRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcmRhdGEpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJzaWQ6ICcgKyBKU09OLnN0cmluZ2lmeShvdGhlcnNpZCkpO1xuICAgICAgICAvL2ZvciAobGV0IGl0ZW0gb2Ygb3RoZXJzaWQpIGNvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG4gICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb3RoZXJzaWRbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOicgKyBpdGVtLm1zZ3NpZCArIGl0ZW0ubXNnZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYWxsZGF0YWJhbGxzID0gaXRlbS5tc2dkYXRhO1xuICAgICAgICBhbGxkYXRhYmFsbHMgPSBhbGxkYXRhYmFsbHMuc3BsaXQoJyAnKTtcbiAgICAgICAgLy9vdGhlckJhbGxzKGFsbGRhdGFiYWxsc1swXSwgYWxsZGF0YWJhbGxzWzFdKTtcbiAgICAgICAgLy9wdXQgYSBiYWxsIHdpdGggbmFtZSBhbmQgbW92ZSBpdDpcblxuICAgIH1cblxufSk7XG5cbmluaXQoKTtcbi8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuLy8gJCgnI2NvbmVjdGFyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgICAgV2lmaVdpemFyZC5pc1dpZmlFbmFibGVkKHdpbiwgZmFpbCk7XG4vLyAgICAgfSBjYXRjaCAoZXJyKSB7XG4vLyAgICAgICAgIGFsZXJ0KFwiUGx1Z2luIEVycm9yIC0gXCIgKyBlcnIubWVzc2FnZSk7XG4vLyAgICAgfVxuXG4vLyB9KTtcblxuJCgnI2NvbmVjdGFyJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIC8vY29uc29sZS5sb2coJ3RhcCBvbiBjb25lY3RhciEhJyk7XG4gICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICBzb2NrZXQuY29ubmVjdCgpO1xuICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gd2luKGUpIHtcbiAgICB2YXIgY29uZmlnID0gV2lmaVdpemFyZC5mb3JtYXRXUEFDb25maWcoXCJFbnNhbWJsZVwiLCBcIkVuc2FtYmxlMTIzXCIpO1xuICAgIGlmIChlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgYWxyZWFkeVwiKTtcblxuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgV2lmaVdpemFyZC5zZXRXaWZpRW5hYmxlZCh0cnVlLCB3aW5FbmFibGUsIGZhaWxFbmFibGUpO1xuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmNvbm5lY3ROZXR3b3JrKFwiRW5zYW1ibGVcIik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgY2hlY2tpbmcgV2lmaSBzdGF0dXNcIik7XG59XG5cbmZ1bmN0aW9uIHdpbkVuYWJsZShlKSB7XG4gICAgY29uc29sZS5sb2coXCJXaWZpIGVuYWJsZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufVxuXG5mdW5jdGlvbiBmYWlsRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIGVuYWJsaW5nIFdpZmkgXCIpO1xufVxuXG5mdW5jdGlvbiBzc2lkSGFuZGxlcihzKSB7XG4gICAgLy9hbGVydChcIkN1cnJlbnQgU1NJRFwiICsgcyk7XG4gICAgY29uc29sZS5sb2coJ3NzaWQ6ICcgKyBzKTtcbiAgICBpZiAocyA9PSAnXCJFbnNhbWJsZVwiJykge1xuICAgICAgICBjb25zb2xlLmxvZygnRW5zYW1ibGUgZm91bmQhJyk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdqb2luJywgeyByb29tOiAnZW5zYW1ibGUnIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIkVuc2FtYmxlXCIsIFwiRW5zYW1ibGUxMjNcIik7XG4gICAgICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgV2lmaVdpemFyZC5jb25uZWN0TmV0d29yayhcIkVuc2FtYmxlXCIpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIEVycm9yIC0nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgLy9hbGVydChcIlBsdWdpbiBFcnJvciAtIFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmYWlsKGUpIHtcbiAgICAvL2FsZXJ0KFwiRmFpbGVkXCIgKyBlKTtcbiAgICBjb25zb2xlLmxvZygnd2lmaSBkaXNhYmxlZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U1NJRCgpIHtcbiAgICBXaWZpV2l6YXJkLmdldEN1cnJlbnRTU0lEKHNzaWRIYW5kbGVyLCBmYWlsKTtcbn1cbi8vbmV3IGNhbnZhczpcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9lcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=