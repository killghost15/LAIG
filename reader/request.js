function getPrologRequest(requestString, onSuccess, onError, port, assinc) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, assinc);

    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}


