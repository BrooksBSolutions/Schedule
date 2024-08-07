(function () {
  "use strict";

  
  const express = require('express');
  const path = require('path');
  const app = express();
  
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tasks.html'));
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); // Assuming your files are in the 'public' folder

  // Call the initialize API first
  microsoftTeams.app.initialize().then(function () {
    microsoftTeams.app.getContext().then(function (context) {
      if (context?.app?.host?.name) {
        updateHubState(context.app.host.name);
      }
    });
  });

  function updateHubState(hubName) {
    if (hubName) {
      document.getElementById("hubState").innerHTML = "in " + hubName;
    }
  }
})();
