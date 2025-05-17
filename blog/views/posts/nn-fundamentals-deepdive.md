## Deep diving into fundamentals of neural networks

When I first started learning about neural networks, it felt like magic. I knew that you give the network some input, and it gives you an output. What surprised me was that the network can learn the connection between input and output by itself. It's like the network finds the math formula that turns inputs into the right outputs, without anyone telling it exactly how.

### Few questions

At first the whole training felt like a trial and error method. I had a lot of questions in mind, most of them probably qualify for a beginner level tech interview in machine learning. But these questions are truly fundamental and require a lot of effort to understand in a self satisfying way.

Some of such questions are the following

1. What is a neuron ?
2. What is the purpose of weights & bias ?
3. What is the role of the activation function ?
4. What is the reason for using a layer of neurons instead of a single neuron?
5. How many neurons should be there in a layer ?
6. When should we use multiple hidden layers ?
7. How does the back-propagation work ?

In this post I am trying to dump my brain on most of those questions. Topics like back-propagation requires another post.

### Starting simple

Out of curiosity, I started exploring neural networks using simple examples like linear equations. That's when many key ideas started to make sense, linear problems are easier to understand. Starting with these basics really helped me see how neural networks work behind the scenes. As a side effect I was able to polish my math knowledge from school on topics such as _vectors, linear equations, differentiation, partial derivatives, local minima, maxima and matrix_.

### Neuron or perceptron

The smallest unit in a neural network is a neuron. A neuron or more technically called perceptron is a computational unit designed to mimic the biological neuron in our brain. A neuron accepts multiple inputs(X) and produces a single output. The output of a neuron is a linear combination of its inputs with its own properties called _weights(W)_.

### Linear combination

The key idea here is **linear combination**. In simple terms, a linear combination is the sum of each input (X)multiplied by its weight (W). Then we add a constant called the bias (b) to this sum. The bias is important because the function we are trying to model might not always pass through the origin (zero point). For example, a line often doesn't go through the origin, and the bias helps shift it to the right place.

Mathematically, for inputs `x1,x2 .. xn` and weights `w1,w2..wn` and bias `b` the output of a single neuron looks like this.

    Output = w1.x1 + w2.x2 + ⋯ + wn.xn + b

### Understanding Neurons Through Simple Math

Let's start with something familiar. A straight line in 2D space. From basic math, we know a line can be written as.

    ax + by + c = 0 or y = mx + C

Here, `m=−a/b` is the slope, and `C=−c/b` is the y-intercept. This form tells us that for every input x, there's a corresponding output y that lies on the line. Now, think of this line like a simple neuron, x is the input m is the weight C is the bias.

The neuron learns to predict y using.

    y = mx + C

Once trained, the neuron can accurately output y for any given x. In this 2D case, there's just one weight—one slope.

### What happens with more inputs?

If we have two inputs, like x and y, the equation becomes:

    ax + by + cz + d = 0

Solving for z, we get:

    z = m1.x + m2.y + C

Now, we have two slopes m1 in the xz-plane and m2 in the yz-plane. This represents a flat plane in 3D space. As we add more inputs, the equation grows, and we move into higher-dimensional spaces. We can't visualize these, but mathematically, they follow the same idea.

### One Neuron, Many inputs

All these linear relationships can be learned by a single neuron. A neuron combines inputs and weights like this:

    Output = w1.x1 + w2.x2 + ⋯ + wn.xn + b

During training, the neuron adjusts these weights and bias to match the desired outputs. If the problem is linear, one neuron is all you need.

### Solving using multiple neurons

Interestingly, a single linear combination can often be written as a combination of other linear combinations. This means you can use multiple neurons and even multiple layers (called hidden layers) to solve the same problem. For example, suppose we have a linear function like.

    L = 5x + 3y + 2

We can break this down into parts:

    L1 = 2x + y + 1
    L2 = 3x + 2y + 1

Then combine them:

    L3 = L1 + L2 = (2x + y + 1) + (3x + 2y + 1) = 5x + 3y + 2

`L3 = L`, the original linear function.

