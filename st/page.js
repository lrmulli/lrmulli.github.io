var patToken = "";
var locations = {}

document.querySelector('#authform').addEventListener('submit', function(event) {
    patToken = document.querySelector('#patToken').value
    //alert(patToken)
    getLocations();
    getDevices();
});

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
        html += '<div class="container"><h1>'+item.name+'</h1><hr><div class="container" id="'+id+'><div class="accordion" id="roomAccordian_'+id+'"></div></div></div>';
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
        receiveLocations(xmlHttp.responseText);
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
        locationId = item.locationId;
        html +='<div class="accordion-item"><h2 class="accordion-header" id="headingOne"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="'
        html += id
        html += '" aria-expanded="true" aria-controls="'+id+'">';
        html += item.name
        html +='</button></h2><div id="'
        html += id
        html += '" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample"><div class="accordion-body"></div></div></div>'
    });
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
 console.log(response)
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
