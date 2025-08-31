from PIL import Image
import pillow_heif
import requests
import io


class Submission:
    def __init__(self, teamName, challenge, points, date, picBytes, picName):
        self.picName = picName
        self.date = date
        self.teamName = teamName
        self.challenge = challenge
        self.points = points
        self.picData = picBytes

        if (self.picName.lower().endswith("heic")):
            self.pic = self.heicConvert(self.picData)
        else:
            self.pic = Image.open(io.BytesIO(self.picData))

    
    def heicConvert(self, picData):
        heif = pillow_heif.read_heif(io.BytesIO(picData))
        pic = Image.frombytes(
            heif.mode,
            heif.size,
            heif.data,
            "raw",
        )

        return pic