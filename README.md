# bats-can-draw

Hey! This is just a quick starter kit for Pico-8-style gamedev on Canvas. It's an NPM package, plus 

Namely that means:

- Fixed framerate (Currently 60)
- Pixel buffer for draw operations
- You own the main loop
- Fixed palette (Currently hardcoded: the pico 8 palette)
- No scenegraph

I'll probably add some support for Pico-8 style IO later. (I haven't coded this yet)

## What I coded

- I set up the canvas to auto-resize to match the container.
- I set the code up to run update() at about 60fps and draw() at the browser's chosen framerate
- I wrote a little demo in main.ts that exploits these features
- I added a .gitignore which you can adapt for your project
- I added Pico-8-style keyboard input and graphics operations
- I set up a little NPM package to include the common code that is not part of the  starter kit.

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

In addition, Parcel doesn't use the real typescript compiler and has a default behavior of literally ignoring all type errors. (Note that VS Code will do the right thing and present you with all your errors, and respects the `strict` setting in `tsconfig.json`.)

## Steps

- Install Node+NPM and Yarn. (I use Node 16.13.1 LTS and Yarn 1.22.17)
- Create a project folder (ex. `kobolds`. You can also just use the existing `demo` folder)
- Copy the files in `demo` to the project folder (ex `kobolds/src/index.html` et al)
- Initialize Yarn (`yarn init -y`)
- Install Parcel (`yarn add --dev parcel`. I use 2.1.1)
- Install bats-can-draw (`yarn add file:..` if you just cloned from git and are using the actual `demo` folder; `yarn add bats_can_draw` otherwise)
- Run Parcel from your project (`cd kobolds`, `yarn parcel src/index.html --no-cache`) 
- Navigate to Parcel's URL in your browser: `http://localhost:1234`

## What you'll end up with

- A `package.json` and `yarn.lock` file which collectively say "this project uses Parcel and `bats-can-draw`." You should version control these so other people can build your code on the exact same package configuration.
- Some parcel-specific folders to not touch (`.parcel-cache`, `dist`)
- Some NPM-specific folders to not touch (`node_modules`)

Man, JavaScript tooling wreaks fucking havoc on your directory structure, doesn't it?

## TODO

- Text
- Palette, clip, and camera commands
- Spritesheets

## Explicitly not in scope

- Map/level editor support
- Sound