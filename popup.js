document.addEventListener('DOMContentLoaded', async () => {
    const inputField = document.getElementById('github-username');
    const saveButton = document.getElementById('save');

    // Load the saved username and set it as the placeholder
    chrome.storage.sync.get(['githubUsername'], (result) => {
        if (result.githubUsername) {
            inputField.placeholder = result.githubUsername;
        }
    });

    // Save the username when the Save button is clicked
    saveButton.addEventListener('click', () => {
        const username = inputField.value.trim();

        if (username) {
            chrome.storage.sync.set({ githubUsername: username }, () => {
                console.log('Username saved:', username);
                // Optionally provide user feedback
                alert('Username saved successfully!');
            });
        } else {
            alert('Please enter a valid username!');
        }
    });
});
