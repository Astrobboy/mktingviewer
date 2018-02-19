import os
import simplejson
import traceback
import json

from flask import Flask, request, render_template, redirect, url_for, send_from_directory, g
from flask_socketio import SocketIO,send, emit
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from werkzeug import secure_filename

from lib.upload_file import uploadfile

from model import Video_lista, db, Url

video_dir = os.getcwd()+'/data/'
vide = '../data/'



app = Flask(__name__)
app.config.from_pyfile('config.cfg')


ALLOWED_EXTENSIONS = set(['mp4', 'png'])
IGNORED_FILES = set(['.gitignore'])

db = SQLAlchemy(app)
bootstrap = Bootstrap(app)
socketio = SocketIO(app)

def saber_ip():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    return ip    

@socketio.on('message')
def handle_message(message):
    g.ul = message
    print('received message: ' + message)

@socketio.on('json')
def handle_json(json):
    send(json, json=True)


@socketio.on("connect")
def handle_connection():
    video_files = Video_lista.query.get(1)
    emit("lista", json.dumps(video_files.lista))

@socketio.on("url_change")
def handle_url(url, nom_video):
    ip = saber_ip()
    url_guardar = Url.query.filter_by(ip=ip).first()
    if url.ip == ip:
        url_guardar.url = url
        url_guardar.nom_video = nom_video
        url_guardar.nom_video = ip
        db.session.merge(url_guardar)
        db.session.commit()
        db.session.close()
    else:
        url_guardar.url = url
        url_guardar.nom_video = nom_video
        url_guardar.nom_video = ip
        db.session.merge(url_guardar)
        db.session.commit()
        db.session.close()


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i += 1

    return filename


def create_thumbnail(image):
    try:
        base_width = 80
        img = Image.open(os.path.join(app.config['UPLOAD_FOLDER'], image))
        w_percent = (base_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((base_width, h_size), PIL.Image.ANTIALIAS)
        img.save(os.path.join(app.config['THUMBNAIL_FOLDER'], image))

        return True

    except:
        print traceback.format_exc()
        return False


@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        files = request.files['file']

        if files:
            filename = secure_filename(files.filename)
            filename = gen_file_name(filename)    
            mime_type = files.content_type

            if not allowed_file(files.filename):
                result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")

            else:
                # save file to disk
                uploaded_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
		print app.config['UPLOAD_FOLDER'], filename
                print uploaded_file_path
		files.save(uploaded_file_path)
                # create thumbnail after saving
                if mime_type.startswith('image'):
                    create_thumbnail(filename)
                
                # get file size after saving
                size = os.path.getsize(uploaded_file_path)

                # return json for js call back
                result = uploadfile(name=filename, type=mime_type, size=size)
            return simplejson.dumps({"files": [result.get_file()]})

    if request.method == 'GET':
        # get all file in ./data directory
        files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'],f)) and f not in IGNORED_FILES ]
        
        file_display = []

        for f in files:
            size = os.path.getsize(os.path.join(app.config['UPLOAD_FOLDER'], f))
            file_saved = uploadfile(name=f, size=size)
            file_display.append(file_saved.get_file())

        return simplejson.dumps({"files": file_display})

    return redirect(url_for('biblioteca'))


@app.route("/delete/<string:filename>", methods=['DELETE'])
def delete(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_thumb_path = os.path.join(app.config['THUMBNAIL_FOLDER'], filename)

    if os.path.exists(file_path):
        try:
            os.remove(file_path)

            if os.path.exists(file_thumb_path):
                os.remove(file_thumb_path)
            
            return simplejson.dumps({filename: 'True'})
        except:
            return simplejson.dumps({filename: 'False'})


# serve static files
@app.route("/thumbnail/<string:filename>", methods=['GET'])
def get_thumbnail(filename):
    return send_from_directory(app.config['THUMBNAIL_FOLDER'], filename=filename)


@app.route("/data/<string:filename>", methods=['GET'])
def get_file(filename):
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER']), filename=filename)


@app.route('/', methods=['GET', 'POST'])
def biblioteca():
    return render_template('biblioteca.html')

@app.route('/cargar_lista', methods=['GET', 'POST'])
def cargar_lista():
    video_files = [f for f in os.listdir(video_dir) if f.endswith('mp4')]
    return render_template('cargar_lista.html', videos=video_files)
	#return renter_template('selecciona.html', ruta='/')


@app.route('/play', methods=['GET'])
def play():
    ip = saber_ip()
    url_enviar = Url.query.filter_by(ip=ip).first()
    video = url_enviar.nom_video
    db.session.commit()
    db.session.close()
    return render_template('repro_video.html', video = vide + video)
 

@app.route('/video/<nombre>',methods=['GET'])
def videos_mostrar(nombre):
    if (nombre):
    	video = vide + nombre
    	return render_template('repro_video.html', video = video )
    return redirect(url_for('/play'))


@app.route('/selecciona',methods=['GET'])
def selecciona():
    return render_template('selecciona.html')

@app.route('/cargar_db',methods=['GET', 'POST'])
def cargar_db():
    if request.method == 'POST':
        lista = request.form.getlist('select_video')
        list_videos = Video_lista.query.get(1)
        list_videos.lista = json.dumps(lista)
        db.session.merge(list_videos)
        db.session.commit()
        db.session.close()
        ip = saber_ip()
        url_guardar = Url.query.filter_by(ip=ip).first()
        if url_guardar.ip == ip:     
            url_guardar.url = 'http://192.168.100.21/play'
            url_guardar.nom_video = lista[0]
            url_guardar.ip
            db.session.merge(url_guardar)
            db.session.commit()
            db.session.close()
        else:
            url_guardar.url = 'http://192.168.100.21/play'
            url_guardar.nom_video = lista[0]
            url_guardar.ip
            db.session.add(url_guardar)
            db.session.commit()
            db.session.close()
    return render_template('biblioteca.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
