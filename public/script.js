'use strict';
window.onload = function() {
   var
      output = document.getElementById('output'),
      result = document.getElementById('result'),
      start = document.getElementById('start-rec'),
      notesNode = $('#notes'),
      notes;
   var langList = {
      'английский': 'en',
      'болгарский': 'bg',
      'греческий': 'el',
      'грузинский': 'ka',
      'иврит': 'he',
      'итальянский': 'it',
      'испанский': 'es',
      'китайский': 'zh',
      'латынь': 'la',
      'македонский': 'mk',
      'монгольский': 'mn',
      'немецкий': 'de',
      'польский': 'pl',
      'финский': 'fi',
      'французский': 'fr'
   };

   //Класс для распознавания речи
   class Recognizer {
      constructor() {
         this.recognition = new webkitSpeechRecognition();
         this.recognition.lang = 'ru-ru';
         this.recognition.interimResults = false;
         this.recognition.maxAlternatives = 1;
         this.recognition.onspeechend = function() {
            this.stop();
         };
         this.recognition.onerror = function(event) {
            console.log('Ошибка распознования речи: ' + event.error);
         }
      }

      start() {
         this.recognition.start();
      }

      abort() {
         this.recognition.abort();
      }
   }

   //Создаем и воспроизводим синтезированную речь
   function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance)
   }

   start.onclick = startRec;

   //Включаем записаь
   function startRec() {
      notesNode.hide();
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
      var
         calc = new RegExp('\\d+.+\\d+'),
         translateInto = new RegExp('переведи на (.+)'),
         createNote = new RegExp('запиши'),
         delNote = new RegExp('удали заметку номер (\\d+)'),
         showNote = new RegExp('покажи заметки');
      text = text.toLowerCase();
      if(calc.test(text))
         calculate(text);
      if(translateInto.test(text) || text === 'переведи') {
         recognizer.abort();
         var lang = translateInto.test(text) ? translateInto.exec(text)[1] : 'английский';
         listenOneFrase(lang);
      }
      if(showNote.test(text)) {
         getNotes();
      }
      if(delNote.test(text)) {
         var num = delNote.exec(text);
         deleteNote();
      }
      if(createNote.test(text)) {
         listenNote();
      }
   }

   //Выисления калькулятора
   function calculate(str) {
      str = str.toLowerCase();
      var
         sum = ['+', 'плюс', 'прибавить'],
         diff = ['-', 'минус', 'вычесть'],
         mult = ['умножить на', 'x', '*'],
         div = ['разделить на', 'делить на', '/'],
         reg = new RegExp('(\\d+)(\\D+)(\\d+)'),
         parsed = reg.exec(str);
      if(sum.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = Number(parsed[1]) + Number(parsed[3]);
         speak(result.textContent);
         return;
      }
      if(diff.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] - parsed[3];
         speak(result.textContent);
         return;
      }
      if(mult.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] * parsed[3];
         speak(result.textContent);
         return;
      }
      if(div.indexOf(parsed[2].trim()) !== -1) {
         result.textContent = parsed[1] / parsed[3];
         speak(result.textContent);
      }
   }

   function listenOneFrase(lang) {
      if(langList[lang]) {
         lang = langList[lang];
         var oneFraseRecognizer = new Recognizer();
         oneFraseRecognizer.start();
         start.disabled = true;
         output.textContent = 'Что мне перевести?';

         oneFraseRecognizer.recognition.onresult = function(event) {
            var text = event.results[0][0].transcript;
            result.textContent = text;
            translate(text, lang);
         }
      } else {
         result.textContent = 'Данный язык не поддерживается';
         speak(result.textContent);
      }
   }

   function listenNote() {
      var noteRecognizer = new Recognizer();
      noteRecognizer.start();
      start.disabled = true;
      output.textContent = 'Записываю';

      noteRecognizer.recognition.onresult = function(event) {
         var text = event.results[0][0].transcript;
         result.textContent = text;
         setNote(text);
      }
   }

   function translate(str, lang) {
      var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170523T195620Z.4eb3dde0ae275bc1.9303391defa57384bf612ed20be2e5f49173c2e6';
      //TODO типа яндексом переведно, туда-сюда
      $.ajax({
            url: url,
            data: {
                text: str,
                lang: lang
            },
            success: function(translation) {
                start.disabled = false;
                result.textContent += ':  ' + translation.text[0];
                speak(result.textContent);
            }
        });
   }

   function getNotes() {
      var params = JSON.stringify({
         'action': 'get_notes'
      });
      $.ajax({
         url: '/api',
         type: 'post',
         contentType: 'application/json',
         data: params,
         success: function(data) {
            var txt = '';
            result.hidden = true;
            notes = JSON.parse(data);
            for(var note in notes) {
               txt += +note + 1 + ') ' + notes[note].text + '\n';
            }
            notesNode.text(txt);
            notesNode.show();
            speak('Вот заметки, которые я нашёл');
         }
      });
   }

   function setNote(noteText) {
      start.disabled = false;
      var params = JSON.stringify({
         'action': 'set_note',
         'note_text': noteText
      });
      $.ajax({
         url: '/api',
         type: 'post',
         contentType: 'application/json',
         data: params,
         success: function(data) {
            console.log(JSON.parse(data));
            speak('Запись создана');
         }
      });
   }

   // document.getElementById('weather').onclick = function() {
   //    var params = JSON.stringify({
   //       'action': 'get_weather'
   //    });
   //     $.ajax({
   //         url: '/api',
   //         type: 'post',
   //         contentType: 'application/json',
   //         data: params,
   //         success: function(data) {
   //            alert(data);
   //         }
   //     });
   // }
};
