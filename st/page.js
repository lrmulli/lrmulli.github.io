var patToken = "";

document.querySelector('#authform').addEventListener('submit', function(event) {
    patToken = document.querySelector('#patToken').value
    //alert(patToken)
    getDevices()
});

function getDevices()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "https://api.smartthings.com/v1/devices/", true); // true for asynchronous 
    xmlhttp.setRequestHeader("Authorization", "Bearer "+patToken);
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
