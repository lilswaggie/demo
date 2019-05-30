#!/bin/sh

PKG="/opt/tomcat-repo/webapps/sotn-webapp/package/build.tar.gz"

if [ ! -f $PKG ]; then
  exit 1
fi

rm -rf /opt/tomcat-repo/webapps/sotn/*
cd /opt/tomcat-repo/webapps/sotn/
cp $PKG ./
tar -zxvf build.tar.gz
mv build/* ./
rm -rf build build.tar.gz

#ps -Af | grep http-server | grep 4204 | awk '{print "kill -9 " $2}' | sh

#echo [STOPPED]

