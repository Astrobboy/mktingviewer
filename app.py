import os
import simplejson
import traceback
import json
import subprocess

from flask import Flask, request, render_template, redirect, url_for, send_from_directory, g
from flask_socketio import SocketIO,send, emit
from flask_bootstrap import Bootstrap
from werkzeug import secure_filename
from flask_pymongo import PyMongo
#from flask_wtf import CSRFProtect
from flask import session

from lib.upload_file import uploadfile

import time
import hashlib
from datetime import timedelta

video_dir = os.getcwd()+'/data/'
vide = '../data/'



app = Flask(__name__)
app.config.from_pyfile('config.cfg')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=61200)
mongo = PyMongo(app)
#csrf = CSRFProtect(app)

ALLOWED_EXTENSIONS = set(['mp4', 'png'])
IGNORED_FILES = set(['.gitignore'])


bootstrap = Bootstrap(app)
socketio = SocketIO(app)   


def saber_ip():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    return ip


@socketio.on("datos")
def handle_connection(json_data):
    ip = saber_ip()
    if (mongo.db.Ip.find_one({'ip': ip})):
        data_video = mongo.db.video.find_one({'_id': '1'})
        data_ip = mongo.db.Ip.find_one({'ip': ip})
        #comparo si son iguales los timepos de creacion de las listas
        if (data_ip['creacion'] == data_video['creacion']):
            # si es solo almaceno tiempo y cont
	        if (len(data_video['lista'])-1 <= data_ip['cont']):
		        data_ip['cont'] = 0 
	        else:          
 		        data_ip['cont'] = json_data['cont']
        else:
            data_ip['creacion'] = data_video['creacion']
        data_ip['tiempo'] = json_data['tiempo']
	    mongo.db.Ip.replace_one({'ip': ip}, data_ip)
        else:
            # almaceno tiempo y cont en 0 y la nueva  creacion
            data_ip['creacion'] = data_video['creacion']
            data_ip['cont'] = 0
            data_ip['tiempo'] = 0
            mongo.db.Ip.replace_one({'ip': ip}, data_ip)
    else:
        data_video = mongo.db.video.find_one({'_id': '1'})
        json_data['ip'] = ip 
        json_data['creacion'] = data_video['creacion']
        #almaceno
        mongo.db.Ip.insert_one(json_data)   


def video_default():
    video_files = [f for f in os.listdir(video_dir) if f.endswith('mp4')]
    return video_files[0]


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

@app.route('/')
def home():
    return render_template("home.html", title="home")


@app.route('/cargar_videos', methods=['GET', 'POST'])
def biblioteca():
    if 'username' in session:
        return render_template('biblioteca.html')
    return redirect(url_for('login'))

@app.route('/cargar_lista', methods=['GET', 'POST'])
def cargar_lista():
    if 'username' in session:
        video_files = [f for f in os.listdir(video_dir) if f.endswith('mp4')]
        return render_template('cargar_lista.html', videos=video_files)
    else:
        return redirect(url_for('login'))



@app.route('/play', methods=['GET'])
def play():
    time.sleep(0.3)
    ip = saber_ip()
    if(mongo.db.Ip.find_one({'ip': ip })):
        #traigo datos de tabla Ip y video para comparar sus fechas
        datos_lista = mongo.db.video.find_one({'_id': '1'})
        datos_ip = mongo.db.Ip.find_one({'ip': ip}) 
        if(datos_lista['creacion'] != datos_ip['creacion']):
            #actualizo la creacion en la tabla Ip
            mongo.db.Ip.update({"ip":ip}, {'$set':{'creacion': datos_lista['creacion']}})
            mongo.db.Ip.update({"ip":ip}, {'$set':{'cont': 0 }}) 
        #vuelvo a traer los datos de ip
        datos_ip = mongo.db.Ip.find_one({'ip': ip})  
        #preparo para enviar 
        tiempo_actual = datos_ip["tiempo"]
        cont = datos_ip["cont"]
        video = datos_lista["lista"][cont]
        return render_template('repro_video.html',
                                video = vide + video,
                                tiempo = tiempo_actual,
                                cont = cont
                                )
    else:
        datos_lista = mongo.db.video.count({'_id': '1'})
        if datos_lista: 
            #obtengo la columna 1, con el fin de obtener la creacion de la lista
            data_video = mongo.db.video.find_one({'_id': '1'})
            #Inserto el primer elemento para esta ip
            mongo.db.Ip.insert_one({
                                    "ip": ip,
                                    "cont": 0,
                                    "tiempo":  0,
                                    "creacion": data_video['creacion']
                                    })
            nom_video = mongo.db.video.find_one({'_id': '1'})
            cont = mongo.db.Ip.find_one({'ip': ip})
            video = nom_video['lista'][cont['cont']]
            return render_template('repro_video.html',
                                    video = vide + video,
                                    cont = cont['cont']
                                    )
 

