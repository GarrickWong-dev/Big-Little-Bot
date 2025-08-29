from flask import Flask, render_template, request, redirect, url_for
from backend import webController


app = Flask(__name__)

@app.route("/")
def index():
    success = request.args.get("success")
    return render_template("index.html", success=success)

@app.route("/newTeam", methods = ["GET", "POST"])
def newTeam():
    if request.method == "POST":
        teamName = request.form.get("teamName")
        newPassword = request.form.get("password")
        inputKey = request.form.get("key")
        adding = webController.newTeam(teamName, newPassword, inputKey)

        if adding == "team added":
            #add the success message here
            return redirect(url_for("index", success="team_added"))
        elif adding == "name taken":
            return render_template("newTeam.html",
                error="Team name already taken")
        elif adding == "invalid key":
            return render_template("newTeam.html",
            error="Invalid Key")
        else:
            return render_template("newTeam.html",
            error="An error occured. Please try again or tell Garrick")
    return render_template("newTeam.html")

         

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

@app.route("/submit")
def submit():
    return render_template("submit.html")

if __name__ == "__main__":
    app.run(debug=True)