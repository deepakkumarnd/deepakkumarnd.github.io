---
layout: post
title: "Creating ruby module function using 'module_function'"
description: "creating ruby module function using 'module_function'"
category:
tags: [ruby module]
---
{% include JB/setup %}

While going through rake source code I came across a function named module_function. I googled about it and came to know that it provides an easy way to create module functions where the receiver is the module itself. Take an example of a Sample module.

    module Sample
      def random_string
        # generates a random string
        [('A'..'Z'), ('a'..'z'), ('0'..'9')].map(&:to_a).reduce(:+).shuffle.take(8).join
      end

      module_function :random_string
    end

    Sample.random_string # =>  "NMHPXydR"

The method random_string can be invoked on the module itself. If you include the module in a class then this method becomes private to that class's instance.

    class A
      include Sample

      def generate_random_string
        random_string    # private method call
      end
    end

    o = A.new
    o.generate_random_string  # => "GQV1j0OK"

Another interesting thing about this method is the module maintains an original copy even if you override the method. In order to understand it lets take an example. Lets override the random_string method in the Sample module.

    module Sample

      # override random_string
      def random_string
        # generates a random string containing only numbers
        (0..9).map(&:to_s).shuffle.join
      end
    end

Now if you call the mehtod using on instance of class A you will get the new method

    o.generate_random_string   # =>  "8073541692"

But the module method is the same

    Sample.random_string       # => "VBkj5fMd"

I found it is very interesting and easy to create module methods hope you also feel so.