var clientId = '833448389133-dbm1trc3j5eujj7k09gi19idsaqjk3qs.apps.googleusercontent.com';
var apiKey = 'AIzaSyDNcoyJPEU7N_4Td5oAa__2x1wVMd6ZPJ4';
var scopes =
  'https://www.googleapis.com/auth/gmail.readonly '+
  'https://www.googleapis.com/auth/gmail.send';
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: true
  }, handleAuthResult);
}

function handleAuthClick() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, handleAuthResult);
  return false;
}

function handleAuthResult(authResult) {
  if(authResult && !authResult.error) {
    loadGmailApi();
    // $('#authorize-button').remove();
    $('#authorize-button').on('click', function(){
      // handleAuthClick();
      angular.element(document.getElementById('manual')).scope().closeManual();
    });
  } else {
    $('#authorize-button').removeClass("hidden");
    $('#authorize-button').on('click', function(){
      handleAuthClick();
    });
  }
}

function loadGmailApi() {
  gapi.client.load('gmail', 'v1');
}

function sendEmail(experimentResult)
{
  $('#send-button').addClass('disabled');
  sendMessage(
    {
      'To': 'nopphawit.kar@gmail.com',
      'Subject': 'Result from Experiment'
    },
    experimentResult,
    finishMessage
  );
  return false;
}

function finishMessage()
{
  console.log('finish send mail');
}

function sendMessage(headers_obj, message, callback)
{
  var email = '';
  for(var header in headers_obj)
    email += header += ": "+headers_obj[header]+"\r\n";
  email += "\r\n" + message;
  var sendRequest = gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
    }
  });
  return sendRequest.execute(finishMessage);
}