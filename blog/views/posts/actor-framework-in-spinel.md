<!--
title: Building an actor framework in Spinel
date: 19/10/2026
lang: en
category: Programming
tags: Ruby, Spinel, Actor Model
-->

# {post_title}

_Disclaimer: This is going to be an ongoing post, I will keep it updated as I do more development._

The [threads in Spinel](https://github.com/matz/spinel/blob/master/docs/thread.md) are parallel without GVL, and they are basically lightweight with large number of M threads multiplexed into fewer N OS workers (OS threads), probably just like Erlang processes. Therefore, it should be possible to build an actor framework using those threads.

I have started working on an actor framework many years back, I knew the basics but never had an opportunity to use actor frameworks in production. My exposure to concurrency was very limited back then. After joining TrueCaller and working on an in house ad server made pushed me to learn more about Akka framework and explore it in details. Before Akka I spent some time on Elixir and tried to understand more about actors, supervisors and the mechanism. But working on ad server at scale gave me more insights.

On last weekend after reading about the spinel threads I restarted my effort in creating a simple very limited actor library with my fresh perspective.

While working on it, I found a new bug in the Spinel compiler's code-gen. I tried to simulate an expensive computation as follows.

```
# File fib.rb
def fib(n)
    a, b = 0, 1

    n.times do 
        c = a + b
        a = b
        b = c
    end

    a
end

p fib(300000)
```

In Ruby we can run this program it works perfectly, ruby interpreter promotes integer to `Bignum` when required. But when compiling using spinel we need to tell the compiler that we need to promote the number to `Bignum` when needed. Otherwise, integer overflow occurs and program crashed while running. 

```shell
integer overflow in + (RangeError)
```

So we need to instruct the compiler using a compiler flag `--int-overflow=promote`.

```shell
$ ./spinel --int-overflow=promote fib.rb
```

But spinel throws an error saying.

```shell
fib.rb:2: error: incompatible integer to pointer conversion assigning to 'sp_Bigint *' (aka 'struct sp_Bigint *') from 'sp_int' (aka 'long') [-Wint-conversion]
fib.rb:2: error: incompatible integer to pointer conversion assigning to 'sp_Bigint *' (aka 'struct sp_Bigint *') from 'sp_int' (aka 'long') [-Wint-conversion]
fib.rb:2: error: incompatible integer to pointer conversion assigning to 'sp_Bigint *' (aka 'struct sp_Bigint *') from 'sp_int' (aka 'long') [-Wint-conversion]
spinel: C compilation failed
spinel: the generated C is kept at /var/folders/p7/r09j45l150xfdf1zmyddlfrm0000gp/T//spinel_out_15725_0.c
```

The error happened because of the multiple assignment in the single line `a, b = 0, 1`. When I changed it into single assignment in separate lines the error goes and programs works as expected.

Interestingly the error wasn't there on the first spinel release. I have verified this separately.

```shell
$../spinel/spinel-2026.09.12/spinel --int-overflow=promote programs/fib.rb
```

The program worked as expected with the old release. But in the latest main the issue was still present. Therefore, I have raised an [issue](https://github.com/matz/spinel/issues/9537) on Github, and suggested a fix. On the next morning to my surprise Matz immediately made a fix and closed the issue referencing my issue in his [commit](https://github.com/matz/spinel/commit/6822d676e9679470d9241d78eb41b00bc3a318ee). To be honest I never expected such a fast response form him, or may be this is done by his Claude agent.

Anyway the issue didn't affect my development. I have created a simple POC version of actor framework [here](https://github.com/deepakkumarnd/actors).

As I progressed I spotted another bug in `Enumerable#cycle` which I reported [here](https://github.com/matz/spinel/issues/9620). Matz merged a [fix](https://github.com/matz/spinel/commit/13bf19f25d3a15669b82193c2212fed9b4ea4458) and the issue go resolved. His agent is super cool btw.

_To be continued ..._