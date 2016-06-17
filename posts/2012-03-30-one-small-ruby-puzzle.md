---
layout: post
title: "One Small Ruby Puzzle"
description: "A small metaprogramming puzzle"
category: 
tags: []
---
{% include JB/setup %}

One day I was going through the famous book Metaprogramming Ruby. This piece of code caught my attention.

	class Roulette
  	  def method_missing(name, *args)
        person = name.to_s.capitalize
        3.times do
          number = rand(10) + 1
          puts "#{number}..."
        end
        "#{person} got a #{number}"
  	  end
	end

	number_of = Roulette.new
	puts number_of.bob
	puts number_of.frank

Here the class Roulette overrides the method_missing method. The puzzle is to predict the output of the program. At the first look we may end up in a very quick solution. So since there is no method like bob and frank obviously the method missing gets called and we expect six random numbers as the output, but the actual output is something crazy. The program enters in a recurssive call and crashes due to lack of memory.

So lets see what exactly happend here. For the first call number_of.bob the block is executed 3 times and produces three random numbers. The very first line after that is

	"#{person} got a #{number}"

so here the interpreter looks for a variable named number in the current scope and it will fail to find one because ruby has a block scope ie local variables defined inside a block are not accessible outside the block. Here the number is defined inside the loop which has a block scope. So number results in a method call and is handled by method_missing as there is no method named "number". So method_missing gets called each time this line encounters which causes an infinite recursion and the program crashes.