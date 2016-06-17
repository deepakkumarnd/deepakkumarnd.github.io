---
layout: post
title: "Some Use Cases That Makes Ruby Programming A Lot Easier"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Ruby is a facinating language, It's flexibible enough to easily extend the language and powerfull 
enough to make coding a breeze. Being a C programmer for a long time, my early ruby coding was a 
kind of C style. I didn't even realized my coding was so bad. Then I slowly came to aware of ruby 
community and conventions to be followed while writing ruby code. I was also exposed to the test 
driven development which I hate untill I got surprised by it's it's importantance.

Ruby provides a lot of built in programming tools(features) which makes coding a lot easier. So I 
want to discuss few of them which I felt really cool.

Lambda & Proc
-------------

I found lambda and Proc so much interesting but wasn't able to figgure out their proper usage.
Basically both are block of code which can be executed, passed or assigned just like a variable.
You can create a block of code as follows.

    myproc = Proc.new do |var|
      # some piece of code
    end
or

    mylambda = lambda do |var|
      # some piece of code
    end

So now you have a block of code assigned to a variable which can be executed at will by a call 
method.
    
    myproc.call

You can pass arguments to it as follows so that the block variables are assigned these values.

    myproc.call(10)

You can assign the proc on some other variable.

    new_proc = myproc

You can pass the block to some methods
    
    def foo block
      block.call
    end

    foo myproc

So if you want to reuse the code and doesn't worth making a method the you can go with proc or
lambda. For example I have a class Student.

    class Student
      def initialize(name)
	    @name = name
      end
      ...
    end

suppose I have 30 students, students = \[s1,s2,s3...s30\] and I want list of their name in camel
case then I can use proc to do that neatly.

    camelize = Proc.new { |var| var.name.capitalize if name.present? }
    students.collect(&camelize)

Thats it here I can avoid a method and still I'm able to reuse the code.