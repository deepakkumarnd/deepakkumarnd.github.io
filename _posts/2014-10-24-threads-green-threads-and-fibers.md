---
layout: post
title: "Threads, green threads and fibers"
description: "Threads, green threads and fibers"
category: "Computer Science"
tags: [ thread, green thread, fiber, computer science ]
---
{% include JB/setup %}

In one of the early [KRUG](//krug.github.io) meetup I took an introductory session on [Go programming](//golang.org) language. At that time I was just trying go for fun. While I was explaining about goroutines so many questions came up. People asked weather goroutines are green threads, fiber or is it a native thread. In this post I hope to cover important concepts regarding threads, green threads and fibers.

In computers threads play a major role, they are the way to implement concurrency. A thread of execution is the smallest sequence of instructions that can be managed by a scheduler independently. A thread is associated with a process. Process is a program under execution which has resources like code, data, stack, heap, sockets and CPU time. Process can have one or more threads and they share process's memory.

# OS threads (1:1)

Os threads or native threads are managed and scheduled by the operating system kernel. In a single core system multiple threads are scheduled and executed on the same CPU in a time sharing manner to make it concurrent whereas in a multicore system they can be executed concurrently by executing on multiple core in a parallely. Os threads making use of underlying hardware(taking advantage of multiple cores) completely depends on the underlying operating system implementation.

# Green Threads (N:1)

Green threads are a term came from Java, In Java native threads were available since JDK 1.2, Java in the early days have researched and then abandoned the use of green threads since JDK 1.3.

Green threads are threads that are scheduled by a virtual machine (VM) instead of natively by the underlying operating system. Green threads emulate multithreaded environments without relying on any native OS capabilities, and they are managed in user space instead of kernel space, enabling them to work in environments that do not have native thread support.

Green threads significantly outperform Linux native threads on thread activation and synchronization, Linux native threads have slightly better performance on I/O and context switching operations.

Green threads cannot take advantage of multicore processors because all the green threads are mapped on to the same OS thread. So a single thread while executing a blocking task such as IO, can block the entire process.

# Hybrid Threads (N:M)

In a hybrid threading model N application threads are mapped to M OS threads. Implementing hybrid model is a hard thing to do because scheduling and synchronization involves both kernel and user level.

# Fibers

Fibers are much like threads, they differ from threads in the way they do the scheduling. Fibers stops themselves and yields CPU to other fibers, which is called co-operative multitasking whereas in threads operating system preempts the thread and runs another thread which is called preemptive multitasking.

In languages like Go, Haskell and Erlang which all uses hybrid threads in a different way. They try to combine the good aspects of native threads as well as green threads. Each of these concurrency models depends on its own implementation. In Go the runtime provides a scheduler which can schedule goroutines to multiple OS threads, so if one goroutine is blocked go run time can schedule other goroutine to anothet os thread. Go promotes use of channels for communication and synchronization instead of shared memory thereby minimizing synchronization issues. In go the programmer has an important role in implementing concurrency but the language runtime can take care of executing the concurrent code parallely if hardware support is available. System calls interfaces in go are implemented in a way that does not block go runtime scheduler. The goroutines are very light weight of size 4KB-8KB, more memory is allocated on demand by the runtime.