import discord #discord
from discord.ext import tasks, commands
import gspread #google sheets
from oauth2client.service_account import ServiceAccountCredentials #authentication for google sheets and google drive
import requests #Allows downloading from drove
from io import BytesIO #Allows for the "use of files" but kept in Ram so nothing is downloaded!


from apikeys import *  #holds token for discord bot

# Set up bot with intents
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)
channel_id = CHANNELID  #This has to be changed to the big little channel id

# Google Sheets setup
scope = [SHEETSACCESS, DRIVEACCESS] #Drive and sheets access
creds = ServiceAccountCredentials.from_json_keyfile_name("sheetsStuff.json", scope) #"sheetsStuff.json" is the name of the json file for the drive and sheet, Must download your own
client = gspread.authorize(creds)
responses = client.open("Big Little (Responses)").worksheet("Form responses") #"Big Little Test (Responses) is the name of the sheets file the form exports too"
leaderBoard = client.open("Big Little (Responses)").worksheet("LeaderBoard")
#-------------------------------------Setting up last row file
# Load last checked row from file
def load_last_row():
    try:
        with open("last_row.txt", "r") as f:
            return int(f.read().strip())
    except (FileNotFoundError, ValueError):
        return 1  # Default to 1 if the file doesn't exist or is invalid

# Save last checked row to file
def save_last_row(row_num):
    with open("last_row.txt", "w") as f:
        f.write(str(row_num))

last_row_checked = load_last_row() 
#-------------------------------------

#-------------------------------------Responsible for sending pictures to discord on update
@tasks.loop(seconds=60)
async def check_for_new_images():
    global last_row_checked
    data = responses.get_all_records() #Holds the entire google sheet

    if len(data) > last_row_checked: #only runs when there are new entries
        new_entries = data[last_row_checked:] #The new entries are saved in its own variable
        channel = bot.get_channel(channel_id) #Sends messages into the correct channel (Big Little)

        for entry in new_entries: #Loops for every new entry
            raw_url = entry.get("Upload Picture!") #get the link to the picture from the "Upload Picture!" column in sheet
            bigLittleGroup = entry.get("Big Little Group:") #get the group from correct column
            challenge = entry.get("What Challenge did you complete?") #get the challenge
            points = entry.get("How many points?") #get the number of points
            if raw_url and "id=" in raw_url: #Checks that there is a valid URL for an image
                file_id = raw_url.split("id=")[-1] #Extracs the file ID from the URL
                direct_url = f"https://drive.google.com/uc?export=download&id={file_id}" #Make the direct download link from the file ID
                
                response = requests.get(direct_url) #Retrives the image file
                if response.status_code == 200: #Checks that the request.get was succesful
                    file_bytes = BytesIO(response.content) #This is the image file! Gets put in ram instead of main mem
                    file_bytes.seek(0)
                    discord_file = discord.File(fp=file_bytes, filename="submission.jpg")  #Creates the Discord file that will be posted!
                    
                    await channel.send( #sends the file and the writing!
                        content=f"**{bigLittleGroup}**\nChallenge: {challenge}\nPoints: {points}",
                        file=discord_file
                    )
                else:
                    await channel.send("Failed to download image.")

            else:
                print("No valid image URL found.")

        last_row_checked = len(data)#changes the last row
        save_last_row(last_row_checked)#Save progress
#--------------------------------------

#--------------------------------------LeaderBoard #Sends the leader board to the discord Channel
@bot.command()
async def points(ctx):
    teams = leaderBoard.col_values(1)[1:]
    points = leaderBoard.col_values(2)[1:]

    for team, point in zip(teams, points):
        await ctx.send(f"{team}: {point}")
#-------------------------------------

#------------------------------------- Running the bot
@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")
    print("-------------------")
    check_for_new_images.start()
#-------------------------------------

bot.run(TOKEN)

