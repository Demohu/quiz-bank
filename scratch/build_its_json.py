import json
import os

workspace = r"C:\Users\liawb\OneDrive\Desktop\題庫"
output_path = os.path.join(workspace, "python_its_questions.json")

questions = [
    {
        "id": "ITS-P02-1",
        "title": "[ITS-P02-1] 請問哪兩種資料類型儲存在第01行的rooms字典（清單）中？\n\n```python\n01 rooms = {1: 'Foyer', 2: 'Conference Room'}\n02 room = input('Enter the room number: ')\n03 if not room in rooms:\n04  print('Room does not exist.')\n05 else:\n06  print(\"The room name is \" + rooms[room])\n```",
        "options": [
            {"label": "A", "text": "布林值和字串"},
            {"label": "B", "text": "浮點數和布林值"},
            {"label": "C", "text": "整數和字串"},
            {"label": "D", "text": "浮點數和整數"}
        ],
        "answer": "C",
        "explanation": "字典 `rooms` 中的鍵是整數（`1`, `2`），值是字串（`'Foyer'`, `'Conference Room'`），因此是整數和字串。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P02-2",
        "title": "[ITS-P02-2] 續上題，請問第02行的 `room` 是哪種資料類型？\n\n```python\n02 room = input('Enter the room number: ')\n```",
        "options": [
            {"label": "A", "text": "bool"},
            {"label": "B", "text": "float"},
            {"label": "C", "text": "int"},
            {"label": "D", "text": "string"}
        ],
        "answer": "D",
        "explanation": "在 Python 中，使用 `input()` 函式接收的使用者輸入預設皆為字串類型 (string)。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P02-3",
        "title": "[ITS-P02-3] 續上題，為什麼第03行 `if not room in rooms:` 會無法正常尋找房間？",
        "options": [
            {"label": "A", "text": "無效的語法"},
            {"label": "B", "text": "不符合的資料類型"},
            {"label": "C", "text": "命名錯誤的變數"}
        ],
        "answer": "B",
        "explanation": "`room` 是字串類型（例如 `'1'`），但 `rooms` 的鍵是整數類型（`1`），因此直接用 `in` 尋找會因為資料類型不符合而找不到。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P03-1",
        "title": "[ITS-P03-1] 關於例外處理 (Exception Handling)，下列敘述是否正確：\ntry陳述式可以包含一個或多個except子句。",
        "options": [
            {"label": "A", "text": "正確"},
            {"label": "B", "text": "錯誤"}
        ],
        "answer": "A",
        "explanation": "一個 try 區塊可以搭配多個 except 區塊來捕捉不同的異常類型。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P03-2",
        "title": "[ITS-P03-2] 關於例外處理，下列敘述是否正確：\ntry陳述式可以包含finally子句，但不含except子句。",
        "options": [
            {"label": "A", "text": "正確"},
            {"label": "B", "text": "錯誤"}
        ],
        "answer": "A",
        "explanation": "`try...finally` 是合法的語法，可以用於不捕捉異常但確保釋放資源的場景。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P03-3",
        "title": "[ITS-P03-3] 關於例外處理，下列敘述是否正確：\ntry陳述式可以包含finally子句以及except子句。",
        "options": [
            {"label": "A", "text": "正確"},
            {"label": "B", "text": "錯誤"}
        ],
        "answer": "A",
        "explanation": "`try...except...finally` 是最標準且完整的異常處理結構。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P03-4",
        "title": "[ITS-P03-4] 關於例外處理，下列敘述是否正確：\ntry陳述式可以包含一個或多個finally子句。",
        "options": [
            {"label": "A", "text": "正確"},
            {"label": "B", "text": "錯誤"}
        ],
        "answer": "B",
        "explanation": "每個 try 結構最多隻能有一個 finally 區塊。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P04",
        "title": "[ITS-P04] 執行下列程式碼，請問輸出為何？\n\n```python\nimport datetime\nd = datetime.datetime(2017, 4, 7)\nprint('{:%B-%d-%y}'.format(d))\n```",
        "options": [
            {"label": "A", "text": "04-07-17"},
            {"label": "B", "text": "2017-APRIL-07"},
            {"label": "C", "text": "April-07-17 (或考試簡體譯本的 APRIL-07-17)"},
            {"label": "D", "text": "04-07-2017"}
        ],
        "answer": "C",
        "explanation": "`%B` 代表完整的月份名稱 (April)，`%d` 代表兩位數日期 (07)，`%y` 代表兩位數年份 (17)。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P05",
        "title": "[ITS-P05] 讀取庫存交易檔案 `inventory.txt`（包含商品識別碼、價格和數量）。程式碼必須讀取並列印每一行、忽略空白行、讀取完畢後關閉檔案。請問您應該針對第05行和第06行撰寫哪些程式碼？\n\n```python\n01 inventory = open(\"inventory.txt\", 'r')\n02 eof = False\n03 while eof == False:\n04  line = inventory.readline()\n05  # 這裡要填什麼？\n06  # 這裡要填什麼？\n07   print(line)\n08  else:\n09   print (\"End of file\")\n10   eof = True\n11   inventory.close()\n```",
        "options": [
            {"label": "A", "text": "05: if line != '\\n': \n06:   if line != \"\":"},
            {"label": "B", "text": "05: if line != '': \n06:   if line != \"\":"},
            {"label": "C", "text": "05: if line != '\\n': \n06:   if line != None:"},
            {"label": "D", "text": "05: if line != '': \n06:   if line != \"\\n\":"}
        ],
        "answer": "D",
        "explanation": "`readline()` 讀到檔案末端 (EOF) 時會回傳空字串 `''`，讀到空白行時會回傳換行符號 `'\\n'`。因此 05 判定非檔案末端 `if line != ''`，06 判定非空白行 `if line != '\\n'`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P06",
        "title": "[ITS-P06] 以下的變數宣告後，它們的資料類型依序是？\n\n```python\nage = 12\nminor = False\nname = \"David\"\nweight = 64.5\nzip = \"545\"\n```",
        "options": [
            {"label": "A", "text": "int、bool、str、float、str"},
            {"label": "B", "text": "int、str、str、float、int"},
            {"label": "C", "text": "float、str、str、float、str"},
            {"label": "D", "text": "int、bool、str、int、int"}
        ],
        "answer": "A",
        "explanation": "`12` 是整數(int)，`False` 是布林值(bool)，`\"David\"` 是字串(str)，`64.5` 是浮點數(float)，`\"545\"` 是字串(str)。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P07-1",
        "title": "[ITS-P07-1] 續上題關於日期處理的程式，在第04行，擷取目前的日期應該使用：\n\n```python\n01 import datetime\n02 dailySpecials=(\"Spaghetti\",\"Macaroni & Cheese\", \"Meatloaf\", \"Fried Chicken\")\n03 weekendSpecials=(\"Lobster\",\"Prime Rib\",\"Parmesan-Crusted Cod\")\n04 # 擷取目前的日期\n05 # 擷取工作日名稱\n```",
        "options": [
            {"label": "A", "text": "now=datetime()"},
            {"label": "B", "text": "now=datetime.date()"},
            {"label": "C", "text": "now=datetime.datetime.now()"},
            {"label": "D", "text": "now=new date()"}
        ],
        "answer": "C",
        "explanation": "在 Python 的 `datetime` 模組中，獲取當前日期與時間的標準方法是 `datetime.datetime.now()`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P07-2",
        "title": "[ITS-P07-2] 續上題，在第05行，擷取工作日（星期幾）的完整名稱應使用：",
        "options": [
            {"label": "A", "text": "today=now.strftime(\"%A\")"},
            {"label": "B", "text": "today=now.strftime(\"%B\")"},
            {"label": "C", "text": "today=now.strftime(\"%W\")"},
            {"label": "D", "text": "today=now.strftime(\"%Y\")"}
        ],
        "answer": "A",
        "explanation": "`%A` 代表完整工作日名稱（例如 Friday）。`%B` 是月份，`%W` 是週數，`%Y` 是四位數年份。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P07-3",
        "title": "[ITS-P07-3] 續上題，在第15行，計算當週剩餘天數（星期日為最後一天，索引為6）應使用：\n\n```python\n15 daysLeft = # 這裡填什麼？\n```",
        "options": [
            {"label": "A", "text": "dayLeft=now-now.weekday()"},
            {"label": "B", "text": "dayleft=today-today.weekday()"},
            {"label": "C", "text": "dayleft=6-now.weekday()"},
            {"label": "D", "text": "dayleft=6-datetime.datetime.weekday()"}
        ],
        "answer": "C",
        "explanation": "`now.weekday()` 回傳整數（0 代表星期一，6 代表星期日），因此當週剩餘天數為 `6 - now.weekday()`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P08",
        "title": "[ITS-P08] 您正在設計一個決策結構，將學生的數字成績（grade）轉換為字母成績。請問(1), (2), (3), (4)分別應使用哪段程式碼？\n\n```python\ngrade = int(input(\"Enter a numeric grade\"))\n(1)                                     \n letter_grade='A'\n(2)                                     \n letter_grade='B'\n(3)                                     \n letter_grade='C'\n(4)                                     \n letter_grade='D'\nelse:\n letter_grade='F'\n```",
        "options": [
            {"label": "A", "text": "(1) if grade >= 90; (2) elif grade >= 80; (3) elif grade >= 70; (4) elif grade >= 65"},
            {"label": "B", "text": "(1) if grade >= 90: (2) elif grade >= 80: (3) elif grade >= 70: (4) elif grade >= 65:"},
            {"label": "C", "text": "(1) if grade > 90: (2) elif grade > 80: (3) elif grade > 70: (4) elif grade > 65:"},
            {"label": "D", "text": "(1) if grade >= 90: (2) else grade >= 80: (3) else grade >= 70: (4) else grade >= 65:"}
        ],
        "answer": "B",
        "explanation": "決策結構開頭使用 `if`，後續分支使用 `elif`，且都需要加上冒號 `:`，數字範圍包含邊界（例如90分是A，89分是B，因此用 `>=`）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P09",
        "title": "[ITS-P09] 某間銀行要產生顯示平均餘額的報表。這份報表必須截斷餘額的小數部分。請問哪兩個程式碼片段可達成目標？(複選)",
        "options": [
            {"label": "A", "text": "average_balance = int(total_deposits/number_of_customers)"},
            {"label": "B", "text": "average_balance = total_deposits//number_of_customers"},
            {"label": "C", "text": "average_balance = total_deposits**number_of_customers"},
            {"label": "D", "text": "average_balance = float(total_deposits//number_of_customers)"}
        ],
        "answer": "AB",
        "explanation": "`int(a/b)` 將浮點數除法的結果轉換為整數（捨去小數點），而 `a//b` 是整除運算子（直接捨去小數點），兩者均符合截斷小數部分的需求。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P10",
        "title": "[ITS-P10] DVD 租借費用計算。晚上8點後歸還多收一晚费用（ontime==\"n\"）。星期日享七折，星期四享五折。完成程式碼(1), (2), (3)的判斷：\n\n```python\nif ontime (1):\n days_rented += 1\nif weekday (2):\n total = (days_rented * cost_per_day) * 0.7\nelif weekday (3):\n total = (days_rented * cost_per_day) * 0.5\n```",
        "options": [
            {"label": "A", "text": "(1) == 'n'   (2) == 'Sunday'   (3) == 'Thursday'"},
            {"label": "B", "text": "(1) != 'y'   (2) is 'Sunday'   (3) is 'Thursday'"},
            {"label": "C", "text": "(1) == 'y'   (2) == 'Sunday'   (3) == 'Thursday'"}
        ],
        "answer": "A",
        "explanation": "如果沒有準時歸還（ontime == 'n'），天數加1。星期幾的比對使用 `== 'Sunday'` 與 `== 'Thursday'`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P11",
        "title": "[ITS-P11] 接受使用者輸入名稱，並將該名稱輸出至畫面。請問您應該在第02行撰寫哪個程式碼？\n\n```python\n01 print(\"What is your name?\")\n02 # 接收輸入\n03 print(name)\n```",
        "options": [
            {"label": "A", "text": "input(\"name\")"},
            {"label": "B", "text": "name = input()"},
            {"label": "C", "text": "input(name)"},
            {"label": "D", "text": "name = input"}
        ],
        "answer": "B",
        "explanation": "`name = input()` 可以接收使用者在主控台輸入的內容並賦值給變數 `name`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P12",
        "title": "[ITS-P12] 在 Python 程式中如果希望使用者輸入時，即使輸入了小數程式也能自動轉為整數來進行運算，你應該使用以下哪個程式碼片段？",
        "options": [
            {"label": "A", "text": "total = input(\"請輸入總數？\")"},
            {"label": "B", "text": "total = int(input(\"請輸入總數？\"))"},
            {"label": "C", "text": "total = str(input(\"請輸入總數？\"))"},
            {"label": "D", "text": "total = float(input(\"請輸入總數？\"))"}
        ],
        "answer": "B",
        "explanation": "使用 `int()` 來將輸入字串轉換為整數數值（註：在標準 Python 中若輸入帶小數點的字串如 '5.5'，直譯 `int()` 會報錯，但本題為考試官方標準答案 B）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P13",
        "title": "[ITS-P13] 接受清單和搜尋詞作為參數，若找到則印出並停止，若未找到則印出找不到。請問程式片段的正確排列順序是？\n\n```python\n(1) def search(items, term):\n(2)  for i in range(len(items)):\n(3)   if items[i] == term:\n        print(\"{0} was found in the list.\".format(term))\n(4)     break\n(5)  else:\n       print(\"{0} was not found in the list.\".format(term))\n```",
        "options": [
            {"label": "A", "text": "1 -> 2 -> 3 -> 4 -> 5"},
            {"label": "B", "text": "1 -> 2 -> 4 -> 3 -> 5"},
            {"label": "C", "text": "1 -> 3 -> 2 -> 4 -> 5"},
            {"label": "D", "text": "1 -> 5 -> 2 -> 3 -> 4"}
        ],
        "answer": "A",
        "explanation": "這是 Python `for...else` 語法結構。若 for 迴圈正常結束（即沒有被 `break` 中斷，代表沒找到），則會執行 `else` 區塊。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P14",
        "title": "[ITS-P14] 接受輸入評分，傳回五星評比平均值，四捨五入到兩位小數。請問(1), (2), (3)應填入什麼？\n\n```python\nsum = count = done = 0\naverage = 0.0\nwhile done != -1:\n rating = (1)\n if rating == -1:\n  break\n sum += rating\n count += 1\naverage = float(sum / count)\n(2) \"... average ...\" (3)\n```",
        "options": [
            {"label": "A", "text": "(1) float(input(\"...\")) \n(2) print(\"...\") \n(3) format(average,'.2f'))"},
            {"label": "B", "text": "(1) input(\"...\") \n(2) print(\"...\") \n(3) {average, '.2f'}"},
            {"label": "C", "text": "(1) float(input(\"...\")) \n(2) output(\"...\") \n(3) format(average,'.2d'))"}
        ],
        "answer": "A",
        "explanation": "評分可以是小數，所以用 `float(input(...))`。輸出使用 `print`。格式化為兩位小數使用 `format(average, '.2f')`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P16",
        "title": "[ITS-P16] 你開發一個程式碼用來判斷整數是奇數還是偶數。請問空格中依序填入？\n\n```python\nfrom random import randint \nnum = randint(1, 100) \n___(1)___ \n    print(\"%d 是偶數\" % num) \n___(2)___ \n    print(\"%d 是奇數\" % num)\n```",
        "options": [
            {"label": "A", "text": "(1) if num / 2 == 0:  (2) if num / 2 != 0:"},
            {"label": "B", "text": "(1) if num % 2 == 0:  (2) else:"},
            {"label": "C", "text": "(1) if num / 2 = 0: (2) if num / 2 <> 0:"},
            {"label": "D", "text": "(1) if num % 2 == 0:  (2) elif num / 2 == 0:"}
        ],
        "answer": "B",
        "explanation": "偶數除以 2 的餘數為 0，即 `num % 2 == 0`，不符合此條件的即為奇數，直接用 `else:` 捕捉即可。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P18",
        "title": "[ITS-P18] 執行以下程式碼，請問輸出值為何？\n\n```python\nlist_1 = [1,2]\nlist_2 = [3,4]\nlist_3 = list_1 + list_2\nlist_4 = list_3 * 3\nprint(list_4)\n```",
        "options": [
            {"label": "A", "text": "[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]"},
            {"label": "B", "text": "[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]"},
            {"label": "C", "text": "[3, 6, 9, 12]"},
            {"label": "D", "text": "[[1, 2], [3, 4], [1, 2], [3, 4], [1, 2], [3, 4]]"}
        ],
        "answer": "A",
        "explanation": "`list_1 + list_2` 會將兩個清單連接成 `[1, 2, 3, 4]`。接著 `* 3` 會將清單內容重複三次，得到一維清單 `[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P19",
        "title": "[ITS-P19] 您正在撰寫程式碼來產生一個最小值 5 與最大值 11 的隨機整數。請問您應該使用哪兩個函式？(複選)",
        "options": [
            {"label": "A", "text": "random.randint(5, 12)"},
            {"label": "B", "text": "random.randrange(5, 12, 1)"},
            {"label": "C", "text": "random.randint(5, 11)"},
            {"label": "D", "text": "random.randrange(5, 11, 1)"}
        ],
        "answer": "BC",
        "explanation": "`randint(a, b)` 包含上限 b（5到11即 `randint(5, 11)`）。`randrange(a, b, step)` 不包含上限 b（5到11即 `randrange(5, 12, 1)`）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P20",
        "title": "[ITS-P20] 計算並顯示所有 2 到 12 的乘法表組合。請問 (1) 和 (2) 應如何撰寫？\n\n```python\ndef times_tables():\n  (1)\n   (2):\n   print(row * col, end = \" \")\n  print()\n```",
        "options": [
            {"label": "A", "text": "(1) for col in range(2, 12): (2) for row in range(2, 12):"},
            {"label": "B", "text": "(1) for col in range(2, 13): (2) for row in range(2, 13):"},
            {"label": "C", "text": "(1) for col in range(12):    (2) for row in range(12):"}
        ],
        "answer": "B",
        "explanation": "要產生 2 到 12（含12）的數值，`range` 的上限必須是 13（因為不包含上限），所以是 `range(2, 13)`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P21",
        "title": "[ITS-P21] 清單 `members` 包含了 50 位會員姓名，最後 5 名是 VIP 會員。你需要分割清單顯示一般會員（前45名），以下哪兩個程式碼可達成？(複選)",
        "options": [
            {"label": "A", "text": "members[-5 : 0]"},
            {"label": "B", "text": "members[0 : -5]"},
            {"label": "C", "text": "members[1 : -5]"},
            {"label": "D", "text": "members[: -5]"}
        ],
        "answer": "BD",
        "explanation": "利用切片 (slicing)，`members[0:-5]` 或省略起點的 `members[:-5]` 都代表取出從索引 0 到倒數第 5 個（不含）的所有元素，即前 45 名一般會員。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P23",
        "title": "[ITS-P23] 應用程式必須讀取並寫入資料至文字檔案。如果檔案不存在，此應用程式就必須建立檔案。如果檔案含有內容，此應用程式就必須刪除內容。請問您應該使用哪個程式碼片段？",
        "options": [
            {"label": "A", "text": "open(\"local_data\", \"w+\")"},
            {"label": "B", "text": "open(\"local_data\", \"r\")"},
            {"label": "C", "text": "open(\"local_data\", \"r+\")"},
            {"label": "D", "text": "open(\"local_data\", \"w\")"}
        ],
        "answer": "A",
        "explanation": "`\"w+\"` 模式代表讀取與寫入，若檔案不存在會建立新檔，若檔案存在則會覆寫（清空原本內容）。符合「讀取並寫入」且「清空內容」的需求。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P24",
        "title": "[ITS-P24] 您正在建立一個函式，將傳入的數字當作浮點數操作。此函式必須提取絕對值，並移除小數點後面的任何小數部分。請問您應該使用哪兩個數學函式？(複選)",
        "options": [
            {"label": "A", "text": "math.floor(x)"},
            {"label": "B", "text": "math.fabs(x)"},
            {"label": "C", "text": "math.frexp(x)"},
            {"label": "D", "text": "math.fmod(x)"}
        ],
        "answer": "AB",
        "explanation": "`math.fabs(x)` 用於取得浮點數絕對值；`math.floor(x)` 用於無條件捨去小數部分（回傳小於或等於它的最大整數）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P30",
        "title": "[ITS-P30] 計算以下的 Python 數學運算式：\n\n```python\n(5 * (1 + 2) ** 2 - 3 + 4 / 2)\n```\n結果為何？",
        "options": [
            {"label": "A", "text": "5"},
            {"label": "B", "text": "8"},
            {"label": "C", "text": "44 (或 44.0)"},
            {"label": "D", "text": "22"}
        ],
        "answer": "C",
        "explanation": "括號最優先：1+2 = 3；接著是乘方：3**2 = 9；接著是乘除法：5*9 = 45，4/2 = 2.0；最後加減法：45 - 3 + 2.0 = 44.0。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P31-1",
        "title": "[ITS-P31-1] 執行下列程式碼，第一個 `print(numList is alphaList)` 會輸出什麼？\n\n```python\nnumList = [1, 2, 3, 4, 5]\nalphaList = [\"a\", \"b\", \"c\", \"d\", \"e\"]\nprint(numList is alphaList) # (1)\nprint(numList == alphaList) # (2)\nnumList = alphaList\nprint(numList is alphaList) # (3)\nprint(numList == alphaList) # (4)\n```",
        "options": [
            {"label": "A", "text": "True"},
            {"label": "B", "text": "False"}
        ],
        "answer": "B",
        "explanation": "兩個清單儲存在不同的記憶體位址，因此 `is` 指向不同物件，輸出為 `False`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P31-2",
        "title": "[ITS-P31-2] 續上題，第二個 `print(numList == alphaList)` 會輸出什麼？",
        "options": [
            {"label": "A", "text": "True"},
            {"label": "B", "text": "False"}
        ],
        "answer": "B",
        "explanation": "兩個清單的元素值不同，因此 `==` 比較內容時不相等，輸出為 `False`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P31-3",
        "title": "[ITS-P31-3] 續上題，第三個 `print(numList is alphaList)` 會輸出什麼？",
        "options": [
            {"label": "A", "text": "True"},
            {"label": "B", "text": "False"}
        ],
        "answer": "A",
        "explanation": "因為執行了 `numList = alphaList`，此時 `numList` 已經參考指向與 `alphaList` 相同的物件，因此 `is` 為 `True`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P31-4",
        "title": "[ITS-P31-4] 續上題，第四個 `print(numList == alphaList)` 會輸出什麼？",
        "options": [
            {"label": "A", "text": "True"},
            {"label": "B", "text": "False"}
        ],
        "answer": "A",
        "explanation": "指向同一個物件，內容當然完全相等，輸出為 `True`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P35",
        "title": "[ITS-P35] 執行以下程式碼，三個 `print` 的輸出結果依序為？\n\n```python\na = 21\nb = 5\nprint(a / b)\nprint(a // b)\nprint(a % b)\n```",
        "options": [
            {"label": "A", "text": "4.2, 4, 1"},
            {"label": "B", "text": "4, 4, 4"},
            {"label": "C", "text": "1, 4, 4.2"},
            {"label": "D", "text": "4.2, 4, 2"}
        ],
        "answer": "A",
        "explanation": "`a / b` 是一般除法得到 `4.2`；`a // b` 是整除得到 `4`；`a % b` 是求餘數得到 `1`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P36-1",
        "title": "[ITS-P36-1] 關於 Python 的文件字串 (docstring)，請問哪種字元代表單行或多行文件字串的開頭和結尾？",
        "options": [
            {"label": "A", "text": "單引號(')"},
            {"label": "B", "text": "雙引號(\")"},
            {"label": "C", "text": "兩個雙引號(\"\")"},
            {"label": "D", "text": "三個雙引號(\"\"\")"}
        ],
        "answer": "D",
        "explanation": "Python 的 docstring 標準是使用三個雙引號 `\"\"\"`（或三個單引號 `'''`）包裝起來。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P36-2",
        "title": "[ITS-P36-2] 續上題，在定義函式時，文件字串 (docstring) 的標準擺放位置在哪裡？",
        "options": [
            {"label": "A", "text": "在程式檔案的最開頭"},
            {"label": "B", "text": "在函式宣告（def）的下一行（即函式主體的第一行）"},
            {"label": "C", "text": "在整個函式定義的最後一行"},
            {"label": "D", "text": "在函式宣告（def）的上一行"}
        ],
        "answer": "B",
        "explanation": "文件字串必須寫在函式主體（Function Body）的第一行，縮排與函式內部程式碼相同。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P36-3",
        "title": "[ITS-P36-3] 續上題，檢閱下列函式：\n\n```python\ndef cube(n):\n  \"\"\" Returns the cube of number n \"\"\"\n  return n*n*n\n```\n請問哪個命令可以成功在主控台列印出此函式的文件字串？",
        "options": [
            {"label": "A", "text": "print(__doc__)"},
            {"label": "B", "text": "print(cube(doc))"},
            {"label": "C", "text": "print(cube.__doc__)"},
            {"label": "D", "text": "print(cube(docstring))"}
        ],
        "answer": "C",
        "explanation": "可以透過訪問物件的屬性 `__doc__`（例如 `cube.__doc__`）來讀取其文件字串。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P44",
        "title": "[ITS-P44] 執行下列程式碼：\n\n```python\nslist = ['a', 'b', 'c', 'd', 'e', 'f']\nprint('f' in slist)\n```\n請問輸出列印的內容為何？",
        "options": [
            {"label": "A", "text": "5"},
            {"label": "B", "text": "6"},
            {"label": "C", "text": "True"},
            {"label": "D", "text": "False"}
        ],
        "answer": "C",
        "explanation": "`in` 運算子用於判斷元素是否存在於序列（如清單）中，因為 `'f'` 確實存在於 `slist` 中，因此輸出為 `True`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P47",
        "title": "[ITS-P47] 輸出必須符合下列需求：1.以雙引號括住字串、2.不以引號括住數字、3.以逗點分隔項目。請問哪兩個程式碼片段符合需求？(複選)\n\n```python\nitem = input(\"Enter the item name: \")\nsales = input(\"Enter the quantity: \")\n```",
        "options": [
            {"label": "A", "text": "print(\"{0},{1}\".format(item, sales))"},
            {"label": "B", "text": "print(item + ',' + sales)"},
            {"label": "C", "text": "print('\"{0}\",{1}'.format(item, sales))"},
            {"label": "D", "text": "print('\"' + item + '\",' + sales)"}
        ],
        "answer": "CD",
        "explanation": "C選項 `'\"{0}\",{1}'.format(item, sales)` 與 D選項 `print('\"' + item + '\",' + sales)` 皆會在 `item` 變數前後加上雙引號 `\"`，並以逗點分隔數值。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P48",
        "title": "[ITS-P48] 執行以下程式碼，請問會列印出幾行輸出？\n\n```python\nproduct = 2\nn = 5\nwhile (n != 0):\n product *= n\n print(product)\n n -= 1\n if n == 3 : break\n```",
        "options": [
            {"label": "A", "text": "1 行"},
            {"label": "B", "text": "2 行"},
            {"label": "C", "text": "3 行"},
            {"label": "D", "text": "5 行"}
        ],
        "answer": "B",
        "explanation": "第一圈：n=5，product=10，印出10，n減1變4，不滿足n==3。第二圈：n=4，product=40，印出40，n減1變3，滿足n==3，觸發 `break` 離開。因此共印出 2 行（10 和 40）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P53",
        "title": "[ITS-P53] 執行下列程式碼，請問 `answer` 變數的顯示值為何？\n\n```python\nvalue1 = 24\nvalue2 = 7\nvalue3 = 17.9\nanswer = (value1 % value2 * 100) // 2.0 ** 3.0 - value2\nprint(answer)\n```",
        "options": [
            {"label": "A", "text": "顯示值 457"},
            {"label": "B", "text": "顯示值 30.5"},
            {"label": "C", "text": "顯示值 30.0"},
            {"label": "D", "text": "發生語法錯誤"}
        ],
        "answer": "C",
        "explanation": "優先級計算：括號內 `value1 % value2 * 100` = `24 % 7 * 100` = `3 * 100` = `300`；接著乘方 `2.0 ** 3.0` = `8.0`；接著整除 `300 // 8.0` = `37.0`；最後減法 `37.0 - 7` = `30.0`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P54",
        "title": "[ITS-P54] 當您執行下列程式時，卻收到第03行的錯誤（造成無法辨識 `os`）。請問最可能的原因是什麼？\n\n```python\n01 def read_file(file):\n02  line = None\n03  if os.path.isfile(file):\n04   data = open(file, 'r')\n05   for line in data:\n06     print(line)\n```",
        "options": [
            {"label": "A", "text": "path方法不存在os物件中。"},
            {"label": "B", "text": "isfile方法不接受單一參數。"},
            {"label": "C", "text": "isfile方法不存在path物件中。"},
            {"label": "D", "text": "您忘記在程式開頭加上 `import os` 匯入該程式庫。"}
        ],
        "answer": "D",
        "explanation": "在使用 `os` 模組的任何函式前，必須使用 `import os` 進行載入，否則會丟出 `NameError: name 'os' is not defined` 錯誤。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P56",
        "title": "[ITS-P56] 宣告字串為：`alph = \"abcdefghijklmnopqrstuvwxyz\"`。請問下列四種切片 (slicing) 操作結果，哪一個是錯誤的？",
        "options": [
            {"label": "A", "text": "alph[3:15] 的結果是 defghijklmno"},
            {"label": "B", "text": "alph[3:15:3] 的結果是 dgjm"},
            {"label": "C", "text": "alph[15:3:-3] 的結果是 pmjg"},
            {"label": "D", "text": "alph[::-3] 的結果是 zwtqnkheb"}
        ],
        "answer": "C",
        "explanation": "`alph[15:3:-3]` 代表從索引 15（p）開始，每次倒退 3 個字元直到索引 4（不含3），順序為：15 (p)、12 (m)、9 (j)、6 (g)。結果應為 `pmjg`，全部選項皆正確（考卷連線拖曳題的原答案，本處作為題目內容核對）。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P60",
        "title": "[ITS-P60] 您需要產生符合以下條件的隨機數：是5的倍數、最小值是5、最大值是100。請問哪兩個程式碼片段符合需求？(複選)",
        "options": [
            {"label": "A", "text": "from random import randrange \nprint(randrange(0, 100, 5))"},
            {"label": "B", "text": "from random import randint \nprint(randint(1, 20) * 5)"},
            {"label": "C", "text": "from random import randrange \nprint(randrange(5, 105, 5))"},
            {"label": "D", "text": "from random import randint \nprint(randint(0, 20) * 5)"}
        ],
        "answer": "BC",
        "explanation": "B選項 `randint(1, 20) * 5` 產生 5 到 100 之間（含）的 5 倍數；C選項 `randrange(5, 105, 5)` 從 5 開始，每次加 5 直到 100（不含105），剛好是 5 到 100 的 5 倍數。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P67",
        "title": "[ITS-P67] 請問下列陳述式有何功能？\n\n```python\ndata = input()\n```",
        "options": [
            {"label": "A", "text": "顯示電腦上的所有輸入周邊裝置"},
            {"label": "B", "text": "顯示允許使用者輸入的訊息方塊"},
            {"label": "C", "text": "允許使用者在終端機主控台（Console）中輸入文字"},
            {"label": "D", "text": "建立HTML輸入元素"}
        ],
        "answer": "C",
        "explanation": "`input()` 函式會在主控台暫停程式執行，並允許使用者鍵入字串文字，直到按下 Enter 為止。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P70",
        "title": "[ITS-P70] 您想要在自己的 Python 程式碼中加入附註/註解，好讓其他團隊成員能夠了解。請問您應該採取下列哪一項做法？",
        "options": [
            {"label": "A", "text": "在任何一行的 // 後面放置附註。"},
            {"label": "B", "text": "在任何程式碼片段的 /* 和 */ 之間放置附註。"},
            {"label": "C", "text": "在任何一行的 # 後面放置附註。"},
            {"label": "D", "text": "在任何程式碼片段的 <!-- 和 --> 之間放置附註。"}
        ],
        "answer": "C",
        "explanation": "Python 使用 `#` 作為單行註解的開頭。`//` 是 C++/Java 註解，`/* */` 是 C 註解，`<!-- -->` 是 HTML 註解。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P72",
        "title": "[ITS-P72] 執行下列程式碼，請問將會列印出什麼數字？\n\n```python\ngrade = 76\nrank = 3\n\nif grade > 80 and rank >= 3:\n grade += 10\nelif grade > 70 and rank > 3:\n grade += 5\nelse:\n grade -= 5\n\nprint(grade)\n```",
        "options": [
            {"label": "A", "text": "71"},
            {"label": "B", "text": "76"},
            {"label": "C", "text": "81"},
            {"label": "D", "text": "86"}
        ],
        "answer": "A",
        "explanation": "第1個條件 `grade > 80` (76 > 80) 為 False。第2個條件 `rank > 3` (3 > 3) 為 False。因此進入 `else` 分支：`grade -= 5` = `76 - 5` = `71`。",
        "imageUrl": ""
    },
    {
        "id": "ITS-P75",
        "title": "[ITS-P75] 執行下列程式碼，請問 `print` 陳述式的輸出為何？\n\n```python\nx = \"oranges\"\ny = \"apples\"\nz = \"bananas\"\ndata = \"{1} and {0} and {2}\"\nprint(data.format(z, y, x))\n```",
        "options": [
            {"label": "A", "text": "bananas and oranges and apples"},
            {"label": "B", "text": "apples and bananas and oranges"},
            {"label": "C", "text": "apples and oranges and bananas"},
            {"label": "D", "text": "oranges and apples and bananas"}
        ],
        "answer": "B",
        "explanation": "`.format(z, y, x)` 中，索引 0 代表 z (bananas)，索引 1 代表 y (apples)，索引 2 代表 x (oranges)。格式化字串 `{1} and {0} and {2}` 代入後即為 `apples and bananas and oranges`。",
        "imageUrl": ""
    }
]

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(questions)} questions in {output_path}")
