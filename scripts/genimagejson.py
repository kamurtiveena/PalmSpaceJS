import os
import json
import simplejson

# filelist=os.listdir('public/study2/res/images')
categorylist=os.listdir('images')

print(categorylist)

data = []

for category in categorylist[:]: # filelist[:] makes a copy of filelist.
    print(category)

    images = os.listdir(os.path.join('images', category))
    print(images)

    for image in images:
        u = {}
        u["type"] = category
        u["src"] = "res/images/" + image
        u["image"] = ""
        u["name"] = image.rsplit(".", 1)[0]
        print(u)
        data.append(u)
    

jsonString = json.dumps(data)
print(jsonString)


dataFile = open("genimages.json", "w")
dataFile.write(simplejson.dumps(simplejson.loads(jsonString), indent=4, sort_keys=True))
dataFile.close()