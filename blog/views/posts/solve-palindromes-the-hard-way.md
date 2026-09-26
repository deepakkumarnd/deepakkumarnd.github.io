<!--
title: Solve the palindromes the hard way
date: 20/09/2026
lang: en
category: Programming
tags: Algorithms, Manachers, Palindrome
-->

# Solve the palindromes the hard way

_{post_date}_

Palindromes are interesting sequence of characters, they read the same in both forward and backward direction. For example my mother tongue `Malayalam` is an excellent example of palindrome. There are many such words in English language `eye`, `mom`, `racecar`, `rotator`, `kayak`, `civic` etc etc. 

Interestingly in biology there are many DNA, RNA sequences which are palindromes, musicians knowingly or unknowingly makes use of notes in palindrome styles, there are interesting dates such as `February 2nd 2020` which can be written as a palindrome `02022020`. Programming problems around palindromes makes it an excellent interview questions in tech interviews.

Sometimes back I have solved a leetcode question identifying the longest palindrome substring in a given string. I was familiar with palindrome since my school days so it was a piece of cake for me to solve it.

The problem only needed the longest palindrome therefore my approach was to start with maximum length.

```text
  Step1: Start with maximum length L of the string S
  Step2: Check if the string is palindrome by contracting to center from bith ends.
    1: If palindrom was found then that is our longest one, print it and exit.
    2: If not found then reduce L by 1 and check all substrings of S of length L-1
  Step1: Repeat step 2 for all the new set if string of L-1
```

I coded the solution in my favourite programming language Ruby. The solution looked neat and the solution worked for all my test inputs. Here is the solution.

```ruby
# Version 0
def palindrome?(s, start_pos, end_pos)
  return false if start_pos > end_pos

  while start_pos <= end_pos
    return false if s[start_pos] != s[end_pos]

    start_pos += 1
    end_pos -= 1
  end

  true
end

def longest_palindrome(s)
  return s if s.empty? || s.length == 1

  (s.length..1).step(-1).each do |length|
    (0..(s.length - length)).each do |start|
      return s.slice(start, length) if palindrome?(s, start, start + length - 1)
    end
  end
end
```

But when I submitted the solution to leetcode I got a timeout error saying that the program is taking more than the expected time. I lookd at the input that caused the timeout it was a huge string of single character `a`. I tried the same input and I got stuck in a never ending loop. They were absolutely correct, the program never finished and took forever on my Mac and I had to kill the program with **Ctrl+C** and I realised that my solution was very poor in terms of time complexity it is of $$ O(n^3) $$, the early exits didn't help at all in the worst case scenarios.

Now I got into all sorts of optimizations thinking on how to improve the time complexity. I knew that I was doing a lot of repeated comparison so my initial thought was to optimize the comparisons. To be honest I firmly believed that I am a very good programmer and I can optimize this problem my self without any help from internet. Therefore I kept on thinking and this time I had a different thinking.

> All the palindromes starts small and grows to its maximum length. Therefore go from the smallest single letter ones and expand around and track the growing ones and abandom the non growing ones till I find the largest.

Therefore I started from an initial possible list of single letter palindromes for odd palindromes and two letter for even palindromes (having two consecutive same letters). Then I expand around these list to next higher length and I will have a lesser number of possible palindromes. As I advance further the possible palindromes list shrinks and the latest non empty list would have the longest palindrom string. From my past solution I have realised that I was doing a lot of duplicate comparisons. So for the same center I thought of storing the positions of the palindromes upto the discovered length so that I don't need to redo comparisons for a longer palindrome with the same mid point.

```ruby
# Version 1
def longest_palindrome(s)
  return s if s.length <= 1

  possible_palindromes = []
  verified_cache = { odd: {}, even: {} }

  [1, 2].each do |len|
    (0...s.length).each do |mid|
      if palindrome?(s, mid, len, verified_cache)
        possible_palindromes.push([mid, len])
      end
    end
  end

  (3..s.length).each do
    possibles = []
    possible_palindromes.each do |mid, current_len|
      if palindrome?(s, mid, current_len + 2, verified_cache)
        possibles.push([mid, current_len + 2]) 
      end  
    end

    break if possibles.empty?

    possible_palindromes = possibles
  end

  mid, max_length = possible_palindromes.last

  diff = max_length.odd? ? max_length / 2 : max_length / 2 - 1
  s.slice(mid - diff, max_length)
end

def get_bounds(full_length, mid, length)
  if length.odd?
    [[0, mid - length / 2].max,
      [mid + length / 2, full_length - 1].min]
  else
    [[0, mid - length / 2 + 1].max,
      [mid + length / 2, full_length - 1].min]
  end
end

def palindrome?(s, mid, length, verified_cache)
  key = length.odd? ? :odd : :even
  # The substring till length - 2 is already a palindrome
  left, right =
    if verified_cache[key].key?(mid)
      left_verified, right_verified = verified_cache[key][mid]
      [left_verified - 1, right_verified + 1]
    else
      length.odd? ? [mid, mid] : [mid, mid + 1]
    end

  lower_bound, upper_bound = get_bounds(s.length, mid, length)

  while left >= lower_bound && right <= upper_bound
    return false if s.getbyte(left) != s.getbyte(right)

    verified_cache[key][mid] = [left, right]

    left -= 1
    right += 1
  end

  length == right - left - 1
end
```

