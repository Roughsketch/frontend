var xBeeArray = [];
var newxBeeArray = [];
var tabletext = '';

function begin() {
    var body = document.getElementById('mainb');
    var text = `<h1 id='tabTitle'>Xbee Nodes</h1>
   <div id='cTable'></div>
   <p id='refbutton'><button onclick='getNodes(true)'>Refresh</button></p>`;
   body.innerHTML = text;

   for(var i = 0; i < 10; i++){
       addXbees(i);
   }
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
    var text = '';
    xBeeArray.sort(function(a, b) {
        return a.ID - b.ID;
    });
    text = `<table id='nodeTable'>
        <th>ID</th>
        <th>Reading</th>
        <th>xBee Name</th>
        <th>Unit</th>`;
    for (var i = 0; i < length; i++) {
        xBeeOBJ = xBeeArray[i];
        if (xBeeOBJ.ConnStatus === true) {
            text += '<tr id = \'conn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>' + xBeeOBJ.ID + '</button></td>';
            text += '<td>' + xBeeOBJ.Reading + '</td>';
            text += '<td>' + xBeeOBJ.Name + '</td>';
            text += '<td>' + xBeeOBJ.Unit + '</td>';
        } else {
            text += '<tr id = \'dconn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>' + xBeeOBJ.ID + '</button></td>';
            text += '<td>' + xBeeOBJ.Reading + '</td>';
            text += '<td>' + xBeeOBJ.Name + '</td>';
            text += '<td>' + xBeeOBJ.Unit + '</td>';
        }
    }
    text += '</table>';
    table.innerHTML = text;
    tabletext = text;
}

function refresh() {
    /*TODO need a function that will return all connected Xbees again with values for columns(idnum, data)
    After, a check needs to be done with existing table elements to see if they were all updated.
    If they weren't, gray out the table box.  If they were, update the data, if new nodes exist add them.
    */
    var alength = newxBeeArray.length;
    var length = xBeeArray.length;
    var found = false;
    var xBeeOBJ = '';
    for (var i = 0; i < length; i++) {
        xBeeArray[i].ConnStatus = false;
    }
    for (i = 0; i < alength; i++) {
        xBeeOBJ = newxBeeArray.shift();
        for (var j = 0; j < length; j++) {
            if (xBeeOBJ.ID == xBeeArray[j].ID) {
                found = true;
                xBeeOBJ.ConnStatus = true;
                xBeeArray[j] = xBeeOBJ;
                break;
            }
        }
        if (!found) {
            newxBeeArray.push(xBeeOBJ);
        }
        found = false;
    }
    alength = newxBeeArray.length;
    if (alength > 0) {
        for (i = 0; i < alength; i++) {
            xBeeOBJ = newxBeeArray.pop();
            xBeeOBJ.ConnStatus = true;
            xBeeArray.push(xBeeOBJ);
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
        if (xBeeOBJ.ID == id) {
            found = true;
            break;
        }
    }
    if (found) {
        text += '<tr><td>Module ID</td><td>' + xBeeOBJ.ID + '</td>';
        text += '<tr><td>Reading</td><td>' + xBeeOBJ.Reading + '</td>';
        text += '<tr><td>Minimum Voltage</td><td>' + xBeeOBJ.MinVol + '</td>';
        text += '<tr><td>Maximum Voltage</td><td>' + xBeeOBJ.MaxVol + '</td>';
        text += '<tr><td>Minimum Value</td><td>' + xBeeOBJ.MinVal + '</td>';
        text += '<tr><td>Maximum Value</td><td>' + xBeeOBJ.MaxVal + '</td>';
        text += '<tr><td>Description</td><td>' + xBeeOBJ.Name + '</td>';
        text += '<tr><td>Unit of Measurment</td><td>' + xBeeOBJ.Unit + '</td>';
        text += '<tr><td>Connection Status</td><td>';
        if (xBeeOBJ.ConnStatus) {
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

function getNodes(refreshtest){
    //refreshtest just determines what function to send data to.
    //true for refresh(), false for initialize().
    var jsonobj = '';
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            if(refreshtest && jsonobj.success){
                newxBeeArray = jsonobj.nodes;
                refresh();
            }else if(!refreshtest && jsonobj.success){
                xBeeArray = jsonobj.nodes;
                initialize();
            }else{
                alert('You are not authorized, please sign in.');
                window.location = 'login.html';
            }
        }
    };
    xhttp.open('GET', '/api/list', true);
    xhttp.send();
    return jsonobj;
}

function login(){
    var jsonobj;
    var loginfo = {"user" : $('#user').val(), "pass" : $('#password').val()};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            if(jsonobj.success){
              window.location = 'index.html';
            }else{
              $( '#errorcon' ).text( 'Error: ' + jsonobj.error );
            }
        }
    };
    xhttp.open('POST','/api/login', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(loginfo));
}

function logout(){
    var jsonobj = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            if(jsonobj.success){
                window.location = 'login.html';
            }
        }
    };
    xhttp.open('GET','/api/logout', true);
    xhttp.send();
}

function addXbees(i){
    jsonobj = '';
    var xhttp = new XMLHttpRequest();

    xbee = {"node_id":i, "name":i.toString(), "units":i.toString()};

    xhttp.onreadystatechange = function(){
        if(xhttp.readState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            if(!jsonobj.success){
                alert('addXbees failed');
            }
        }
    };
    xhttp.open('POST', '/api/add', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(xbee));
}