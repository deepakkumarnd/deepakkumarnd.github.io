---
layout: post
title: "Constucting Image With HTML"
description: ""
category: 
tags: []
---
{% include JB/setup %}

For a long time I was wondering how people have created images using 
pure html and css. Initially I thought they might have done it with 
the help of some image editor in some other complicated way. Then I came 
across ImageMagick library which provides so many image manipulation
methods.

For doing image manipulation in ruby you can use the very famous rmagick
gem. So here is a program below which will accept an image filename as 
input and produces an html file with the complete image constructed using 
html and css style. But I am sure there will be better ways to do that.

    #!/usr/bin/env ruby

    require 'RMagick'

    class ImageGenerator
      def initialize(path)
        exit unless File.exists? path
        @title  = File.basename(path).split('.').first
        @image  = Magick::Image.read(path)[0]
        @output = File.new("index.html", "w+")
        generate
        @output.close
      end

      def generate
        output = "<!DOCTYPE html><html><head><title>#{@title}</title><style></style>
	              </head><body><table cellspacing=0px >"
    
        (0...@image.rows).each do |r|
          row = "<tr>"
          (0...@image.columns).each do |c| 
            pix = @image.get_pixels(c, r, 1, 1)
            row += "<td style=\"background-color:#{@image.to_color(pix.first)};\"></td>"
          end
	      row += '</tr>'
          output += "#{row}"
        end
    
        output += '</table></body></html>'
        @output.puts(output)
      end
    end

    ImageGenerator.new(ARGV.first) if ARGV.first

The idea is to map each pixel in the image to an html table. By styling each cell in the 
table with the corresponding pixel color we can reconstruct the image in html.
