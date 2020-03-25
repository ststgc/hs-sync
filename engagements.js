// Get All Engagements
function getEngagements(){
  let matrix = [];
  // Add props to retrive from contacts.
  let props = "lastname,firstname,company,email,phone,hs_analytics_source,is_partner,partner_reffered_by";
  let id, firstName, lastName, company, email, phone, hs_analytics_source, isPartner, partner_reffered_by;
  let labels = ['id', 'firstName', 'lastName', 'company', 'email', 'phone', 'hs_analytics_source', 'isPartner', 'partner_reffered_by'];
  matrix.push(labels);  
  let go = true;
  let hasMore = false;
  let after;
  let counter = 1;
  let timeLimit = 10000; // 10sec
  let timeStarted = new Date(2008, 5, 1, 2, 0, 0);
  let timeNow, timeDiff;
  
  
  try {
    while (go){
      let url = "https://api.hubapi.com/engagements/v1/engagements/paged?hapikey=" + HUBSPOT_API_KEY + "&properties=" + props;
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
      
      // throw new Error();
      
      data.results.forEach((item)=>{
        Logger.log(item);
        //id = item['id'];
        //lastName = item['properties']['lastname'];
        //firstName = item['properties']['firstname']; 
        //company = item['properties']['company'];
        //phone = item['properties']['phone'];
        //partner_reffered_by = item['properties']['partner_reffered_by'];
        //hs_analytics_source = item['properties']['hs_analytics_source'];
        //email = item['properties']['email'];
        matrix.push([id, lastName, firstName, company, email, phone, hs_analytics_source, isPartner, partner_reffered_by]);
      })
      counter++

      // Debug
      // throw new Error('デバッグ用エラーが発生！');
    }
  } catch(error) {
    Logger.log("Error: %s", error);

    // Post to slack
    let username = "HubSpotスプレ連携GASの門番";
    let icon = ":robot_face:";
    let message = "`HubspotGetAllData`のGASでエラーが起きています。\n担当者はご対応をお願いいたします。\n\n```" + error + "``` \n\n 該当スプレ：" + SLACK_NOTIFY_SHEET_URL;
    postToSlack(SLACK_WEBHOOK_OFFERSHS,username,icon,message);
  }
  return matrix;
}


function writeEngagements(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetName = 'engagements';
  let sheet = ss.getSheetByName(sheetName);
  let data = getContacts();
  let lastRowNum = data.length;
  let lastColNum = data[0].length;
  sheet.clear();
  sheet.getRange(1, 1, lastRowNum, lastColNum).setValues(data);
}
