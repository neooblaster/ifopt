# ifopt ReadMe

``ifopt`` is my own **Command Line Interface** options parser with some
other feature.
During a project where I developed a simple script, I need to add some
option to change the behavior. I use **NodeJS** options and parse them
as like **PHP** perform. 

So, finaly I created ``ifopt`` to reuse it event if **cli** lib already
exist.

## Summary

[](MakeSummary)



## How to use it


### Installation of  ``ifopt``

* Go into the root of your project
* Type the following command : ``npm install ifopt`` :
    * That will creates a ``package.json`` file, or add it as dependency.



### Load `ifopt` object

* Once ``ifopt`` installed, load it as following :

````js
const opt = require('ifopt');
````



### ``ifopt`` mains functionnalities

In the world of **Command Line Interface options**,
there is two kind of options :
* The short options which begins with one dash (`-`).
* The long options which begins with two dashes (`--`).

I created a third kind of option : **the implicits** ones.
All elements put behind the command are an option.

For instance, in this command ``find text -v --output=file.txt``,
``text`` is also an option as `-v` and `--output` are.
**implicits** option are identified with their position, without
taking account of short & long option :

* ``find text -v --output=file.txt``
* ``find -v text --output=file.txt``
* ``find -v --output=file.txt text``

Herebefore, ``text`` is always the **first** implicit option.

``ifopt`` only parse options.
Using returned option is in your hand.
You can decide to use implicit, sort and long option for
the same information (Eg: **input file**)
.

An option **CAN HAVE**, **MUST HAVE** or **NOT** a value.
It's possible to set the expected behavior regarding the option.
``ifopt`` will warn the user when the option not fullfill the requirement.



### Parse NodeJS options

``ifopt`` offers differents ways to set and get NodeJS options.
The simpliest way is to get 




### Check Option (`isOption()`)




