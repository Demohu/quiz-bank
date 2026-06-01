import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inspect handleFileUpload function
idx_f = html.find('const handleFileUpload =')
if idx_f != -1:
    print('handleFileUpload at:', idx_f)
    print(html[idx_f:idx_f+1000])
    print("-" * 50)

# Let's inspect handleQuizFileUpload function
idx_q = html.find('const handleQuizFileUpload =')
if idx_q != -1:
    print('handleQuizFileUpload at:', idx_q)
    print(html[idx_q:idx_q+1000])
    print("-" * 50)
