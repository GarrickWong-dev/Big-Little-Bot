import requests
from . import apiKeys
from . import sub
import os

def noti(sub):
    fileName = os.path.basename(sub.picturePath)

    message = (
        f"📸 **New Submission**\n"
        f"Team: **{sub.teamName}**\n"
        f"Challenge: **{sub.challenge}**\n"
        f"Points: **{sub.points}**\n"
        f"Date: **{sub.date}**"
    )

    with open(sub.picturePath, "rb") as f:
        files = {"file": (fileName, f)}
        data = {"content":message}
        requests.post(apiKeys.discord, data=data, files=files)