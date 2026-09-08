## N-Bandits problem

While studying reinforcement learning, I came across the well-known n-armed bandit problem. What I find interesting is how closely it relates to real-life decisions. In life, we constantly make choices and try to get the best possible reward from them. For example, we might choose which stock to invest in for the next five years, decide which restaurant to try, or select the best players for a team.

Many of these decisions happen almost automatically. We usually stick with options we already know and trust, but sometimes we take a chance and try something new. This balance between choosing what we know and exploring new options is at the heart of the n-armed bandit problem.

To understand this better, imagine you have moved to a new city and want to explore the different types of food available. You might start by checking restaurant ratings online and then visiting some of them. Based on your experience, you form your own opinion and rating of each restaurant. Sometimes, instead of choosing a highly rated restaurant, you may randomly try a new one. Occasionally, you might discover an even better option.

In the beginning, you are likely to explore a lot because you don't know which restaurants are good. But a year later, you would have tried many restaurants and probably figured out your favourites. Over time, you will mostly choose the restaurants you already know are good. This is called exploitation ie. making use of the best choices you have discovered so far.

However, you may still occasionally try a new restaurant, such as one that recently opened around the corner. This is called exploration ie. trying something new in the hope of finding an even better option. This **balance between exploration and exploitation** is the key idea behind the **n-armed bandit** problem.

> The n-armed bandit problem is simply a formalization of scenarios like this. When we have to make the same type of decision repeatedly, we tend to learn from our experiences and gradually choose the options that give us better results.

The key idea behind the problem is that we need to balance exploration and exploitation. Exploration means trying new options to see if we can find something better. Exploitation means choosing the best option we have discovered so far.

In simple terms, **always exploring is inefficient, while always exploiting can cause us to miss better options**. The challenge is to find the right balance between the two so that we can maximize our rewards over time.

At first, this may seem like a sensible idea, but we can also test it experimentally. The same idea is widely used in reinforcement learning, where a computer needs to decide which action is likely to give the best reward. For example, it can be used to decide the best move in a game or which option is likely to give the highest return over time.

When we choose the option that has performed best based on what we already know, we are following a **greedy approach**. In other words, we exploit the best choice we have found so far. However, if we continue to explore other options, we may discover one that performs even better. This is the **non-greedy** approach. By balancing exploration with exploitation, we have a better chance of finding the best choice over the long term.

[Here](https://github.com/deepakkumarnd/mynotebooks/blob/main/Reinforcement%20learning/n%20armed%20bandits%20testbed.ipynb) is an implementation of the concept. While running the program the trials optimize over time to maximum yields.


