Angular + Express + Sequelize
=============================
A simple login seed built with an [Angular](http://angularjs.org/) frontend and an [Express](http://expressjs.com/) + [Sequelize](http://sequelizejs.com/documentation) (MySQL) backend.

Kickstarted with [Angular-Express-Seed](https://github.com/btford/angular-express-seed).

To start a project simply clone this repository. No need to install the dependencies. You must have MySQL installed. 

The default database name is "angularexpress". This can be changed [here](https://github.com/sanderblue/angular-express-mysql/blob/master/app.js#L39).

Setup
=====
First access MySQL via the command line.

Create the database:
``` sql
create database angularexpress;
```

Then run: 
``` bash
node app.js
```