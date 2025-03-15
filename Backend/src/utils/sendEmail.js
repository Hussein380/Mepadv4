/**
 * Simplified email function that just logs the email that would have been sent
 * This is a placeholder since we're removing email functionality
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (HTML)
 */
const sendEmail = async (options) => {
    // Log that we would have sent an email
    console.log(`[EMAIL PLACEHOLDER] Would have sent email to: ${options.email}`);
    console.log(`[EMAIL PLACEHOLDER] Subject: ${options.subject}`);
    console.log(`[EMAIL PLACEHOLDER] Message length: ${options.message.length} characters`);
    
    // Return a fake successful response
    return {
        messageId: `fake-message-id-${Date.now()}`
    };
};

module.exports = sendEmail;
