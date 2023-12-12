document.addEventListener('DOMContentLoaded', function() {
    const addMappingForm = document.getElementById('addMappingForm');
    const errorMessage = document.getElementById('errorMessage');

    addMappingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newExt = document.getElementById('newExtension').value.trim();
        const newFolder = document.getElementById('newFolder').value.trim();

        // Reset the error message
        errorMessage.textContent = '';

        // Validate the input
        if (!newExt || !newFolder) {
            errorMessage.textContent = 'Please fill in both fields.';
            return;
        }

        // Save the new mapping
        chrome.storage.sync.get('folderMap', function(data) {
            data.folderMap = data.folderMap || {};

            // Check if the extension already exists in mappings
            if (data.folderMap.hasOwnProperty(newExt)) {
                errorMessage.textContent = 'File Extension already exists.';
                return;
            }

            // Add the new mapping
            data.folderMap[newExt] = newFolder;
            chrome.storage.sync.set({ 'folderMap': data.folderMap }, function() {
                // Clear the form
                addMappingForm.reset();
                showSuccessMessage();
            });
        });
    });

    function showSuccessMessage() {
        successMessage.textContent = 'Mapping added successfully!';
        successMessage.style.display = 'block';
        setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
    }
});
