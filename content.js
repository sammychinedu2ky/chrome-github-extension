const titleFormat = /^DEV-\d+\*? - .+$/;
function validatePR(username) {
    let allText = document.body.innerText;

    // CHECK FOR MERGE CONFLICTS
    const observer = new MutationObserver((mutations) => {
        // Loop through all mutations
        mutations.forEach((mutation) => {
            const allText = document.body.textContent;
            if (allText.includes("Conflicting files") && !window.location.href.includes(content.js)) {
                alert("There are conflicting files in the PR. Please resolve them before merging.");
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    document.addEventListener("click", (event) => {
        // Check if the clicked element is a button and contains the text "Create Pull Request"

        const clickedElement = event.target;
        const buttonElement = clickedElement.closest("button");

        // VALIDATE PR TITLE
        if (clickedElement.textContent.includes("Create pull request") && buttonElement?.type === "submit") {

            const pullRequestTitle = document.querySelector("#pull_request_title")?.value; // Adjust the selector as needed

            if (!titleFormat.test(pullRequestTitle)) {
                alert('The Pull Request title must follow this format:\nDEV-<JIRA-ID> - <Title>\nPlease fix the title.');

                event.preventDefault();
            }
        }

        // VALIDATE PR TITLE AND DELETE SQUASH AND MERGE MESSAGE
        if (clickedElement.textContent.includes("Squash and merge") || clickedElement.textContent.includes("Merge pull request") && buttonElement?.type === "button") {
            let errors = [];
            let PRTitlePath = document.querySelector('#partial-discussion-header > div.gh-header-show > div > h1 > bdi').innerText;
            if (allText.includes(`${username} wants to merge`)) {
                if (!titleFormat.test(PRTitlePath)) {
                    errors.push("PR title is not in the correct format\n Correct format: DEV-<JIRA-ID> - <Title>");
                }

                if (clickedElement.textContent.includes("Squash and merge") && buttonElement?.type === "button") {
                    let mergeMessageField = document.querySelector('#merge_message_field');
                    mergeMessageField.focus();

                    document.execCommand('selectAll');

                    document.execCommand('delete');
                }
                if (errors.length > 0) {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    alert(errors.join("\n"));
                }
            }
        }
    })
}



(async () => {
    try {
        const { githubUsername: username } = await chrome.runtime.sendMessage({ action: "getUsername" })


        if (username) {
            console.log("Username received:", username);
            validatePR(username);
        } else {
            if (!username) {
                alert("Please set your username in the extension popup");
            } else {
                console.error("Failed to fetch username => ", username);
            }
        }

    } catch (error) {
        console.error("Error fetching username:", error);
    }

})();
