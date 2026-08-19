import re
from pathlib import Path


file_path = Path("dataset/Amazon Sales.csv")

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()


match = re.search(r'<pre[^>]*>(.*?)</pre>', content, re.DOTALL)
if match:
    csv_text = match.group(1)
    csv_text = csv_text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    

    with open(file_path, "w", encoding='utf-8') as out_f:
        out_f.write(csv_text)
    print("Done ! Data cleaned successfully")
else:
    print("Data does not cleaned")