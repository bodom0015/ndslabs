#!/bin/bash

# Fetch the project
cd /go/src/github.com/ndslabs/apiserver
go get github.com/tools/godep
#go build -ldflags "-X main.Version=0.1alpha -X main.BuildDate=`date "+%Y-%m-%dT%H:%M:%S"`"

# Set up environment
GOOS=linux 
GOARCH=amd64 

# Now build the Go stuff
godep 
go build -o build/bin/apiserver-linux-amd64
