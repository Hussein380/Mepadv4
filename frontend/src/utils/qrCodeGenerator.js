/**
 * Utility functions for generating QR codes from invitation links
 */

/**
 * Generates a QR code data URL for a given link
 * @param {string} link - The URL to encode in the QR code
 * @returns {Promise<string>} - A data URL containing the QR code
 */
export const generateQRCode = async (link) => {
    try {
        // Dynamically import QRCode.js to reduce initial bundle size
        const QRCode = (await import('qrcode')).default;
        
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(link, {
            width: 200,
            margin: 2,
            color: {
                dark: '#0f172a', // Navy blue
                light: '#ffffff' // White
            }
        });
        
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
};

/**
 * Downloads a QR code as an image
 * @param {string} dataUrl - The QR code data URL
 * @param {string} fileName - The name for the downloaded file
 */
export const downloadQRCode = (dataUrl, fileName = 'invitation-qr-code') => {
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
