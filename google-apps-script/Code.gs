const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1528021303339126918/7DvCoPr3zolzOTa-9us2ZhwZKHk3pQ74q8x_MjzBzF7Y-xUnEFZDPdS3atycV6zxPvO_';

const SHEET_NAMES = {
  application: 'Applications',
  popup: 'PopupSignups',
  newsletter: 'NewsletterSignups'
};

const SHEET_HEADERS = {
  application: ['Timestamp', 'Domain', 'Email', 'Name', 'Phone', 'Role', 'Why LionSpear', 'Accepted'],
  popup: ['Timestamp', 'Domain', 'Email', 'Name', 'Phone', 'Accepted'],
  newsletter: ['Timestamp', 'Domain', 'Email', 'Accepted']
};

function appendToSheet(endpoint, data) {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) return;

  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheetName = SHEET_NAMES[endpoint];
    const headers = SHEET_HEADERS[endpoint];
    if (!sheetName || !headers) return;

    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    }
    const row = headers.map(h => {
      switch (h) {
        case 'Timestamp': return data.timestamp || new Date().toISOString();
        case 'Domain': return data.domain || '';
        case 'Email': return data.email || '';
        case 'Name': return data.name || '';
        case 'Phone': return data.phone || '';
        case 'Role': return data.role || '';
        case 'Why LionSpear': return data.note || '';
        case 'Accepted': return data.accepted !== undefined ? String(data.accepted) : 'true';
        default: return '';
      }
    });
    sheet.appendRow(row);
  } catch (e) {
    console.error('Sheets append failed:', e.toString());
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const endpoint = e.parameter.endpoint || 'unknown';
    
    let embed;
    
    switch (endpoint) {
      case 'application':
        embed = createApplicationEmbed(data);
        break;
      case 'popup':
        embed = createPopupEmbed(data);
        break;
      case 'newsletter':
        embed = createNewsletterEmbed(data);
        break;
      default:
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unknown form type' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    sendToDiscord(embed);
    appendToSheet(endpoint, data);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
       
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createApplicationEmbed(data) {
  return {
    title: '🦁 New Crew Application',
    color: 0x4AA8C8,
    fields: [
      { name: 'Name', value: data.name || '—', inline: true },
      { name: 'Email', value: data.email || '—', inline: true },
      { name: 'Phone', value: data.phone || '—', inline: true },
      { name: 'Role', value: data.role || '—', inline: true },
      { name: 'Why LionSpear?', value: data.note || '(not provided)', inline: false }
    ],
    footer: { text: `LionSpear • ${new Date(data.timestamp).toLocaleString()}` },
    timestamp: data.timestamp
  };
}

function createPopupEmbed(data) {
  return {
    title: '🔔 Newsletter Signup (Popup)',
    color: 0x5DBDE3,
    fields: [
      { name: 'Name', value: data.name || '—', inline: true },
      { name: 'Email', value: data.email || '—', inline: true },
      { name: 'Phone', value: data.phone || '—', inline: true }
    ],
    footer: { text: `LionSpear • ${new Date(data.timestamp).toLocaleString()}` },
    timestamp: data.timestamp
  };
}

function createNewsletterEmbed(data) {
  return {
    title: '📧 Newsletter Signup (Footer)',
    color: 0x3A94B3,
    fields: [
      { name: 'Email', value: data.email || '—', inline: true }
    ],
    footer: { text: `LionSpear • ${new Date(data.timestamp).toLocaleString()}` },
    timestamp: data.timestamp
  };
}

function sendToDiscord(embed) {
  const payload = {
    embeds: [embed],
    username: 'LionSpear Bot'
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(DISCORD_WEBHOOK, options);
  
  if (response.getResponseCode() !== 200 && response.getResponseCode() !== 204) {
    throw new Error(`Discord webhook failed: ${response.getResponseCode()} ${response.getContentText()}`);
  }
}

function setup() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('DISCORD_WEBHOOK', DISCORD_WEBHOOK);
  props.setProperty('SHEET_ID', '1i6lQrxz94lWJC3-FDuw3IJKyjdrQEEjvUUXaf7H2aDk');
  console.log('Setup complete');
  return 'Setup complete';
}

function testWebhook() {
  sendToDiscord(createApplicationEmbed({
    name: 'Test User',
    email: 'test@lionspear.ae',
    phone: '+971 50 000 0000',
    role: 'spearfisher',
    note: 'Test application from setup',
    timestamp: new Date().toISOString()
  }));
  sendToDiscord(createPopupEmbed({
    name: 'Test User',
    email: 'test@lionspear.ae',
    phone: '+971 50 000 0000',
    timestamp: new Date().toISOString()
  }));
  sendToDiscord(createNewsletterEmbed({
    email: 'test@lionspear.ae',
    timestamp: new Date().toISOString()
  }));
  console.log('✅ Test messages sent to Discord');
  return 'Test messages sent to Discord';
}

function testApplication() {
  sendToDiscord(createApplicationEmbed({
    name: 'Test User',
    email: 'test@lionspear.ae',
    phone: '+971 50 000 0000',
    role: 'spearfisher',
    note: 'Test application from setup',
    timestamp: new Date().toISOString()
  }));
  return 'Test application sent';
}

function testPopup() {
  sendToDiscord(createPopupEmbed({
    name: 'Test User',
    email: 'test@lionspear.ae',
    phone: '+971 50 000 0000',
    timestamp: new Date().toISOString()
  }));
  return 'Test popup sent';
}

function testNewsletter() {
  sendToDiscord(createNewsletterEmbed({
    email: 'test@lionspear.ae',
    timestamp: new Date().toISOString()
  }));
  return 'Test newsletter sent';
}