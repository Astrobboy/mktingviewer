"""
from os import walk, getcwd


def ls(ruta=getcwd()):
    #listaarchivos = []
    new_array = []
    for (_, subdirs, archivos) in walk(ruta):
      #elimino esta ruta
      rut = _.lstrip('srv/mediagoblin.example.org/\
        mediagoblin/user_dev/media/public/media_entries')
      #prdeno la ruta de la url
      rut = 'mgoblin_media/media_entries/' + rut + '/'
      for archivo in archivos: 
        if not '.jpg' in archivo: #agarra del array el que no tiene dentro .jpg
          new_array.append(rut+archivo)
      #listaarchivos.extend(subdirs+archivos)
    return new_array

array = ls()
new_array= []

for archivo in array:
  if not '.jpg' in archivo:
    new_array.append(archivo)
"""
# -*-  encoding: utf-8 -*-
import time
import urllib2
from os import walk, getcwd
import json


def ls(ruta=getcwd()):
    #listaarchivos = []
    new_array = []
    for (_, subdirs, archivos) in walk(ruta):
      #elimino esta ruta
      rut = _.lstrip('srv/mediagoblin.example.org/\
        mediagoblin/user_dev/media/public/media_entries')
      #prdeno la ruta de la url
      rut = 'mgoblin_media/media_entries/' + rut + '/'
      for archivo in archivos:
        if not '.jpg' in archivo:  # agarra del array el que no tiene dentro .jpg
          new_array.append(rut+archivo)
      #listaarchivos.extend(subdirs+archivos)
    return new_array

def ejecutaScript():
    #Aqui agregas en contenido de tu script o ejecutas el script dentro de un archivo .py.
    #python myscript.py
    array = ls()
    f = urllib2.urlopen('http://localhost:5000/lista', json.dumps({ "lista": array}))
    #print f.read()
    #print('Ejecutando Script...')
    time.sleep(60)


while True:
    ejecutaScript()
