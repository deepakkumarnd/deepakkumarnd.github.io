---
layout: post
title: "Nginx basic http auth setup"
description: "setup basic http authentication in nginx web server"
category:
tags: []
---
{% include JB/setup %}

Login as **root** user

create a file **access_cred** in **/var** in the following format

    username:encrypted_password

create encrypted password using openssl

    $ openssl passwd -crypt <password>

copy that password and create the file as specified above

Now add the following lines to server or location block in nginx config file

    auth_basic "Restricted Access";
    auth_basic_user_file /var/access_cred;

Restart nginx

    $ nginx -t reload

[reference](http://roger.steneteg.org/441/basic-authentication-with-nginx/)
