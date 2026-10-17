<!--
title: Spinal new kid in the block
date: 17/10/2026
lang: en
category: Programming
tags: Ruby, Spinal, Benchmarking, Programming Languages
-->

# {post_title}

Few days ago I have found out that **Ruby** creator **Yukihiro Matzumato**  aka **Matz**  is working on a new programming language called **Spinal**. This was during a casual online meetup of with my fellow rubyists from [Kerala Ruby Users Group](https://krug.github.io/). In the past we used to  meet almost regularly in one of our offices in Kochi and chit-chat on technology. 

These days our meetups are mostly online,  [Covid19](https://en.wikipedia.org/wiki/COVID-19_pandemic) and unavailability of organizing members in Kochi made those physical meetups infeasible. Akhil and [Hari](https://hsps.in/) moved to US, [Nithin](https://nithinbekal.com/) moved to Canada [Revath](https://blog.revathskumar.com/) moved to Germany and I moved to Bangalore for work.

So spinal ignited my curiosity and I rushed to the [spinal repo](https://github.com/matz/spinel) to know what is going on.  Oh great it is an Ahead Of Time compiler. The idea is that a normal ruby program is compiled to a C program then the C program is compiled to produce the final executable. In nutshell, **you can leverage all the benefits of using ruby without compromising on C level performance**.

> Spinal = Ruby -> C -> Binary

I looked at the benchmarks given in the repo and did some benchmark myself. Then I benchmarked using [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) program which I have written 14 years back almost when I started with serious Ruby programming.  Actually I felt terrible when I looked at my own old code, I couldn't bear to look at it for more than a minute. I did an immediate rewrite and kept the original file as it is so that I can look at it again. 

I felt that it is a good idea to go back and look at our own old programs to understand how much we have improved in programming.

As of today 17/10/2026 there was only one release of spinal. I have downloaded the source and compiled the binary but that version didn't work. The program compiled successfully, and it ran ultra-fast, I sensed that something is wrong. When I looked at the results they did not match with the result produced by ruby.

The culprit was a standard library method `Enumerable#cycle`. There was a bug in [`Enumerable#cycle`](https://ruby-doc.org/4.0.6/Enumerable.html#method-i-cycle), method which I have used in the program. When cycle method called without a block the iteration abruptly stopped after first cycle.

This was an important bug, I spotted the issue and hoped to raise a PR for fixing it, I can be a language contributor, OMG a What ? I cloned the repo and compiled spinal separately, as I expected the bug was already fixed immediately after the first release.

Another thing was the ruby `benchmark` library wasn't available in the first release, but they made it available immediately after the release in the main branch.

The program worked as expected with the new spinal binary from the main branch. From the first look it felt great, the compiled binary was 4 times faster than ruby 4.0.6, and it was around 776KB on my 14-inch MacBook Pro with Apple M3. Here are the benchmark results.

```text
# Spinal
      user     system      total        real
    13.950000   0.030000  13.980000 ( 13.999426)

# Ruby
      user     system      total        real
    58.449009   0.153634  58.602643 ( 58.755261)
```

Benchmark code [https://github.com/deepakkumarnd/conways-life-problem](https://github.com/deepakkumarnd/conways-life-problem)

Spinal on compilation produces a single binary file which we can run just like any compiled binary.

`$ spinal program.rb     # produces a single binary 'program'`

But if you want to see the C code produced by Spinal use`-S` switch. The produced C code is horrible to look at it but as **DHH** says what if I don't have to look at the code ? 

Later I watched a [video](https://www.youtube.com/watch?v=IEOqgPfGLQ8) in YouTube in which Matz and DHH are talking and there were bits and pieces on spinal. Interestingly Matz is using Claude for most of his work, and he claims to be a great vibe coder himself.

As of today, spinal is a subset of Ruby, it supports many of the language features, but it doesn't support all features of ruby for example no `ObjectSpace`, `Tracepoint`, `binding`, dynamic class creation using `Class.new(parent_class)` works only with a static parent class. No dynamic meta-programming such as using `method_mising`, `eval` but `define_method` is supported with some limitations. **Threads** are truly parallel in spinal without any GVL.

> Spinel runs Ruby Threads as true parallelism with no GVL. A threaded program is scheduled onto N OS workers that run green threads over a stop-the-world garbage collector, so CPU-bound threads make progress on separate cores at the same time. This is the JRuby / TruffleRuby model, not CRuby's: individual operations are not made atomic by a global lock.

So can spinal be drop-in replacement for Ruby ? Certainly not but I feel the direction spinal is taking is very hopeful for ruby programmers. For smaller ruby libraries and applications it could be a replacement with minimal code changes in near future. For large applications and libraries if we can rewrite parts to run on spinal then it is a going to be a great motivation boost to the ruby ecosystem.

In the new age, where agents write most of the code, a programming language that is still readable without compromise on performance is the need of the hour. Agents generating rust for everything might not be a long term feasible solution. By compiling Ruby to C all those efforts and workarounds to optimize the language for raw performance and concurrency can be better utilized to produce high performant, agent safe, readable and maintainable code.