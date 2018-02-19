from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)

class Video_lista(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lista = db.Column(db.String(120000), unique=False, nullable=False)

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(120000), unique=False, nullable=False)
    nom_video = db.Column(db.String(120000), unique=False, nullable=False)
    ip = db.Column(db.String(50), unique=False, nullable=False)
"""
 lista_video = Video_lista.query.get(1)
    if lista_video: 
        video = json.loads(var.lista)[0]
    else:
        video_files = [f for f in os.listdir(video_dir) if f.endswith('mp4')]
        video = video_files[0]
    db.session.commit()
    db.session.close()
    """