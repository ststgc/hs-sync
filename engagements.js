//サコ編集済2020/03/28
// Get All Engagements
function getEngagements(){
  let matrix = [];
  let id, contactIds,companyIds,dealIds,ownerIds,createdAt,lastUpdated;
  let labels  = ['id','createdAt','lastUpdated','contactIds','companyIds','dealIds','ownerIds'];
  matrix.push(labels);  
  let go = true;
  let counter = 1;
  let offset;
  let hasMore;
  
  try {
    while (go){
      let url = "https://api.hubapi.com/engagements/v1/engagements/paged?hapikey=" + HUBSPOT_API_KEY +"&limit=250";
      let key = "";
      
      if(counter =! 1){
        key = "&offset=" + offset;
      }
      
      url = url + key;
      let request = UrlFetchApp.fetch(url);
      let data = JSON.parse(request.getContentText());
      
      if (data['hasMore'] == true ){
         offset = data.offset;
      }else{
        go = false;
      }
      
      data.results.forEach((item)=>{
        id = item['engagement']['id'];
        createdAt = (item['engagement']['createdAt']/1000+ 32400) / 86400 + 25569; //unixtimeをスプレ用に変換
        lastUpdated = (item['engagement']['lastUpdated']/1000+ 32400) / 86400 + 25569;
        contactIds = item['associations']['contactIds'];
        companyIds = item['associations']['companyIds'];
        dealIds = item['associations']['dealIds'];
        ownerIds = item['associations']['ownerIds'];
        matrix.push([id,createdAt,lastUpdated,contactIds,companyIds,dealIds,ownerIds]);
      })
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
  let data = getEngagements();
  let lastRowNum = data.length;
  let lastColNum = data[0].length;
  sheet.clear();
  sheet.getRange(1, 1, lastRowNum, lastColNum).setValues(data);
}
