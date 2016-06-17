---
layout: post
title: "Composite Unique Validator in Rails"
description: "Composite Unique Validator in Rails"
category:
tags: [rails, validations, unique_validator]
---
{% include JB/setup %}

There are situations where we want to create a unique constraint for more than
one columns. In a database level it can be easily achieved by adding a unique
index on one or more fields.

The same thing can be achieved by using rails validations too, but the advantage
of using rails validations are.

1. You can easily modify the validation
2. You can provide user friendly messages if any violations occur.
3. Easy in development mode.


    At the same time the disadvantage can come in situations where if you are
using multiple app servers and two operations results in records which violates
uniqueness. For example say two users are trying to create user accounts with
same username from two app instances, both the app instances pass the unique
validation test and two records with same username will be created in the
database.

In such cases the data integrity should be ensured using database level unique
constraints. The same thing applies to other constraints too. So the best thing
in a production app would be to add critical constraints like unique at database
level and to add validation in rails app for a user friendly response.

Lets take an example say we have a User model and Topic model, users can
subscribe or unsubscribe topics and we store the relationship in a user_topics
join table.

      class User < ActiveRecord::Base
        ...
        has_many :topics, through: :user_topics
        ...
      end

      class Topic < ActiveRecord::Base
        ...
        has_many :users, through: :user_topics
        ...
      end

      class UserTopic < ActiveRecord::Base
        belongs_to :user
        belongs_to :topic

        validates :user_id, uniquness: { scope: :topic_id, message: 'You are
          already following this topic' }
      end

The validation in UserTopic model ensures only one record is created for a user
for a particular topic. Now lets write a migration to add a unique constraint in
database for ensuring the data integrity at database level.

    class AddUniqueContraintToUserTopic < ActiveRecord::Migration
      add_index :user_topics, [:user_id, :topic_id], unique: true
    end


    $ rake db:migrate

By doing so we can ensure the integrity of the database.
