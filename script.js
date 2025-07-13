const saveCurrentTabs = document.getElementById('saveTabsBtn');

saveCurrentTabs.addEventListener('click', async () => {
  const collectionName = document.getElementById('collectionName').value.trim();
  const errorMessage = document.getElementById('errMsg');

  // Clear previous error
  errorMessage.textContent = '';

  if (!collectionName) {
    errorMessage.textContent = 'Please provide a collection name';
    return;
  }

  // Async function to get active tab
  const getCurrentTab = async () => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  const currentTab = await getCurrentTab();
  console.log(currentTab);
});
