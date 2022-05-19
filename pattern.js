//const debug = require('yves').debugger(require('../package.json').name + ':lib:midi:' + (require('change-case').paramCase(require('path').basename(__filename, '.js'))).replace(/-/g, ':'))

const patternTraining = require('./training/pattern.js')

const fs = require('fs-extra')
const path = require('path')
const toneJSmidi = require('@tonejs/midi')

const Table = require('cli-table3')

const jsonfile = require('jsonfile')
const _ = require('lodash')
const util = require('util')


const writeMidiFiles = process.env.MIDI ? !!parseInt(process.env.MIDI) : false
const temperature = process.env.TEMPERATURE ? parseFloat(process.env.TEMPERATURE) : 1.0
const velocity = process.env.VELOCITY ? parseInt(process.env.VELOCITY) : 100
const patternLength = process.env.STEPS ? parseInt(process.env.STEPS) : 16

const ticksPerStep = 120

function generateLetter(patternTraining, history, order, temperature) {
  let h = history.slice(-order)
  let dist = {}
  let l = patternTraining[h]
  for (let key in l) {
    if ({}.hasOwnProperty.call(l, key)) {
      let v = l[key]
      dist[key] = (v / temperature) + 1.0 - (1.0 / temperature)
    }
  }
  let x = Math.random()
  for (let k in dist) {
    if ({}.hasOwnProperty.call(dist, k)) {
      let p = dist[k]
      x = x - p
      if (x <= 0.0) {
        return k
      }
    }
  }
}

function generateText(patternTraining, order, nletters, temperature) {
  let starts = Object.keys(patternTraining).filter(function(k) {
    return k.slice(-2) === '~\n'
  })
  let history = starts[Math.floor(Math.random() * Math.floor(starts.length))]
  let s = ''
  for (let i = 0; i < nletters; i++) {
    let c = generateLetter(patternTraining, history, order, temperature)
    history = history.slice(1) + c
    s += c
  }
  return s
}

function generatePattern(patternTraining, order, patternLength, temperature) {
  let stepLength = 9
  let text = generateText(patternTraining, order, (stepLength + 2) * patternLength, temperature)
  let lines = text.split('\n')
  let re = /^(.)!([01])\$([01])#([01])=$/
  let s = 0
  let steps = []
  let c1 = 36


  for (let l = 0; l < lines.length; l++) {
    let line = lines[l]
    if (line === '~') {
      continue
    }
    let m = line.match(re)
    if (m === null) {
      continue
    }

    let step = {
      note: m[1].charCodeAt(0) - 82 + c1,
      accent: m[2] === '1',
      slide: m[3] === '1' ? 1 : 0,
      gate: m[4] === '1' ? 1 : 0
    }

    steps.push(step)

    s = s + 1
    if (s === patternLength) {
      break
    }
  }

  return steps
}


function generate() {

  const size = patternLength
  const steps = generatePattern(patternTraining, 18, size, temperature)
  if (writeMidiFiles) {

    function Note(pitch, start, duration, velocity) {
      this.midi = pitch
      this.time = start / 2
      this.duration = duration / 2
      this.velocity = (velocity + 1) / 128
    }

    let fixGate = false

    let notes = []
    let lastStep = null
    let previousNote = null
    steps.forEach((step, index) => {
      if (!(!fixGate && step.gate === 0)) {
        if (lastStep && lastStep.note === step.note && lastStep.slide && (fixGate || lastStep.gate)) {
          // slide and same pitch as previous step -> extend duration of previous note
          if (step.slide && previousNote) {
            previousNote.duration += 0.125
          }
        } else {
          const note = new Note(step.note, index / 4.0, step.slide ? 0.375 : 0.125, step.accent ? 127 : velocity)
          notes.push(note)
          previousNote = note
        }
        lastStep = step
      }
    })

    const name = `Bacara - ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`

    const midiFile = new toneJSmidi.Midi()
    midiFile.name = name

    const track = midiFile.addTrack()

    track.name = name
    notes.forEach( (note, index) => {
      track.addNote(note)
    })

    const filepath = path.resolve(`${__dirname}/midi/patterns/${name.replace(/:/g, '.')}.mid`)
    fs.ensureDirSync(path.dirname(filepath))
    fs.writeFileSync(filepath, new Buffer.from(midiFile.toArray()))

    const midiData = fs.readFileSync(filepath)
    const midiJson = new toneJSmidi.Midi(midiData)
    midiJson.tracks[0].instrument.number = 38

    let maxTicks = 0
    _.get(midiJson, 'tracks.0.notes', []).forEach( note => {
      if (maxTicks < note.ticks) {
        maxTicks = note.ticks
      }
    })
    const ticksPerStep = 120
    let patternSteps = 1
    while (Math.floor(maxTicks / ticksPerStep) > patternSteps) {
      patternSteps *= 2
    }
    return midiJson
  } else {
    return steps
  }
}


const pattern = generate({})

console.log(util.inspect(pattern, {showHidden: false, depth: null, colors: true}))
