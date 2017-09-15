/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


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
  statusCode = statusCode || 200;
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
    sendResponse(response, {results: messages});
  },
  'POST': (request, response) => {
    collectData(request, message => {
      messages.push(message);
      message.objectId += 1;
      sendResponse(response, null);
    });
  },
  'OPTIONS': (request, response) => {
    sendResponse(response, null);
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


