from flask import Flask
import os
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!"

@app.route("/message")
def message():
    # Handle your post message
    return "Hello Message!"


if __name__ == "__main__":
    app.run()