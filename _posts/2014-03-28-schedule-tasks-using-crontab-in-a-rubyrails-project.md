---
layout: post
title: "Schedule tasks using crontab in a ruby/rails project"
description: "schedule tasks using crontab in a ruby/rails project"
category:
tags: []
---
{% include JB/setup %}

Sometimes we might have to run some jobs repeatedly at particular intervals of time say backup logs, sending emails etc. In unix systems we can schedule such tasks using the buitin cron daemon. Cron is a daemon used to execute scheduled tasks. Unix systems provides a command **crontab** which allows to create scheduled tasks for an individual user.

Cron  searches  its  spool area (/var/spool/cron/crontabs) for crontab files and load them into memory.  File in this directory should not be accessed directly - the crontab command should be used to access and update them. you can use the following command to edit your own crontab file.

    $ crontab -e

For example suppose you want to backup your log directory every day at 1:10 AM add the following line to the crontab.

    10 1 * * * *  /path/to/your/backup/script.sh

Cron uses section 10 1 * * * * to figgure out the schedule to execute the job. To understand the format here is the cron mapping of each field.

    * * * * * *
    | | | | | |
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
    | | | +------ Month of the Year (range: 1-12)
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)

But directly editing the crontab is bit hard, and it is painful to update the crontab to make a change. If you are in a ruby/rails project there is a wonderful gem called **whenever** which can be used to schedule your crontab.

Lets take an example of sending a daily digest email of some updates to users. Lets say we have a mailer like this.

    # file: app/mailers/user_mailer.rb

    class UserMailer < ActionMailer::Base
      def digest_email_update(options)
        # ... email sending logic goes here
      end
    end

Since we need to send the email as a separate process, lets create a rake task to do that. You may create a new file email_tasks.rake in lib/tasks directory of your rails application.

    # file: lib/tasks/email_tasks.rake

    desc 'send digest email'
    task send_digest_email: :environment do
      # ... set options if any
      UserMailer.digest_email_update(options).deliver!
    end

The **send_digest_email: :environment** means to load the rails environment before running the task, so that you can access the application's classes (**UserMailer**) in the rake task.

Now just run the command **rake -T** to view the newly created rake task. You can just test everything works fine by running the task and checking whether the email is sent or not.

At this point we have a working rake task which can be scheduled using **crontab**.

## Steps to automate the created rake task using whenever gem

Install whenever gem

add the following line to Gemfile and execute bundle command

    # file: Gemfile

    gem 'whenever', require: false

Install the gem by running bundle command

    $ bundle

Now go to the project directory and run the wheneverize command to create a schedule file

    $ wheneverize .

This will create a **schedule.rb** file in **config** directory of your rails application.
Edit the schedule.rb file to schedule our task. Lets say we need to send the digest email at 10PM every day.

    # file: config/schedule.rb

    every :day, at: '10pm' do
      # specify the task name as a string
      rake 'send_digest_email'
    end

Just run whenever command to get a preview of the generated schedules in the actual cron format.

    $ whenever

You can verify the created schedule and then update your crontab using

    $ whenever -w

run whenever --help to see various options available

    $ whenever --help

In order to clear your crontab run the following command

    $ whenever -c

# Custom Job types

Other than just rake task whenever provides three more job types namely command, runner and script. Apart from these you may create your own job type too. In the following example you can see we heve used all these three job types. Job type runner allows you to input some piece of code as a string which should be run at a particular interval of time. Similaryly command accepts a command to be run at each interval whereas rake runs a rake task defined in your application.

    every 3.hours do
      runner 'User.expire_session_cache'
      rake 'rake_task_name'
      command '/usr/bin/command_name'
    end

Suppose you want to create a custom **job_type** you can do so by defining that job_type. Lets say we are defining a new job type foo.

    job_type :foo, '/usr/local/bin/foo :taskname :filename'

you use this new job type as follows in your **schedule.rb**

    every 2.hours do
      foo 'somecommand', filename: 'inputfilepath'
    end

# Use capistrano plugin to automate the task scheduling

Whenever provides capistrano recipes to automate the crontab updating during each deployment. To do that just require the plugin.

    # file: config/deploy.rb

    require 'whenever/capistrano'

    set :whenever_environment, defer { stage }
    set :whenever_command, 'bundle exec whenever'

thats it. Now on deployment capistrano will update your crontab.
