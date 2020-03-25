// Script Properties
let scriptProperties = PropertiesService.getScriptProperties();
const HUBSPOT_API_KEY = scriptProperties.getProperty("HUBSPOT_API_KEY");
const HUBSPOT_PARTNER_LIST_ID = scriptProperties.getProperty("HUBSPOT_PARTNER_LIST_ID");

// Slack Webhooks
const SLACK_WEBHOOK_OFFERSHS = scriptProperties.getProperty("SLACK_WEBHOOK_OFFERSHS");
const SLACK_WEBHOOK_STSTGC = scriptProperties.getProperty("SLACK_WEBHOOK_STSTGC");
const SLACK_NOTIFY_SHEET_URL = scriptProperties.getProperty("SLACK_NOTIFY_SHEET_URL");
