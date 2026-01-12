// Web Info Collector - Content Script

function extractInfo() {
  const bodyText = document.body.innerText;
  const htmlContent = document.body.innerHTML;

  // Regex patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

  // Extraction
  const emails = [...new Set(bodyText.match(emailRegex) || [])];
  const phones = [...new Set(bodyText.match(phoneRegex) || [])];

  const socialMediaUrls = [
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'linkedin.com', 'youtube.com', 'tiktok.com', 'github.com',
    'pinterest.com', 'snapchat.com'
  ];

  const socialLinks = [];
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.href.toLowerCase();
    socialMediaUrls.forEach(social => {
      if (href.includes(social) && !socialLinks.includes(link.href)) {
        socialLinks.push(link.href);
      }
    });
  });

  return {
    emails,
    phones,
    socialLinks: [...new Set(socialLinks)]
  };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "collectData") {
    const data = extractInfo();
    sendResponse(data);
  }
  return true;
});
