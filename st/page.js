var patToken = "";

const authform = document.querySelector('#authform')
authform.addEventListener('submit', function(event) {
    patToken = document.querySelector('#patToken').value
    alert(patToken)
});
