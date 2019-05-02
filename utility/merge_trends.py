import glob
import errno
import json

path = r'C:\Users\Jason\Desktop\Districts_in_HK\web\src\data\google-trends\屯門區'
files = glob.glob(path+"\*.json")
new_json = []

for name in files:
    try:
        with open(name,"r",encoding="utf-8") as f:
            json_data = json.load(f)
            for obj in json_data:
                new_json.append(obj)
    except IOError as exc:
        if exc.errno != errno.EISDIR:
            raise

new_json = sorted(new_json, key=lambda x: x['value'], reverse=True)

print(new_json[0:19])

with open(path+'\\new.json', 'w', encoding='utf-8') as outfile:
    json.dump(new_json[0:14], outfile)
