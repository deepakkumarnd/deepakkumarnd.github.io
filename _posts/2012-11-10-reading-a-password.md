---
layout: post
title: "Reading A Password"
description: ""
category: 
tags: []
---
{% include JB/setup %}

For a long time I was trying to figgure out a way to read password or
secret keys from the console. I like the way in which unix systems or
mysql asks the password, the first one hides the keys typed and the 
later prints * instead of the actual charator. Finally I got the solution
using highline library. In ruby we could do that so easily.


    require 'highline/import'
    
    ask("Secret Key:> ") { |k| k.echo = "*" }
 
 This will print the * charactor instead of actual ascii charactor while you 
 are typing the secret key. If you don't want to display anything like the 
 unix passwd command then turn the echo off by doing the following.

    ask("Secret Key:> ") { |k| k.echo = false }

