var express = require('express');
const server = express();
const serverPort = 3000;
// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
//
// var mainWindow = null;
//
// app.on('window-all-closed', function() {
//    if (process.platform != 'darwin') {
//       app.quit();
//    }
// });
// app.on('ready', function() {
//    mainWindow = new BrowserWindow({
//       width: 800,
//       height: 600,
//       //frame: false,
//       resizable: false
//    });
//
//    mainWindow.loadURL('http://localhost:' + serverPort);
//
//   // Открываем DevTools.
//   //mainWindow.webContents.openDevTools();
//
//    mainWindow.on('closed', function() {
//       mainWindow = null;
//    });
// });
server.use(express.static('public'));
server.get('/*', function(reg, res){
   //res.sendFile(__dirname + '/index.html');
   //res.sendFile(__dirname + '/script.js');
})
server.listen(serverPort, function(){
   console.log('Server start')
})
