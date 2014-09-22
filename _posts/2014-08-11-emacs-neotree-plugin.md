---
layout: post
title: "Emacs Neotree Plugin"
description: "An easy to use navigation sidebar for emacs"
category:
tags: []
---
{% include JB/setup %}

Emacs's neotree plugin provides a filebrowser sidebar. You can use it in a project to browse files, It also provides functionality like create, delete or rename your files.

You can install it in emacs 24.x from the built in package manager by typing

    M-x install-package

Search for the package using C-s and install it by pressing enter key

Once installed just add the following line to .emacs file to access it.

    (require 'neotree)
    (global-set-key [f8] 'neotree-toggle)

That's it, Now you will be able to access this in emacs using pressing key f8.