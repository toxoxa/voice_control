window.onload = function() {
   var
      output = document.getElementById('output'),
      result = document.getElementById('result');

   document.getElementById('close').onclick = function() {
      window.close();
   }

   document.getElementById('start-rec').onclick = readpls;

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
         //recognition.start();
      }
      recognition.onresult = function(event) {
         var text = event.results[0][0].transcript;
         console.log(text);
         output.textContent = text;
         choosceOperation(text);
      }
      recognition.onerror = function(err) {
         //debugger;
      }
   }

   function choosceOperation(text) {
      var calc = new RegExp('\\d+.+\\d+')
       if(calc.test(text))
          calculate(text);
   }

   function calculate(str) {
      str = str.toLowerCase();
      var
         sum = ["+", "плюс", "прибавить"],
         diff = ["-", "минус", "вычесть"],
         mult = ["умножить на", "x", "*"],
         div = ["разделить на", "делить на", "/"],
         reg = new RegExp('(\\d+)(\\D+)(\\d+)');
         parsed = reg.exec(str);
         debugger;
      if(sum.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = Number(parsed[1]) + Number(parsed[3]);
         return;
      }
      if(diff.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] - parsed[3];
         return;
      }
      if(mult.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] * parsed[3];
         return;
      }
      if(div.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] / parsed[3];
         return;
      }
   }
}
