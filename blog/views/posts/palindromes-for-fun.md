<!--
title: Palindromes for fun
date: 20/09/2026
lang: en
draft: true
-->

# Palindromes for fun [Draft]

_{post_date}_

Palindromes are interesting sequence of characters, they read the same in both forward and backward direction. For example my mother tongue **Malayalam** is an excellent example of palindrome. There are many such words in english language 'eye', 'mom', 'racecar', 'rotator', 'kayak', 'civic' etc etc. Interestingly in biology there are many DNA, RNA sequences which are palindromes, musicians makes use of notes in palindrome styles, there are interesting dates such as February 2nd 2020 which can be written as a palindrome 02022020. Programming problems around palindromes makes it an excellent interview questions in a coding round in tech interviews.

Sometimes back I have solved a leetcode questions identifying the longest palindrome in a given string. I was familiar with palindrome since my school days so it was straightforward for me to solve it. 

The problem only needed the longest palindrome therefore my approach was to start with maximum length.

```text
  Step1: Start with maximum length of the string L
  Step2: Check if the string is palindrome by contracting to center from bith ends.
  Step3: If palindrom we found our longest string, exit.
  Step4: If not palindrom reduce L by 1 and find all string of length L-1
  Step5: Repeat step 2 for all the new set if string of L-1
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

But when I submitted the solution to leetcode I got a timeout error saying that the program is taking more than the expected time. I lookd at the input that caused the timeout it was a huge string of single character `a`. I tried the same input and I got the same timeout issue in my local machine. They were absolutely correct, the program never finished and took forever on my Mac and I had to kill the program with **Ctrl+C** and I realised that my solution was very poor in terms of time complexity it is of $$ O(n^3) $$, the early exits didn't help at all in the worst case scenarios.

Now I got into all sorts of optimizations thinking on how to improve the time complexity. I knew that I was doing a lot of repeated comparison so my initial thought was to optimize the comparisons. To be honest I firmly believed that I am a very good programmer and I can optimize this problem my self without any help from internet. Therefore I kept on thinking and this time I had a different thinking.

> All the palindromes starts small and grows to its maximum length.

Therefore I started from an initial possible list of single letter palindromes for odd palindromes and two letter for even palindromes (having two consecutive same letters). Then I expand around these list to next higher length and I will have a lesser number of possible palindromes. As I advance further the possible palindromes list shrinks and the latest non empty list would have the longest palindrom string. From my past solution I have realised that I was doing a lot of duplicate comparisons. So for the same center I thought of storing the positions of the palindromes upto the discovered length so that I don't need to redo comparisons for a longer palindrome with the same mid point.

```ruby
# Version 1
def longest_palindrome(s)
  return s if s.length <= 1

  possible_palindromes = []
  verified_cache = { odd: {}, even: {} }

  [1, 2].each do |len|
    (0...s.length).each do |mid|
      possible_palindromes.push([mid, len]) if palindrome?(s, mid, len, verified_cache)
    end
  end

  (3..s.length).each do
    possibles = []
    possible_palindromes.each do |mid, current_len|
      possibles.push([mid, current_len + 2]) if palindrome?(s, mid, current_len + 2, verified_cache)
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

The solution looks very complicated, it makes use of a cache `verified_cache` to store the positions of already discovered palindromes centered around a mid position. This reduced comparison substantially and the solution worked after submission for all the test inputs. The time complexity came down to $$ O(n^2) $$, space complexity increased from $$ O(1) $$ to $$ O(n) $$ which is understandable. But something was wrong I wasn't very happy about the optimised version. First of all it looked so complex and I didn't want to take a second look at it. Another issue is that my submission ranked at the bottom, which means my $$ O(n^2) $$ is still way slower than other $$ O(n^2) $$ solution. Therefore I did some modification to the earlier version. Anyway I rewrote it for better readablility.


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
      longest = s.slice(start, length) if palindrome?(s, start, start + length - 1, verified_cache)
    end
  end

  longest
end
```

Now I let my ego go and researched about the problem, I found that there was a well known solution called **manacher's algorithm** that solves my problem. To my surprise Manacher made it $$ O(n) $$, which means finding palindromes in a string is superfast with manacher's algorithm. I got a sense of what the algorithm is about and implemented a solution based on that. The following is not manacher's algorithm implementation I borrowed few ideas from it. Firstly instead of returning boolean I changed it to the length of palindrome secondly I used the idea of adding $$ # $$ to get rid of handling of even lengthed palindromes and boundary checks. But the core idea on how to proceed changed to manacher's approach.

> Go from left to right expand around each char and figure out longest palindrome.

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
  # add surrounding hash to simplify boundary handling
  # convert string to an odd lengthed string and make possible palindromes to be odd lengthed.
  s = '#' + s.split('').join('#') + '#'
  longest = ''

  (0...s.length).each do |mid|
    palindrom = expand(s, mid)

    longest = palindrom if palindrom&.length > longest.length
  end

  longest.gsub('#', '')
end
```

Looks better isn't it ? How about using an array to store the max of palindromes with each position as center ? By doing this we can basically discover all the palindrome substrings in the given string.

```ruby
# Version 4
def expand(s, mid)
  left = mid - 1
  right = mid + 1

  while left > 0 && right < s.length
    break if s.getbyte(left) != s.getbyte(right)

    @rads[mid] += 1

    left -= 1
    right += 1
  end

  @rads[mid]
end

def longest_palindrome(s)
  return s if s.length <= 1

  s = "##{s.split('').join('#')}#"
  # keep the radiuses of palindromes for each position
  @rads = Array.new(s.length) { 0 }

  max_center = 1

  (1...s.length).each do |mid|
    radius = expand(s, mid)
    max_center = mid if radius > @rads[max_center]
  end

  # take the maximum slice
  s[(max_center - @rads[max_center])..(max_center + @rads[max_center])].gsub('#', '')
end
```
Looks clever and simple isn't it ? In worst case this is still an $$ O(n^2) $$ in terms of time complexity but it is much faster than all my previous versions. Now lets run a benchmark and compare the versions.

```text
Version v0       25.659960   0.135666  25.795626 ( 26.039852)
Version v1        0.357933   0.000952   0.358885 (  0.358902)
Version v2        0.636836   0.004177   0.641013 (  0.641028)
Version v3        0.196977   0.000633   0.197610 (  0.197613)
Version v4        0.102647   0.000118   0.102765 (  0.102767)
```

Firstly prepend and append **#**, so that we simplify looping and handling of the start and end of string positions. Secondly convert every possible palindromes to odd length by adding **#** in between each letters and get rid of complications due to even lengthed palindroms. For example the even lengthed palindrom **aa** becomes odd lengthed **a#a** and it is a palindrome centered around **#**. Thirdly store the radius of each of the palindrom around the center in an array and finally avoid duplicate checks by using a mirroring technique.