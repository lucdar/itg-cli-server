# Necessity of `itg-cli-server`

As I think more and more about this project (interfacing itg-buddy with itg-cli), the necessity of `itg-cli-server` becomes less and less clear. I think that it’s probably best to collapse this layer of indirection and consolidate the structure of the project to be on one machine, the DDR computer. `itg-buddy` will directly make calls to the `itg-cli`, a much cleaner souliton imo.

I think I was excited to build something distributed and using web protocols like that, but I soon came to realize that communicating over these protocols requires a lot of organization that I’d have to build up from scratch, something I wasn’t really prepared or motivated to do. I also think that the more software we have running, the greater chance there is for something to break, or for a vulnerability to surface. Debugging will be easier, development will be easier, and adding new features will be easier. Also, getting things to communicate over stdin and stdout is already challenging enough haha. I won’t need to host the `itg-cli-server` so the bot will be able to be used in the UC Berkeley DDR machine regardless of my input or support after I graduate. I think that things are better  with this structure.

Eventually it would be fun to build out an API, but I don't think this project is right for the task. I want lots of two-way communication, it’s hard to implement it in a REST-like way, and wrapping my head around the async communication that needs to happen as well as being able to describe it cohesively--it's a bit too much to handle right now. I just want to get things working!

Thanks `itg-cli-server`. Though you were only run a handful of times, you gave me some precious insight into the world of web sockets and the need for and difficulty in making well defined communication standards.