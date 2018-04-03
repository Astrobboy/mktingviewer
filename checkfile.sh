#!/bin/bash

IMG_DIR="/home/astro/mktingviewer/static/img/productos"
PRODUCT_NAME=$(echo "$1" | cut -d"/" -f5)
if ! [ -f "$IMG_DIR/$PRODUCT_NAME" ];
then
	wget $1 -P $IMG_DIR
fi
	
 	
