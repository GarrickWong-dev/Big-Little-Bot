import os
from PIL import Image
import pillow_heif


class Submission:
    def __init__(self, teamName, challenge, points, date, photoName):
        
        self.date = date
        self.teamName = teamName
        self.challenge = challenge
        self.points = points

        ogFolderPath = os.path.join("pics",teamName)

        self.picturePath = self.rename(ogFolderPath,photoName) 
        if ("heic" in self.picturePath.lower()):
            self.picturePath = self.heicConvert(self.picturePath)

    def rename(self, ogPath, photoName):
        oldPath = os.path.join(ogPath, photoName)
        suffix = os.path.splitext(photoName)[1] #jpg, png, heic etcc
        newName = f"{self.challenge}, {self.points} Points! {self.date}{suffix}"

        newPath = os.path.join(ogPath, newName)
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