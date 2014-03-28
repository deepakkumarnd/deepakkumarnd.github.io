---
layout: post
title: "Schedule tasks using crontab in a ruby/rails project"
description: "schedule tasks using crontab in a ruby/rails project"
category:
tags: []
---
{% include JB/setup %}

Sometimes we might have to run some jobs repeatedly at some interval. In unix systems we can schedule such  tasks using the buitin **cron daemon**. Cron is a daemon used to execute scheduled tasks. We can use the **crontab** which helps to create scheduled tasks for an individual user.

But directly editing the crontab is bit hard, and it is painful to update the crontab to make a change. If you are in a ruby/rails project there is a wonderful **gem** called [whenever](https://github.com/javan/whenever) which can be used to schedule your crontab.

Lets take an example of sending a daily digest email of some updates to users. Lets say we have a mailer like this.

    # file: app/mailers/user_mailer.rb

    class UserMailer < ActionMailer::Base
      def digest_email_update(options)
        # ... set email options
      end
    end

Since we need to send the email as a separate process, lets create a rake task to do that. You may create a new file email_tasks.rake in lib/tasks directory of your rails application.

    # file: lib/tasks/email_tasks.rake

    desc 'send digest email'
    task send_digest_email: :environment do
      # ... set options if any
      UserMailer.digest_email_update(options).deliver!
    end

The **send_digest_email: :environment** means to load the rails environment before running the task, so that you can access the application's classes (UserMailer) in the rake task.

Now just run the command **rake -T** to view the newly created rake task. You can just test everything works fine by running the task and checking whether the email is sent or not.

At this point we have a working rake task which can be scheduled using **crontab**.

# Steps to automate the created rake task using **whenever** gem

## Install whenever gem

  add the following line to **Gemfile** and execute **bundle** command

    # file: Gemfile

    gem 'whenever', require: false

## Go to the project directory and run the **wheneverize** command

    $ wheneverize .

    This will create a schedule.rb file in **config** directory

## Edit the **schedule.rb** file to schedule our task. Lets say we need to send the digest email at 10PM every day.

    # file: config/schedule.rb

    every :day, at: '10pm' do
      # specify the task name as a string
      rake 'send_digest_email'
    end

## Update the **crontab**  to schedule the tasks using **cron**

run whenever command preview the generated schedule and then write to crontab

    $ whenever   # shows the preview

    $ whenevr -w

run whenever --help to see various options

    $ whenever --help

run **whenever -c** to clear your crontab

## Add capistrano plugin to automate the whole process

Whenever provides **capistrano** recipes to automate the crontab updating during each deployment. To do that just require the plugin.

    # file: config/deploy.rb

    require 'whenever/capistrano'

    set :whenever_environment, defer { stage }
    set :whenever_command, 'bundle exec whenever'

Done.

Other than just **rake** task **whenever** provides three more job types namely **command**, **runner** and **script**. Apart from these you may create your own job type too.

Suppose you want to create a custom job_type you can do so by defining that job_type.

    job_type :foo, '/usr/local/bin/foo :taskname :filename'

use this new job type as follows

    every 2.hours do
      foo 'somecommand', filename: 'inputfilepath'
    end