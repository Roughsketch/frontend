var xBeeArray = []
var newxBeeArray = []
var tabletext = ''
function begin(){
   var body = document.getElementById('mainb')
   var text = `<h1 id='tabTitle'>Xbee Nodes</h1>
   <div id='cTable'></div>
   <button onclick='refresh()'>Refresh</button>`
   body.innerHTML = text
   initialize()
}
function initialize(){
    /*TODO need a function that will return all connected Xbees with values for columns
    (id, description, value)
    id = Xbee id number
    description = brief summary of node
    value = The scaled value of the reading 
    Then populate a table on the page with all of these values
    JSON*/
    var xBeeOBJ
    var length = xBeeArray.length
    var table = document.getElementById('cTable')
    var text = ''
    text = `<table id='nodeTable'>
        <th>ID</th>
        <th>Reading</th>
        <th>xBee Name</th>
        <th>Unit</th>`
    for(var i = 0; i < length; i++){
        xBeeOBJ = xBeeArray[i]
        if(xBeeOBJ.ConnStatus == true){
            text += '<tr id = \'conn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>'+ xBeeOBJ.ID +'</button></td>'
            text += '<td>' + xBeeOBJ.Reading + '</td>'
            text += '<td>' + xBeeOBJ.Name + '</td>'
            text += '<td>' + xBeeOBJ.Unit + '</td>'
        }else{
            text += '<tr id = \'dconn\'><td><button onclick=\'openNode(' + xBeeOBJ.ID + ')\'>'+ xBeeOBJ.ID +'</button></td>'
            text += '<td>' + xBeeOBJ.Reading + '</td>'
            text += '<td>' + xBeeOBJ.Name + '</td>'
            text += '<td>' + xBeeOBJ.Unit + '</td>'
        }
    }
    text += '</table>'
    table.innerHTML = text
    tabletext = text
}

function refresh(){
    /*TODO need a function that will return all connected Xbees again with values for columns(idnum, data)
    After, a check needs to be done with existing table elements to see if they were all updated.
    If they weren't, gray out the table box.  If they were, update the data, if new nodes exist add them.
    */
    var alength = newxBeeArray.length
    var length = xBeeArray.length
    var found = false
    var xBeeOBJ = ''
    for(var i = 0; i < length; i++){
        xBeeArray[i].ConnStatus = false
    }
    for(var i = 0; i < alength; i++){
        xBeeOBJ = newxBeeArray.shift()
        for(var j = 0; j < length; j++){
            if(xBeeOBJ.ID == xBeeArray[j].ID){
                found = true
                xBeeOBJ.ConnStatus = true
                xBeeArray[j] = xBeeOBJ
                break
            }
        }
        if(!found){
            newxBeeArray.push(xBeeOBJ)
        }
        found = false
    }
    alength = newxBeeArray.length
    if(alength > 0){
        for(var i = 0; i < alength; i++){
            xBeeOBJ = newxBeeArray.pop()
            xBeeOBJ.ConnStatus = true
            xBeeArray.push(xBeeOBJ)
        }
    }
    initialize()
}

function openNode(id){
    /*TODO: Create a button that will allow you to control a function on the Xbee*/
    var page = document.getElementById('mainb')
    var text = '<table>'
    var length = xBeeArray.length
    var xBeeOBJ
    var found = false
    for(var i = 0; i < length; i++){
        xBeeOBJ = xBeeArray[i]
        if(xBeeOBJ.ID == id){
            found = true
            break
        }
    }
    if(found){
        text += '<tr><td>Module ID</td><td>' + xBeeOBJ.ID + '</td>'
        text += '<tr><td>Reading</td><td>' + xBeeOBJ.Reading + '</td>'
        text += '<tr><td>Minimum Voltage</td><td>' + xBeeOBJ.MinVol + '</td>'
        text += '<tr><td>Maximum Voltage</td><td>' + xBeeOBJ.MaxVol + '</td>'
        text += '<tr><td>Minimum Value</td><td>' + xBeeOBJ.MinVal + '</td>'
        text += '<tr><td>Maximum Value</td><td>' + xBeeOBJ.MaxVal + '</td>'
        text += '<tr><td>Description</td><td>' + xBeeOBJ.Name + '</td>'
        text += '<tr><td>Unit of Measurment</td><td>' + xBeeOBJ.Unit + '</td>'
        text += '<tr><td>Connection Status</td><td>'
        if(xBeeOBJ.ConnStatus){
            text += 'Connected</td>'
        }else{
            text += 'Disconnected</td>'
        }
        text += '</table>'
    }
    text += '<button onclick=\'goBack()\'>Go Back</button>'
    page.innerHTML = text
}
function goBack(){
    var page = document.getElementById('mainb')
    page.innerHTML = `<h1 id='tabTitle'>Xbee Nodes</h1>
    <div id='cTable'></div>
    <button onclick='refresh()'>Refresh</button>`
    var table = document.getElementById('cTable')
    table.innerHTML = tabletext
}

function getNodes(){
    var xBeeOBJ
        xBeeOBJ = {"ID": "2",
        "Reading": "24",
        "MinVol": "1",
        "MaxVol": "200",
        "MinVal": "40", 
        "MaxVal": "212", 
        "Name": "pressure", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        xBeeArray[0] = xBeeOBJ
        
        xBeeOBJ = {"ID": "1",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        xBeeArray[1] = xBeeOBJ
        
        xBeeOBJ = {"ID": "4",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        xBeeArray[2] = xBeeOBJ
        
        xBeeOBJ = {"ID": "3",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        xBeeArray[3] = xBeeOBJ

        xBeeOBJ = {"ID": "3",
        "Reading": '80',
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        newxBeeArray[0] = xBeeOBJ
        
        xBeeOBJ = {"ID": "4",
        "Reading": "99",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        newxBeeArray[1] = xBeeOBJ

        xBeeOBJ = {"ID": "5",
        "Reading": "99",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": true}
        newxBeeArray[2] = xBeeOBJ
}
function mergeSort(arr){
    //TODO make this
    return arr;
 }

 function merge(left, right){
     //TODO make this
  }
    
getNodes()