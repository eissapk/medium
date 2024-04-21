#!/bin/bash

[ -d $PWD/../backend/client ] && rm -r $PWD/../backend/client
[ -d $PWD/dist ] && cp -r $PWD/dist $PWD/../backend/client