// Function to set the popup based on token detection status
function setPopup(tabId, hasToken, isWallapopUrl = false) {
  let popup;
  if (hasToken) {
    popup = 'templates/token_detected.html'; // When a Bearer token is detected
  } else if (!hasToken && isWallapopUrl) {
    popup = 'templates/notification.html'; // Default notification for wallapop without a detected token
  } else {
    popup = 'templates/notWallapop.html'; // When the user is not on a wallapop webpage
  }
  chrome.action.setPopup({ tabId, popup });
}

// Listener for outgoing web requests to detect the Authorization token
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const authHeader = details.requestHeaders.find(header => header.name === 'Authorization');
    const appVersionHeader = details.requestHeaders.find(header => header.name === 'X-AppVersion');

    if (authHeader && authHeader.value.startsWith('Bearer ')) {
      // Token detected, save its status and value
      chrome.storage.local.set({ tokenDetected: true, tokenValue: authHeader.value.split(' ')[1] }, () => {
        setPopup(details.tabId, true, true);
      });

      // Get all cookies for the current URL
      chrome.cookies.getAll({ url: details.url }, function (cookies) {
        const deviceIdCookie = cookies.find(cookie => cookie.name === 'device_id');
        const refreshTokenCookie = cookies.find(cookie => cookie.name === 'refreshToken');

        if (appVersionHeader) {
          chrome.storage.local.set({ appVersion: appVersionHeader.value });
        }

        if (deviceIdCookie) {
          // Device ID detected, save its status and value
          chrome.storage.local.set({ deviceIdDetected: true, deviceIdValue: deviceIdCookie.value });
        }

        if (refreshTokenCookie && refreshTokenCookie.value.match(/.*\..*\..*/)) {
          // Refresh token detected, save its status and value
          chrome.storage.local.set({ refreshTokenDetected: true, refreshTokenValue: refreshTokenCookie.value });
        }
      });
    }
  },
  { urls: ["*://*.wallapop.com/*"] },
  ["requestHeaders"]
);

// Listener for tab updates to manage the popup and reset the token
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading' && tab.url.includes('wallapop.com')) {
    chrome.storage.local.set({ tokenDetected: false, tokenValue: '' }); // Reset the token status and value
  }
  if (tab.url.includes('wallapop.com')) {
    chrome.storage.local.get('tokenDetected', function (data) {
      setPopup(tabId, data.tokenDetected, true);
    });
  } else {
    setPopup(tabId, false); // Set to notWallapop when the URL is not wallapop.com
  }
});

// Listener for tab activation to manage the popup
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url.includes('wallapop.com')) {
      chrome.storage.local.get('tokenDetected', function (data) {
        setPopup(tab.id, data.tokenDetected, true);
      });
    }
  });
});
