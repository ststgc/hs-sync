// Slack post
function postToSlack(postUrl, username, icon, message){
  let jsonData = {
    "username": username,
    "icon_emoji": icon,
    "text": message
  };
  let payload = JSON.stringify(jsonData);
  let options = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };
  UrlFetchApp.fetch(postUrl, options);  
}

