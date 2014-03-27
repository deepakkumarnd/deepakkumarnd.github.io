---
layout: post
title: "Use readable urls in your rails application"
description: "Readable URL in your rails application"
category:
tags: []
---
{% include JB/setup %}

When you develop a rails application say a blog application, the framework uses the database id to identify an individual blog post. So the url to an individual post looks like

    foo.com/posts/122

If you share this url to someone it is really hard to guess the contents of the post without going to the actual post.

One way to solve this issue is to use friendly url rather than using just the id of the post. The simplest way is to simply override the **to_param** method in your model.

    class Post < ActiveRecord::Base
      def to_param
        "#{id}-#{title}".parameterize
      end
    end

So now onwards you will have a readable url in your blog posts, somthing like

    foo.com/posts/22-friendly-id

If you apply **to_i** to a string in ruby which starts with a number you will get that number back

    '22-friendly-id'.to_i => 22

The **Post.find** uses the same mechanism internally so that you don't have to change anything else.

But what if you want to get rid of the id parameter? You will have to do some hardwork for that. Luckily a quick google search gave me an awesome gem called [friendly_id](https://github.com/norman/friendly_id) which solves this issue in a very few steps.

# Steps to use FriendlyId

## Installation

  Add the following line to your **Gemfile**

    gem 'friendly_id', '~> 5.0.0'

## Run the generator command

    rails generate friendly_id

  You need to add a slug field in your model to use friendly_url

    rails generate scaffold post title:string slug:string

or if you already have a post model

    rails generate migration add_slug_to_posts slug:string

## Add a database index on the slug field for faster access

  open the corresponding migration file and add an index to slug field

    class AddSlugToPosts < ActiveRecord::Migration
      def change
        add_column :posts, :slug, :string
        add_index :posts, :slug, unique: true
      end
    end

## Run migration

  rake db:migrate

## Add the friendly id module in the model file

    class Post < ActiveRecord::Base
      extend FriendlyId
      friendly_id :title, use: :slugged
    end

## Done now update your previous records

    rails c
    >> Post.find_each(&:save)

  Now you will have friendly readable urls in your applicaion, restart your application and go to any post to see the changed url.

# Accessing the individual post using new url

  Now we have a readable url but in the latest version of **FriendlyId** they haven't modified the **Model#find** method to use the new changed url. So to use that you have to the new format.

    Post.friendly.find(params[:id])

  You may also edit the config file **config/initializers/friendly_id.rb** of your rails application root directory.