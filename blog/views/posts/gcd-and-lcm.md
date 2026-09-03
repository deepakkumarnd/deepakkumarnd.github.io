## GCD and LCM

GCD and LCM are two important topics that no one miss during school math. When I started learning programming these two programs were
there in almost all the reference books as a next level hello world. If I remember correctly even Knuth started with GCD in his 
revered Art of Computer Programming book. They are even asked as interview questions. These programs are quite simple but they are truly 
beautiful and powerful and one can refer to them at any point of time.

### Greatest Common Divider (GCD)

In mathematics GCD of two positive integers `a` and `b` is the highest number that can divide both `a` and `b`.

Let's look at how is GCD is calculated using an example. Take two numbers a and b as 15 and 10 our goal is to find the 
GCD of 15 and 10. The calculation is as follows.

* Step1 - Divide `a` by `b` and take the reminder `r`, ie: `r = a % b`.
* Step2 - Shift the row to left so that `a` becomes `b` and `b` becomes `r`. 

Repeat the steps untill `b` becomes zero, once b becomes zero our answer will be the value of `a` which is 5 in this particular example. 

Take a look at the table below for a better understanding.

| a | b | r |
| :--: | :--: | :--: |
| 15 | 10 | 5 |
| 10 | 5 | 0 |
| 5 | 0 |  |

The above mentioned method is called `Euclid`'s algorithm. Lets now implement the code so that we can run it and test.

    int gcd(int a, int b) {
        if (b == 0) return a;
        
        return gcd(b, a % b);
    }

The code is self explanatory, the recursive call to gcd makes this program truly follow the natural thinking.

### Least Common Multiplier (LCM)

When it comes to LCM of two integers `a` and `b` it is defined as the smallest number that can be divided using both a and b. We calculate
LCM by factorising the numbers to their smallest factors.

| | a | b |
| :--: | :--: |
| 5 | 15 | 10 |
| 3 | 3 | 2 |
| 2 | 1 | 2 |
|   | 1 | 1 |

Now our LCM would be a multipel of these factors 5x3x2 = 30

Interestingly LCM and GCD are related as follows.

$$
\text{LCM}(a, b) = \frac{a \cdot b}{\text{GCD}(a, b)}
$$

Therefore implementing LCM is as easy as follows 

    int lcm(int a, int b) {
        return (a * b) / gcd(a, b)
    }

Look at how `lcm` is beautifully composed using our earlier `gcd`, here both `gcd` and `lcm` are pure reusable functions and have no side effects.

##### Footnotes

Greater common divider is also known as Highest Common Factor or HCF. GCD is a relatively new term popularised by americal 
influence in computing.