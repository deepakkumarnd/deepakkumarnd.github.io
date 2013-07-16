---
layout: post
title: "Use puma as application server in a rails application"
description: ""
category:
tags: []
---
{% include JB/setup %}

Puma server setup in a rails application
========================================
[Puma](http://puma.io) is a simple, fast, threaded, and highly concurrent HTTP 1.1 server for Ruby/Rack applications
developed by [Engine Yard](https://engineyard.com).

Install puma server
-------------------
    gem install puma
or add gem 'puma' in Gemfile then run the bundle command.

Deployment
----------
Puma comes with a built in capistrano recipes for starting stoping and restarting the puma server.
In order to use these built in tasks add the following line to deploy.rb

    require 'puma/capistrano'

The above line provdes these cap tasks you can use them as follows.

    $ bundle exec cap puma:start
    $ bundle exec cap puma:restart
    $ bundle exec cap puma:stop

Configuration
-------------

Add a configuration file for puma in config directory

    touch config/puma_env.rb

Sample configuration file is [here](https://github.com/puma/puma/blob/master/examples/config.rb)
All details of available configuration is [here](https://github.com/puma/puma/blob/master/lib/puma/configuration.rb)

Actually you don't have to do any configuration for using puma, if you include the capistrano recipe then puma requires
zero configuration to use.

Now just deploy your application

    cap deploy:setup
    cap deploy:cold
    cap deploy

