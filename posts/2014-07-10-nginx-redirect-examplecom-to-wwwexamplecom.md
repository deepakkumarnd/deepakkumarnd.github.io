---
layout: post
title: "Nginx Redirect example.com to www.example.com"
description: "redirect example.com to www.example.com Nginx"
category:
tags: []
---
{% include JB/setup %}

It is advised to go with either www or without www format for your domain name.

Login as root and add the following lines in nginx config file

    server {
        listen 80;
        server_name example.com;
        return 301 http://www.example.com$request_uri;
    }

now restart nginx

    $ nginx -t reload
