/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
app.initialize();

function OnOff() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("readystatechange", function() {
        // console.log(this.readyState);
        if (this.readyState === 4) {
            $('#alert').fadeIn();
        }
        if (this.readyState === 404) {
            alert('Error de conexión');
        }
    });
    xmlhttp.open("GET", "http://192.168.4.1/LED=ONOFF");
    xmlhttp.send();
}

function newOnoff() {
    var request;
    if (request) {
        return;
    }
    request = $.ajax({
        url: 'http://192.168.4.1/LED=ONOFF/',
        data: {},
        type: 'GET',
        cache: false,
        crossDomain: true,
        timeout: 3000, //3 second timeout
        beforeSend: function() {
            console.log('sending request');
        },
        success: function(data) {
            console.log(data);
            console.log('success!');
            $('#alert').fadeIn();
        },
        error: function(xhr, textStatus, errorThrown) {
            alert('Error de conexión');
            console.log('error!');
        }
    });
    return request;
}
$(document).ready(function() {
    $('#wifi').click(function() {
        try {
            WifiWizard.isWifiEnabled(win, fail);
        } catch (err) {
            alert("Plugin Error - " + err.message);
        }

    });

    function win(e) {
        if (e) {
            alert("Wifi enabled already");
        } else {
            WifiWizard.setWifiEnabled(true, winEnable, failEnable);
        }

    }

    function fail(e) {
        alert("Error checking Wifi status");
    }

    function winEnable(e) {
        alert("Wifi enabled successfully");
    }

    function failEnable(e) {
        alert("Error enabling Wifi ");
    }

    $('#search').click(function() {
        try {
            WifiWizard.listNetworks(listHandler, fail);
        } catch (err) {
            alert("Plugin Error - " + err.message);
        }

    });

    function listHandler(a) {
        alert(a);
    }

    $('#scan').click(function() {
        try {
            WifiWizard.getScanResults({ numLevels: 1 }, listHandler1, fail);
        } catch (err) {
            alert("Plugin Error - " + err.message);
        }

    });

    function listHandler1(a) {
        alert(JSON.stringify(a));
    }

    $('#connect').click(function() {
        try {
            var config = WifiWizard.formatWPAConfig("Invitados", "invitado123");
            WifiWizard.addNetwork(config, function() {
                WifiWizard.connectNetwork("Invitados");
            });
        } catch (err) {
            alert("Plugin Error - " + err.message);
        }

    });

    function connectSuccess(e) {
        alert("Connect success");
    }
    $('#onoff input').on('click', function() {
        newOnoff();
    });
    var gyroscope = navigator.gyroscope;
    console.log('gyroscope get current: ' + gyroscope.getCurrent);
});