// Get All Deals
// To add props: [dealId, labels, props, data.forEach()]
function getDeals(){
  let matrix = [];
  let dealId, dealName, dealStage, pipeline, amount, channel, channel_child, hubspot_owner_id, referral_vc, closedate, createdAt, updatedAt, archived, tier;
  let labels = ['dealId', 'dealName', 'dealStage', 'pipeline', 'amount', 'channel', 'channel_child', 'hubspot_owner_id','referral_vc', 'closedate', 'createdAt', 'updatedAt', 'archived', 'tier'];
  matrix.push(labels);
  let go = true;
  let hasMore = false;
  let after;
  let counter = 0

  while (go){
    let props = "channel,channel_child,referral_vc,dealname,dealstage,pipeline,amount,closedate,tier,hubspot_owner_id";
    let url = "https://api.hubapi.com/crm/v3/objects/deals?hapikey=" + HUBSPOT_API_KEY + "&properties=" + props;
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
      dealId = item.id;
      dealName = item.properties.dealname;
      dealStage = item.properties.dealstage;
      pipeline = item.properties.pipeline;
      amount = item.properties.amount;
      channel = item.properties.channel;
      channel_child = item.properties.channel_child;
      referral_vc = item.properties.referral_vc;
      hubspot_owner_id = item.properties.hubspot_owner_id;
      closedate = item.properties.closedate;
      createdAt = item.createdAt;
      updatedAt = item.updatedAt;
      archived = item.archived;
      tier = item.properties.tier;
      matrix.push([dealId, dealName, dealStage, pipeline, amount, channel, channel_child, hubspot_owner_id, referral_vc, closedate, createdAt, updatedAt, archived, tier]);
      Logger.log(item);
    });
    Logger.log("Current Page: %s", counter);
    counter++
  }
  return matrix;
}

function writeDeals(){
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = 'deals';
    let sheet = ss.getSheetByName(sheetName);
    let data = getDeals();
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

