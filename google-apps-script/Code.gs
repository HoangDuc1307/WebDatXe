function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('NOTIFICATION_SECRET');
    const adminEmail = properties.getProperty('ADMIN_EMAIL');

    if (!expectedSecret || data.secret !== expectedSecret) {
      return jsonResponse({ success: false, message: 'Secret không hợp lệ' });
    }

    if (!adminEmail) {
      return jsonResponse({ success: false, message: 'Chưa cấu hình ADMIN_EMAIL' });
    }

    MailApp.sendEmail({
      to: adminEmail,
      subject: data.subject,
      body: data.text,
      name: 'Xe khách Như Khánh',
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
