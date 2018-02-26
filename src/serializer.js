"use strict";

import * as JSSynth from "./jssynth";

class Serializer {
  constructor() {};

  static serializeInstrument(instrument) {
    let filterCutoff = parseInt(instrument.filterCutoff, 10);

    let serializedConfig = {
      oscillators: [
        {
          waveform: instrument.waveform1,
          octave: parseInt(instrument.waveform1Octave),
          detune: 0,
        },
        {
          waveform: instrument.waveform2,
          octave: parseInt(instrument.waveform2Octave),
          detune: parseInt(instrument.waveform2Detune),
        }
      ],
      lfo: {
        waveform:  instrument.lfoWaveform,
        frequency: parseFloat(instrument.lfoFrequency),
        amplitude: parseInt(instrument.lfoAmplitude, 10),
      },
      filter: {
        cutoff:    filterCutoff,
        resonance: parseInt(instrument.filterResonance, 10),
        mode: instrument.filterModulator,
        lfo: {
          waveform:  instrument.filterLFOWaveform,
          frequency: parseFloat(instrument.filterLFOFrequency),
          amplitude: parseFloat(instrument.filterLFOAmplitude) * filterCutoff,
        },
        envelope: {
          attack:  parseFloat(instrument.filterEnvelopeAttack),
          decay:   parseFloat(instrument.filterEnvelopeDecay),
          sustain: parseFloat(instrument.filterEnvelopeSustain),
          release: parseFloat(instrument.filterEnvelopeRelease),
        },
      },
      envelope: {
        attack:  parseFloat(instrument.envelopeAttack),
        decay:   parseFloat(instrument.envelopeDecay),
        sustain: parseFloat(instrument.envelopeSustain),
        release: parseFloat(instrument.envelopeRelease),
      },
    };

    return new JSSynth.Instrument(serializedConfig);
  };

  static serializePatterns(patterns) {
    let serializedPatterns = {};

    patterns.forEach(function(pattern) {
      let serializedRows = [];

      pattern.rows.forEach(function(row) {
        let sequence;
        let rawSequenceString;

        rawSequenceString = row.notes.map(function(note) { return note.name; }).join(' ');
        sequence = JSSynth.SequenceParser.parse(rawSequenceString);
        serializedRows.push(sequence);
      });

      serializedPatterns[pattern.id] = serializedRows;
    });

    return serializedPatterns;
  };

  static trackByID(tracks, id) {
    let i;
    for (i = 0; i < tracks.length; i++) {
      if (tracks[i].id === id) {
        return tracks[i];
      }
    }

    return undefined;
  };

  static instrumentByID(instruments, id) {
    let i;
    for (i = 0; i < instruments.length; i++) {
      if (instruments[i].id === id) {
        return instruments[i];
      }
    }

    return undefined;
  };

  static patternsByTrackID(allPatterns, trackID) {
    let i;
    let patterns = [];

    for (i = 0; i < allPatterns.length; i++) {
      if (allPatterns[i].trackID === trackID) {
        patterns.push(allPatterns[i]);
      }
    }

    return patterns;
  };

  static serialize(tracks, instruments, patterns) {
    let i, j;
    let serializedInstrument;
    let serializedPatterns;
    let serializedNotes = [];

    for (i = 0; i < (8 * 16); i++) {
      serializedNotes[i] = [];
    }

    let trackVolumeMultiplier = 1 / tracks.length;

    tracks.forEach(function(track) {
      if (track.muted) {
        return;
      }

      serializedInstrument = Serializer.serializeInstrument(Serializer.instrumentByID(instruments, track.instrumentID));
      serializedPatterns = Serializer.serializePatterns(Serializer.patternsByTrackID(patterns, track.id));

      for (i = 0; i < track.patterns.length; i++) {
        if (track.patterns[i].patternID !== -1) {
          let sequences = serializedPatterns[track.patterns[i].patternID];

          sequences.forEach(function(sequence) {
            for (j = 0; j < sequence.length; j++) {
              if (sequence[j] && sequence[j].name()) {
                serializedNotes[(i * 16) + j].push(new JSSynth.InstrumentNote(sequence[j], serializedInstrument, track.volume * trackVolumeMultiplier));
              }
            }
          });
        }
      }
    });

    return serializedNotes;
  };
};

export { Serializer };