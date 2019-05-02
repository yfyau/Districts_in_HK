import glob
import errno
import json

data_folder = glob.glob(r"..\src\data\google-trends")



path = r'..\src\data\google-trends\屯門區'
files = glob.glob(path+"\*.json")
new_json = []
new_strings = ""

for name in files:
    try:
        with open(name,"r",encoding="utf-8") as f:
            json_data = json.load(f)
            for obj in json_data:
                
                if obj['query'] not in new_strings:
                    new_json.append(obj)
                    new_strings += obj['query']

    except IOError as exc:
        if exc.errno != errno.EISDIR:
            raise

new_json = sorted(new_json, key=lambda x: x['value'], reverse=True)
import glob
import errno
import json

data_folder = glob.glob(r"..\src\data\google-trends\*")

for district in data_folder:

    district_name = district.split('\\')[-1]

    print(district_name)

    files = glob.glob(district+r"\*.json")
    new_json = []
    new_strings = ""

    for name in files:
        try:
            with open(name,"r",encoding="utf-8") as f:
                json_data = json.load(f)
                for obj in json_data:
                    
                    if obj['query'] not in new_strings:
                        new_json.append(obj)
                        new_strings += obj['query']
        except IOError as exc:
            if exc.errno != errno.EISDIR:
                raise

    new_json = sorted(new_json, key=lambda x: x['value'], reverse=True)
    with open(district+'\\new.json', 'w', encoding='utf-8') as outfile:
        json.dump(new_json[0:14], outfile)

print(new_json[0:19])

with open(path+'\\new.json', 'w', encoding='utf-8') as outfile:
    json.dump(new_json[0:14], outfile)
