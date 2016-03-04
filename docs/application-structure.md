# Application Structure

This document is intended to give a high level overview of the structure of FLICast Core for the FireTV.

The FLICast Core - FireTV project follows the standard [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) structure. The following files are worth noting:

* `init.js`: contains several configuration variables for getting our application started properly
* `app.js`: the main controller. Works by jump starting the application as a whole, and then tying together and wrangling the models and views
* `index.html`: a conglomeration of [Handlebars](http://handlebarsjs.com/) templates, which get parsed by views
* `model-json.js`: a model for reading and delegating our JSON data from a client. This will change depending on the JSON structure received / API endpoints available, et cetera.
* `*-view.js`: individual views. Responsible for handling the actual display work, including rendering, button presses, and state transitions, within each view.
* A variety of utility scripts for handling errors (in what eventually should be a [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-compliant manner), translating user input device mechanisms, unifying timestamps, et cetera.
* `*.scss`: SASS files for handling styling. _TODO: More on SASS._

Before you jump in to the code, it's important to understand modern Javascript development patterns, in particular the *Immediately-invoked function expression.* They have a lot of wonderful properties, are simple to write, reuse, and extend, *and* performant relative to frameworks which aim to solve the same problems.

I recommend reading the following articles [for what it's worth, I find them to be most useful in a top-to-bottom order, but simplest to quickly understand in bottom-to-top]:

* [Ben Alman on IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/): This is the guy who coined the term. Probably the most useful resource, but requires a little bit of reading.
* [I Love My IIFE](http://gregfranko.com/blog/i-love-my-iife/)
* [An Introduction to IIFE](http://adripofjavascript.com/blog/drips/an-introduction-to-iffes-immediately-invoked-function-expressions.html)
* [Wikipedia on IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)
* [Stack Overflow answer on IIFE](http://stackoverflow.com/a/8228308)
