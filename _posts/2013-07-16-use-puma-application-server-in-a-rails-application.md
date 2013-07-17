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

Configure a reverse proxy in nginx web server
---------------------------------------------

Incase you are using nginx as the web server you can use the reverse proxy configuration for nginx as follows.

Add the following configuration in nginx.conf.

    upstream puma {
      server unix:///var/sock/puma.sock fail_timeout=0;
    }

    server {
      # listen 80 default deferred;
      server_name example.com;
      root /home/deploy/apps/example/current/public;
      location ^~ /assets/ {
	# gzip_static on;
	expires max;
	add_header Cache-Control public;
      }

      try_files $uri/index.html $uri @puma;
      location @puma {
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header Host $http_host;
	proxy_redirect off;
	proxy_pass http://puma;
      }

      error_page 500 502 503 504 /500.html;
      client_max_body_size 4G;
      keepalive_timeout 10;
    }

Now restart your nginx server

    service nginx restart
