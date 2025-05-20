## Distributed unique counts using HyperLogLog

How do you identify unique number of items such as unique number of users visiting your website ? Unique number of people doing a transaction during a time frame etc ?

At low scale it is a matter or sorting the items and taking a group count. Or you could use a hash table and increment a counter for each items in the hash table. But how will you do it when the scale is huge with a few hundreds of application instances processing huge number of requests per second ?

You will have to spend a lot of computing power and money to get unique counts, it is very costly and time consuming at huge scale. In order to find the unique count in a cost effective and computationally efficient manner You will have to use some clever method to reduce the infrastructure cost otherwise you will end up in spending lot of money and precious time to solve this problem.

In such a situation where 100% accuracy isn't a hard-line requirement approximate method with minimum probability of error can come to rescue. Here you are trading accuracy of your measurement with computing costs.

HyperLogLog is a probabilistic algorithm that is apt for such problems. `HyperLogLog` can help you to get approximate unique counts of items with very minimal error with a negligible amount of space (in few bytes). `HyperLogLog` is implemented by many programming libraries. One such library project called `Datasketches` comes to rescue for `JVM` based projects. This project is incubated within `Apache software foundation`, the library provides an HLL sketch for solving this problem.

<https://datasketches.apache.org/>

Lets take an example of an ad service which runs an app install campaign. Your backend fetches ads from this ad-server and forwards them to your client. Since the volume of requests in too huge `(more than ~100K requests per second)` and the data returned is an ad which shouldn't be cached, so you plan to do a simple logging to a file and each line is the app id returned in an ad.

Imagine your manager asks you to find out how many unique ads were served to each customer app. Sounds simple at first—until you start digging into the logs. What you find is hundreds of log files spread across multiple servers. Each file is several gigabytes in size, packed with millions of log entries. Suddenly, this straightforward request becomes a significant data processing challenge.

Now comes the real challenge, aggregating and analyzing all those log files, which collectively weigh in at around 100 GB (or more). Your goal is to determine the unique count of each AdId per customer app. At first glance, it might seem like a simple matter of using a hash table to map each AdId to a count. But in practice, this quickly becomes infeasible.

Why? Because maintaining a mapping like `AdId -> Count` across all customer apps means loading and processing huge volumes of data. Even with parallel processing, you're looking at parsing, counting, and then merging results from millions of log lines an operation that's both memory intensive and complex.

And that's assuming everything goes smoothly. If you attempt to perform this aggregation on demand, latency becomes a major bottleneck. Alternatively, if you opt to count periodically at the app server level, you're introducing new risks: handling instance crashes, ensuring no duplication during merges, and maintaining consistency across runs. In short, this seemingly simple request turns into an extremely difficult, resource heavy operation.

When you need a quick yet reasonably accurate estimate of unique AdIds per customer, HyperLogLog (HLL) comes to the rescue. HLL is a probabilistic algorithm designed specifically for cardinality estimation—i.e., counting unique items in a data stream. Instead of keeping exact counts, it tracks the number of distinct elements with impressive accuracy and a fraction of the memory traditional approaches would require.

Here's how it can work in our case: Each ad server instance can maintain its own HLL sketch, updating it every time an ad is served. These HLL sketches can then be published periodically every few seconds or minutes to a queue or a lightweight data store.

A downstream `reducer` service can consume these HLL records and merge them efficiently. The beauty of HLL lies in its `mergeability`, **you can combine multiple HLL instances to produce a global estimate, without needing access to the raw data**. This makes it a perfect fit for distributed systems where log aggregation is costly or infeasible.

And the best part? The memory footprint is minimal—often just a few kilobytes per HLL instance making it a scalable and cost effective solution for real-time or near real time analytics.

Happy Learning
