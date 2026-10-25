/**
 * Google Apps Script для RSVP Қанағат & Мөлдір.
 * 1) Создайте Google Таблицу.
 * 2) Extensions → Apps Script.
 * 3) Вставьте этот код и сохраните.
 * 4) Deploy → New deployment → Web app.
 * 5) Execute as: Me. Who has access: Anyone.
 * 6) Скопируйте Web app URL в script.js в переменную sheetEndpoint.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Уақыт', 'Аты', 'Жауабы', 'Қонақ саны']);
  }
  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    new Date(data.timestamp || new Date()),
    data.guestName || 'Қонақ',
    data.answer || '',
    data.guestCount || '1 қонақ'
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
