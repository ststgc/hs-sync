// TODO: sleepなしだとHubSpot側でリクエスト超過、ありだとGAS側で最大稼働時間超過でエラる
// 36 burst limit, 100 * 36 = 3600 request is limit
// Get All Companies
function getCompanies(){
  let matrix = [];
  let companyId, companyName, domain, hs_analytics_source, updatedAt, createdAt, archived;
  let labels = ['companyId', 'companyName', 'domain', 'hs_analytics_source', 'updatedAt', 'createdAt', 'archived']
  matrix.push(labels);
  let go = true;
  let hasMore = false;
  let after;
  let counter = 1;
  let timeLimit = 10000; // 10sec
  let timeStarted = new Date(2008, 5, 1, 2, 0, 0);
  let timeNow, timeDiff;

  while (go){
    let url = "https://api.hubapi.com/crm/v3/objects/companies?hapikey=" + HUBSPOT_API_KEY;    
    if (counter = 100){
      timeNow = new Date(2008, 5, 1, 2, 0, 0);
      timeDiff = timeNow.getTime() - timeStarted.getTime();
      if (timeLimit < timeDiff) {
        Utilities.sleep(50);
      }
      counter = 1;
    }
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
      companyId = item.id;
      companyName = item.properties.name;
      domain = item.properties.domain;
      createdAt = item.createdAt;
      updatedAt = item.updatedAt;
      archived = item.archived;
      matrix.push([companyId, companyName, domain, hs_analytics_source, updatedAt, createdAt, archived]);
    })
    counter++
  }
  return matrix;
}

// TODO: 起動時間の最大時間を越えるためエラーで止まる
function writeCompanies(){
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = 'companies';
    let sheet = ss.getSheetByName(sheetName);
    let data = getCompanies();
    let lastRowNum = data.length;
    let lastColNum = data[0].length;
    sheet.clear();
    sheet.getRange(1, 1, lastRowNum, lastColNum).setValues(data);
  } catch(error) {
    Logger.log("Error: %s", error);
    // Post to slack
    let username = "HubSpotスプレ連携GASの門番";
    let icon = ":robot_face:";
    let message = "`HubspotGetAllData`のGASでエラーが起きています。\n担当者はご対応をお願いいたします。\n\n```" + error + "``` \n\n 該当スプレ：" + SLACK_NOTIFY_SHEET_URL;
    postToSlack(SLACK_WEBHOOK_OFFERSHS,username,icon,message);
  }
}
