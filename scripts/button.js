chrome.storage.local.get('tokenDetected', function (data) {
  if (data.tokenDetected) {

    chrome.storage.local.get(['tokenValue', 'deviceIdValue', 'refreshTokenValue', 'appVersion'], function (data) {
      if (data.tokenValue) {
        sessionInfo = {
          token: data.tokenValue,
          deviceId: data.deviceIdValue,
          refreshToken: data.refreshTokenValue,
          appVersion: data.appVersion
        }

        document.getElementById('wallabotButton').addEventListener('click', function () {
          url = 'http://localhost:9090/?session=' + JSON.stringify(sessionInfo);
          chrome.tabs.create({ url: url });
        });

        // Add event listener for the copySessionButton
        document.getElementById('copySessionButton').addEventListener('click', function () {
          navigator.clipboard.writeText(
            JSON.stringify(sessionInfo)
          ).then(function () {
            document.getElementById('copySessionButton').textContent = 'Session copied!';
          }, function (err) {
            document.getElementById('copySessionButton').textContent = 'Error copying';
          });
        });
      }
    });
  }
});