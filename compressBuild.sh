#!/bin/bash

FILE='IEE_IO_Application_Angular'
EXT='resource'
RESOURCE_FOLDER='Salesforce/src/staticresources'
DIST_FOLDER='dist/IEE-InterlochenOnline-Application'

# remove old zip file if it exists
if [ -f $RESOURCE_FOLDER/$FILE.$EXT ]; then
   rm $RESOURCE_FOLDER/$FILE.$EXT;
   echo -e "removed old version of $FILE.$EXT\n"
else
   echo -e "$FILE.$EXT does not exist\n"
fi

if [ ! -d "$RESOURCE_FOLDER" ]; then
   mkdir -p $RESOURCE_FOLDER;
fi

if [ ! -d "$DIST_FOLDER" ]; then
  echo -e "$DIST_FOLDER does not exist\n"
  ls
fi

cd $DIST_FOLDER || exit;

# compress new version
echo -e "Compressing files to $FILE.$EXT"
zip -r "../../$RESOURCE_FOLDER/$FILE.$EXT" *

echo -e "\nFinished creating $FILE.$EXT\n"
