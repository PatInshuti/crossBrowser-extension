import json

with open("freq_result.json") as json_file:
    data = json.load(json_file)

    arr = []
    for eachObject in data:
        for key, website in eachObject.items():
            if key not in arr:
                arr.append(key)


    print(arr)
    print(len(arr))

