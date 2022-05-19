# Bacara Algo

This is a short demo of an two *algo's* (HAPAX speak for Generators). One for patterns (actually ACID Bassline patterns), and one for drums.

![Example Clips](images/Screenshot.png)

To run it, please fist install NodeJS ([here](https://nodejs.org/en/)).

	cd bacara-algo
	npm install

For Patterns, run:

	MIDI=0 TEMPERATURE=1.0 VELOCITY=100 STEPS=16 node pattern.js

This should result in something like this:

    [
      { note: 36, accent: false, slide: 1, gate: 1 },
      { note: 36, accent: false, slide: 0, gate: 1 },
      { note: 48, accent: false, slide: 1, gate: 1 },
      { note: 36, accent: false, slide: 1, gate: 1 },
      { note: 38, accent: false, slide: 0, gate: 1 },
      { note: 34, accent: true, slide: 0, gate: 1 },
      { note: 36, accent: true, slide: 1, gate: 1 },
      { note: 50, accent: true, slide: 0, gate: 1 },
      { note: 38, accent: false, slide: 1, gate: 1 },
      { note: 62, accent: false, slide: 1, gate: 0 },
      { note: 62, accent: true, slide: 0, gate: 1 },
      { note: 50, accent: false, slide: 0, gate: 1 },
      { note: 38, accent: false, slide: 1, gate: 1 },
      { note: 47, accent: false, slide: 0, gate: 1 },
      { note: 53, accent: true, slide: 1, gate: 1 },
      { note: 53, accent: false, slide: 0, gate: 1 }
    ]


For Drums, run:

	MIDI=0 STEPS=16 node drums.js

This should result in something like this (an array for **BD**, **SD**, **LT**, **MT**, **HT**, **RS**, **HC**, **CB**, **CY**, **OH**, **CH**):

    [
      [
        1, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 0, 0,
        1, 0, 0, 0
      ],
      [
        2, 2, 1, 1, 2, 1,
        1, 1, 2, 1, 1, 1,
        2, 1, 1, 1
      ],
      [
        0, 0, 1, 0, 1, 1,
        0, 2, 0, 0, 0, 0,
        0, 0, 0, 2
      ],
      [
        0, 0, 0, 1, 0, 1,
        0, 1, 0, 0, 0, 0,
        0, 0, 0, 0
      ],
      [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 1, 1, 1
      ],
      [
        0, 0, 0, 0, 0, 1,
        0, 1, 0, 0, 0, 0,
        2, 0, 0, 0
      ],
      [
        0, 0, 0, 1, 0, 0,
        1, 0, 2, 0, 1, 1,
        0, 0, 0, 0
      ],
      [
        0, 1, 0, 0, 0, 1,
        0, 0, 0, 1, 0, 0,
        0, 1, 0, 0
      ],
      [
        2, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
      ],
      [
        0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0,
        0, 0, 0, 0
      ],
      [
        0, 0, 2, 0, 0, 0,
        2, 1, 0, 0, 0, 0,
        0, 0, 0, 1
      ],
      [
        2, 1, 0, 1, 1, 1,
        0, 1, 1, 1, 0, 1,
        1, 1, 0, 1
      ]
    ]


## The Parameters

**MIDI**:   If set to '1', will write the generated notes to a MIDI file  (in either the 'patterns' or 'drums' folder insode 'midi' folder)
        If set to '0', it will not write it
        (default 0)

**TEMPERATURE**: Influences the generated pattern (value between 1.0 and 5.0) (default 1.0)

**VELOCITY**:   The Velocity for 'Normal' (non-accented) notes, only needed when writing MIDI files (default 100)

**STEPS**:  Positive Integer, determines the number of steps (default 16)

**STYLE**: 'all', 'house' or 'breaks' (default 'all')
