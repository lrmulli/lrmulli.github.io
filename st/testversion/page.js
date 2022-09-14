var patToken = "";
var locations = {}
var rooms = {}
var devices = []
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());

window.addEventListener('load',function() {
    console.log("Loaded")
    let params = (new URL(document.location)).searchParams;
    patToken = params.get("pat");
    console.log(patToken)
        if(patToken != "")
        {
            getLocations();
        }
    });

document.querySelector('#authform').addEventListener('submit', function(event) {
    patToken = document.querySelector('#patToken').value
    getLocations();
    //getDevices();
    event.preventDefault();
});

document.querySelector('#deviceInfoModal').addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget
  console.log(button)
  // Extract info from data-bs-* attributes
  const deviceId = button.getAttribute('data-bs-deviceid')
  const btntype = button.getAttribute('data-bs-btntype')
  const modalTitle = deviceInfoModal.querySelector('.modal-title')    
  var item = devices[deviceId]
    if(btntype == "info")
    {
        modalTitle.textContent = 'Device Info - '+item.label
        jsonViewer.showJSON(item, -1, 2);
    }
    else if(btntype == "state")
    {
        modalTitle.textContent = 'Device State - '+item.label
        getDeviceState(deviceId)
    }
    else if(btntype == "info_plus")
    {
        modalTitle.textContent = 'Device Info+ - '+item.label
        getDeviceInfo(deviceId)
    }
})
function getDeviceState(deviceId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        jsonObjViewer(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/devices/"+deviceId+"/status", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function getDeviceInfo(deviceId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        jsonObjViewer(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/devices/"+deviceId+"", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function jsonObjViewer(response)
{
    resp = JSON.parse(response);
    jsonViewer.showJSON(resp, -1, 2);
}
function getLocations()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        receiveLocations(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/locations/", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function receiveLocations(response)
{
    locations = JSON.parse(response);
    var html = "";
    locations.items.forEach(item => {
        console.log(item.name);
        var id = 'location_'+item.locationId
        html += '<div class="container"><h1>'+item.name+'</h1><hr><div class="container" id="'+id+'"><div class="accordion" id="roomAccordian_'+id+'"></div></div></div>';
    });
    document.querySelector('#devices').innerHTML = html
    locations.items.forEach(item => {
        getRooms(item.locationId)
    });
    getDevices();
}
function getRooms(locationid)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        receiveRooms(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/locations/"+locationid+"/rooms", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function receiveRooms(response)
{
    rooms = JSON.parse(response);
    var html = "";
    var locationId = "";
    rooms.items.forEach(item => {
        console.log(item.name);
        var id = 'room_'+item.roomId;
        var headingId = 'heading_'+id
        var bodyId = 'body_'+id
        locationId = item.locationId;
        html +='<div class="accordion-item"><h2 class="accordion-header" id="'+headingId+'"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#'
        html += bodyId
        html += '" aria-expanded="false" aria-controls="'+bodyId+'">';
        html += item.name
        html +='</button></h2><div id="'
        html += bodyId
        html += '" class="accordion-collapse collapse" aria-labelledby="'+headingId+'" data-bs-parent="#roomAccordian_location_'+locationId+'"><div class="accordion-body" id="body_'+locationId+'_'+id+'">'
        html += '<div class="table-responsive"><table class="table table-hover"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody id="tbody_'+locationId+'_'+id+'"></tbody></table>'
        html += '</div></div></div></div>'
    });
    var id = 'room_undefined';
    var headingId = 'heading_'+id
    var bodyId = 'body_'+id
    html +='<div class="accordion-item"><h2 class="accordion-header" id="'+headingId+'"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#'
    html += bodyId
    html += '" aria-expanded="false" aria-controls="'+bodyId+'">';
    html += 'Unassigned'
    html +='</button></h2><div id="'
    html += bodyId
    html += '" class="accordion-collapse collapse" aria-labelledby="'+headingId+'" data-bs-parent="#roomAccordian_location_'+locationId+'"><div class="accordion-body" id="body_'+locationId+'_'+id+'">'
    html += '<div class="table-responsive"><table class="table table-hover"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody id="tbody_'+locationId+'_'+id+'"></tbody></table>'
    html += '</div></div></div></div>'
    document.querySelector('#roomAccordian_location_'+locationId).innerHTML = html
    
}
function getDevices()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        receiveDevices(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/devices/", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function receiveDevices(response)
{
    d = JSON.parse(response);
    
    d.items.forEach(item => {
        devices[item.deviceId] = item        
    });
    processDevices()
}
function processDevices()
{   
    devices.forEach(item => {
        var html = "";
        console.log("processing device")
        console.log(item);
        var id = 'device_'+item.deviceId;
        html += '<tr><td>'+item.label+'</td><td>'+item.name+'</td><td>'+item.type+'</td><td><div class="btn-group" role="group" aria-label="Basic example">'
        html += '<button type="button" id="button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="info" data-bs-deviceid="'+item.deviceId+'">Info</button>'
        html += '<button type="button" id="button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="state" data-bs-deviceid="'+item.deviceId+'">State</button>'
        html += '</div></td></tr>'
        console.log(item)
        if(item.roomId === null)
        {
            document.querySelector('#tbody_'+item.locationId+'_room_unassigned').innerHTML += html
        }
        else
        {
            document.querySelector('#tbody_'+item.locationId+'_room_'+item.roomId).innerHTML += html
        }
        
    });  
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
