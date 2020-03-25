// Get All Owners
function getOwners(){
  let matrix = [];
  //let dealId, dealName, dealStage, pipeline, amount, channel, channel_child, hubspot_owner_id, referral_vc, closedate, createdAt, updatedAt, archived, tier;
  let labels = ['id', 'userId', 'email', 'lastName', 'firstName', 'createdAt'];
  matrix.push(labels);
  let go = true;
  let hasMore = false;
  let after;
  let counter = 0

  while (go){
    // let props = "channel,channel_child,referral_vc,dealname,dealstage,pipeline,amount,closedate,tier,hubspot_owner_id";
    let url = "https://api.hubapi.com/crm/v3/owners?hapikey=" + HUBSPOT_API_KEY;
    if (hasMore){
      url += "&after=" + after;
    }
    let request = UrlFetchApp.fetch(url);
    let data = JSON.parse(request.getContentText());
    hasMore = data.paging ? true : false;
    if (hasMore){
      after = data.paging.next.after;
    }
    if (!hasMore){
      go = false;
    }
    data.results.forEach((item)=>{
      id = item.id;
      userId = item.userId;
      email = item.email;
      lastName = item.lastName;
      firstName = item.firstName;
      createdAt = item.createdAt;
      matrix.push([id,userId,email,lastName,firstName,createdAt]);
      Logger.log(item);
    });
    Logger.log("Current Page: %s", counter);
    counter++
  }
  return matrix;
}

function writeOwners(){
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = 'owners';
    let sheet = ss.getSheetByName(sheetName);
    let data = getOwners();
    let lastRowNum = data.length;
    let lastColNum = data[0].length;
    sheet.clear();
    sheet.getRange(1, 1, lastRowNum, lastColNum).setValues(data);
  } catch(error){
    Logger.log("Error: %s", error);
    // Post to slack
    let username = "HubSpotスプレ連携GASの門番";
    let icon = ":robot_face:";
    let message = "`HubspotGetAllData`のGASでエラーが起きています。\n担当者はご対応をお願いいたします。\n\n```" + error + "``` \n\n 該当スプレ：" + SLACK_NOTIFY_SHEET_URL;
    postToSlack(SLACK_WEBHOOK_OFFERSHS,username,icon,message);
  }
}

