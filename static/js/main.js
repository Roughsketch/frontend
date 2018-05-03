var xBeeArray = [];
var newxBeeArray = [];
var tabletext = '';

function begin() {
    var body = document.getElementById('mainb');
    var text = `<h1 id='tabTitle'>Xbee Nodes</h1>
   <div id='cTable'></div>`;
   setInterval(refresh, 1000);
   body.innerHTML = text;
   getNodes(false);
}

function initialize() {
    /*TODO need a function that will return all connected Xbees with values for columns
    (id, description, value)
    id = Xbee id number
    description = brief summary of node
    value = The scaled value of the reading
    Then populate a table on the page with all of these values
    JSON*/
    var xBeeOBJ;
    var length = xBeeArray.length;
    var table = document.getElementById('cTable');

    if (table !== null) {
        var text = '';
        xBeeArray.sort(function(a, b) {
            return a.uuid - b.uuid;
        });
        text = `<table id='nodeTable'>
            <th>ID</th>
            <th>Reading</th>
            <th>xBee Name</th>
            <th>Unit</th>`;
        for (var i = 0; i < length; i++) {
            xBeeOBJ = xBeeArray[i];
            if (xBeeOBJ.ConnStatus === true) {
                text += '<tr id = \'conn\'><td><button onclick=\'openNode(' + xBeeOBJ.uuid + ')\'>' + xBeeOBJ.uuid + '</button></td>';
                text += '<td>' + convertReading(xBeeOBJ.min_voltage, xBeeOBJ.max_voltage, xBeeOBJ.min_value, xBeeOBJ.max_value, xBeeOBJ.reading).toFixed(2) + '</td>';
                text += '<td>' + xBeeOBJ.name + '</td>';
                text += '<td>' + xBeeOBJ.units + '</td>';
            } else {
                text += '<tr id = \'dconn\'><td><button onclick=\'openNode(' + xBeeOBJ.uuid + ')\'>' + xBeeOBJ.uuid + '</button></td>';
                text += '<td>' + convertReading(xBeeOBJ.min_voltage, xBeeOBJ.max_voltage, xBeeOBJ.min_value, xBeeOBJ.max_value, xBeeOBJ.reading).toFixed(2) + '</td>';
                text += '<td>' + xBeeOBJ.name + '</td>';
                text += '<td>' + xBeeOBJ.units + '</td>';
            }
        }
        text += '</table>';
        table.innerHTML = text;
        tabletext = text;
    }
}

function refresh() {
    /*TODO need a function that will return all connected Xbees again with values for columns(idnum, data)
    After, a check needs to be done with existing table elements to see if they were all updated.
    If they weren't, gray out the table box.  If they were, update the data, if new nodes exist add them.
    */
    var old = xBeeArray;
    getNodes(false);
    var updated = xBeeArray;

    for (var i = 0; i < old.length; i++) {
        var found = false;
        for (var j = 0; j < updated.length; ++j) {
            if (updated[j].uuid == old[i].uuid) {
                found = true;
            }
        }

        if (!found) {
            old[i].ConnStatus = false;
            updated.push(old[i]);
        }
    }

    xBeeArray = updated;

    var now = Date.now() / 1000;
    for (var i = 0; i < xBeeArray.length; i++) {
        if (xBeeArray[i].last_update + 5 < now) {
            xBeeArray[i].ConnStatus = false;
        } else {
            xBeeArray[i].ConnStatus = true;
        }
    }

    initialize();
}

