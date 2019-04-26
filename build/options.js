function loadOptions() {
    chrome.storage.sync.get('quickDelay', (quickDelayDays) => {
        document.getElementById('quick-delay').value = quickDelayDays.quickDelay ? quickDelayDays.quickDelay : [1,3,7];
    });
}

function saveOptions() {
    const quickDelay = document.getElementById('quick-delay').value;
    chrome.storage.sync.set({quickDelay}, () => savedOptionsFeedback());
}

function savedOptionsFeedback() {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    const save = document.getElementById('save');
    save.style.visibility = 'hidden';
}

document.addEventListener('DOMContentLoaded', loadOptions());
document.getElementById('save').addEventListener('click', saveOptions);