The solution looked very complicated, it makes use of a cache `verified_cache` to store the positions of already discovered palindromes centered around a mid position. This reduced repeated comparisons substantially and the solution worked after submission for all the test inputs. The time complexity came down to $$ O(n^2) $$, but space complexity increased from $$ O(1) $$ to $$ O(n) $$ which is understandable. 

But still something felt wrong I wasn't very happy about the optimised version. Firstly it looked so complex and I didn't want to take a second look at it, secondly it took me couple of hours to write this so certainly not suitable for an interview puzzle third problem was that my submission ranked at the bottom, which means my $$ O(n^2) $$ is still way slower than other $$ O(n^2) $$ solution. By this time I got very much obsessed with this problem. Therefore I did some modification to the version 0 and combined with version 1 which resulted in the following better readable but poor performant version.

```ruby
# Version 2
def palindrome?(s, start_pos, end_pos, verified_cache)
  length = end_pos - start_pos + 1
  key = length.odd? ? :odd : :even

  mid = (start_pos + end_pos) / 2

  left, right = if verified_cache[key].key?(mid)
                  a, b = verified_cache[key][mid]
                  [a - 1, b + 1]
                else
                  length.odd? ? [mid, mid] : [mid, mid + 1]
                end

  while left >= start_pos && right <= end_pos
    return false if s[left] != s[right]

    verified_cache[key][mid] = [left, right]
    left -= 1
    right += 1
  end

  true
end

def longest_palindrome(s)
  return s if s.empty? || s.length == 1

  verified_cache = { odd: {}, even: {} }
  longest = ''

  (1..s.length).each do |length|
    (0..(s.length - length)).each do |start|
      if palindrome?(s, start, start + length - 1, verified_cache)
        longest = s.slice(start, length)
      end
    end
  end

  longest
end
```

Now I let go of my ego and researched about the problem, I found that there was a well known solution called **manacher's algorithm** that solves my problem. My eyes nearly popped out to know that Manacher made it $$ O(n) $$, which means finding palindromes in a string is superfast with manacher's algorithm. I read about it and got a sense of what the algorithm is about and implemented a solution based on that. The following is not manacher's algorithm implementation I borrowed few ideas from it. Firstly instead of returning boolean I changed it to returning the length of palindrome secondly I used the idea of adding `#` to get rid of handling of even lengthed palindromes. The core idea shifted to manacher's method.

> Go from left to right expand around each char to find palindromes.

```ruby
# Version 3
def expand(s, mid)
  left = mid
  right = mid

  while left >= 0 && right < s.length
    break if s[left] != s[right]

    left -= 1
    right += 1
  end

  s[(left + 1)..(right - 1)]
end

def longest_palindrome(s)
  # convert string to an odd lengthed string and
  # make possible palindromes to be odd lengthed.
  s = '#' + s.split('').join('#') + '#'
  longest = ''

  (0...s.length).each do |mid|
    palindrom = expand(s, mid)

    longest = palindrom if palindrom&.length > longest.length
  end

  longest.gsub('#', '')
end
```

Looks better isn't it ? How about using an array to store the radius of palindromes with each position of the padded string as center ? By doing this simple looking change we basically end up discovering all the palindrome substrings in the given string without using any extra spaces for storing each discovered palindrome substrings.

