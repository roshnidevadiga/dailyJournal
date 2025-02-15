/**
 * Google Apps Script code for handling journal entries
 */

function createResponse(content) {
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles all HTTP requests
 * @param {Object} e - The event object from Google Apps Script
 * @return {TextOutput} The response with appropriate CORS headers
 */
function doPost(e) {
  // Handle OPTIONS method for CORS preflight
  if (e.postData === undefined) {
    return createResponse({ status: 'success' });
  }

  try {
    // Accept any content type as long as we can parse the JSON

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.date || !data.content) {
      throw new Error('Missing required fields: date and content');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Format the date to IST
    const date = new Date(data.date);
    const formattedDate = Utilities.formatDate(date, 'Asia/Kolkata', 'MMMM dd, yyyy HH:mm:ss');
    
    // Append the entry to the sheet
    sheet.appendRow([formattedDate, data.content]);
    
    // Return success response
    return createResponse({
      status: 'success',
      message: 'Entry saved successfully'
    });
  } catch (error) {
    // Return error response
    return createResponse({
      status: 'error',
      message: error.message || 'Failed to process request'
    });
  }
}

/**
 * Handles GET requests
 * @param {Object} e - The event object from Google Apps Script
 * @return {TextOutput} The response with appropriate CORS headers
 */
function doGet(e) {
  return createResponse({
    status: 'success',
    message: 'Service is running'
  });
}

/**
 * Handles OPTIONS requests (CORS preflight)
 * @param {Object} e - The event object from Google Apps Script
 * @return {TextOutput} The response with appropriate CORS headers
 */
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success'
  })).setMimeType(ContentService.MimeType.JSON);
}
