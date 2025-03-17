function setFlash(res, type, message) {
    res.cookie('flashMonitor', JSON.stringify({ type, message }));
}

// Utility function to get flash message
function getFlash(req, res) {
    let flashData = null;
    
    if (req?.cookies?.flashMonitor) {
        try {
            flashData = JSON.parse(req.cookies.flashMonitor);
        } catch (error) {
            console.error('Error parsing flashMonitor cookie:', error);
        }
        
        res.clearCookie('flashMonitor'); // Remove the flash message after retrieving it
    }

    return flashData; // Returns { type: 'success' or 'error', message: 'Your message' }
}

module.exports = { setFlash, getFlash };
