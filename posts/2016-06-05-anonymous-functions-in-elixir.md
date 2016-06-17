---
layout: post
title: "Anonymous functions in elixir"
description: ""
category: 
tags: [elixir]
---
{% include JB/setup %}

Anonymous functions are first class values in Elixir, they can be passed as arguments to other functions and also can be returned as a value.

Creating an anonymouse function in elixir

    f = fn(x) -> x * x end

or in short form

    f = &(&1*&1)

where &1 will be replaced by the first argument.

Invoking an anonymous function

    f.(2)   # 2*2 => 4

Anonymous function can be created out of named functions as well. For example we can make **String.upcase/1** as anonymous. By doing this we can pass them to other functions.

    g = &String.upcase(&1)

    g.("hello")  # "HELLO"

Anonymous functions has many use cases, they can be used in **Enum.map/2** function.

    names = ["Deepak", "raghu", "Akram", "Stalin"]
    Enum.map(names, g)  # ["DEEPAK", "RAGHU", "AKRAM", "STALIN]

You many use pattern matching in anonymous function, in that case you need to use the same arity.

    f = fn
      (:square, x) ->  x * x
      (:cube, x) -> x * x * x
    end
    
    f.(:square, 4)   # 16
    f.(:cube, 4)     # 64




