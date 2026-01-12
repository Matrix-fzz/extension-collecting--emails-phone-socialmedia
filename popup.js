document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const emailList = document.getElementById('emailList');
  const phoneList = document.getElementById('phoneList');
  const socialList = document.getElementById('socialList');

  scanBtn.addEventListener('click', async () => {
    scanBtn.textContent = 'Scanning...';
    scanBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(tab.id, { action: "collectData" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          renderEmpty();
        } else if (response) {
          renderResults(response);
        }
        scanBtn.textContent = 'Scan Page';
        scanBtn.disabled = false;
      });
    } catch (error) {
      console.error(error);
      scanBtn.textContent = 'Scan Page';
      scanBtn.disabled = false;
    }
  });

  function renderResults(data) {
    updateList(emailList, data.emails);
    updateList(phoneList, data.phones);
    updateList(socialList, data.socialLinks, true);
  }

  function renderEmpty() {
    [emailList, phoneList, socialList].forEach(list => {
      list.innerHTML = '<div class="empty-state">Unable to scan this page</div>';
    });
  }

  function updateList(container, items, isLink = false) {
    if (!items || items.length === 0) {
      container.innerHTML = '<div class="empty-state">None found</div>';
      return;
    }

    container.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      
      const text = document.createElement('span');
      text.textContent = isLink ? new URL(item).hostname.replace('www.', '') : item;
      text.title = item;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '📋';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(item);
        copyBtn.innerHTML = '✅';
        setTimeout(() => copyBtn.innerHTML = '📋', 1500);
      };

      div.appendChild(text);
      div.appendChild(copyBtn);
      container.appendChild(div);
    });
  }
});
