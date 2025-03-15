import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiCopy, BiShareAlt, BiCheck, BiLinkExternal, BiQr, BiDownload } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { generateQRCode, downloadQRCode } from '../../utils/qrCodeGenerator';

export default function InvitationLinks({ invitationLinks, onClose }) {
    const [copiedLinks, setCopiedLinks] = useState({});
    const [qrCodes, setQrCodes] = useState({});
    const [showQrCode, setShowQrCode] = useState(null);

    useEffect(() => {
        // Generate QR codes for all links when component mounts
        const generateAllQrCodes = async () => {
            const codes = {};
            for (const invitation of invitationLinks) {
                const link = invitation.link || invitation.invitationLink;
                if (link) {
                    try {
                        const qrCode = await generateQRCode(link);
                        codes[invitation.email] = qrCode;
                    } catch (error) {
                        console.error(`Error generating QR code for ${invitation.email}:`, error);
                    }
                }
            }
            setQrCodes(codes);
        };
        
        generateAllQrCodes();
    }, [invitationLinks]);

    const handleCopyLink = (link, email) => {
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopiedLinks({ ...copiedLinks, [email]: true });
                toast.success('Link copied to clipboard');
                
                // Reset copied status after 3 seconds
                setTimeout(() => {
                    setCopiedLinks(prev => ({ ...prev, [email]: false }));
                }, 3000);
            })
            .catch(err => {
                console.error('Failed to copy link:', err);
                toast.error('Failed to copy link');
            });
    };

    const handleShareLink = async (link, name) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Meeting Invitation',
                    text: `Join our meeting! Here's your invitation link for ${name}`,
                    url: link
                });
                toast.success('Link shared successfully');
            } catch (err) {
                console.error('Error sharing:', err);
                // User probably canceled the share
                if (err.name !== 'AbortError') {
                    toast.error('Failed to share link');
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            handleCopyLink(link, name);
            toast.success('Link copied! You can now paste it in your preferred messaging app');
        }
    };

    // Function to open the link directly
    const handleOpenLink = (link) => {
        window.open(link, '_blank');
    };

    // Function to toggle QR code display
    const toggleQrCode = (email) => {
        setShowQrCode(showQrCode === email ? null : email);
    };

    // Function to download QR code
    const handleDownloadQrCode = (email, name) => {
        if (qrCodes[email]) {
            downloadQRCode(qrCodes[email], `invitation-${name.replace(/\s+/g, '-').toLowerCase()}`);
            toast.success('QR code downloaded');
        } else {
            toast.error('QR code not available');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-blue-900/90 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                         border border-blue-700/50 max-w-2xl w-full mx-auto"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Invitation Links</h2>
                <p className="text-blue-200 mb-6">
                    Email invitations have been sent to all participants. The links below can also be shared manually if needed.
                </p>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {invitationLinks.map((invitation, index) => (
                        <div 
                            key={index}
                            className="p-4 bg-blue-800/50 rounded-lg border border-blue-700/50"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-white">{invitation.name}</span>
                                <span className="text-blue-300 text-sm">{invitation.email}</span>
                            </div>
                            
                            {showQrCode === invitation.email ? (
                                <div className="flex flex-col items-center gap-3 py-3">
                                    {qrCodes[invitation.email] ? (
                                        <>
                                            <img 
                                                src={qrCodes[invitation.email]} 
                                                alt={`QR code for ${invitation.name}`}
                                                className="w-48 h-48 bg-white p-2 rounded-lg"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownloadQrCode(invitation.email, invitation.name)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 
                                                              rounded text-white text-sm transition-colors"
                                                >
                                                    <BiDownload /> Download QR
                                                </button>
                                                <button
                                                    onClick={() => toggleQrCode(invitation.email)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 
                                                              rounded text-white text-sm transition-colors"
                                                >
                                                    Hide QR
                                                </button>
                                            </div>
                                            <p className="text-blue-300 text-sm text-center mt-1">
                                                Scan this QR code to open the invitation link
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-blue-300 py-4">Generating QR code...</div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text"
                                            value={invitation.link || invitation.invitationLink}
                                            readOnly
                                            className="flex-1 bg-blue-950/70 border border-blue-800 rounded px-3 py-2 
                                                    text-blue-200 text-sm truncate cursor-pointer"
                                            onClick={() => handleCopyLink(invitation.link || invitation.invitationLink, invitation.email)}
                                            title="Click to copy"
                                        />
                                        <button
                                            onClick={() => handleCopyLink(invitation.link || invitation.invitationLink, invitation.email)}
                                            className="p-2 bg-blue-700 hover:bg-blue-600 rounded text-white transition-colors"
                                            title="Copy link"
                                        >
                                            {copiedLinks[invitation.email] ? (
                                                <BiCheck className="text-lg" />
                                            ) : (
                                                <BiCopy className="text-lg" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleShareLink(invitation.link || invitation.invitationLink, invitation.name)}
                                            className="p-2 bg-green-700 hover:bg-green-600 rounded text-white transition-colors"
                                            title="Share link"
                                        >
                                            <BiShareAlt className="text-lg" />
                                        </button>
                                        <button
                                            onClick={() => toggleQrCode(invitation.email)}
                                            className="p-2 bg-purple-700 hover:bg-purple-600 rounded text-white transition-colors"
                                            title="Show QR code"
                                        >
                                            <BiQr className="text-lg" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleOpenLink(invitation.link || invitation.invitationLink)}
                                        className="text-blue-300 hover:text-blue-200 text-sm underline flex justify-center py-2 
                                                bg-blue-950/50 rounded-md hover:bg-blue-900/50 transition-colors"
                                    >
                                        Click to open invitation page
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
