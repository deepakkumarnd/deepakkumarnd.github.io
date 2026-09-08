<!--
title: Reinforcement Learning (Part 1)
date: 09/08/2025
lang: en
-->

# Reinforcement Learning (Part 1)

The idea of learning by interacting with the environment is something fundamental in nature for example a child learning to say words or trying to walk and become successful at it over time. Learning by interacting with the environment is driven by some end goals, or we can say that the goal drives the learning progress. Such learning is called trial and error learning or more formally reinforcement learning.

Reinforcement learning in a computational approach can be described as follows: we let an agent interact with an environment through a series of actions , the environment rewards the agent for the action performed . The agent over time learns to pick actions such that the total reward from the environment is maximized. In short we can say that all goals can be described by maximizing total future rewards, this is known as the _reward hypothesis_.

Reinforcement learning differs from other paradigms such as supervised learning and unsupervised learning. In supervised learning we train with labelled datasets whereas in unsupervised learning the patterns or labels are recognized automatically without the help of a labelled dataset. What makes reinforcement learning different from these paradigms ? Reinforcement learning does not use a supervisor but it is guided by delayed feedback (reward). The order of events is important in reinforcement learning. The agent’s actions change the environment which can influence future observations (states) made by the agent.

There are many examples where reinforcement learning makes sense. A power generation factory can optimize the power generation by rewarding the agent for doing actions that increase power production, it can punish the agent for any breach of threshold levels. Another one is playing games better than humans. Any moves leading to winning can be rewarded and any moves leading to failure can be punished. Even if some of the immediate move results in a -ve reward the agent now can calculate moves that result in a win. When the agent considers not just the immediate reward for a move but the overall rewards for a winning path containing future actions and chooses actions accordingly the agent can even surpass the human players.

### Elements of Reinforcement Learning

![Architecture](images/reinforcement_11.png "Architecture")

A reinforcement learning system has the following elements: an agent that decides an action, an environment on which actions are performed and rewards are generated, a policy which decides the behavior of the agent at a particular time, a value function and an optional model.

The policy can be thought of as a mapping from a state to action. Policy is not something fixed, it is learned over time. Rewards are short term signals that tell the agent that an action performed was desirable or not. The agent’s job is to maximize the total rewards received by it. A value function is a long term signal that determines what is good for the agent. The value function determines the value of a state by computing total expected rewards over time starting with that state. When the reward helps the agent to make immediate decisions whereas the value function helps with more long term vision. The last element is called a model which mimics the environment and helps with planning for future actions. Without models the reinforcement learning is called model free and is a _"trial and error"_ method.

### Evolutionary methods in reinforcement learning

In reinforcement learning approaches like genetic algorithms, genetic programming, simulated annealing etc don't really use value function and are called evolutionary methods because they mimic the way in which an organism evolves biologically. Evolutionary methods are effective when we cannot accurately represent the state of the environment.

Happy Learning
