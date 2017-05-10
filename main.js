const electron = require('electron');
const app = electron.app;  // Модуль контролирующей жизненный цикл нашего приложения.
const BrowserWindow = electron.BrowserWindow;  // Модуль создающий браузерное окно.

// Определение глобальной ссылки , если мы не определим, окно
// окно будет закрыто автоматически когда JavaScript объект будет очищен сборщиком мусора.
var mainWindow = null;

// Проверяем что все окна закрыты и закрываем приложение.
app.on('window-all-closed', function() {
   // В OS X обычное поведение приложений и их menu bar
   //  оставаться активными до тех пор пока пользователь закроет их явно комбинацией клавиш Cmd + Q
   if (process.platform != 'darwin') {
      app.quit();
   }
});

// Этот метод будет вызван когда Electron закончит инициализацию
// и будет готов к созданию браузерных окон.
app.on('ready', function() {
   // Создаем окно браузера.
   mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      resizable: false
   });

   // и загружаем файл index.html нашего веб приложения.
   mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Открываем DevTools.
  //mainWindow.webContents.openDevTools();

  // Этот метод будет выполнен когда генерируется событие закрытия окна.
   mainWindow.on('closed', function() {
   // Удаляем ссылку на окно, если ваше приложение будет поддерживать несколько
        // окон вы будете хранить их в массиве, это время
        // когда нужно удалить соответствующий элемент.
      mainWindow = null;
   });
});
