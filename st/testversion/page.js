var patToken = "";
var locations = {}
var rooms = {}
var devices = []
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());
var lastDevicesReceived = {}

window.addEventListener('load',function() {
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
    event.preventDefault();
});

document.querySelector('#deviceInfoModal').addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget
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
    else if(btntype == "health")
    {
        modalTitle.textContent = 'Device Health - '+item.label
        getDeviceHealth(deviceId)
    }
    else if(btntype == "delete")
    {
        modalTitle.textContent = 'Delete - '+item.label
        deleteDevice(deviceId)
    }
    else if(btntype == "prefs")
    {
        modalTitle.textContent = 'Preferences - '+item.label
        getDevicePreferences(deviceId)
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
function getDevicePreferences(deviceId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        jsonObjViewer(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/devices/"+deviceId+"/preferences", true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.setRequestHeader("Accept", "application/vnd.smartthings+json;v=20170916");
    xmlHttp.send(null);
}
function getDeviceHealth(deviceId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        jsonObjViewer(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/devices/"+deviceId+"/health", true); // true for asynchronous 
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
        var id = 'location_'+item.locationId
        html += '<div class="container"><h1>'+item.name+'</h1><hr><div class="container" id="'+id+'"><div class="accordion" id="roomAccordian_'+id+'"></div></div></div>';
    });
    document.querySelector('#devices').innerHTML = html
    locations.items.forEach(item => {
        getRooms(item.locationId)
    });
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
        html += '<div class="table-responsive"><table class="table table-hover"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody class="room_tbody" id="tbody_'+locationId+'_'+id+'"></tbody></table>'
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
    html += '<div class="table-responsive"><table class="table table-hover"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody class="room_tbody" id="tbody_'+locationId+'_'+id+'"></tbody></table>'
    html += '</div></div></div></div>'
    document.querySelector('#roomAccordian_location_'+locationId).innerHTML = html
    getDevices(locationId,"");
}
function getDevices(locationId,link_override)
{
    var filter = "?";
    if(locationId != "")
    {
        filter += "locationId="+locationId
    }
    var link = "https://api.smartthings.com/v1/devices/"+filter
    if(link_override != "")
    {
        link = link_override
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        receiveDevices(xmlHttp.responseText);
    }
    xmlHttp.open("GET", link, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    xmlHttp.send(null);
}
function receiveDevices(response)
{
    d = JSON.parse(response);
    console.log('Received '+d.items.length+' devices!')
    lastDevicesReceived = d;
    d.items.forEach(item => {
        devices[item.deviceId] = item        
    });
    if(d._links?.next?.href)
    {
        console.log('getting more devices')
        getDevices("",d._links.next.href)
    }
    else 
    {
        console.log("no more devices to get for this location")
        processDevices()
    }
}
function emptyRooms()
{
    document.querySelectorAll(".room_tbody").forEach((item) => {
        document.querySelector("#"+item.id).innerHTML = ""; 
    });
}
function processDevices()
{   
    emptyRooms() //empty all the rooms - so that they are clear to be re-added
    for (let x in devices) 
    {
        var item = devices[x];
        var html = "";
        //console.log("processing device")
        //console.log(item);
        var id = 'device_'+item.deviceId;
        html += '<tr><td>'+item.label+'</td><td>'+item.name+'</td><td>'+item.type+'</td><td><div class="btn-group" role="group" aria-label="Basic example">'
        html += '<button type="button" id="info_button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="info" data-bs-deviceid="'+item.deviceId+'"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Info" width="16" height="16" fill="currentColor" class="bi bi-info-square-fill" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg></button>'
        html += '<button type="button" id="prefs_button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="prefs" data-bs-deviceid="'+item.deviceId+'"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Preferences" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg></button>'
        html += '<button type="button" id="state_button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="state" data-bs-deviceid="'+item.deviceId+'">State</button>'
        html += '<button type="button" id="health_button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="health" data-bs-deviceid="'+item.deviceId+'">Health</button>'
        //html += '<button type="button" id="delet_button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-btntype="delete" data-bs-deviceid="'+item.deviceId+'">Delete</button>'
        html += '</div></td></tr>'
        if(item.roomId === null)
        {
            document.querySelector('#tbody_'+item.locationId+'_room_unassigned').innerHTML += html
        }
        else
        {
            document.querySelector('#tbody_'+item.locationId+'_room_'+item.roomId).innerHTML += html
        }
    }
}
function deleteDevice(deviceId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        jsonObjViewer(xmlHttp.responseText)
    }
    xmlHttp.open("DELETE", "https://api.smartthings.com/v1/devices/"+deviceId, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Authorization", "Bearer "+patToken);
    //disabled the delete capability
    //xmlHttp.send(null); 
}


//http functions
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
