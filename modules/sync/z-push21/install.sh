#!/bin/bash

VERSION="2.1.3-1892";
URL="http://download.z-push.org/final/";

FOLDER=`echo $VERSION | cut -c 1-3`;
FOLDERLOCAL=`echo $FOLDER | sed -e 's/\.//g'`;

cd `dirname "$0"`

rm -f z-push-$VERSION.tar.gz
rm -Rf ../../z-push*

wget ${URL}/${FOLDER}/z-push-$VERSION.tar.gz

tar zxf z-push-$VERSION.tar.gz
mv z-push-$VERSION ../../z-push${FOLDERLOCAL}

cp -R backend/go ../../z-push${FOLDERLOCAL}/backend
cp config.php ../../z-push${FOLDERLOCAL}

rm -f z-push-$VERSION.tar.gz
echo "z-push_${VERSION} installed!"
