import os
from PIL import Image
import pillow_heif


class Submission:
    def __init__(self, teamName, challenge, points, date, photoName):
        
        self.date = date
        self.teamName = teamName
        self.challenge = challenge
        self.points = points

        baseDir = os.path.dirname(os.path.abspath(__file__))
        picsPath = os.path.join(baseDir, "pics", teamName)
        self.picturePath = self.rename(picsPath,photoName) 

        if ("heic" in self.picturePath.lower()):
            self.picturePath = self.heicConvert(self.picturePath)

    def rename(self, picsPath, photoName):
        oldPath = os.path.join(picsPath, photoName)
        suffix = os.path.splitext(photoName)[1] #jpg, png, heic etcc
        newName = f"{self.challenge}, {str(self.points)} Points! {self.date}{suffix}"

        newPath = os.path.join(picsPath, newName)
        os.rename(oldPath,newPath)
        return newPath
    
    def heicConvert(self, ogPath):
        ogPic = pillow_heif.read_heif(ogPath)
        img = Image.frombytes(
            ogPic.mode,
            ogPic.size,
            ogPic.data,
            "raw",
        )

        base = os.path.splitext(ogPath)[0]
        newPath = base+".jpg"

        img.save(newPath, format="JPEG")

        os.remove(ogPath)

        return newPath