## Greatest Common Divider

In mathematics GCD of two positive integers `a` and `b` is the highest number that can divide both `a` and `b`.

Let's look at how is GCD is calculated using an example. Take two numbers a and b as 15 and 5 our goal is to find the 
GCD of 15 and 5. The calculation is as follows.

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


##### Footnotes

Greater common divider is also known as Highest Common Factor or HCF. GCD is a relatively new term popularised by americal 
influence in computing.