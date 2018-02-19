from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)

class Video_lista(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lista = db.Column(db.String(120000), unique=False, nullable=False)