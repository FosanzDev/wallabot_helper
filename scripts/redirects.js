document.getElementById('profileLink').addEventListener('click', function (e) {
  e.preventDefault();
  chrome.tabs.update({url: e.target.href});
});

document.getElementById('loginLink').addEventListener('click', function (e) {
  e.preventDefault();
  chrome.tabs.update({url: e.target.href});
});