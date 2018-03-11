#!/bin/bash

current_dir=$PWD;cd server;gulp build;npm start;cd $current_dir;