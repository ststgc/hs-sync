function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Magic Buttons');
  menu.addItem('Write Contacts', 'writeContacts');
  menu.addItem('Write Companies', 'writeCompanies');
  menu.addItem('Write Deals', 'writeDeals');
  menu.addItem('Write Engagements', 'writeEngagements');
  menu.addSeparator();
  menu.addItem('Write Pipelines', 'writePipelines');
  menu.addToUi();
}