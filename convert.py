import os
import ffmpy

inputdir = '/home/astro/Downloads/juegos_videos'

for filename in os.listdir(inputdir):
    actual_filename = filename[:-4]
    if(filename.endswith(".mp4")):
      #os.system('ffmpeg -i {} -c:v libvpx -b:v 1M -c:a libvorbis  {}.ogg'.format(filename, actual_filename))
      os.system('ffmpeg -i {} -c:v libtheora -b:v 3M  -c:a libvorbis -y  {}.ogv'.format(filename, actual_filename))
      print filename



#convierte a .ogg audio
#os.system('ffmpeg -i {} -vn -acodec libvorbis -y  {}.ogg'.format(filename, actual_filename))