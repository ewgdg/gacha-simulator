#!/bin/bash
rm -r functions/.nuxt
cp -r .nuxt functions
rm -r functions/.nuxt/dist/client
read -p "Press enter to continue"
