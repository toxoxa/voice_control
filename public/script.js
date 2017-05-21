window.onload = function() {
   var output = document.getElementById('output');

   document.getElementById('close').onclick = function() {
      window.close();
   }

   function readpls() {
      var recognition = new webkitSpeechRecognition();
      recognition.lang = 'ru-ru';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.start();
      console.log('Ready to receive a command.');
      recognition.onspeechend = function() {
         recognition.stop();
      }
      recognition.onend = function() {
         recognition.start();
      }
      recognition.onresult = function(event) {
         var text = event.results[0][0].transcript;
         console.log(text);
         output.textContent = text;
      }
      recognition.onerror = function(err) {
         //debugger;
      }
   }

   document.getElementById('start-rec').onclick = readpls;
}
