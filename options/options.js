document.addEventListener('DOMContentLoaded', function() {
    const addMappingForm = document.getElementById('addMappingForm');
    const mappingsContainer = document.getElementById('mappingsContainer');
    const howToButton = document.getElementById('howToButton');
    const howToContent = document.getElementById('howToContent');


    function loadMappings() {
        chrome.storage.sync.get('folderMap', function(data) {
            mappingsContainer.innerHTML = '';
            Object.keys(data.folderMap || {}).forEach(ext => {
                const row = document.createElement('tr');

                const extCell = document.createElement('td');
                extCell.textContent = ext;

                const folderCell = document.createElement('td');
                folderCell.textContent = data.folderMap[ext];

                const actionCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = function() {
                    delete data.folderMap[ext];
                    chrome.storage.sync.set({ 'folderMap': data.folderMap }, function() {
                        loadMappings();
                    });
                };
                actionCell.appendChild(removeButton);

                row.appendChild(extCell);
                row.appendChild(folderCell);
                row.appendChild(actionCell);

                mappingsContainer.appendChild(row);
            });
        });
    }

    howToButton.addEventListener('click', function() {
        howToContent.style.display = howToContent.style.display === 'block' ? 'none' : 'block';
    });

    addMappingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newExt = document.getElementById('newExtension').value.trim();
        const newFolder = document.getElementById('newFolder').value.trim();
        if (newExt && newFolder) {
            chrome.storage.sync.get('folderMap', function(data) {
                data.folderMap = data.folderMap || {};
                data.folderMap[newExt] = newFolder;
                chrome.storage.sync.set({ 'folderMap': data.folderMap }, function() {
                    loadMappings();
                    addMappingForm.reset();
                    clearErrorMessage(); // Clear any previous error messages
                });
            });
        } else {
            displayErrorMessage('Both fields are required.');
        }
    });

    // Function to display error message
    function displayErrorMessage(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block'; // Show the error message
    }

    // Function to clear error message
    function clearErrorMessage() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'none';
    }

    loadMappings();
});
