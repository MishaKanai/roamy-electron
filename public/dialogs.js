const path = require("path");
const fs = require('fs');
const { app, dialog } = require("electron");
const { push } = require('connected-react-router')
module.exports={ showOpenDialog }
  function showOpenDialog(browserWindow, store, fileStore) {
      dialog.showOpenDialog(browserWindow, {
        defaultPath: app.getPath('downloads'),
        // properties: ['openDirectory'],
        filters: [
            { name: 'JSON Files', extensions: ['json']}
        ]
      }).then(({ canceled, filePaths }) => {
          if (canceled || !filePaths) {
              return;
          }
          const [filePath] = filePaths;
        const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8'})
          console.log(fileContents)
          fileStore.set('currentFile', filePath)
          store.dispatch(push('/'))
          store.dispatch({
            type: 'LOAD_DIR',
            payload: {
              dir: filePath,
              fileContents: fileContents ? JSON.parse(fileContents) : {}
            }
          })
      })
  }