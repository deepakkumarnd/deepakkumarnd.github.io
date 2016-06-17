---
layout: post
title: "Few steps to make your rails application secure"
description: ""
category:
tags: []
---
{% include JB/setup %}

Every application can be vulnerable at one point or another, a single breach could take down the entire system. In case of rails application we have seen some really dangerous breaches in the past especially in github. Think of someone taking down github what will happen to our life? The situation can be a digital catastrophe. To avoid such dangers one must be vigilant while coding to avoid at least the known dangers. Here are a few of them to be kept in mind.

1. Avoid using your own authentication methods use already existing battle tested libraries like devise or authlogic.
For example

        def encrypt(password)
            salted_password = SALT + password
            self.encrypted_password = Digest::SHA1.hexdigest(salted_password)
        end

   Here the SHA1 algorithm is used to hash the password which is not a good encryption method. SHA1 is a fast algorithm which makes brute force attack easier.

   Second thing is salted password here, which is same for all the users can be a great security risk. The salted password is prepended with each user generated password. The salted password must be a random key generated for each user.

2. Avoid using servers like webrick which returns the server informations like server version and rails ruby version.
For example WeBrick returns the following information.

        HTTP/1.1 200 OKS
        Server: WEBrick/1.3.1 (Ruby/1.9.3/2012-04-20)

3. YAML related issues.

        class Post < ActiveRecord::Base
            serialize :tags
        end

   If you have stored some user supplied data in the tags which when loaded later may result in executing the stored data. This may be a piece of code supplied by the user, a Remote Code Execution happens here, If the user provides some malicious code this could risk be a great security risk.

   A better approach is to use JSON for serialization of user supplied data, because when the data is deserialized it won't produce executable code.

        class Post < ActiveRecord::Base
            serialize :tags, JOSN
        end