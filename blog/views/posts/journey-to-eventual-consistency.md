<!--
title: Journey to eventual consistency
date: 22/09/2026
lang: en
tags: Database, NoSQL, Consistency
category: Engineering
-->

# Journey to eventual consistency

_{post_date}_

Let's look at an example of building a web application. We begin with a the framework of our choice and uses an appropriate database for our application. In our case lets go with an [**ACID**](https://www.mongodb.com/resources/products/capabilities/acid-compliance) compliant relational database such as [**Postgresql**](https://www.postgresql.org/). 

> Relational databases are a popular choice because tables and relationship between tables are a good fit in many of the scenarios, developers and architects are very much familiar with relational databases, there are a lot of high quality free libraries available.

In our example we are happy with our decision because a single instance of relational database can do a lot of heavy lifting and ensure consistent state of our application data. Over time the business grows and I/O operations increases and application starts facing performance issues sometimes  downtimes due to memory pressure, slow queries etc.

Since the application is stateless it can be scaled relatively easily by increasing the number of app instances but the database becomes a bottleneck and single point of failure in our system. Therefore in order to reduce the load on the database server we have decided to use read replicas, with read replicas the writes will go to master and master replicates the data to slave replicas. Master ensures the data it commitetd to all the slave instances and then sends the response back to client, this of course add some delays to writes but if our system is read heavy compares to writes then the impact is somewhat negligible. The reads will directly go to replicas therefore our system can now handle heavy reads and moderate writes.

```text
    Reads
        + Read from one of the available replica

    Writes 
        + Write to master
        + Master writes to replicas in parallel
        + Retries on write failures
        + Master waits for write confirmation from all the replicas
        + Responds to client
```

Our database is still ACID compliant with better availability and faster read response at the cost slower writes.

The journey continues, the business grew more and reads grew much more, keep on adding new replicas doesn't feel like a a good idea anymore. [**Vertical scaling**](https://www.mongodb.com/resources/basics/horizontal-vs-vertical-scaling) of database instances did help to some extend but that won't be feasible long term solution considering costs. Till this point our system is.

- Strong consistent
- Supports joins

