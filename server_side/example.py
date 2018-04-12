from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!"

@app.route("/message")
def message():
    // Handle your post message
    return "Hello World!"


if __name__ == "__main__":
    app.run()