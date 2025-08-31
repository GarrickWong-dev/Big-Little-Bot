from flask import Flask, render_template, request, redirect, url_for
from backend import webController
import io

app = Flask(__name__)

@app.route("/")
def index():
    success = request.args.get("success")
    return render_template("index.html", success=success)         

@app.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if webController.logIn(username, password):
            return redirect(url_for("submit"))
        else:
            return render_template("login.html",
            error="Invalid username or password")
    return render_template("login.html")

@app.route("/submit", methods=["GET", "POST"])
def submit():
    teams = webController.listOfTeams()
    if request.method == "POST":
        team = request.form.get("team")
        challenge = request.form.get("challenge")
        points = int(request.form.get("points"))
        date = request.form.get("date")
        pic = request.files.get("pic")
        
        picBytes = pic.read()
        picName = pic.filename
        webController.newSubmit(team, challenge, points, date, picBytes, picName)
        return redirect(url_for("submit"))
    return render_template("submit.html", teams = teams)

@app.route("/leaderboard")
def leaderboard():
    scores = webController.getScoreBoard()
    return render_template("leaderboard.html", leaderboard = scores)


if __name__ == "__main__":
    app.run(debug=True)