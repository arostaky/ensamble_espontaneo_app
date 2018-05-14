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
var socket = io.connect('http://192.168.0.159:5000' + namespace);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjBhZDM4MzE1MzVjOGEzZjYyY2QiLCJ3ZWJwYWNrOi8vLy4vZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUEsSUFBSSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUMvRCxNQUFNLEdBQUcsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLEVBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUNuQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQ3BDLE9BQU8sR0FBRyxJQUFJLEVBQ2QsRUFBRSxHQUFHLENBQUMsRUFDTixFQUFFLEdBQUcsQ0FBQyxFQUNOLEVBQUUsR0FBRyxDQUFDLEVBQ04sSUFBSSxHQUFHLENBQUMsRUFDUixJQUFJLEdBQUcsQ0FBQyxFQUNSLElBQUksR0FBRyxDQUFDLEVBQ1IsUUFBUSxHQUFHLENBQUMsRUFDWixRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFDeEIsYUFBYSxHQUFHLEtBQUssRUFDckIsWUFBWSxFQUNa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QztBQUVELG9CQUFvQixDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQscUJBQXFCLENBQUM7SUFDbEIsNEJBQTRCO0lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQztZQUNELFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMseUNBQXlDO1FBQzdDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELGNBQWMsQ0FBQztJQUNYLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRDtJQUNJLFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjBhZDM4MzE1MzVjOGEzZjYyY2QiLCJ2YXIgY29udGFpbmVyLCBzdGF0cywgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXIsIGdyb3VwLCBwYXJ0aWNsZSA9IFtdLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMixcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIsXG4gICAgd2F0Y2hJRCA9IG51bGwsXG4gICAgWFggPSAwLFxuICAgIFlZID0gMCxcbiAgICBaWiA9IDAsXG4gICAgYWNjWCA9IDEsXG4gICAgYWNjWSA9IDIsXG4gICAgYWNjWiA9IDMsXG4gICAgY291bnRtc2cgPSAxLFxuICAgIG1hdGVyaWFsLCBwcm9ncmFtLCBteXNpZCxcbiAgICBjb25uZWN0U3RhdHVzID0gZmFsc2UsXG4gICAgYWxsZGF0YWJhbGxzLFxuICAgIGRldmljZWlzUmVhZHkgPSBmYWxzZTtcbmNvbnN0IG90aGVyc2lkID0gbmV3IFNldCgpO1xudmFyIGNvdW50ZXIgPSAwLFxuICAgIGNoYW5nZSA9IGZhbHNlLFxuICAgIGxvY2FsQ291bnRlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjb3VudCcpO1xuXG5mdW5jdGlvbiBzZXRDb3VudGVyKHZhbCkge1xuICAgIGlmIChsb2NhbENvdW50ZXIgPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY291bnQnLCB2YWwpO1xuICAgICAgICBjb3VudGVyID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvdW50ZXIgPSBsb2NhbENvdW50ZXI7XG4gICAgICAgIC8vIGlmIChjb3VudGVyICE9IHBhcnNlSW50KGxvY2FsQ291bnRlcikpIHtcbiAgICAgICAgLy8gICAgIGNvdW50ZXIgPSBwYXJzZUludChsb2NhbENvdW50ZXIpO1xuICAgICAgICAvLyAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxufVxudmFyIGFwcCA9IHtcbiAgICAvLyBBcHBsaWNhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHRoaXMub25EZXZpY2VSZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrYnV0dG9uXCIsIG9uQmFja0tleURvd24sIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lbnVidXR0b25cIiwgb25NZW51S2V5RG93biwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgb25QYXVzZSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBkZXZpY2VyZWFkeSBFdmVudCBIYW5kbGVyXG4gICAgLy9cbiAgICAvLyBCaW5kIGFueSBjb3Jkb3ZhIGV2ZW50cyBoZXJlLiBDb21tb24gZXZlbnRzIGFyZTpcbiAgICAvLyAncGF1c2UnLCAncmVzdW1lJywgZXRjLlxuICAgIG9uRGV2aWNlUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkRXZlbnQoJ2RldmljZXJlYWR5Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkZXZpY2UgaXMgcmVhZHknKTtcbiAgICAgICAgZ2V0Q3VycmVudFNTSUQoKTtcbiAgICAgICAgc3RhcnRXYXRjaCgpO1xuICAgICAgICBkZXZpY2Vpc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy9uYXZpZ2F0b3IuZ3lyb3Njb3BlLndhdGNoKG9uU3VjY2Vzcywgb25FcnJvciwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFVwZGF0ZSBET00gb24gYSBSZWNlaXZlZCBFdmVudFxuICAgIHJlY2VpdmVkRXZlbnQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIC8vIHZhciBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAvL3ZhciBsaXN0ZW5pbmdFbGVtZW50ID0gcGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGlzdGVuaW5nJyk7XG4gICAgICAgIC8vdmFyIHJlY2VpdmVkRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2VpdmVkJyk7XG5cbiAgICAgICAgLy8gbGlzdGVuaW5nRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICAgICAgLy8gcmVjZWl2ZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jazsnKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgRXZlbnQ6ICcgKyBpZCk7XG4gICAgfVxufTtcbmFwcC5pbml0aWFsaXplKCk7XG4vLyBTdGFydCB3YXRjaGluZyB0aGUgYWNjZWxlcmF0aW9uXG4vL1xuZnVuY3Rpb24gb25CYWNrS2V5RG93bigpIHtcbiAgICBjb25zb2xlLmxvZygnYmFjayBrZXkgcHJlc3NlZCEnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgbmF2aWdhdG9yLmFwcC5leGl0QXBwKCk7XG59XG5cbmZ1bmN0aW9uIG9uTWVudUtleURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ21lbnUga2V5IHByZXNzZWQnKTtcbiAgICBzb2NrZXQuZW1pdCgnZGlzY29ubmVjdCByZXF1ZXN0Jyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG59XG5cbmZ1bmN0aW9uIG9uUGF1c2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCBvbiBwYXVzZScpO1xuICAgIHNvY2tldC5lbWl0KCdkaXNjb25uZWN0IHJlcXVlc3QnKTtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRXYXRjaCgpIHtcbiAgICAvLyBVcGRhdGUgYWNjZWxlcmF0aW9uIGV2ZXJ5IDEwMCBtaWxsaXNlY29uZHNcbiAgICB2YXIgb3B0aW9ucyA9IHsgZnJlcXVlbmN5OiAxMDAgfTtcbiAgICB3YXRjaElEID0gbmF2aWdhdG9yLmFjY2VsZXJvbWV0ZXIud2F0Y2hBY2NlbGVyYXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCBvcHRpb25zKTtcbn1cbi8vIFN0b3Agd2F0Y2hpbmcgdGhlIGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIHN0b3BXYXRjaCgpIHtcbiAgICBpZiAod2F0Y2hJRCkge1xuICAgICAgICBuYXZpZ2F0b3IuYWNjZWxlcm9tZXRlci5jbGVhcldhdGNoKHdhdGNoSUQpO1xuICAgICAgICB3YXRjaElEID0gbnVsbDtcbiAgICB9XG59XG4vLyBvblN1Y2Nlc3M6IEdldCBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGFjY2VsZXJhdGlvblxuLy9cbmZ1bmN0aW9uIG9uU3VjY2VzcyhhY2NlbGVyYXRpb24pIHtcblxuICAgIFhYID0gYWNjZWxlcmF0aW9uLng7XG4gICAgWVkgPSBhY2NlbGVyYXRpb24ueTtcbiAgICBaWiA9IGFjY2VsZXJhdGlvbi56O1xuICAgIC8vIHNvY2tldC5lbWl0KCdteSByb29tIGV2ZW50JywgeyByb29tOiAnZW5zYW1ibGUnLCBkYXRhOiBYWCArICcgJyArIFlZICsgJyAnICsgWlogfSk7XG59XG4vLyBvbkVycm9yOiBGYWlsZWQgdG8gZ2V0IHRoZSBhY2NlbGVyYXRpb25cbi8vXG5mdW5jdGlvbiBvbkVycm9yKCkge1xuICAgIGFsZXJ0KCdvbkVycm9yIScpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICQoJy5jb250YWluZXInKS5hcHBlbmQoY29udGFpbmVyKTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAzMDAwKTtcbiAgICAvL2NhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG4gICAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB2YXIgUEkyID0gTWF0aC5QSSAqIDI7XG4gICAgcHJvZ3JhbSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgMC41LCAwLCBQSTIsIHRydWUpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9O1xuICAgIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgc2NlbmUuYWRkKGdyb3VwKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY3JlYXRpbmcgYmFsbHMhJyk7XG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLlNwcml0ZUNhbnZhc01hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBNYXRoLnJhbmRvbSgpICogMHg4MDgwMDggKyAweDgwODA4MCxcbiAgICAgICAgICAgIHNvcnQ6IHRydWUsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIDIwMDAgLSAxMDAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH1cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5DYW52YXNSZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Eb2N1bWVudFRvdWNoTW92ZSwgZmFsc2UpO1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBvbmRldmljZW1vdGlvbiwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgaWYgKGNvdW50bXNnIDwgMikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdiYWxscyBhZGRlZCEnKTtcbiAgICAgICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyO1xuICAgICAgICBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIDAuNSwgMCwgUEkyLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TcHJpdGVDYW52YXNNYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ODA4MDA4ICsgMHg4MDgwODAsXG4gICAgICAgICAgICBwcm9ncmFtOiBwcm9ncmFtXG4gICAgICAgIH0pO1xuICAgICAgICBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5TcHJpdGUobWF0ZXJpYWwpO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gdmFsWCAqIDIwMDAgLSA1MDA7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSB2YWxZICogMjAwMCAtIDUwMDtcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gcGFydGljbGUuc2NhbGUueSA9IE1hdGgucmFuZG9tKCkgKiAyMCArIDEwO1xuICAgICAgICBncm91cC5hZGQocGFydGljbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbW92ZUJhbGxzKHZhbFgsIHZhbFksIHZhbFopIHtcbiAgICBncm91cC5zY2FsZS54ID0gdmFsWDtcbiAgICBncm91cC5zY2FsZS55ID0gdmFsWTtcbn1cblxuZnVuY3Rpb24gb3RoZXJCYWxscyh2YWxYLCB2YWxZLCB2YWxaKSB7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWDonICsgdmFsWCk7XG4gICAgY29uc29sZS5sb2coJ2RhdGEgZm9yIGJhbGxzWTonICsgdmFsWSk7XG4gICAgLy8gY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAvLyBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIC8vIC8vIENyZWF0ZSBhIGNpcmNsZSBhcm91bmQgdGhlIG1vdXNlIGFuZCBtb3ZlIGl0XG4gICAgLy8gLy8gVGhlIHNwaGVyZSBoYXMgb3BhY2l0eSAwXG4gICAgLy8gdmFyIG1vdXNlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMSwgMCwgMCk7XG4gICAgLy8gdmFyIG1vdXNlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIC8vICAgICBjb2xvcjogMHgwMDAwZmZcbiAgICAvLyB9KTtcbiAgICAvLyBtb3VzZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChtb3VzZUdlb21ldHJ5LCBtb3VzZU1hdGVyaWFsKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24ueiA9IC01O1xuICAgIC8vIHNjZW5lLmFkZChtb3VzZU1lc2gpO1xuICAgIC8vIC8vIE1ha2UgdGhlIHNwaGVyZSBmb2xsb3cgdGhlIG1vdXNlXG4gICAgLy8gdmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKHZhbFgsIHZhbFksIDAuNSk7XG4gICAgLy8gdmVjdG9yLnVucHJvamVjdChjYW1lcmEpO1xuICAgIC8vIHZhciBkaXIgPSB2ZWN0b3Iuc3ViKGNhbWVyYS5wb3NpdGlvbikubm9ybWFsaXplKCk7XG4gICAgLy8gdmFyIGRpc3RhbmNlID0gLWNhbWVyYS5wb3NpdGlvbi56IC8gZGlyLno7XG4gICAgLy8gdmFyIHBvcyA9IGNhbWVyYS5wb3NpdGlvbi5jbG9uZSgpLmFkZChkaXIubXVsdGlwbHlTY2FsYXIoZGlzdGFuY2UpKTtcbiAgICAvLyBtb3VzZU1lc2gucG9zaXRpb24uY29weShwb3MpO1xuICAgIC8vIHBhcnRpY2xlLnBvc2l0aW9uLnggPSB2YWxYICogMjAwMCAtIDUwMDtcbiAgICAvLyBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gdmFsWSAqIDIwMDAgLSA1MDA7XG4gICAgLy8gcGFydGljbGUucG9zaXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiAyMDAwIC0gNTAwO1xuICAgIC8vIHBhcnRpY2xlLnNjYWxlLnggPSBwYXJ0aWNsZS5zY2FsZS55ID0gTWF0aC5yYW5kb20oKSAqIDIwMCArIDEwMDtcbiAgICAvLyBncm91cC5hZGQocGFydGljbGUpO1xufVxuXG5mdW5jdGlvbiBvbkRvY3VtZW50VG91Y2hTdGFydChldmVudCkge1xuICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBtb3VzZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93SGFsZlg7XG4gICAgICAgIG1vdXNlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3dIYWxmWTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaE1vdmUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgJiYgY29ubmVjdFN0YXR1cyA9PSB0cnVlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vdXNlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3dIYWxmWDtcbiAgICAgICAgbW91c2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvd0hhbGZZO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VYOicgKyBtb3VzZVgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbW91c2VZOiAnICsgbW91c2VZKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ215IHJvb20gZXZlbnQnLCB7IHJvb206ICdlbnNhbWJsZScsIGRhdGE6IG1vdXNlWCAqIFhYICsgJyAnICsgbW91c2VZICogWVkgKyAnICcgKyBaWiwgY291bnRlcjogY291bnRlciB9KTtcbiAgICAgICAgdXBkYXRlQmFsbHMobW91c2VYLCBtb3VzZVksIFpaKTtcbiAgICB9XG59XG5cbi8vIHdpbmRvdy5vbmRldmljZW1vdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgICAgIGFjY1ggPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4vLyAgICAgICAgIGFjY1kgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG4vLyAgICAgICAgIGFjY1ogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XG4vLyAgICAgfVxuLy9cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHJlbmRlcmVyLmNsZWFyKCk7XG4gICAgLy9jYW1lcmEucG9zaXRpb24uc2V0KDAsIDAsIDUpO1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi54ICs9IChNYXRoLnJvdW5kKFhYKSAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDU7XG4gICAgLy8gY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1NYXRoLnJvdW5kKFlZKSAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgZ3JvdXAucm90YXRpb24ueCArPSBYWCAvIDEwMDA7XG4gICAgZ3JvdXAucm90YXRpb24ueSArPSBZWSAvIDEwMDA7XG4gICAgZ3JvdXAucG9zaXRpb24ueCArPSBYWCAvIDUwMDtcbiAgICBncm91cC5wb3NpdGlvbi55ICs9IFlZIC8gNTAwO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn1cblxuLy9jb25zb2xlLmxvZygnYWNjWDonICsgYWNjWCk7XG5cbi8vJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG52YXIgbmFtZXNwYWNlID0gJy90ZXN0JztcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vMTkyLjE2OC4wLjE1OTo1MDAwJyArIG5hbWVzcGFjZSk7XG5cbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHNvY2tldC5lbWl0KCdteSBldmVudCcsIHsgZGF0YTogJ0lcXCdtIGNvbm5lY3RlZCEnIH0pO1xuICAgIGNvbm5lY3RTdGF0dXMgPSB0cnVlO1xuICAgICQoJyNjb25lY3RhcicpLmhpZGUoKTtcbiAgICBpZiAoZGV2aWNlaXNSZWFkeSA9PSB0cnVlKSB7XG4gICAgICAgIHdpbmRvdy5wbHVnaW5zLnRvYXN0LnNob3dTaG9ydFRvcCgnQ29uZWN0YWRvJywgZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKVxuICAgICAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICAgICAgICAvL2FsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvd1Nob3J0VG9wKCdEZXNjb25lY3RhZG8nLCBmdW5jdGlvbihhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b2FzdCBzdWNjZXNzOiAnICsgYSlcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICAgIC8vYWxlcnQoJ3RvYXN0IGVycm9yOiAnICsgYilcbiAgICB9KTtcbiAgICAkKCcjY29uZWN0YXInKS5zaG93KCk7XG4gICAgLy8kKCcjbG9nJykuYXBwZW5kKCc8YnI+RGlzY29ubmVjdGVkJyk7XG59KTtcbnNvY2tldC5vbignbXkgcmVzcG9uc2UnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyAkKCcjbG9nJykuYXBwZW5kKCc8YnI+UmVjZWl2ZWQ6ICcgKyBtc2cuZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZygnY291bnRtc2c6ICcgKyBjb3VudG1zZyk7XG5cbn0pO1xuc29ja2V0Lm9uKCdteSByZXNwb25zZSBjb3VudCcsIGZ1bmN0aW9uKG1zZykge1xuICAgIC8vJCgnI2xvZycpLmFwcGVuZCgnPGJyPlJlY2VpdmVkOiAnICsgbXNnLmRhdGEgKyBtc2cuY291bnQpO1xuICAgIHNldENvdW50ZXIobXNnLmNvdW50KTtcbn0pO1xuc29ja2V0Lm9uKCdqb2lucm9vbScsIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vY29uc29sZS5sb2coJ3NpZDogJyArIEpTT04uc3RyaW5naWZ5KHZhbC5zaWQpKTtcbiAgICBteXNpZCA9IHZhbC5zaWQ7XG59KTtcbnNvY2tldC5vbignZW5zYW1ibGUnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAvLyQoJyNsb2cnKS5hcHBlbmQoJzxicj5SZWNlaXZlZDogJyArIG1zZy5kYXRhKTtcbiAgICBjb3VudG1zZysrO1xuICAgIHVwZGF0ZUJhbGxzKFhYLCBZWSwgWlopO1xuICAgIC8vY29uc29sZS5sb2coJ2RhdGEgWFlaOiAnICsgSlNPTi5zdHJpbmdpZnkobXNnLmRhdGEpKTtcbiAgICAvL2NvbnNvbGUubG9nKCdzaWQnICsgSlNPTi5zdHJpbmdpZnkobXNnLnNpZCkpO1xuICAgIGlmIChteXNpZCAhPSBtc2cuc2lkKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ21zZyBpZDonICsgbXNnLnNpZCk7XG4gICAgICAgIHZhciBtc2dzaWQgPSBtc2cuc2lkO1xuICAgICAgICB2YXIgbXNnZGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICB2YXIgb3RoZXJkYXRhID0geyAnbXNnc2lkJzogbXNnc2lkLCAnbXNnZGF0YSc6IG1zZ2RhdGEgfVxuICAgICAgICBvdGhlcnNpZC5hZGQob3RoZXJkYXRhKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3RoZXJkYXRhOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJkYXRhKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ290aGVyc2lkOiAnICsgSlNPTi5zdHJpbmdpZnkob3RoZXJzaWQpKTtcbiAgICAgICAgLy9mb3IgKGxldCBpdGVtIG9mIG90aGVyc2lkKSBjb25zb2xlLmxvZygnb3RoZXJzaWQ6JyArIGl0ZW0ubXNnc2lkICsgaXRlbS5tc2dkYXRhKTtcbiAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG90aGVyc2lkW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvdGhlcnNpZDonICsgaXRlbS5tc2dzaWQgKyBpdGVtLm1zZ2RhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFsbGRhdGFiYWxscyA9IGl0ZW0ubXNnZGF0YTtcbiAgICAgICAgYWxsZGF0YWJhbGxzID0gYWxsZGF0YWJhbGxzLnNwbGl0KCcgJyk7XG4gICAgICAgIG90aGVyQmFsbHMoYWxsZGF0YWJhbGxzWzBdLCBhbGxkYXRhYmFsbHNbMV0pO1xuICAgICAgICAvL3B1dCBhIGJhbGwgd2l0aCBuYW1lIGFuZCBtb3ZlIGl0OlxuXG4gICAgfVxuXG59KTtcbi8vICQoJyNjb25lY3RhcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4vLyAgICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG4vLyB9KTtcbi8vICQoJyNob2xhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbi8vICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbi8vICAgICBzdGFydFdhdGNoKCk7XG4vLyB9KTtcbmluaXQoKTtcbmFuaW1hdGUoKTtcbi8vc3RhcnRXYXRjaCgpO1xuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICByZW5kZXIoKTtcbiAgICBzdGF0cy51cGRhdGUoKTtcbn1cblxuLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4vLyAkKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgICBXaWZpV2l6YXJkLmlzV2lmaUVuYWJsZWQod2luLCBmYWlsKTtcbi8vICAgICB9IGNhdGNoIChlcnIpIHtcbi8vICAgICAgICAgYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbi8vICAgICB9XG5cbi8vIH0pO1xuXG4kKCcjY29uZWN0YXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygndGFwIG9uIGNvbmVjdGFyISEnKTtcbiAgICBnZXRDdXJyZW50U1NJRCgpO1xuICAgIHNvY2tldC5jb25uZWN0KCk7XG4gICAgc29ja2V0LmVtaXQoJ2pvaW4nLCB7IHJvb206ICdlbnNhbWJsZScgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiB3aW4oZSkge1xuICAgIGlmIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2lmaSBlbmFibGVkIGFscmVhZHlcIik7XG4gICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIk1yX1JvYm90XCIsIFwic2F5aDNsbDB0b215bGl0dGxlZnJpZW5kXCIpO1xuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuY29ubmVjdE5ldHdvcmsoXCJNcl9Sb2JvdFwiKTtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBXaWZpV2l6YXJkLnNldFdpZmlFbmFibGVkKHRydWUsIHdpbkVuYWJsZSwgZmFpbEVuYWJsZSk7XG4gICAgICAgIHZhciBjb25maWcgPSBXaWZpV2l6YXJkLmZvcm1hdFdQQUNvbmZpZyhcIk1yX1JvYm90XCIsIFwic2F5aDNsbDB0b215bGl0dGxlZnJpZW5kXCIpO1xuICAgICAgICBXaWZpV2l6YXJkLmFkZE5ldHdvcmsoY29uZmlnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFdpZmlXaXphcmQuY29ubmVjdE5ldHdvcmsoXCJNcl9Sb2JvdFwiKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciBjaGVja2luZyBXaWZpIHN0YXR1c1wiKTtcbn1cblxuZnVuY3Rpb24gd2luRW5hYmxlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIldpZmkgZW5hYmxlZCBzdWNjZXNzZnVsbHlcIik7XG59XG5cbmZ1bmN0aW9uIGZhaWxFbmFibGUoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZW5hYmxpbmcgV2lmaSBcIik7XG59XG5cbmZ1bmN0aW9uIHNzaWRIYW5kbGVyKHMpIHtcbiAgICAvL2FsZXJ0KFwiQ3VycmVudCBTU0lEXCIgKyBzKTtcbiAgICBjb25zb2xlLmxvZygnc3NpZDogJyArIHMpO1xuICAgIGlmIChzID0gJ1wiTXJfUm9ib3RcIicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ01yX1JvYm90IGZvdW5kIScpO1xuICAgICAgICBzb2NrZXQuZW1pdCgnam9pbicsIHsgcm9vbTogJ2Vuc2FtYmxlJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgV2lmaVdpemFyZC5pc1dpZmlFbmFibGVkKHdpbiwgZmFpbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BsdWdpbiBFcnJvciAtJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIC8vYWxlcnQoXCJQbHVnaW4gRXJyb3IgLSBcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgLy9hbGVydChcIkZhaWxlZFwiICsgZSk7XG4gICAgY29uc29sZS5sb2coJ3dpZmkgZGlzYWJsZWQnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFNTSUQoKSB7XG4gICAgV2lmaVdpemFyZC5nZXRDdXJyZW50U1NJRChzc2lkSGFuZGxlciwgZmFpbCk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9