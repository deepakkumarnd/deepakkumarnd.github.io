---
layout: post
title: "Ruby On Rails Configure rspec, guard and spring with libnotify"
description: "Ruby On Rails Configure rspec, guard and spring with libnotify"
category:
tags: []
---
{% include JB/setup %}

Tested with Rails 4.0.3, rspec 3.0.2, Gurad 2.6.1

Install **libnotify** in debian or ubuntu for getting screen notifications

    $ sudo apt-get install libnotify-bin

In your Gemfile add

    group :development, :test do
        gem "libnotify"
        gem "rspec-rails", "~> 3.0.0"
        gem "spring-commands-rspec"
        gem "guard-rspec"
        gem "rb-inotify" if `uname` =~ /Linux/
    end

    group :test do
        gem "factory_girl_rails"
        gem "simplecov", require: false
    end

In .rspec add

    --color
    --format documentationrun

Go to command line and run

    $ bundle
    $ rails generate rspec:install

Edit **spec_helper.rb**

    require "rubygems"
    require "simplecov"
    SimpleCov.start
    ENV["RAILS_ENV"] ||= "test"
    require File.expand_path("../../config/environment", __FILE__)
    require "rspec/rails"
    require "pundit/rspec"

    Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
    ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

    RSpec.configure do |config|
        config.fixture_path = "#{::Rails.root}/spec/fixtures"
        config.use_transactional_fixtures = true
        config.order = "random"
        config.include FactoryGirl::Syntax::Methods
        config.include Devise::TestHelpers, :type => :controller
    config.infer_spec_type_from_file_location!

    end

    $ guard init

Go to your Guardfile and change line **guard :rspec do** to **guard :rspec, cmd: "bin/spring rspec" do**

Generate stubs to run spring

    $ spring binstub --all

Now you can happily run

    $ guard