#!/bin/sh

#  prepare_tenant.sh
#  RNWhiteLabel
#
#  Created by Khalil EL ISMAILI on 11/03/2019.
#  Copyright © 2019 Facebook. All rights reserved.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
# echo $DIR DIR=$DIR/..

if [ "$1" != "" ]; then tenant=$1
else tenant="main"
fi

if [ ! -d "$DIR/tenant_config/$tenant/" ]; then
  # Control will enter here if $DIRECTORY exists. echo "
  echo "$DIR/tenant_config/$tenant/"
  exit
fi

if [ "${CONFIGURATION}" == "Dev" ] || [ "${CONFIGURATION}" == "Dev Debug" ]; then
  echo "DEV"
  echo "tenant_config/$tenant/.env.dev" > /tmp/envfile
elif [ "${CONFIGURATION}" == "OTA" ] || [ "${CONFIGURATION}" == "OTA Debug" ]; then
  echo "OTA"
  echo "tenant_config/$tenant/.env.ota" > /tmp/envfile
elif [  "${CONFIGURATION}" == "Release" ] || [ "${CONFIGURATION}" == "Debug" ]; then
  echo "RELEASE"
  echo "tenant_config/$tenant/.env.release" > /tmp/envfile
else
  echo "DEV"
  echo "tenant_config/$tenant/.env.dev" > /tmp/envfile
fi

source=$DIR/tenant_config/$tenant/ios/AppIcon.appiconset/*
destination=$DIR/ios/RNWhiteLabel/Images.xcassets/AppIcon.appiconset

rm -rf $destination/*
mkdir -p $destination
cp -Rf $source $destination

sourceL=$DIR/tenant_config/$tenant/ios/LaunchImage.launchimage/*
destinationL=$DIR/ios/RNWhiteLabel/Images.xcassets/"LaunchImage.launchimage"

rm -rf $destinationL/*
mkdir -p $destinationL
cp -Rf $sourceL $destinationL

echo "Pre-build has executed successfully!"
