/* JS-coding by Artyom Vlasov (thegreycardinal@gmail.com). */

/* Правило-диапазон.
   Описывает фрагмент от начальной до конечной подстроки, включительно.

   Пример:
    Входная строка: 123210.
    Начальная подстрока: 2.
    Конечная подстрока: 1.
    Описываемый фрагмент: 2321.

   Структура:
    type - тип правила, обязателен для всех правил.
    start - начало диапазона.
    end - конец диапазона.
    name - метка для найденного фрагмента.
*/

/* В данном случае, описан синтаксис комментария.
*/
 var rule_range = { "type": "range",
                    "start": "/*",
                    "end": "*/",
                    "name": "comment"
                  };


/* Находит первое вхождение диапазона range в строку input.

   Возвращает объект со следующими данными:
    type - тип найденного фрагмента.
    start - индекс первого символа из найденного фрагмента.
    end - индекс последнего символа из найденного фрагмента.

   Если фрагмент не найден - возвращает false.
*/
 function get_range(input, range)
  {
   var start;
   var end;
   var res = false;

   start = input.indexOf(range.start);

   if (start !== -1)
    {
     end = input.indexOf(range.end, start);

     if (end !== -1)
      {
       res = { "type": range.name,
               "start": start,
               "end": end + range.end.length,
             };
      }
    }

   return res;
  }

