twistofpepper - Gourmet Twitter
=================================

## Introduction

I've had the domain name for this project for a while now, I purchased it with another
project in mind, times change, my plans change, and now I have repurposed the domain name
for a new experiment.

## Description

The server initially serves up a static html page, the application is all 
written in javascript, on the client side, sammy is used for the client side logic,
node is used on the server, after loading the page, the communication happens over websockets,
thanks to socket.io.

## Developers

For an out-of-the-box solution install from npm

		npm install twistofpepper

The application will load and be available at `http://localhost:3000/`

neat

If you're still not satisfied, you might want to grab the source.

Get the repository

		git clone http://github.com/hecticjeff/twistofpepper.git
		cd twistofpepper

Then install and get dependencies with npm

		npm link .

This will make a link to the code and put it in the npm path, so you can load up the code and
experiment with it, any changes will be available to other app immediatly.

even neater
