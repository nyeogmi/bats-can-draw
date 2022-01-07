# bats-can-draw

Hey! This is just a quick starter kit for pixel buffery gamedev on Canvas with Parcel.

Namely that means:

- Fixed framerate (Currently 60)
- Pixel buffer for draw operations
- You own the main loop
- No scenegraph

I'll probably add some support for Pico-8 style IO later. (I haven't coded this yet)

I'll also set it up to use nearest-neighbor scaling. (which is just a CSS thing)

## Why you would use this

You might use this if:

- You hate relinquishing main()
- You like pushing pixels
- You're porting a game to JavaScript from pygame or minifb

## Steps

- Install Node+NPM and Yarn. (I use Node 16.13.1 LTS and Yarn 1.22.17)
- Create a project folder (ex. `kobolds`)
- Copy the files in src/ to the project folder (ex `kobolds/src/index.html` et al)
- Install Parcel (`yarn add --dev parcel`)
- Run Parcel from your project (`cd kobolds`, `yarn parcel src/index.html`)
- Navigate to Parcel's URL in your browser: `http://localhost:1234`

## What I did

- I set up the canvas to auto-resize to match the container.
- I set the code up to run update() at about 60fps and draw() at the browser's chosen framerate

## TODO

- Use nearest-neighbor scaling
- Tell the browser we want 60fps
- Provide a higher level interface to canvas operations

## Explicitly not in scope

- Map/level editor support
- Sound