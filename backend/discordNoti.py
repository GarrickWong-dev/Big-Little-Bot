import requests
import os
import io
from . import sub

def noti(sub):
    fileName = "submission.jpg"

    imageBuffer = io.BytesIO()
    rgbImage = sub.pic.convert("RGB")
    rgbImage.save(imageBuffer, format="JPEG")
    imageBuffer.seek(0)
    imageBuffer.seek(0)

    message = (
        f"📸 **New Submission**\n"
        f"Team: **{sub.teamName}**\n"
        f"Challenge: **{sub.challenge}**\n"
        f"Points: **{sub.points}**\n"
        f"Date: **{sub.date}**"
    )

    files = {"file": (fileName, imageBuffer, "image/jpeg")}
    data = {"content":message}

    discordWebhookUrl = os.getenv("DISCORD_WEBHOOK_URL")
    requests.post(discordWebhookUrl, data=data, files=files)