This example shows that even a simple function can be built using multiple smaller parts. That's the basic idea behind neural networks. Stacking and combining small operations to build more complex ones. And this principle holds true even in higher dimensions of linear combination.

### Nonlinearity

But there is a catch, we can model only linear problems in this way ie, when the input and output are related by a straight line. For example, take a nonlinear function like a parabola defined as follows.

    y = ax² + c

In this case, even if we use many neurons and stack multiple layers, we still can't solve the problem using only linear combinations. That's because combining one line with another still gives you another line. No matter how many you add, you won't get a curve. To solve nonlinear problems like this, we need to introduce something extra, a non-linear twist in the network's behavior. This is where activation functions come in.

### Activation function

Activation functions are often explained as switches that "activate" when the neuron's output passes a certain threshold, inspired by how neurons in the brain fire. But the real reason we use them in neural networks is that
_"they force a linear combination output curved"_.

### Universal Approximation Theorem

As you dig deeper into how neural networks solve nonlinear problems, you'll eventually come across a key idea known as the Universal Approximation Theorem. This theorem is foundational, it helps answer many of the questions that come up when trying to understand how neural networks can handle complex relationships between inputs and outputs.

The Universal Approximation Theorem states that

    A feed forward neural network with just one hidden layer and a finite number of neurons can approximate any continuous function, as closely as you want, as long as it uses an activation function that is non-linear, continuous, non-constant, and bounded.

It means that even relatively simple neural networks have the power to represent very complex functions, as long as the right conditions are met. Of course, in practice, deeper networks with more layers are often used for better efficiency and generalization, but this theorem gives us confidence that neural networks can theoretically solve a huge range of problems.

The Universal Approximation Theorem might sound intimidating at first, it's packed with terms that seem to require deep mathematical knowledge. But if we look at it with an example and some intuition, it becomes much easier to understand. Let's take the familiar curve of a parabola.

    y = ax² + c

Now let's focus on a limited range, say, where x goes from 0 to 5. Within this range, we can see how the curve behaves. Now imagine breaking this curve into many tiny straight-line segments, so that when we connect them, they closely follow the shape of the parabola.

Each of those tiny line segments can be represented by a linear combination of inputs and weights, plus a bias, which is exactly what a single neuron does. If we use multiple neurons, we can assign each one to approximate a small segment of the curve.

But here's the catch: connecting straight lines alone won't create a curved shape. That's where activation functions come in. At the end of each line segment (or neuron), we apply a small non-linear twist using an activation function (like `ReLU` or `tanh`). This twist allows the network to go beyond straight lines and helps it approximate curves and other complex shapes.
The more neurons we use, the smaller and more accurate those segments become.

So, more neurons means finer approximation of the curve.
That's the heart of the Universal Approximation Theorem, it tells us that, given enough neurons and the right activation function, a neural network can approximate any continuous function to any desired level of accuracy.
**So how many neurons do we need?** It depends on the problem. For simple shapes (like a parabola), a small number of neurons may be enough. For more complex curves (like a circle or a wave), we need more neurons to capture all the detail.

Since each neuron represent a part of line segment we can say that each neuron essentially learns a small piece of the overall curve, or a sub-feature of the curve. The more neurons you have, the more detailed and accurate your model becomes.

As per the theorem a single hidden layer can solve any problem, but it might need a very large number of neurons. This can make calculations slow and inefficient. However, by using multiple layers, we can break the problem into smaller parts and simplify the work. More layers usually help the network learn better with fewer neurons in each layer. But adding too many layers or neurons doesn't always improve the results. **Therefore finding the right number of layers and neurons depends on the problem and requires some experimentation.**

### Final note

The approach of using neural networks to approximate functions works well when the function is continuous meaning it changes smoothly without sudden jumps. But _in the real world, many functions are discontinuous_, with sharp breaks or gaps. When there's a discontinuity in a range, one network might struggle to model it accurately because linear combinations with activation functions produce outputs that are smooth and continuous. To handle this, we often need to use separate networks for different parts of the input range where discontinuities occur, or apply special techniques to smooth out those jumps. This might be an interesting topic for another post.

Happy Learning
