
with open("hispar.txt") as fp:
    expectedSite = 1
    f = open("hispar-full.txt", "a")

    for line in fp:
        lineArr = line.split()
        newSiteIndex = lineArr[0]

        if expectedSite < int(newSiteIndex):
            expectedSite = int(newSiteIndex)

        if newSiteIndex == str(expectedSite):
            # print(str(expectedSite) + "-->" + lineArr[2])
            expectedSite+=1
            f.write(lineArr[2]+"\n")
