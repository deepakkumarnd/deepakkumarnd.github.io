## Batch normalization

In a deep neural network, inputs pass through multiple hidden layers from left to right to produce the output. We use stochastic gradient descent (SGD) as an effective method to train these networks. During training, the gradient of the loss function with respect to the network's weights is computed using the chain rule of differentiation, flowing backward through the network from the output layer to the input layer.

With this understanding take a deeper look at what is happening during the training. The input is undergoing a linear combination with the weights and then a bias is added to it at each layer. After that an activation function (F) acts on the result.

$$
\text{output} = F(XW + b)
$$

Now this output is going to be the input to the next layer and it goes on like that. For the given input the loss is calculated and a gradient with respect to the parameters is calculated and gradient descent is performed from the rightmost layer to the left. This is represented as follows.

$$
W = W - \text{lr} \cdot \frac{\partial L}{\partial W}
$$

The learning rate here is not a constant value, it comes from an optimizer like `ADAM` optimizer. Therefore we will be able to update each weight in a non uniform way.

### Internal Covariate Shift

When weights are updated each layer produces outputs of varying distribution. This varying distribution is known by the term `Internal Covariate Shift`. Research shows that network convergence is much better when the distribution remains the same, because networks don't have additional effort in capturing different distributions even for the same input representation..

Therefore if we have a way to keep the distribution the same for all the inputs and train the network then we can achieve great accuracy with a much lower number of iterations.

This is where `batch normalization` comes in. In order to understand batch normalization let's look at an example network with two layers

For a two layer network the outputs can be written as follows.

$$
\text{Output} = F_2\left(F_1(X_1, W_1), W_2\right)
$$

Here $$ X_1 $$ is the `k` dimensional input, $$ W_1 $$, $$ W_2 $$ are weight metrics. $$ F_1 $$ and $$ F_2 $$ are activation functions.

We can rewrite this as follows

$$
X_2 = F_1(X, W_1)
$$

$$
\text{Output} = F_2(X_2, W_2)
$$

Concepts like **Internal Covariate Shift** can be understood using intuition. To understand it better let's imagine that we are trying to teach a small kid to recognize shapes or patterns. We use printed cards of a particular size each containing a single pattern in different ways at different angles and slightly varying sizes. After a few trails the kid will be able to recognize and identify the patterns correctly.

Now imagine that we have done the same training with different sized cards in which patterns are printed. This means the kid has to understand that the same pattern can come in varying sizes hence the training may take more time than with the fixed cards.

The trainer now recognizes that by scaling all the training cards to a fixed card size kids can learn much faster because they don't have the additional effort of scaling in their brain to identify the pattern.

### Normalization

This is what happens when we use normalization, we fix the input distribution to have zero mean and a variance of one. Such a distribution is called `normal distribution`. With this the network doesn't have additional effort in learning different distributions in addition to learning features of the inputs. Therefore when we apply normalization to each input the number of iterations to train the network goes down substantially.

Note that each layer identifies a set of features of the inputs. Without normalization when the training data flows through multiple network layers, the same input undergoes multiple non linear transformations and each transformation will be of different distributions. Therefore careful network initialization will be needed for the network to converge and that is very difficult thing to do.

To avoid this problem a normalization can be applied to inputs at each layer. Therefore each input representing the same result with varying distribution will be represented in a normalized way. This will drastically bring down the training effort and time because fewer iterations are required compared to the non normalized inputs.

### Identity transformation

However, there's an important detail to note, normalization alters the inputs, which means the transformed data may no longer fully represent the original inputs. To address this, an `Identity Transformation` is applied to the normalized data. This ensures that the model can still recover the original input distribution if needed. Here's how it works.

$$
\text{Normalized} = \frac{X - \mu}{\sigma}
$$

**Where:**

-   $$ \mu $$ is the mean of X
-   $$ \sigma $$ is the standard Deviation of X

$$
\hat{X} = \gamma \cdot X_{\text{norm}} + \beta
$$

**Where:**

-   $$ \hat{X} $$ is the transformed output
-   $$ X\_{\text{norm}} $$ is the normalized input
-   $$ \gamma $$ is the learnable scale parameter
-   $$ \beta $$ is the learnable shift parameter

The `scale` $$ \gamma $$ and `shift` $$ \beta $$ are trainable parameters, initially set to 1 and 0 at the start of training. In stochastic gradient descent, we work with mini-batches and apply normalization at the batch level. This is more efficient because it allows us to optimize multiple inputs in one forward pass. The scale and shift parameters are updated for each batch and are designed to reverse the normalization effect, producing a representation that works well for the entire batch. As a result, we obtain a batch of normalized inputs tailored for learning.

Normalized inputs have smaller values, which means they produce smaller outputs when passed through activation functions like `sigmoid` ($$ \frac{1}{1 + e^{-x}} $$), often used in the final layers. Because the inputs are smaller, softmax outputs don't get saturated. When softmax receives large inputs, it can output values close to 1, causing the gradient to become zero and when that happens, the neuron stops learning. Normalization helps prevent this by keeping input values small, which reduces the risk of vanishing gradients caused by saturating activation functions.

Another key point is that the transformed values are like shrinking a high-resolution image into a low-resolution one. This process removes a lot of details. In a similar way, normalization acts as a form of `regularization`. While regularization deserves a separate discussion, its main purpose is to prevent the network from `overfitting`. Because normalization already provides this regularizing effect, it may reduce the need for additional methods like `dropout` or allow for using a lower dropout rate.

Happy Learning