function openNode(id) {
    /*TODO: Create a button that will allow you to control a function on the Xbee*/
    var page = document.getElementById('mainb');
    var text = '<table>';
    var length = xBeeArray.length;
    var xBeeOBJ;
    var found = false;
    for (var i = 0; i < length; i++) {
        xBeeOBJ = xBeeArray[i];
        if (xBeeOBJ.uuid == id) {
            found = true;
            break;
        }
    }
    if (found) {
        text += '<tr><td>Module ID</td><td>' + xBeeOBJ.uuid + '</td>';
        text += '<tr><td>Reading</td><td>' + convertReading(xBeeOBJ.min_voltage, xBeeOBJ.max_voltage, xBeeOBJ.min_value, xBeeOBJ.max_value, xBeeOBJ.reading) + '</td>';
        text += '<tr><td>Minimum Voltage</td><td>' + xBeeOBJ.min_voltage + '</td>';
        text += '<tr><td>Maximum Voltage</td><td>' + xBeeOBJ.max_voltage + '</td>';
        text += '<tr><td>Minimum Value</td><td>' + xBeeOBJ.min_value + '</td>';
        text += '<tr><td>Maximum Value</td><td>' + xBeeOBJ.max_value + '</td>';
        text += '<tr><td>Description</td><td>' + xBeeOBJ.name + '</td>';
        text += '<tr><td>Unit of Measurment</td><td>' + xBeeOBJ.units + '</td>';
        text += '<tr><td>Connection Status</td><td>';

        var now = Date.now() / 1000;
        if (xBeeOBJ.last_update + 5 < now) {
            xBeeOBJ.ConnStatus = false;
        } else {
            xBeeOBJ.ConnStatus = true;
        }

        if (xBeeOBJ.ConnStatus === true) {
            text += 'Connected</td>';
        } else {
            text += 'Disconnected</td>';
        }
        text += '</table>';
    }
    text += '<button onclick=\'goBack()\'>Go Back</button>';
    page.innerHTML = text;
}

function goBack() {
    var page = document.getElementById('mainb');
    page.innerHTML = `<h1 id='tabTitle'>Xbee Nodes</h1>
    <div id='cTable'></div>
    <p id='refbutton'><button onclick='refresh()'>Refresh</button></p>`;
    var table = document.getElementById('cTable');
    table.innerHTML = tabletext;
}

//This function will take the reading from one linear scale to another
//Specifically from the specified voltage range to the specified value range.
function convertReading(min_voltage, max_voltage, min_value, max_value, reading){
    var voltage_range = max_voltage - min_voltage;
    var value_range = max_value - min_value;
    var value_per_volt = value_range / voltage_range;
    var offset_value = min_value - (min_voltage * value_per_volt);
    var converted = (reading * value_per_volt) + offset_value;
    return converted / 100;
}

function getNodes(refreshtest){
    //refreshtest just determines what function to send data to.
    //true for refresh(), false for initialize().
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            var jsonobj = JSON.parse(xhttp.responseText);
            if(refreshtest && jsonobj.success){
                console.log(jsonobj.nodes);
                newxBeeArray = jsonobj.nodes;
                refresh();
            }else if(!refreshtest && jsonobj.success){
                xBeeArray = jsonobj.nodes;
                for(var i = 0; i < xBeeArray.length; i++){
                    xBeeArray[i].ConnStatus = true;
                }
                //initialize();
            }else{
                alert('You are not authorized, please sign in.');
                window.location = 'login.html';
            }
        }
    };
    xhttp.open('GET', '/api/list', true);
    xhttp.send();
}

function login(){
    var loginfo = {"user" : $('#user').val(), "pass" : $('#password').val()};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            var jsonobj = JSON.parse(xhttp.responseText);
            if(jsonobj.success){
              window.location = 'index.html';
            }else{
              $( '#errorcon' ).text( 'Error: max' + jsonobj.error );
            }
        }
    };
    xhttp.open('POST','/api/login', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(loginfo));
}

function logout(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            var jsonobj = JSON.parse(xhttp.responseText);
            if(jsonobj.success){
                window.location = 'login.html';
            }
        }
    };
    xhttp.open('GET','/api/logout', true);
    xhttp.send();
}

function addXbees(testdata){
    //just using the same data so that I can easily verify that I'm getting the right stuff for each row.
    var xhttp = new XMLHttpRequest();

    xbee = {"uuid":testdata, "name":testdata.toString(), "units":testdata.toString()};

    xhttp.onreadystatechange = function(){
        if(xhttp.readState == XMLHttpRequest.DONE && xhttp.status == 200){
            var jsonobj = JSON.parse(xhttp.responseText);
            if(!jsonobj.success){
                alert('addXbees failed');
            }
        }
    };
    xhttp.open('POST', '/api/add', false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(xbee));
}