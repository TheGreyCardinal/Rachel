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


/* Вставляет найденный токен в дерево.

   tree - массив объектов.
   old_token - индекс старого токена.
   insert_token - вставляемый токен. Разбивает старый на части.

   Изменяет дерево, ничего не возвращает.
*/
 function insert_token(tree, old_token, insert_token)
  {
   var old_start = tree[old_token].start;
   var old_end = tree[old_token].end;
   var res = [];

   if ((old_start > insert_token.start)
       || (old_end < insert_token.end)
      )
    {
     return false;
    }

   if ((old_start == insert_token.start)
        && (old_end == insert_token.end))
    {
     res.push({ "type": insert_token.type,
                "start": old_start,
                "end": old_end
              })
    }
  else if (old_start == insert_token.start)
    {
     res.push({ "type": insert_token.type,
                "start": insert_token.start,
                "end": insert_token.end
              });

     res.push({ "type": tree[old_token].type,
                "start": insert_token.end + 1,
                "end": old_end
              });
    }
   else if (old_end == insert_token.end)
    {
     res.push({ "type": tree[old_token].type,
                "start": old_start,
                "end": insert_token.start - 1
              });

     res.push({ "type": insert_token.type,
                "start": insert_token.start,
                "end": old_end
              });
    }
   else
    {
     res.push({ "type": tree[old_token].type,
                "start": old_start,
                "end": insert_token.start - 1
              });

     res.push({ "type": insert_token.type,
                "start": insert_token.start,
                "end": insert_token.end
              });

     res.push({ "type": tree[old_token].type,
                "start": insert_token.end + 1,
                "end": old_end
              });
    }

   tree.splice(old_token, 1);

   for (var i = 0; i < res.length; i++)
    {
     tree.splice(old_token + i, 0, res[i]);
    }
   i = undefined;
  }


/* Применяет правила разбра к необработанному токену (type: raw).

   На вход принимает массив объектов-правил и дерево.
   Изменяет дерево, ничего не возвращает.
*/
 function apply_rules(input, tree, rules)
  {
   for (var i = 0; i < rules.length; i++)
    {
     var rule = rules[i];

     for (var j = 0; j < tree.length; j++)
      {
       var token = tree[j];

       if (token.type == "raw")
        {
         var find = rule_func(input, token, rule);

         if (find !== false)
          {
           insert_token(tree, j, find);
          }
        }
       else
        {
         continue;
        }
      }
     j = undefined;
    }
   i = undefined;
  }


