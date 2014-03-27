---
layout: post
title: "Deployment Using Capistrano 3"
description: "Deploy a web application using capistrano 3"
category:
tags: []
---
{% include JB/setup %}

Capistrano is a remote server automation and deployment tool written in Ruby. It is one of the best deployemnt tool availabel today. Capistrano is generic it can be used to deploy any application remotely.

### Installation

    $ gem install capistrano

or you can specify the gem in a Gemfile as follows, in ruby based projects (Rails, Sinatra etc)

    group :developemnt do
      gem 'capistrano'
    end

check the version of installed capistrano using **cap** command

    $ cap -V                               # or cap --version
    Capistrano Version: 3.0.1 (Rake Version: 10.1.0) ###

Capistrano version 3 is **multistaged** by default means you can setup your application to deploy in differnt environments (production, staging etc) without installing additional plugins.

Capistrano comes with a bunch of default task which you can list using.

    $ bundle exec cap -vT                  # or simply cap -vT

Here I am going to describe deploying a sinatra application to my VPS using capistrano. So lets say I have a sinatra application named 'foobar' which is production ready and needs to be deployed to a VPS. The very basic deployment can be summarised in four steps.

**step1 :** Add capistrano gem to Gemfile and run bundle command to install it

    group :development do
      gem 'capistrano'
    end

    $ bundle

**step2 :** Install capistrano in your application

    $ bundle exec cap install

This will add the following files to your application

    Capfile
    config/deploy.rb
    config/deploy/production.rb
    config/deploy/staging.rb
    lib/capistrano/tasks          # directory

**setp3 :** Edit the deploy.rb file and put the global configuration here

The file deploy.rb is generic to all the environments so edit this file to put general configuration, You can override the configuraion in the corresponding environment files later.

The set command is used to set static configurations.

    set :application, 'foobar'                       # application name
    set :repo_url, 'git@example.com:me/foobar.git'   # your repo url
    set :branch, 'master'                            # branch to be deployed
    set :keep_releases, 2                            # keeps only two copies of deployments

The **keep_release** option above will keep upto 2 versions and deletes the previous deployments
If you want to input something while deploying like specifying branch name during deployment you can use **ask** command.

    ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

If you don't input anything the proc will be evaluated and branch will get assigned to the result.
Set the directory to which you want to deploy your application, and specify the version control used.
Here I have a deploy user in my VPS.

    set :deploy_to, '/home/deploy/apps/foobar'
    set :scm, :git

The following options are also available for configuring capistrano output

    set :format, :pretty
    set :log_level, :debug
    set :pty, true

**step4 :** Configure the environment file

Now it is the time to modify the environment file just open your environemnt file say deploy/production.rb.
Set the stage variable

    set :stage, :production

Now change the roles

    role :app, %w{deploy@<vps_ip_address>}
    role :web, %w{deploy@<vps_ip_address>}
    role :db,  %w{deploy@<vps_ip_address>}

You can define as many roles as you need, also each role can have an array of servers as the second argument

    eg: role :queue, %w{ queue@server1 queue@server2 ...}

When you execute a task on a particular role, the generated command runs in all these servers with that role.
Here deploy is my deployment user on VPS, Rememmber you need to sign in to VPS and add your ssh key in ~/.ssh/authorizeds_keys in order to deploy your application.
Done

You can make use of capistrano plugins to easily add tasks such as bundle, asset compilation etc

For using rvm you can use.

    require 'capistrano/rvm'

You can require the bundle plugin to run the bundle command

    require 'capistrano/bundler'

If you are using puma server then you can use the puma plugin to start, stop and restart the server.

    require 'capistrano/puma'

If you are using a rails applicaiton you can use the following tasks too.

    require 'capistrano/rails/assets'
    require 'capistrano/rails/migrations'

You can now deploy your application by running

    cap production deploy