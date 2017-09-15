/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var objectId = 0;

var messages = [
  {
    username: 'Jono',
    text: 'Do my bidding!',
    roomname: 'lobby',
    objectId: objectId
  }
];


var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'Content-Type': 'application/json',
  'access-control-max-age': 10 // Seconds.
};

var sendResponse = (response, data, statusCode) => {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = (request, callback) => {
  var data = '';
  request.on('data', chunk => data += chunk);
  request.on('end', () => callback(JSON.parse(data)));
};

var actions = {
  'GET': (request, response) => {
    sendResponse(response, {results: messages}, 200);
  },
  'POST': (request, response) => {
    collectData(request, message => {
      messages.push(message);
      message.objectId = ++objectId;
      sendResponse(response, {objectId: message.objectId}, 201);
    });
  },
  'OPTIONS': (request, response) => {
    sendResponse(response, null, 200);
  }
};

module.exports = function(request, response) {

  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    sendResponse(response, 'Not Found', 404);
  }



  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  
};