```ruby
# Version 4
def padded_input(s)
  pad = '#'
  s = s.split('').join(pad)
  "#{pad}#{s}#{pad}"
end

def unpad(s)
  s.gsub('#', '')
end

def expand(s, mid, rads)
  left = mid - 1
  right = mid + 1

  while (left > 0) && (right < s.length) && (s.getbyte(left) == s.getbyte(right))
    rads[mid] += 1
    left -= 1
    right += 1
  end

  rads[mid]
end

def longest_palindrome(s)
  return s if s.length <= 1

  s = padded_input(s)

  rads = Array.new(s.length) { 0 }

  longest_pos = 0

  (1...s.length - 1).each do |pos|
    radius = expand(s, pos, rads)
    longest_pos = pos if radius > rads[longest_pos]
  end

  unpad(s[(longest_pos - rads[longest_pos])..(longest_pos + rads[longest_pos])])
end
```
Looks clever and simple isn't it ? In worst case this is still an $$ O(n^2) $$ in terms of time complexity but it is much faster than all my previous versions. Now let's run a benchmark and compare all these versions.

```text
Version v0       25.659960   0.135666  25.795626 ( 26.039852)
Version v1        0.357933   0.000952   0.358885 (  0.358902)
Version v2        0.636836   0.004177   0.641013 (  0.641028)
Version v3        0.196977   0.000633   0.197610 (  0.197613)
Version v4        0.102647   0.000118   0.102765 (  0.102767)
```

## Manacher's algorithms

