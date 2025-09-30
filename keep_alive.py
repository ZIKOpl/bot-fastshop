from flask import Flask
from threading import Thread
import os

app = Flask('')

@app.route('/')
def home():
    return "Bot Discord en ligne 🚀"

def run():
    port = int(os.environ.get("PORT", 10000))  # Render fournit $PORT automatiquement
    app.run(host="0.0.0.0", port=port)

def keep_alive():
    t = Thread(target=run)
    t.start()
