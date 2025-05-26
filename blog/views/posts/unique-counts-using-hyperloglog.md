## Getting the distributed unique realtime counts

How do you identify on a realtime basis, unique number of items such as unique number of users visiting your website, unique number of people doing a transaction or unique number of ads getting served ?

We can see that the problem computationally can be solved by doing a `group count`. At low scale taking a group count isn't a problem at all. This can be achieved by using a database query or even using an in memory hash table. But how will you do it when the scale is huge say a few hundreds of application instances each of which processing huge number of requests per second ?

If you use an external datastore and group by operation then this will lead to additional write operations to the datastore per every ad getting served. Firstly this can become a bottleneck because of slow write involved and you might end up scaling app instances just for counting the unique items not for the real demand, secondly the group by operation is very costly which needs a lot of disk reads and processing.

If you use in memory approach then this will lead to increase in the app instance memory, combining those in memory counts is going to be a challenge and this might leads to highly inaccurate results because instances may go down at random for a number of reasons. Here one approach is going to be extremely costly the other is going to be inaccurate. In such distributed computing setup `batch processing` or map reduce is proffered most of the time and they might work perfectly on non real time basis. But when the requirement is realtime mostly for realtime monitoring, fraud detection etc a better but approximate method might come in handy. A different but clever probabilistic approach such as `HyperLogLog` comes to rescue in such cases. In situations where 100% accuracy isn't a hard-line requirement an approximate method with minimum probability of error can come to rescue. Here you are trading accuracy of your measurement for speed and cost.

HyperLogLog is a probabilistic algorithm that is apt for such problems. `HyperLogLog` can help you to get approximate unique counts of items with very minimal error with a negligible amount of space (in few bytes). `HyperLogLog` is implemented by many programming libraries. One such library project called `Datasketches` comes to rescue for `JVM` based projects. This project is incubated within `Apache software foundation`, the library provides an HLL sketch for solving this problem.

<https://datasketches.apache.org/>

Lets take an example of an ad service which runs an app install ad campaign. Your backend fetches ads from multiple ad networks and forwards the winning ad to your client. Since the volume of requests in too huge `(more than ~100K requests per second)` and the data returned is an ad which shouldn't be cached because that ad might become invalid next time. Remember that your business don't want to over serve any ads as per the contract, because you will have zero yield and may end up wasting resources instead of serving other ads which will yield revenue.

Imaging that you are logging the ad ids to a file and each line is the app id returned in an ad. Next you need to find unique number of ads getting served from the ad server for monitoring purpose or for tuning the ad delivery for cost optimizations. The batch processing of log files will take time and is not going to be realtime. So lets go with the HyperLogLog here.

How does this work ? Each ad server instance can maintain its own HLL sketch updating it every time an ad is served. You can think of an HLL sketch as an in memory hash table but with a very few bytes of memory usage. These HLL sketches can then be published periodically every few seconds or minutes to a queue or written to a data store such as redis. I have used [Aerospike](https://aerospike.com/) which has in built support for HLL and is an excellent choice when it comes to distributed computing.

A downstream `reducer` can then read the data store and merge these multiple HLL's and then probably publish a metric or write to a dashboard. On merging two sketches we get the combined unique counts from both sketches and `this operation is commutative` which simply means that the order of sketches doesn't matter we get the same results by combining different HLL sketches in any order.

The downstream reducer can be triggered by an api call or even a periodic cron job (every minute). The beauty of HLL lies in its `mergeability`, **you can combine multiple HLL instances to produce a global estimate, without needing access to the raw data**. This makes it a perfect fit for distributed systems where log aggregation is costly or infeasible. The result is that we will be able to see the realtime count of each ads getting served on our dashboard and this will enable the decision makers to take business decisions to optimize ad serving.

And the best part? Firstly the memory footprint is minimal—often just a few kilobytes per HLL instance. Secondly this doesn't lead to scaling the app instances for the realtime counting purpose.

Happy Learning
