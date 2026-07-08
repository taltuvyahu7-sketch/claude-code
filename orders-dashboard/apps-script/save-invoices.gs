/**
 * INN7 — שמירה אוטומטית של חשבוניות שילוח מהמייל לתיקיית Google Drive.
 *
 * מה זה עושה: כל שעה, מאתר מיילים עם קבצים מצורפים מהשולחים ברשימה
 * (חשבוניות DHL/FedEx), ושומר את הקבצים (PDF/CSV/XLS/ZIP) לתיקייה
 * "DHL Invoices" בדרייב. משם הדשבורד קולט אותם ברענון האוטומטי.
 *
 * התקנה (פעם אחת):
 *   1. היכנסו אל script.google.com עם חשבון tal.t@inn7-fashion.com
 *   2. New project → הדביקו את הקובץ הזה → שמרו (Ctrl+S)
 *   3. בסרגל למעלה בחרו את הפונקציה setup → לחצו Run
 *   4. אשרו את ההרשאות (Gmail + Drive) בחלון שנפתח
 * זהו — הסקריפט מייבא אחורה 90 יום ומתזמן את עצמו לרוץ כל שעה.
 */

const FOLDER_NAME = 'DHL Invoices';
const SENDERS = [
  'il.query@dhl.com',      // חשבוניות DHL Express ישראל
  'no_reply@fedex.com',    // ניירת FedEx
];
const LOOKBACK_DAYS = 90;
const FILE_TYPES = /\.(pdf|csv|xls|xlsx|zip)$/i;

/** הרצה חד-פעמית: יוצרת טריגר שעתי ומייבאת אחורה. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('saveInvoiceAttachments').timeBased().everyHours(1).create();
  saveInvoiceAttachments();
}

function saveInvoiceAttachments() {
  const folder = getOrCreateFolder(FOLDER_NAME);
  const done = PropertiesService.getScriptProperties();
  SENDERS.forEach(sender => {
    const threads = GmailApp.search(
      'from:' + sender + ' has:attachment newer_than:' + LOOKBACK_DAYS + 'd');
    threads.forEach(thread => thread.getMessages().forEach(msg => {
      if (done.getProperty(msg.getId())) return;
      msg.getAttachments({ includeInlineImages: false, includeAttachments: true })
        .forEach(att => {
          const name = att.getName();
          if (!FILE_TYPES.test(name)) return;
          if (folder.getFilesByName(name).hasNext()) return; // כבר נשמר
          folder.createFile(att.copyBlob().setName(name));
        });
      done.setProperty(msg.getId(), '1');
    }));
  });
}

function getOrCreateFolder(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
