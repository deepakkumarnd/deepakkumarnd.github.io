<!--
title: Getting the distributed unique realtime counts
date: 19/01/2022
lang: en
category: Engineering
tags: HyperLogLog, Redis, Distributed Systems, Aerospike
-->

# Getting the distributed unique real-time counts

How do you count unique number of users visiting your high traffic website ? You may log visits to a file and use a batch job to get the unique counts. You may create a row for each user in a `database`, or a user visit count key in a `cache` and increment a counter against the user.  Furthermore, If you don't want to store each of those events then use `PubSub` mechanism. Publish an event for each user visit and **process those events in batches** using a downstream consumer and then update a global counter.

All these methods are correct and can give you correct counts. But at huge scale all these methods can be very costly, ineffective, consumes huge amount of disk space, memory and cpu.

But what if the problem is more complex ?  What if the problem is finding the number of visits by each user ? Or number of ads served per app install campaign ? The problem becomes a complex **group count** rather than a simple count.

The next problem would be the time taken to compute these counts. How long you need to wait to get those counts for you to show in a dashboard for taking a business decision ? The decision could strategic or very important such as rate limiting access to a resource, stopping an ad campaign once a desired number of ads are served. If the decision has to be taken in a near real time manner then all these methods are going to be very ineffective.

If we go with in memory counters on each app instance then that seems to work at first look, but that comes with the following challenges.

1. Each app instance end up consuming a lot of RAM because of huge number of in memory counters.
2. An instance crash means losing all those counters and counts become incorrect.
3. The process of combining counters without proper care is going to be error-prone because of point no 2 ?

So we need a better way to calculate those counts. Maybe a **real-time but approximate count** is more than enough for decision-making rather than an accurate one.  In situations where 100% accuracy isn't a hard-line requirement an approximate method with minimum probability of error can come to rescue. That is when a clever probabilistic algorithm known as **HyperLogLog** comes to rescue.

HyperLogLog is a probabilistic cardinality estimation algorithm used to count unique elements in massive datasets with exceptional memory efficiency.

> `HyperLogLog` can help you to get approximate unique counts of items with very minimal error with a negligible amount of space (in few bytes). 

HyperLogLog is implemented by many programming libraries. One such library I have used is [**Datasketches**](https://datasketches.apache.org/) for **JVM** based projects. This project is incubated within **Apache software foundation**, this library provides an HLL sketch for solving our problem.

Let us take an example of ad service which runs an app install ad campaign. Ad server backend fetches ads from multiple ad networks such as **Google Ads** pick an ad based on multiple campaign filtering criteria and finally forwards the winning ad to the client. The volume of request is huge **(more than ~100K requests per second)** and the data returned is an ad which shouldn't be cached.

> Firstly the cached ad might become invalid by the time we serve it secondly the trackers associated with each add should not be used more than once so for each serving of an ad we need to fetch it from the ad networks.

 Remember that your business don't want to over-serve any ads as per the contract, because you will have zero yield by over-serving and may end up wasting resources instead of serving other ads. We need to use `HLL` to find the unique number of ads getting served from the ad server to make some business decision.

How does this work ? Each ad server instance can maintain its own HLL sketch update it every time an ad is served. You can think of an HLL sketch as an in memory hash table but with a very few bytes of memory usage. These HLL sketches are periodically saved to a persistent data store or file to guard against instance crash.

> I have used [Aerospike](https://aerospike.com/) it has built-in support for HLL and is an excellent choice when it comes to distributed caching at huge scale.

Each HLL from the app instance is going to be only a few kilobytes even for such a huge volume. All these HLL objects are then collected to a single instance merge them to get total counts. 

The beauty of HLL lies in its **mergeability**, we can combine multiple HLL sketches to produce a global estimate without needing access to the raw data. This makes it a perfect fit for distributed systems where real-time counter aggregation is costly or infeasible. On merging two sketches we get the combined unique counts from both sketches and **this operation is commutative**, so the order of sketches doesn't matter, we get the same results by combining different HLL sketches in any order.

```text
HLL = HLL1 + HLL2 + HLL3 ... + HLLn
```

In a Ruby application that uses `Redis` for caching you could use [**PFADD**](https://redis.io/docs/latest/commands/pfadd/). If you want to use HLL in pure Ruby then the following gems available.

1. [https://github.com/besquared/hyperloglog](https://github.com/besquared/hyperloglog)
2. [https://github.com/davidesantangelo/hyll](https://github.com/davidesantangelo/hyll)

One important point to remember is that HLL is an approximate method, it shouldn't be used where accuracy matters such as financial data. HLL is expected to have a variance of 1-2% which is negligible when it comes to huge volumes but may not be negligible when it comes to lower volumes. Therefore, using HLL for counting low volume datasets may not be preferable choice.

Happy Learning
