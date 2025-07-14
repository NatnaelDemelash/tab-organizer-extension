const saveCurrentTabs = document.getElementById('saveTabsBtn');

saveCurrentTabs.addEventListener('click', async () => {
  const collectionName = document.getElementById('collectionName').value.trim();
  const errorMessage = document.getElementById('errMsg');
  errorMessage.textContent = '';

  if (!collectionName) {
    errorMessage.textContent = 'Please provide a collection name';
    return;
  }

  // Load saved collections once
  const stored = localStorage.getItem('collections');
  const collections = stored ? JSON.parse(stored) : [];

  // Check for duplicates (case-insensitive)
  const duplicate = collections.find(
    (collection) =>
      collection.name.toLowerCase() === collectionName.toLowerCase()
  );
  if (duplicate) {
    errorMessage.textContent = 'Collection name already exists';
    return;
  }

  // Get tabs
  const queryOptions = { currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  const tabUrls = tabs.map((tab) => tab.url);

  // Create and save collection
  const newCollection = { name: collectionName, urls: tabUrls };
  collections.push(newCollection);
  localStorage.setItem('collections', JSON.stringify(collections));

  renderCollections();
});

function getCollections() {
  const stored = localStorage.getItem('collections');
  return stored ? JSON.parse(stored) : [];
}

function renderCollections() {
  const collectionsList = document.getElementById('collectionsList');
  collectionsList.innerHTML = ''; // Clear previous content

  const collections = getCollections();

  collections.forEach((collection, index) => {
    // Container for each collection
    const collectionDiv = document.createElement('div');
    collectionDiv.classList.add('collection');

    // Collection name
    const name = document.createElement('p');
    name.textContent = collection.name;

    // Buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('collection-buttons');

    // Open Tabs button
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Tabs';

    openBtn.addEventListener('click', () => {
      // Prevent multiple confirmation boxes
      if (collectionDiv.querySelector('.confirm-box')) return;

      // Create confirmation box
      const confirmationBox = document.createElement('div');
      confirmationBox.classList.add('confirm-box');
      confirmationBox.innerHTML = `
        <span>❓ Open ${collection.urls.length} tabs from "${collection.name}"?</span>
      `;

      // Yes button
      const yesBtn = document.createElement('button');
      yesBtn.textContent = 'Yes, open tabs';
      yesBtn.classList.add('confirm-yes');

      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.classList.add('confirm-cancel');

      // Append buttons to confirmation box
      confirmationBox.appendChild(yesBtn);
      confirmationBox.appendChild(cancelBtn);

      // Append confirmation box under the buttons inside collection container
      collectionDiv.appendChild(confirmationBox);

      // Yes button action
      yesBtn.addEventListener('click', () => {
        collection.urls.forEach((url) => {
          chrome.tabs.create({ url });
        });
        confirmationBox.remove();
      });

      // Cancel button action
      cancelBtn.addEventListener('click', () => {
        confirmationBox.remove();
      });
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {
      // Remove from collections array and update localStorage
      const collections = getCollections();
      collections.splice(index, 1); // Remove this collection
      localStorage.setItem('collections', JSON.stringify(collections));
      renderCollections();
    });

    // Append buttons to buttons container
    buttonsDiv.appendChild(openBtn);
    buttonsDiv.appendChild(deleteBtn);

    // Append name and buttons container to collection div
    collectionDiv.appendChild(name);
    collectionDiv.appendChild(buttonsDiv);

    // Append collection div to main list
    collectionsList.appendChild(collectionDiv);
  });
}

// Initial render on page load
document.addEventListener('DOMContentLoaded', renderCollections);
