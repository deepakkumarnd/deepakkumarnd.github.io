---
layout: post
title: "Spawning Subprocesses In Ruby Scripts"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Somtimes it is required to execute some unix system command within your
ruby script. For that ruby provides a variety of ways.

you can use backquotes to execute a unix system command 

    `ls -al`

or 

    %x{ls -al}

or even system method

    system("ls -al")

Apart from these ruby provides a IO.popen which spawns a subprocess and creates a pipe
or IO stream between ruby interpreter and the subprocess. So the interesting thing is 
you can send the input to this subprocess as a standard input also you can get the 
standard output of this subprocess. Here is a small example.

    def run_command(command, input = '')
      IO.popen(command, 'r+') do |pipe|
        pipe.puts input
        pipe.close_write
        pipe.read
      end
    end
    
    puts run_command "wc -w", "How many people are here"

Here we have opened an IO stream in read write mode and we wrote our input to the
stream. Once the write to the stream is done we have to close the stream in order to 
continue the subprocess. The output produced to the standard output of the sub process 
can be read from the pipe using the read method.


But what if the sub process is an interactive one like passwd. Which expects a human to 
type the old password and then the new password then repeat it to confirm password. Using
ruby's expect and pty library you can mimick a human. Here is a sample program which changes the user password.

    require 'expect'
    require 'pty'

    old_password = "hell"

    PTY.spawn("passwd") do |input, output, pid|
      output.sync = true
      $expect_verbose = false
  
      input.expect("(current) UNIX password:", 30) do |response|
        output.print "#{old_password}\n" if response
      end

      input.expect(/UNIX password:/,2) do |response|
        output.print "welcome123\n" if response
      end
  
      input.expect(/UNIX password:/) do |response|
        output.print "welcome123\n" if response
      end
    end
    
Here we have spawned the passwd command and expect it to ask some questions.
We can either go with strings or regular expressions as expected strings, the 
matched block will get executed once a matching expected string is found. 
The second argument is timeout in seconds (default 999,999), which means if 
timeout is 30 expect method will wait for maximum 30 seconds before executing 
the block. 
