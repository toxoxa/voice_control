'use strict';
window.onload = function() {
   var
      output = document.getElementById('output'),
      result = document.getElementById('result'),
      start = document.getElementById('start-rec');

   //Класс для распознавания речи
   class Recognizer {
      constructor() {
         this.recognition = new webkitSpeechRecognition();
         this.recognition.lang = 'ru-ru';
         this.recognition.interimResults = false;
         this.recognition.maxAlternatives = 1;
         this.recognition.onspeechend = function() {
            this.stop();
         }
         this.recognition.onerror = function(err) {
            console.log("Ошибка распознования речи" + err);
         }
      }

      start() {
         this.recognition.start();
      }

      abort() {
         this.recognition.abort();
      }
   }

   start.onclick = startRec;

   //Включаем записаь
   function startRec() {
      //Создаем экземпляр webkitSpeechRecognition, который будем использовать для распознавания речи
      var recognizer = new Recognizer();
      recognizer.start();
      recognizer.recognition.onresult = function(event) {
         var text = event.results[0][0].transcript;
         output.textContent = text;
         chooseOperation(text, recognizer);
      }
   }

   //Выбор команды
   function chooseOperation(text, recognizer) {
      var calc = new RegExp('\\d+.+\\d+')
       if(calc.test(text))
          calculate(text);
       if(text.toLowerCase() == 'переведи') {
         recognizer.abort();
         listenOneFrase();
      }
   }

   //Выисления калькулятора
   function calculate(str) {
      str = str.toLowerCase();
      var
         sum = ["+", "плюс", "прибавить"],
         diff = ["-", "минус", "вычесть"],
         mult = ["умножить на", "x", "*"],
         div = ["разделить на", "делить на", "/"],
         reg = new RegExp('(\\d+)(\\D+)(\\d+)'),
         parsed = reg.exec(str);
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

   function listenOneFrase() {
      var oneFraseRecognizer = new Recognizer();
      oneFraseRecognizer.start();
      start.disabled = true;
      output.textContent = 'Что мне перевести?';

      oneFraseRecognizer.recognition.onresult = function(event) {
         var text = event.results[0][0].transcript;
         result.textContent = text;
         translate(text);
      }
   }

   function translate(str) {
      var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170523T195620Z.4eb3dde0ae275bc1.9303391defa57384bf612ed20be2e5f49173c2e6';
      //TODO типа яндексом переведно, туда-сюда
      $.ajax({
            url: url,
            data: {
                text: str,
                lang: 'en'
            },
            success: function(translation) {
                start.disabled = false;
                result.textContent += ':  ' + translation.text[0];
            }
        });
   }
}
