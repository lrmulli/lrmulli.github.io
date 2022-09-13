var patToken = "";
var locations = {}

window.addEventListener('load',function() {
    console.log("Loaded")
    let params = (new URL(document.location)).searchParams;
    patToken = params.get("pat");
    console.log(patToken)
    getLocations(); 
    });

document.querySelector('#authform').addEventListener('submit', function(event) {
    patToken = document.querySelector('#patToken').value
    alert(patToken)
    getLocations();
    //getDevices();
    return false
});

document.querySelector('#deviceInfoModal').addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget
  console.log(button)
  // Extract info from data-bs-* attributes
  const deviceId = button.getAttribute('data-bs-deviceid')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  const modalTitle = deviceInfoModal.querySelector('.modal-title')

  modalTitle.textContent = 'Device Info - '+deviceId
})

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
        html += '<table class="table"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody id="tbody_'+locationId+'_'+id+'"></tbody></table>'
        html += '</div></div></div>'
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
    html += '<table class="table"><thead><tr><th scope="col">Label</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">More Info</th></tr></thead><tbody id="tbody_'+locationId+'_'+id+'"></tbody></table>'
    html += '</div></div></div>'
    document.querySelector('#roomAccordian_location_'+locationId).innerHTML = html
    getDevices();
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
    devices = JSON.parse(response);
    
    devices.items.forEach(item => {
        var html = "";
        console.log(item.label);
        var id = 'device_'+item.deviceId;
        html += '<tr><td>'+item.label+'</td><td>'+item.name+'</td><td>'+item.type+'</td><td><button type="button" id="button_'+item.deviceId+'" class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#deviceInfoModal" data-bs-deviceid="'+item.deviceId+'">Device Info</button></td></tr>'
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