This post would be worthless if I don't dissect the clever tricks used in [manacher's algorithm](https://en.wikipedia.org/wiki/Longest_palindromic_substring). This algorithm was created by computer scientist **Glenn K Manacher** in **1975**. The first clever trick is to converts the given string to an odd lengthed string by padding with `#` or any other special symbol. Let's check what happens when you add padding to a string `eye`.

```text
e y e     => odd length of 3
e # y # e => odd length of 5
```

You can notice that the string remains odd lengthed palindrom around the same mid character `y`.

Now let's take an even lengthed string 'aa'

```text
a a       => even length of 2
a # a # a => odd length of 5
```

Here the even lengthed `aa` got converted into an odd lengthed string which is still a palindrome around the middle `#`. By padding with `#` we can apply the algorithm to check palindrome for both odd and even lengthed strings alike. 

The second clever tricks is to use an array to track the radius of palindromes centered around a particular position. A zero initialized position array `P` with a length equal to the length of padded string is used. Each value in the array is the length of radius of palindrome around that position.

```text
     -------------------
S = | e | # | y | # | e |
     -------------------
P = | 0 | 0 | 2 | 0 | 0 |
     -------------------

     -------------------------------------------------------------------
S = | m | # | a | # | l | # | a | # | y | # | a | # | l | # | a | # | m |
     -------------------------------------------------------------------
P = | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 8 | 0 | 1 | 0 | 3 | 0 | 1 | 0 | 0 |
     -------------------------------------------------------------------
```

The most interesting advantage of this is that in a single go we can find all the palindrome substrings. For any given any position slice the padded string by radius value around the given position and remove the padding `#` characters, that would be a palindrom substring centered around that position.

But there exists a hidden problem for non palindrome strings that end with a palindrome substring. We may end up with a wrong result for inputs such as `abb`. Take the string `abb`, the longest palindrom substring ubdoubtably is `bb`.

```text
     -------------------
S = | a | # | b | # | b |
     -------------------
P = | 0 | 0 | 1 | 1 | 0 |
     -------------------
```

We have two high radius positions with value 1. If we go with the first highest radius at position 2 then we will end up with palindrom sub string `#b#` which results in `b` as our answer. But if we go with the position 3 we will have palindrom sub string `b#b` and we will have `bb` as our correct answer. Therefore it is important to pick pattern centered around `#` when it comes to such ending patterns. But there is an easy workaround so that we need not have to worry about whether we pick the correct palindrome or not. Simply prepend and append `#` to the padded string. So our string becomes `#a#b#b#`, which is still an odd lengthed string.

```text
     ---------------------------
S = | # | a | # | b | # | b | # |
     ---------------------------
P = | 0 | 1 | 0 | 1 | 2 | 1 | # |
     ---------------------------
```

Now the winner is clear we can just pick the right palindrome by selecting the first highest value in the array `P`.

Now there is a third clever trick that avoids a lot of duplicate comparisons and makes this an $$ O(n) $$ algorithm. Manacher used a mirroring technique by which we can avoid a lot of comparisons. The idea is as follows when we found a palindorm substring then we from its center to the right boundary is a mirror image of its left side. Therefore if we move to the next position from the center position and expand we need not have to expand from the next character we can skip many comparisons within the boundary. This is something bit hard to grasp, at least it wasn't easy for me to fully digest I actually took couple of days. Therefore I will try to explain in simplest way possible.

To better get the idea let's take the following example 

```text
                         |
                         |
    ---+-----------------+-----------------+---
S = ...| a | e |...| a | e |...| a | e | a |...
     ------------------------------------------
P = ...| 0 | 2 |...| 3 | r |...| _ | _ | _ |...
    ---+-----------------+-----------------+---
         r   j       i   C   I       J   R
                         |
                         |
                        Mirror
```

Here the sub string `ae...aea...ea` is a palindrom around the letter `e`. When we began the process from position `0` the value of `C` and `R` will be initialized to `0`. As we proceed to right we have detected a palindrom with radius 1 at position `j`, later at `C` we have detected another palindrom with `radius = r` and a right boundary `R`. Next we need to move to the next position `I` and expand around, but we know something about palindrome.

> In a palindrome the right side is a mirror image of left side. 

Look at the mirror position at our center `C` with a right boundary `R`. Move to next position `I` and try to expland from there. We can clearly see that `I` is within the right boundary `R` ie. `(I< R)` and `I` is far away from the boundary R. therefore if we take the mirror position `i` then because of mirror symmetry the value of `P[I]` would be at least that of `P[i]` which is 3. Means we have covered three positions around `I` and skipped three comparison by copying value of `P[i]` to `P[I]`. Now we could expand around further in the old way with `P[I] = 3`. The same logic applies to positions after `I` and we would save a lot of comparisons.

Now let's move to `J`, the mirror value is `P[j]`, but we cannot blindly copy the value from mirror position to P[J] because `J` is closer to `R`. If we copy the value 2 from `P[j]` that implies that we have covered 2 positions around `J` and crossed the boundary. But our mirror ends at `R` and we only know upto the right boundary of the mirror. Therefore **mirror value is limited by the distance from the right boundary**. We need to take the minimum of mirror value and distance from boundary as value of `P[J]`. So `min(P[j], R-J)` ie 1 would be our value at `P[J]` instead of 2. 

In the previous case the `I + P[i]` was well within the boundary `R` and `R - I` was definitely greater than mirror value `P[i]`. So `min(P[i], R - I)` would be `P[i]`.

Once `P[J]` is set expand further around the new position `J` we may cross over the right boundary `R` during the expansion, if we cross over after full expansion around `J` change the value of the right boundary to higher value and shift center `C` to current position `J`. 

Finally on reaching at the right boundary `R` our mirror end then we will need to perform the normal expand operation starting from the position `R`. So center `C` and right boundary `R` will be set to the current position.

Enough of the explanation let's look at the code.

```ruby
# Version 5 - Manachers algorithm
def longest_palindrome(s) # rubocop:disable Metrics/AbcSize
  return s if s.length <= 1

  s = padded_input(s)

  rads = Array.new(s.length) { 0 }
  center = 0
  right_boundary = 0

  longest_pos = 0

  (1...s.length - 1).each do |pos|
    if pos < right_boundary
      mirror_pos = 2 * center - pos
      rads[pos] = [rads[mirror_pos], right_boundary - pos].min
    else
      center = pos
      right_boundary = pos
    end

    radius = expand(s, pos, rads)

    if pos + radius > right_boundary
      right_boundary = pos + radius
      center = pos
    end

    longest_pos = pos if radius > rads[longest_pos]
  end

  unpad(s[(longest_pos - rads[longest_pos])..(longest_pos + rads[longest_pos])])
end

def padded_input(s)
  pad = '#'
  s = s.split('').join(pad)
  "#{pad}#{s}#{pad}"
end

def unpad(s)
  s.gsub('#', '')
end

def expand(s, pos, rads)
  left = pos - rads[pos] - 1
  right = pos + rads[pos] + 1

  while (left >= 0) && (right < s.length) && (s.getbyte(left) == s.getbyte(right))
    rads[pos] += 1
    left -= 1
    right += 1
  end

  rads[pos]
end
```

Now take a look at the benchmark, the manacher's algorithm implementations is 100 times faster than my fastest version mind blowing isn't it ? That mirror optimization is like a nitro booster to the version 4 and that is the only change between version 4 and version 5.

```text
                      user     system      total        real
Version v0       25.188437   0.133858  25.322295 ( 25.498048)
Version v1        0.369134   0.001866   0.371000 (  0.398301)
Version v2        0.644181   0.004304   0.648485 (  0.668061)
Version v3        0.198444   0.000601   0.199045 (  0.199072)
Version v4        0.105792   0.000480   0.106272 (  0.130387)
Version v5        0.001027   0.000005   0.001032 (  0.001032)
```

Guess what happened after submitting the version 5 on leetcode.

![Palindrome Leetcode Submission](images/palindrome.png "Palindrome"){: width="620" }

Happy learning