@app.route('/selecciona',methods=['GET'])
def selecciona():
    return render_template('selecciona.html')

@app.route('/cargar_db',methods=['GET', 'POST'])
def cargar_db():
    if 'username' in session:
        if request.method == 'POST':
            #compruebo y creo collection video
            if (mongo.db.video.find({})):
                #consulto si existe 0 = false, 1 = true
                if(mongo.db.video.count({'_id': '1'})):
                    #si existe cambia la lista
                    lista = request.form.getlist('select_video')
                   #obtengo datos de db, y cambio lista
                    mongo.db.video.replace_one({"_id":"1"}, {"lista":lista, "creacion": time.strftime('%l:%M %p %Z on %b %d, %Y')})
                else:
                    # si no existe crea la lista
                    mongo.db.video.insert_one({"_id":"1", "lista":[f for f in os.listdir(video_dir) if f.endswith('mp4')], "creacion": time.strftime('%l:%M %p %Z on %b %d, %Y') })
        return redirect(url_for('cargar_lista'))
    else:
        return redirect(url_for('login'))

@app.route('/producto/<id>',methods=['GET'])
def index(id):
    producto = mongo.db.producto.find_one_or_404({'codigo': id})
    ruta = '../static/img/productos/'
    link_images_static = []
    for link in producto['link_images']:
        os.system("/bin/checkfile " + link)
        link_images_static.append(ruta + link.split("/")[-1])
    return render_template('index.html',
                            title = producto['title'],
                            link = link_images_static,
                            code = producto['codigo'] )

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if (username != "" and password != ""):
            if (mongo.db.usuario.find_one({'username': username}) and mongo.db.usuario.find_one({'password': hashlib.new("sha1", password).hexdigest()})):
                session['username'] = username
                return redirect(url_for('biblioteca'))
            else:
                return render_template('login.html', title = 'Login', tipo = "message_info(1);")
        else:
            return render_template('login.html', title = 'Login', tipo = "message_info(2);")
    return render_template('login.html', title = 'Login')

@app.route('/logout', methods = ['GET'])
def logout():
    if 'username' in session:
        session.pop('username')
    return redirect(url_for('login'))

@app.route('/nuevo_usuario', methods = ['GET', 'POST'])
def nuevo_usuario():
    if 'username' in session:
        if(session['username'] == 'root'):
            if request.method == 'POST':
                username = request.form['username']
                password = request.form['password']
                if (username != "" and password != "" ):
                    mongo.db.video.insert_one({'username': username, 'password': hashlib.new("sha1", password).hexdigest() })
                    return render_template('crear_usuario.html', title = 'Nuevo_User', tipo='message_info(3);')
                else:
                    return render_template('crear_usuario.html', title = 'Nuevo_User', tipo='message_info(2);')
            else:
                return render_template('crear_usuario.html', title = 'Nuevo_User') 
        else:
            return render_template('home.html', title = "Home", tipo='message_info(4);')
    return redirect(url_for('login'))

#para obtener cookie
#request.cookies.get('nomcookie')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
