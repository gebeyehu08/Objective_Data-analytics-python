#!/bin/sh

cd $(dirname $0)

yarn install && yarn serve
