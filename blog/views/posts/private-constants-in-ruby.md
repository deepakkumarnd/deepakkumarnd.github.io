<!--
title: Private constants in ruby
date: 25/09/2026
lang: en
tags: Programming, Ruby
category: Programming
-->

# Private constants in ruby

_{post_date}_

In Ruby programming language constants are special variables that should not be reassigned. There is no special syntax for defining constants in ruby, a variables starting with a capital letter is treated as a constant. Technically speaking they are not really constants because ruby allows reassigning a constant but with a warning, more importantly ruby allows mutating the value of a constant. If you are new to ruby this feels like a fundamental flaw in the language. But this is not a flaw that is how the language is designed.

> Ruby is a dynamic, it trusts programmers to write code sensibily than to act like a regulator.

By convention programmers use `FULL_CAPITAL_LETTERS` words as name for constant values. If you modify the constant which you shouldn't then ruby issues a harmless warning and changes its value. If you mutate the value then ruby silently changes the value.

```shell
irb(main):001> NAME = "Deepak"
=> "Deepak"
irb(main):002> NAME = "Deepak Kumar"
(irb):2: warning: already initialized constant NAME
(irb):1: warning: previous definition of NAME was here
=> "Deepak Kumar"
irb(main):026> NAME.concat(' Hello')
=> "Deepak Kumar Hello"
```

Therefore it is upto the developer to use constant sensibily. A class name such as `Tiger` or module name such as `Carnivorous` also starts with a capital letter, yes they are treated as constants in ruby. Just like constants they can be reassigned. If you reassign `Tiger` as `Cow` then of course `Tiger` becomes a `Cow` and that is not going to be funny.

## Visibility of a constant

If you define a constant it is accessible publicly, more like a global variable. You can access deeply nested constants using the scope operator. You can list down all the constants defined within a class or module by calling the method `constants`.

```shell
irb(main):008> Math.constants
=> [:E, :DomainError, :PI]
irb(main):027> Math::PI
=> 3.141592653589793
```

```ruby
module Animal
    OUTPUT_FORMAT = 'json'

    module Carnivorus; end
    module Herbivorus; end

    class Tiger
        TYPE = 'wild'
        include Carnivorus
    end

    class Cow
        TYPE = 'domestic'
        include Herbivorus
    end
end
```

```shell
irb(main):015> Animal.constants
=> [:Cow, :OUTPUT_FORMAT, :Carnivorus, :Herbivorus, :Tiger]
irb(main):016> Animal::Tiger::TYPE
=> "wild"
```

## Private constants

From the above examples it is very clear that your constant are accessible ourside the scope. But some of the constants such as `OUTPUT_FORMAT` does not make sense outside its scope. What if you want to define constants privately ? Starting with ruby 1.9.3 ruby introduced [Module.private_constant](https://www.rubydoc.info/stdlib/core/Module:private_constant) method that lets you make constants private. In the above example if you don't want to expose the behavioural modules and `OUTPUT_FORMAT` then you can make them private as follows.

```ruby
module Animal
    OUTPUT_FORMAT = 'json'

    module Carnivorus; end
    module Herbivorus; end

    private_constant :Carnivorus
    private_constant :Herbivorus
    private_constant :OUTPUT_FORMAT

    class Tiger
        TYPE = 'wild'
        include Carnivorus
    end

    class Cow
        TYPE = 'domestic'
        include Herbivorus
    end
end
```

Now if you try to access the private constant then ruby throws an error.

```shell
irb(main):018> Animal.constants
=> [:Cow, :Tiger]
irb(main):019> Animal::Carnivorus
(irb):19:in '<main>': private constant Animal::Carnivorus referenced (NameError)
```
Private constants in ruby is a lesser known feature, from an object oriented point of view private constants are a way to encapsulate the code or data internal to a module or a class. In larger programs such features are valuable because every developer may not have the full context, some may not understand that the constant is meant only for the private usage within the module.