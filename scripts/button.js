chrome.storage.local.get('tokenDetected', function (data) {
  if (data.tokenDetected) {
    document.getElementById('wallabotButton').textContent = 'Token detected, click here to redirect to the Wallabot app';

    chrome.storage.local.get('tokenValue', function (data) {
      if (data.tokenValue) {
        document.getElementById('wallabotButton').addEventListener('click', function () {
          chrome.tabs.create({ url: 'http://localhost:9090/?token=' + data.tokenValue });
        });

        // Add event listener for the copyTokenButton
        document.getElementById('copyTokenButton').addEventListener('click', function () {
          navigator.clipboard.writeText(data.tokenValue).then(function() {
            document.getElementById('copyTokenButton').textContent = 'Copied!';
          }, function(err) {
            document.getElementById('copyTokenButton').textContent = 'Error copying';
          });
        });
      }
    });
  }
});