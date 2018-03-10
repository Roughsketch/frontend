var xBeeArray = [];
var newxBeeArray = [];
var tabletext = '';
function begin(){
   var body = document.getElementById('mainb');
   var text = `<h1 id='tabTitle'>Xbee Nodes</h1>
   <div id='cTable'></div>
   <button onclick='refresh()'>Refresh</button>`;
   body.innerHTML = text;
   initialize();
}

function initialize(){
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
    xBeeArray.sort(function(a, b){return a.ID - b.ID;});
    text = `<table id='nodeTable'>
        <th>ID</th>
        <th>Reading</th>
        <th>xBee Name</th>
        <th>Unit</th>`;
    for(var i = 0; i < length; i++){
        xBeeOBJ = xBeeArray[i];
            text += '<tr id = \'conn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>'+ xBeeOBJ.ID +'</button></td>';
            text += '<td>' + xBeeOBJ.Reading + '</td>';
            text += '<td>' + xBeeOBJ.Name + '</td>';
            text += '<td>' + xBeeOBJ.Unit + '</td>';
        }else{
            text += '<tr id = \'dconn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>'+ xBeeOBJ.ID +'</button></td>';
            text += '<td>' + xBeeOBJ.Reading + '</td>';
            text += '<td>' + xBeeOBJ.Name + '</td>';
            text += '<td>' + xBeeOBJ.Unit + '</td>';
        }
    }
    text += '</table>';
    table.innerHTML = text;
    tabletext = text;
}

function refresh(){
    /*TODO need a function that will return all connected Xbees again with values for columns(idnum, data)
    After, a check needs to be done with existing table elements to see if they were all updated.
    If they weren't, gray out the table box.  If they were, update the data, if new nodes exist add them.
    */
    newxBeeArray =  getNodes();
    var alength = newxBeeArray.length;
    var length = xBeeArray.length;
    var found = false;
    var xBeeOBJ = '';
    for(var i = 0; i < length; i++){
        xBeeArray[i].ConnStatus = false;
    }
    for(var i = 0; i < alength; i++){
        xBeeOBJ = newxBeeArray.shift();
        for(var j = 0; j < length; j++){
            if(xBeeOBJ.ID == xBeeArray[j].ID){
                found = true;
                xBeeOBJ.ConnStatus = true;
                xBeeArray[j] = xBeeOBJ;
                break;
            }
        }
        if(!found){
            newxBeeArray.push(xBeeOBJ);
        }
        found = false;
    }
    alength = newxBeeArray.length;
    if(alength > 0){
        for(var i = 0; i < alength; i++){
            xBeeOBJ = newxBeeArray.pop();
            xBeeOBJ.ConnStatus = true;
            xBeeArray.push(xBeeOBJ);
        }
    }
    initialize();
}

function openNode(id){
    /*TODO: Create a button that will allow you to control a function on the Xbee*/
    var page = document.getElementById('mainb');
    var text = '<table>';
    var length = xBeeArray.length;
    var xBeeOBJ;
    var found = false;
    for(var i = 0; i < length; i++){
        xBeeOBJ = xBeeArray[i];
        if(xBeeOBJ.ID == id){
            found = true;
            break;
        }
    }
    if(found){
        text += '<tr><td>Module ID</td><td>' + xBeeOBJ.ID + '</td>';
        text += '<tr><td>Reading</td><td>' + xBeeOBJ.Reading + '</td>';
        text += '<tr><td>Minimum Voltage</td><td>' + xBeeOBJ.MinVol + '</td>';
        text += '<tr><td>Maximum Voltage</td><td>' + xBeeOBJ.MaxVol + '</td>';
        text += '<tr><td>Minimum Value</td><td>' + xBeeOBJ.MinVal + '</td>';
        text += '<tr><td>Maximum Value</td><td>' + xBeeOBJ.MaxVal + '</td>';
        text += '<tr><td>Description</td><td>' + xBeeOBJ.Name + '</td>';
        text += '<tr><td>Unit of Measurment</td><td>' + xBeeOBJ.Unit + '</td>';
        text += '<tr><td>Connection Status</td><td>';
        if(xBeeOBJ.ConnStatus){
            text += 'Connected</td>';
        }else{
            text += 'Disconnected</td>';
        }
        text += '</table>';
    }
    text += '<button onclick=\'goBack()\'>Go Back</button>';
    page.innerHTML = text;
}
function goBack(){
    var page = document.getElementById('mainb');
    page.innerHTML = `<h1 id='tabTitle'>Xbee Nodes</h1>
    <div id='cTable'></div>
    <button onclick='refresh()'>Refresh</button>`;
    var table = document.getElementById('cTable');
    table.innerHTML = tabletext;
}


function getNodes(){
    var jsonobj = '';
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            console.log(jsonobj);
        } 
    };
    xhttp.open('GET', '/api/list', true);
    xhttp.send();
    return jsonobj;
}

function login(loginfo){
    var jsonobj;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200){
            jsonobj = JSON.parse(xhttp.responseText);
            console.log(jsonobj);
        } 
    };
    xhttp.open('POST','/api/login', true);
    xhttp.send(loginfo);
    return jsonobj;
}


login({"user": "root", "pass": "toor"});
getNodes();