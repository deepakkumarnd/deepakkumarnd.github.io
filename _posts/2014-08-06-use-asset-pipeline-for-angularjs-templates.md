---
layout: post
title: "Use asset pipeline for angularjs templates"
description: "Use asset pipeline for angularjs templates"
category:
tags: []
---
{% include JB/setup %}

In your Gemfile add the following gems

    gem 'angularjs-rails'
    gem 'angular-rails-templates'

require them in application.js also require the template directory too which is **app/assets/templates** in this case.

    //= require angular
    //= require angular-rails-templates
    //= require ../templates

Now in your angular initializer file config.js.coffee

    window.App = angular.module('App', [ 'templates']);

Now your will be able to access your templates with just the filename eg: home.html

The templates can be made of any other template engine, for example **home.html.slim** in template directory will be converted into **home.html** on accessing.
