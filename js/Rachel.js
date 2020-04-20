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
               "end": end + range.end.length
             };
      }
    }

   return res;
  }


/* Правило-линия.
   Описывает фрагмент из заданных символов.

   Пример:
    Входная строка: 12221348.
    Массив символов: ["1", "2"].
    Описываемый фрагмент: 12221.

   Структура:
    type - тип правила, обязателен для всех правил.
    list - массив с символами
    name - метка для найденного фрагмента.
*/

/* В данном случае, описан синтаксис комментария.
*/
 var rule_line = { "type": "line",
                   "list": [" ", "\n", "\r", "\r\n", "\t"],
                   "name": "whitespace"
                 };


/* Находит первое вхождение фрагмента из заданных символов.

   Возвращает объект со следующими данными:
    type - тип найденного фрагмента.
    start - индекс первого символа из найденного фрагмента.
    end - индекс последнего символа из найденного фрагмента.

   Если фрагмент не найден - возвращает false.
*/
 function get_line(input, line)
  {
   var start;
   var end;
   var res = false;

   for (var i = 0; i < line.list.length; i++)
    {
     var tmp = input.indexOf(line.list[i]);

     if (tmp !== -1)
      {
       if ((start > tmp) || (typeof start == "undefined"))
        {
         start = tmp;
        }
      }
    }
   i = undefined;

   if (typeof start !== "undefined")
    {
     end = start;

     while (line.list.indexOf(input[end + 1]) !== -1)
      {
       end++;
      }

     res = { "type": line.name,
             "start": start,
             "end": end
           };
    }

   return res;
  }

