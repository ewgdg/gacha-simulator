#!/bin/bash
rm -rf public/*
mkdir -p public/_nuxt
cp -r .nuxt/dist/client/* public/_nuxt
read -p "Press enter to continue"
