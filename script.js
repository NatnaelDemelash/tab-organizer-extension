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
    const queryOptions = { currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    const tabUrls = tabs.map((tab) => tab.url);
    return tabUrls;
  };

  const tabUrls = await getCurrentTab();

  // Read exisitng collections or start with empty array
  const stored = localStorage.getItem('collections');
  const collections = stored ? JSON.parse(stored) : [];

  console.log(collections);
  // Create new collection object
  const newCollection = {
    name: collectionName,
    urls: tabUrls,
  };

  // Add the collection to the array
  collections.push(newCollection);

  // Save the uppdated array back to the localStorage

  localStorage.setItem('collections', JSON.stringify(collections));

  renderCollections();
});

function getCollections() {
  const stored = localStorage.getItem('collections');
  return stored ? JSON.parse(stored) : [];
}

function renderCollections() {
  const collectionsList = document.getElementById('collectionsList');
  collectionsList.innerHTML = ''; // Clear preveious content

  const collections = getCollections();

  collections.forEach((collection, index) => {
    // create container for each collections
    const collectionDiv = document.createElement('div');
    collectionDiv.classList.add('collection');

    // collection name
    const name = document.createElement('p');
    name.textContent = collection.name;

    // Open Tabs button
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Tabs';

    openBtn.addEventListener('click', () => {
      // TODO:
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {});

    // Append name and buttons to collection container
    collectionDiv.appendChild(name);
    collectionDiv.appendChild(openBtn);
    collectionDiv.appendChild(deleteBtn);

    // Append collection container to the collection list
    collectionsList.appendChild(collectionDiv);
  });
}

document.addEventListener('DOMContentLoaded', renderCollections);
