# bats-can-draw

Hey! This is just a quick starter kit for pixel buffery gamedev on Canvas with Parcel.

Namely that means:

- Fixed framerate (Currently 60)
- Pixel buffer for draw operations
- You own the main loop
- No scenegraph

I'll probably add some support for Pico-8 style IO later. (I haven't coded this yet)

## What I coded

- I set up the canvas to auto-resize to match the container.
- I set the code up to run update() at about 60fps and draw() at the browser's chosen framerate
- I wrote a little demo in main.ts that exploits these features
- I added a .gitignore which you can adapt for your project
- I added Pico-8-style keyboard input

## Why you would use this

You might use this if:

- You hate relinquishing main()
- You like pushing pixels
- You're porting a game to JavaScript from pygame or minifb
- You like TypeScript and want to use that over JavaScript
- You want hot reloading, breakpoints, and a working debugger, all of which exist in Chrome/Firefox, and which Parcel does not break 
- You want a trivial example of ES6 modules

## Gotchas

Parcel seems immature and kind of unstable. When I used `<link rel="stylesheet" href="reset.css">` to add my reset.css file, things broke. When I attempted to use parcel with npm, I got a completely broken installation.

## Steps

- Install Node+NPM and Yarn. (I use Node 16.13.1 LTS and Yarn 1.22.17)
- Create a project folder (ex. `kobolds`)
- Copy the files in src/ to the project folder (ex `kobolds/src/index.html` et al)
- Install Parcel (`yarn add --dev parcel`. I use 2.1.1)
- Run Parcel from your project (`cd kobolds`, `yarn parcel src/index.html`)
- Navigate to Parcel's URL in your browser: `http://localhost:1234`

## What you'll end up with

- A package.json and yarn.lock file which collectively say "this project uses Parcel." You should version control these so other people can build your code on the exact same package configuration.
- Some parcel-specific folders to not touch (.parcel-cache, dist)
- Some NPM-specific folders to not touch (node_modules)

Man, JavaScript tooling wreaks fucking havoc on your directory structure, doesn't it?

## TODO

- Provide a higher level interface to canvas operations

## Explicitly not in scope

- Map/level editor support
- Sound