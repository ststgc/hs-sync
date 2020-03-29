// Get All Pipelines
// TODO: Support pagination, 現状は数的に問題なさそう
function getPipelines(){
  let url = "https://api.hubapi.com/crm/v3/pipelines/deals?hapikey=" + HUBSPOT_API_KEY;
  let request = UrlFetchApp.fetch(url);
  let data = JSON.parse(request.getContentText());
  let results = data.results;
  let matrix = [];
  let pipelineId, pipelineLabel, stageId, stageLabel;
  let labels = ['pipelineId', 'pipelineLabel', 'stageId', 'stageLabel'];
  matrix.push(labels);
  let stages;
  for (let i=0;i<results.length;i++){
    pipelineId = results[i].id;
    pipelineLabel = results[i].label;
    stages = results[i].stages;
    for (let j=0;j<stages.length;j++){
      stageId = stages[j].id;
      stageLabel = stages[j].label
      matrix.push([pipelineId, pipelineLabel, stageId, stageLabel]);
    }
  }
  // Debug
  // throw new Error('デバッグ用エラーが発生！');
  return matrix;
}

function writePipelines(){
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetName = 'engagements';
    let sheet = ss.getSheetByName(sheetName);
    let data = getPipelines();
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
