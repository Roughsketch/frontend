var xBeeArray = [];
function initialize(){
    /*TODO need a function that will return all connected Xbees with values for columns
    (id, description, value)
    id = Xbee id number
    description = brief summary of node
    value = The scaled value of the reading 
    Then populate a table on the page with all of these values
    JSON*/
    var xBeeOBJ = xBeeArray[0]
    var length = xBeeArray.length
    var ctable = document.getElementById('cTable')
    var dctable = document.getElementById('dcTable')
    for(var j = 0; j < 2; j++){
        var text = `<table>
            <th>ID</th>
            <th>Reading</th>
            <th>Min Voltage</th>
            <th>Max Voltage</th>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>xBee Name</th>
            <th>Unit</th>
            <th>ConnStatus</th>`
            for (var i = 0; i<length; i++){
                xBeeOBJ = xBeeArray[i]
                if(j == 0){
                    var test = 'true'
                }else{
                    var test = 'false'
                }
                if(xBeeOBJ.ConnStatus == test){
                    text += '<tr id = \'row'+ xBeeOBJ.ID +'\'><td>' + xBeeOBJ.ID +'</td>'
                    text += '<td id=\'read' + xBeeOBJ.ID +'\'>' + xBeeOBJ.Reading + '</td>'
                    text += '<td>' + xBeeOBJ.MinVol + '</td>'
                    text += '<td>' + xBeeOBJ.MaxVol + '</td>'
                    text += '<td>' + xBeeOBJ.MinVal + '</td>'
                    text += '<td>' + xBeeOBJ.MaxVal + '</td>'
                    text += '<td>' + xBeeOBJ.Name + '</td>'
                    text += '<td>' + xBeeOBJ.Unit + '</td>'
                    text += '<td>' + xBeeOBJ.ConnStatus + '</td>'
                }
            }
            text += '</table>'
            if(j==0){
                ctable.innerHTML = text   
            }else{
                dctable.innerHTML = text
            }
    }
}

function refresh(){
    /*TODO need a function that will return all connected Xbees again with values for columns(idnum, data)
    After, a check needs to be done with existing table elements to see if they were all updated.
    If they weren't, gray out the table box.  If they were, update the data
    */
    var length = newxBeeArray.length
    var alength = xBeeArray.length
    var found = false
    for(var i = 0; i < alength; i++){
        for(var j = 0; j < length; j++){
            console.log(i + ' ' + j)
            if(newxBeeArray[j].ID == xBeeArray[i].ID){
                xBeeArray[i].Reading = newxBeeArray[j].Reading
                found = true
                j = length
            }
        }
        if(!found){
            xBeeArray[i].ConnStatus = 'false'
        }
        found = false
    }
    initialize()
    console.log('refresh\n')
}

function openNode(){
    /*Creates new table that shows values of individual node and allows
    for the control of certain functions*/
    console.log('Open Node\n')
}

function testArray(){
    newxBeeArray = []
        var xBeeOBJ = {"ID": "1",
        "Reading": "24",
        "MinVol": "1",
        "MaxVol": "200",
        "MinVal": "40", 
        "MaxVal": "212", 
        "Name": "pressure", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        xBeeArray[0] = xBeeOBJ
        
        var xBeeOBJ = {"ID": "2",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        xBeeArray[1] = xBeeOBJ
        
        var xBeeOBJ = {"ID": "3",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        xBeeArray[2] = xBeeOBJ
        
        var xBeeOBJ = {"ID": "4",
        "Reading": "22",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        xBeeArray[3] = xBeeOBJ

        var xBeeOBJ = {"ID": "3",
        "Reading": 80,
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        newxBeeArray[0] = xBeeOBJ
        
        var xBeeOBJ = {"ID": "4",
        "Reading": "99",
        "MinVol": "0",
        "MaxVol": "212",
        "MinVal": "32", 
        "MaxVal": "100", 
        "Name": "Temperature", 
        "Unit": "Fdeg",
        "ConnStatus": 'true'}
        newxBeeArray[1] = xBeeOBJ
    console.log(xBeeArray)
}

testArray() 
initialize()