In order to handle more I/O operations especially reads in a cost effective way we need to figure out other engineering solutions. One immediate step taken is to use a [**read through cache**](https://en.wikipedia.org/wiki/Cache_(computing)) mechanisms.

> Read through cache is an in memory key value store that sits between database and application. It stores recently accessed data with an expiry so that they can be served instantly.

Since there are no I/O in theory the cache is much more faster than a database and can handle huge scale. For the purpose of caching we could use [**Redis**](https://redis.io/) or [**Memcached**](https://memcached.org/). The application first try to read from cache, if the desired data is not found in the cache a database read will fetch the data and the data will be cached. Caches can also be used to store the result of an expensive computation, thereby we could optimize performance of our app instances. But sometimes this can be a dangerous choice because at times there is a possibility of a [**cache stampade**](https://en.wikipedia.org/wiki/Cache_stampede) without a cache lock and wait protection on expiry.

```text
    Reads
        + Read from cache and return
        + Read from database on a cache miss
            + Save the record on cache
```

> A cache stampade occurs when a cache entry for an expensive computation expires. If recomputing takes say couple of seconds, at high concurrency when hundreds or even thousands of clients will request for the expired data on multiple app instances during this 2 seconds window. This triggers a large number of expensive computation on multiple app instances multiple times that eventually result in a downtime or affect availability of your system.

But there is a bigger probelem introduced by caching, **our system is no longer guarantees consistency** because we may have one version of a record in database and different version in cache, it is upto the engineering team to invalidate the cache so that the users will get updated versiion on a cache miss. 

> How does the version mismatch happen ? The database may be updated manually via a migration or even by a background job. In such a scenario, we need to invalidate the cache.

How do we ensure the system always serve the latest data to our users ? Unlike before we need to put in additional engineering effort to make our system consistent eventually. _At this point our system transition from a strong consistent system to eventual consistent system._

- Eventually consistent
- Supports joins

Once we tackles the engineering complexities introduced by caching we can reap the benefits of our efforts. Our system will be much more available, fast and can serve much more load with high throughput. This of course would result in a better and faster user experience and should positively impact the business. The business will boom the application becomes much more popular and millions of users would benefit from it. _But with growging concurrent user base our writes kept on increasing and a single master may not be capable of handling all those load_. Additionally all the slave instances are also taking writes with higher order of number of writes, the slave instance would also face extra pressure.

At this point a different strategy is what we need, we need a [**data partitioning**](https://www.geeksforgeeks.org/system-design/data-partitioning-techniques/) so that for each of the partition there can be a master slave replicas. With partition we can distribute writes to multiple master nodes. Such a setup is called [**shrading**](https://www.geeksforgeeks.org/dbms/what-is-sharding/).

> In shrading there would be multiple master nodes, for each master nodes there would be slave nodes. While read-write operations application identifies the shrad using a shrading key and connect to that shrad for reads and writes.

A shrading key can be anything that can partitions data. For example for our user records we could use two shrads in which all users with an even database id will go to shrad 1 and all users with an odd database id will go to shrad 2, but if you want to increase the number of partition in future you would need to change the strategy and that might need copying data to newly added partition based on the new strategy.

Another strategy can be creating data partitions based on year of birth of users so that users with same age group who may interact each other more go into the same partition. Such strategy may improve end user experience because all the data related to that user sits together in the same shrad which makes the data read faster. Additionally adding a new partition does not requires moving data around in this case. _Therefore choosing the right shrading strategy has to be a well thought decision._

The moment you implement shrading you realise that **database joins are not possible anymore**. Why ? Because tables are now distributed in different partitions, each partition has no idea about other partitions, they are independent. Even taking a count of total number of users would need to consult all partitions getting user counts from them and add up to get the final user count. Even relational schema won't be feasible  because relation may spread across shrads. Engineering needs to rewrite all those join queries and any queries that touches multiple partitions. At this point our system became.

- Eventually consistent
- No join supported
- Hard to support relations.

> We may even have to let go of the strong consistency per shrad, and the shrad itself could be eventually consistent. A relational model may not even work.

```text
    Reads
        + Read from cache
        + Cache miss
            + Compute shrad key and identify the shrad
            + Read from replica of the shrad
            + Cache the result

    Writes 
        + Compute shrad key and identify the shrad
        + Write to shrad master
        + Master writes to replicas in parallel asynchronously
        + Retries on write failures
        + Master waits quoram write confirmation, not from all the replicas
        + Invalidate cache
        + Responds to client
```

> All these leads to a different database approach from our earlier choice of ACID compliant relational database. At massive scale system should be optimised for high throughput and availability, system can't guarantee strong consistency, support joins, relations. Storage data as row becomes a concern because we still need to allocate space for empty data attributes in a row.

- Eventually consistent 
- No support for joins
- No relations based on foreign key
- Data needs to be stored as columns or documents.
- Can effortlessly take huge number of read/writes

Sounds familiar ? They are the descriptions of a [**NoSQL**](https://en.wikipedia.org/wiki/NoSQL) database system. NoSQL solutions are built exactly for such workloads. There are many solutions optimised for real use cases. [**Cassandra**](https://cassandra.apache.org/_/index.html) a column based database which can take reads and writes on all the partitions. [**MongoDB**](https://www.mongodb.com/) a document based database that has built in support for shrading and replication.

The choice depends on the type of data and scale we are dealing with, certainly for messaging and financial transactions consistency can't be compromised. Imagine getting an important DM from your girfriend/boyfriend bit late than the expected timeframe. How about a descriptancy in your account balance after salary day ?

It was a long post, probably my first long post on this topic. The key takeaway is that choosing a database system should always depend on the nature of the problem you are solving. _There are no silver bullets, usually what works is a combinations of choices._ It is absolutely fine to use different solutions for different subproblems within the same product. For example, you might use a strongly consistent database for financial transactions while using a NoSQL database for other use cases. As engineers, we should be open to exploring different technologies and strategies based on the situation. At the same time, we need to be thoughtful and mindful about the trade-offs behind our choices.

Happy learning