/* Берёт исходную строку, дерево токенов и массив правил оформления.

   Возвращает оформленную строку.

   Правила оформления - объект { "token_type": "decorate_class"].
*/
 function decor(input, tree, decor_rules)
  {
   var res = "";

   for (var i = 0; i < tree.length; i++)
    {
     var content = input.substring(tree[i].start, tree[i].end + 1);

     content = content.replace(/</g, "&lt;");
     content = content.replace(/>/g, "&gt;");
     content = content.replace(/\"/g, "&#34;");
     content = content.replace(/\'/g, "&#39;");

     if (typeof decor_rules[tree[i].type] !== "undefined")
      {
       content = "<span class=\"" + decor_rules[tree[i].type]
               + "\">" + content + "</span>";
      }

     res = res + content;
    }
   i = undefined;

   return res;
  }


/* Сложное правило-диапазон.
   Описывает фрагмент от начальной до конечной подстроки, включительно.
   При этом проверяются условия префиксов/суффиксов для начальной и конечной
   подстрок.

   Пример:
    Входная строка: 12321014.
    Начальная подстрока: 2.
    Префикс начальной строки: [3, true]
    Суффикс начальной строки: [2, true]
    Конечная подстрока: 1.
    Префикс конечной строки: [2, false].
    Суффикс конечной строки: [4, false]
    Описываемый фрагмент: 2101.
     Т.к. проверяются префиксы/суффиксы, то правило сработает на второй 2
     и третьей 1 исходной строки.
    Также, префиксы/суффиксы указывают, должны ли они присутствовать или нет.

   Структура:
    type - тип правила, обязателен для всех правил.
    start - начало диапазона.
    end - конец диапазона.
    name - метка для найденного фрагмента.
*/

/* В данном случае, описан синтаксис комментария.
*/
 var rule_range_if = { "type": "range_if",
                       "start": "\"",
                       "start_pre": ["\\", false],
                       "end": "\"",
                       "end_pre": ["\\", false],
                       "name": "string"
                     };


/* Объект, группирующий функции обработки.
*/
 function rule_func(input, token, rule)
  {
   var res = false;

   switch (rule.type)
    {
     case "range":
       res = get_range(input, token, rule);

       break;

     case "line":
       res = get_line(input, token, rule);

       break;

     case "range_if":
       res = get_range_if(input, token, rule);

       break;
    }

   return res;


   /* Находит первое вхождение диапазона range в строку, описываемую token.

      Возвращает объект со следующими данными:
       type - тип найденного фрагмента.
       start - индекс первого символа из найденного фрагмента.
       end - индекс последнего символа из найденного фрагмента.

      Если фрагмент не найден - возвращает false.
   */
    function get_range(input, token, range)
     {
      var start;
      var end;
      var content = input.substring(token.start, token.end + 1);
      var res = false;

      start = content.indexOf(range.start);

      if (start !== -1)
       {
        end = content.indexOf(range.end, start + 1);

        if (end !== -1)
         {
          res = { "type": range.name,
                  "start": token.start + start,
                  "end": token.start + end + range.end.length - 1
                };
         }
       }

      return res;
     }


   /* Находит первое вхождение фрагмента из заданных символов.

      Возвращает объект со следующими данными:
       type - тип найденного фрагмента.
       start - индекс первого символа из найденного фрагмента.
       end - индекс последнего символа из найденного фрагмента.

      Если фрагмент не найден - возвращает false.
   */
    function get_line(input, token, line)
     {
      var start;
      var end;
      var content = input.substring(token.start, token.end + 1);
      var res = false;

      for (var i = 0; i < line.list.length; i++)
       {
        var tmp = content.indexOf(line.list[i]);

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

        while (line.list.indexOf(content[end + 1]) !== -1)
         {
          end++;
         }

        res = { "type": line.name,
                "start": token.start + start,
                "end": token.start + end
              };
       }

      return res;
     }


   /* Находит первое вхождение диапазона range в строку, описываемую token.
      Дополнительно проверяются префиксы/суффиксы.

      Возвращает объект со следующими данными:
       type - тип найденного фрагмента.
       start - индекс первого символа из найденного фрагмента.
       end - индекс последнего символа из найденного фрагмента.

      Если фрагмент не найден - возвращает false.
   */
    function get_range_if(input, token, range_if)
     {
      var start;
      var true_start;
      var end;
      var true_end;
      var content = input.substring(token.start, token.end + 1);
      var res = false;

      start = content.indexOf(range_if.start);

      while (start !== -1)
       {
        true_start = check_range_point(content,
                                       start,
                                       range_if.start.length,
                                       range_if.start_pre,
                                       range_if.start_post
                                      );
        if (true_start)
         {
          break;
         }
        else
         {
          start = content.indexOf(range_if.start, start + 1);
         }
       }

      if ((start !== -1) && (true_start))
       {
        end = content.indexOf(range_if.end, start + 1);

        while (end !== -1)
         {
          true_end = check_range_point(content,
                                       end,
                                       range_if.end.length,
                                       range_if.end_pre,
                                       range_if.end_post
                                      );
          if (true_end)
           {
            break;
           }
          else
           {
            end = content.indexOf(range_if.end, end + 1);
           }
         }

        if ((end !== -1) && (true_end))
         {
          res = { "type": range_if.name,
                  "start": token.start + start,
                  "end": token.start + end + range_if.end.length - 1
                };
         }
       }

      return res;
     }


   /* Проверяет истинность найденного фрагмента, учитывая параметры
      префиксов/суффиксов.
   */
    function check_range_point(content, point_index, point_length, prefix, postfix)
     {
      var res = false;
      var prefix_flag = true;
      var postfix_flag = true;

      if (prefix)
       {
        var pre_index = point_index - prefix[0].length;

        if (pre_index >= 0)
         {
          var pre_content = content.substring(pre_index, point_index);

          if (prefix[1] == false)
           {
            if (pre_content == prefix[0])
             {
              prefix_flag = false;
             }
           }
          else
           {
            if (pre_content !== prefix[0])
             {
              prefix_flag = false;
             }
           }
         }
        else
         {
          if (prefix[1])
           {
            prefix_flag = false;
           }
         }
       }

      if (postfix)
       {
        var post_index = point_index + point_length;

        if (post_index + postfix[0].length <= content.length)
         {
          var post_content = content.substring(post_index, post_index + postfix[0].length);

          if (postfix[1] == false)
           {
            if (post_content == postfix[0])
             {
              postfix_flag = false;
             }
           }
          else
           {
            if (post_content !== postfix[0])
             {
              postfix_flag = false;
             }
           }
         }
        else
         {
          if (postfix[1])
           {
            postfix_flag = false;
           }
         }
       }

      if ((prefix_flag) && (postfix_flag))
       {
        res = true;
       }

      return res;
     }
  }

