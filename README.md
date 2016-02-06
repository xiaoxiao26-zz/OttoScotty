##Otto Scotty

Have you ever been at home and had a desire to evaluate some raw Javascript
without having to open up your laptop? Or maybe you've found yourself bored at a
CMU party, wanting nothing more than to just surreptitiously sling some sick
lines of Javascript, but you feared that someone would notice and call you a
nerd.

If that sounds like you, then, first of all, I'm sorry. Second of all, you're a
nerd. Third of all, we have a solution to your problem.

Just shoot a message to our chat bot Otto Scotty on Facebook, and he'll evaluate
your Javascript for you. Don't hurt him; he's fragile.

### What's in this git repo???
This contains the backend to Otto Scotty. You can see its Node.js server, a
Chrome extension that runs on Alan Jaffe's computer to run Otto, and the
javascript code that the aforementioned Chrome extension runs on. Some may call
this disorganized. Some may say that we should split this disparate components
into separate repos. But those people are fools. When has writing maintainble
code ever helped anyone?

### Can I run my own version of Otto Scotty using this code?
Sure, but I don't feel like typing up instructions right now. Do note that the
computer running the Chrome extension also needs to install another Chrome
extension called Content-Security-Policy. This is because running this bot
violates the Facebook Content Security Policy. Wait, what?
