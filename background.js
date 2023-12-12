let folderMap = {
    'pdf': 'PDFs/',
    'exe': 'Installers/',
    'jpg': 'Images/',
    'png': 'Images/',
    'docx': 'Documents/',
    'xlsx': 'Documents/',
    'zip': 'ZIP/',
    // Initial default mappings; these can be updated dynamically
};

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    try {
        const fileExtension = downloadItem.filename.split('.').pop().toLowerCase();
        
        if (folderMap[fileExtension]) {
            const newFilename = folderMap[fileExtension] + downloadItem.filename;
            suggest({filename: newFilename});
        }
    } catch (error) {
        console.error('Error in redirecting download:', error);
        suggest({filename: 'Other/' + item.filename});
    }
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
    if (downloadDelta.error) {
        console.error('Download error:', downloadDelta.error.current);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'updateFolderMap' && request.newFolderMap) {
        // Update the folderMap with the new mappings provided in the request
        folderMap = request.newFolderMap;
        sendResponse({status: 'Folder map updated successfully'});
    }
    
});



