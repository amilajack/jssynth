app.factory('InstrumentService', ['$rootScope', function($rootScope) {
  var IDGenerator = function() {
    var nextId = 0;

    return {
      next: function() {
        nextId++;

        return nextId;  
      },
   };
  };
  var idGenerator = new IDGenerator();

  var instruments = [{
                        id:                 idGenerator.next(),
                        name:               'Instrument 1',
                        waveform:           'square',
                        lfoWaveform:        'sine',
                        lfoFrequency:       5,
                        lfoAmplitude:       10,
                        filterCutoff:       1000,
                        filterResonance:    0,
                        filterLFOWaveform:  'sine',
                        filterLFOFrequency: 5,
                        filterLFOAmplitude: 0,
                        envelopeAttack:     0.0,
                        envelopeDecay:      0.0,
                        envelopeSustain:    1.0,
                        envelopeRelease:    0.0,
                     },
                     {
                        id:                 idGenerator.next(),
                        name:               'Instrument 2',
                        waveform:           'sawtooth',
                        lfoWaveform:        'sine',
                        lfoFrequency:       5,
                        lfoAmplitude:       0,
                        filterCutoff:       1000,
                        filterResonance:    0,
                        filterLFOWaveform:  'sine',
                        filterLFOFrequency: 5,
                        filterLFOAmplitude: 0,
                        envelopeAttack:     0.0,
                        envelopeDecay:      0.0,
                        envelopeSustain:    1.0,
                        envelopeRelease:    0.0,
                     },];

  var instrumentService = {};

  instrumentService.addInstrument = function() {
    var id = idGenerator.next();
    var newInstrument = {
      id:                 id,
      name:               'Instrument ' + id,
      waveform:           'sawtooth',
      lfoWaveform:        'sine',
      lfoFrequency:       5,
      lfoAmplitude:       0,
      filterCutoff:       1000,
      filterResonance:    0,
      filterLFOWaveform:  'sine',
      filterLFOFrequency: 5,
      filterLFOAmplitude: 0,
      envelopeAttack:     0.0,
      envelopeDecay:      0.0,
      envelopeSustain:    1.0,
      envelopeRelease:    0.0,
    };

    instruments.push(newInstrument);

    $rootScope.$broadcast('InstrumentService.update');

    return newInstrument;
  };

  instrumentService.updateInstrument = function() {
    $rootScope.$broadcast('InstrumentService.update');
  };

  instrumentService.instrumentByID = function(targetID) {
    for (var i = 0; i < instruments.length; i++) {
      if (instruments[i].id === targetID) {
        return instruments[i];
      }
    }

    return null;
  };

  instrumentService.instruments = function() { return instruments; };

  return instrumentService;
}]);

app.factory('PatternService', ['$rootScope', 'InstrumentService', function($rootScope, InstrumentService) {
  var IDGenerator = function() {
    var nextId = 0;

    return {
      next: function() {
        nextId++;

        return nextId;  
      },
   };
  };
  var idGenerator = new IDGenerator();

  var patterns = [
                   {
                     id: idGenerator.next(),
                     name: 'Pattern 1',
                     instrumentID: 1,
                     tracks: [
                       {
                         muted: false,
                         notes: [{name: 'E4'},
                                 {name: 'G4'},
                                 {name: ''},
                                 {name: 'E4'},
                                 {name: 'A5'},
                                 {name: '-'},
                                 {name: 'C5'},
                                 {name: '-'},
                                 {name: 'A5'},
                                 {name: '-'},
                                 {name: 'G4'},
                                 {name: '-'},
                                 {name: 'E4'},
                                 {name: 'D4'},
                                 {name: 'C4'},
                                 {name: ''},],
                       },
                     ],
                   },
                   {
                     id: idGenerator.next(),
                     name: 'Pattern 2',
                     instrumentID: 2,
                     tracks: [
                       {
                         muted: false,
                         notes: [{name: 'C1'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: 'D1'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},],
                       },
                       {
                         muted: false,
                         notes: [{name: 'C3'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: ''},
                                 {name: ''},
                                 {name: ''},
                                 {name: ''},],
                       },
                       {
                         muted: false,
                         notes: [{name: 'E3'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: '-'},
                                 {name: ''},
                                 {name: ''},
                                 {name: ''},
                                 {name: ''},],
                       },
                     ],
                   },
                 ];
  
  var patternService = {};

  patternService.changeInstrument = function(patternID) {
    $rootScope.$broadcast('PatternService.update');
  };

  patternService.addPattern = function(instrumentID) {
    var id = idGenerator.next();

    var newPattern = {
      id: id,
      name: 'Pattern ' + id,
      instrumentID: instrumentID,
      tracks: [
        {
          muted: false,
          notes: [{name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},],
        },
      ]
    };

    patterns.push(newPattern);

    $rootScope.$broadcast('PatternService.update');

    return newPattern;
  };

  patternService.addTrack = function(patternID) {
    var newTrack = {
                     muted: false,
                     notes: [{name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''},
                             {name: ''}],
                   };
    var pattern = patternService.patternByID(patternID);
    pattern.tracks.push(newTrack);

    $rootScope.$broadcast('PatternService.update');
  };

  patternService.removeTrack = function(patternID, trackIndex) {
    var pattern = patternService.patternByID(patternID);
    pattern.tracks.splice(trackIndex, 1);

    if (pattern.tracks.length === 0) {
      patternService.addTrack(patternID);
    }

    $rootScope.$broadcast('PatternService.update');
  };

  patternService.toggleTrackMute = function(patternID, trackIndex) {
    var pattern = patternService.patternByID(patternID);
    pattern.tracks[trackIndex].muted = !pattern.tracks[trackIndex].muted;
    $rootScope.$broadcast('PatternService.update');
  };

  patternService.updateName = function(patternID) {
    $rootScope.$broadcast('PatternService.update');
  };

  patternService.updateNotes = function(patternID, trackIndex, noteIndex) {
    var i;
    var pattern = patternService.patternByID(patternID);
    var newNoteName = pattern.tracks[trackIndex].notes[noteIndex].name;

    if (newNoteName === "-") {
      i = noteIndex - 1;
      while (i >= 0 && pattern.tracks[trackIndex].notes[i].name === "") {
        pattern.tracks[trackIndex].notes[i].name = "-";
        i -= 1;
      }
    }
    else if (newNoteName === "") {
      i = noteIndex + 1;
      while (i < pattern.tracks[trackIndex].notes.length && pattern.tracks[trackIndex].notes[i].name === "-") {
        pattern.tracks[trackIndex].notes[i].name = "";
        i += 1;
      }
    }

    $rootScope.$broadcast('PatternService.update');
  };
 
  patternService.patterns = function() { return patterns; };

  patternService.patternByID = function(targetID) {
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].id === targetID) {
        return patterns[i];
      }
    }

    return null;
  };

  patternService.patternsByInstrumentID = function(targetID) {
    var filteredPatterns = [];

    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].instrumentID === targetID) {
        filteredPatterns.push(patterns[i]);
      }
    }

    return filteredPatterns;
  };

  return patternService;
}]);


app.factory('SequencerService', ['$rootScope', 'InstrumentService', function($rootScope, InstrumentService) {
  var patterns = [
                   {
                     muted: false,
                     patterns: [
                       { patternID: 1, },
                       { patternID: 2, },
                       { patternID: -1, },
                       { patternID: 1, },
                       { patternID: 1, },
                       { patternID: 1, },
                       { patternID: 1, },
                       { patternID: 1, },
                     ],
                   },
                   {
                     muted: false,
                     patterns: [
                       { patternID: 2, },
                       { patternID: -1, },
                       { patternID: -1, },
                       { patternID: 2, },
                       { patternID: 2, },
                       { patternID: 2, },
                       { patternID: 2, },
                       { patternID: 2, },
                     ],
                   }
                 ];

  var sequencerService = {};

  sequencerService.patterns = function() { return patterns; };

  sequencerService.changeSequencer = function(sequenceIndex) {
    $rootScope.$broadcast('SequencerService.update');
  };

  sequencerService.addRow = function(rowIndex) {
    patterns.push({
      muted: false,
      patterns: [
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
        { patternID: -1, },
      ],
    });

    $rootScope.$broadcast('SequencerService.update');
  };

  sequencerService.removeRow = function(rowIndex) {
    patterns.splice(rowIndex, 1);

    if (patterns.length === 0) {
      sequencerService.addRow(0);
    }

    $rootScope.$broadcast('SequencerService.update');
  };

  sequencerService.toggleRowMute = function(rowIndex) {
    patterns[rowIndex].muted = !patterns[rowIndex].muted;
    $rootScope.$broadcast('SequencerService.update');
  };

  return sequencerService;
}]);


app.factory('SerializationService', ['InstrumentService', 'PatternService', 'SequencerService', function(InstrumentService, PatternService, SequencerService) {
  var serializeInstruments = function() {
    var serializedInstruments = {};

    InstrumentService.instruments().forEach(function(instrument) {
      var filterCutoff = parseInt(instrument.filterCutoff, 10);

      var serializedConfig = {
        waveform:  instrument.waveform,
        lfo: {
          waveform:  instrument.lfoWaveform,
          frequency: parseFloat(instrument.lfoFrequency),
          amplitude: parseInt(instrument.lfoAmplitude, 10),
        },
        filter: {
          cutoff:    filterCutoff,
          resonance: parseInt(instrument.filterResonance, 10),
          lfo: {
            waveform:  instrument.filterLFOWaveform,
            frequency: parseFloat(instrument.filterLFOFrequency),
            amplitude: parseFloat(instrument.filterLFOAmplitude) * filterCutoff,
          },
        },
        envelope: {
          attack:  parseFloat(instrument.envelopeAttack),
          decay:   parseFloat(instrument.envelopeDecay),
          sustain: parseFloat(instrument.envelopeSustain),
          release: parseFloat(instrument.envelopeRelease),
        },
      };

      serializedInstruments[instrument.id] = new JSSynth.Instrument(serializedConfig);
    });

    return serializedInstruments;
  };

  var serializePatterns = function(serializedInstruments) {
    var serializedPatterns = {};

    var emptyPattern = {
      id: -1,
      name: 'Empty Pattern',
      instrumentID: 1,
      tracks: [
        {
          muted: false,
          notes: [{name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},
                  {name: ''},],
        },
      ],
    };

    PatternService.patterns().forEach(function(pattern) {
      var serializedTracks = [];
      var instrument = serializedInstruments[pattern.instrumentID];

      pattern.tracks.forEach(function(track) {
        var sequence = JSSynth.SequenceParser.parse(serializeTrackNotesIntoSequence(track));
        serializedTracks.push(new JSSynth.Track(instrument, sequence, track.muted));
      });

      var serializedPattern = new JSSynth.Pattern();
      serializedPattern.replaceTracks(serializedTracks);

      serializedPatterns[pattern.id] = serializedPattern;
    });

    // Empty pattern
    serializedPatterns[-1] = new JSSynth.Pattern();
    var emptyTracks = [];
    emptyPattern.tracks.forEach(function(track) {
      var sequence = JSSynth.SequenceParser.parse(serializeTrackNotesIntoSequence(track));
      emptyTracks.push(new JSSynth.Track(serializedInstruments[1], sequence, track.muted));
    });
    serializedPatterns[-1].replaceTracks(emptyTracks);

    return serializedPatterns;
  };

  var serializeTrackNotesIntoSequence = function(track) {
    var rawNotes = [];

    track.notes.forEach(function(note, index) {
      rawNotes[index] = note.name;
    });

    return rawNotes.join(' ');
  };

  var serializationService = {};

  serializationService.serialize = function() {
    var serializedInstruments = serializeInstruments();
    var serializedPatterns = serializePatterns(serializedInstruments);
    var serializedPatternSequence = [];

    var sequencerPatterns = SequencerService.patterns();
    var totalSteps = sequencerPatterns[0].patterns.length;

    for (var i = 0; i < totalSteps; i++) {
      serializedPatternSequence[i * 16] = [];
      
      sequencerPatterns.forEach(function(row) {
        if (!row.muted) {
          serializedPatternSequence[i * 16].push(serializedPatterns[row.patterns[i].patternID]);
        }
      });
    }

    return serializedPatternSequence;
  };

  return serializationService;
}]);


app.factory('TransportService', ['$rootScope', function($rootScope) {
  var playing = false;
  var amplitude = 0.25;
  var tempo = 100;
  var loop = true;

  var stopCallback = function() {
    playing = false;
  };

  var songPlayer = new JSSynth.SongPlayer([[new JSSynth.Pattern()]]);
  var transport = new JSSynth.Transport(songPlayer, stopCallback);

  if (!transport) {
    alert("Your browser doesn't appear to support WebAudio, and so won't be able to use the JS-120. Try a recent version of Chrome, Safari, or Firefox.");
    return;
  }

  var transportService = {};

  transportService.toggle = function() {
    transport.toggle();
    playing = !playing;
  };

  transportService.setTempo = function(newTempo) {
    tempo = newTempo;
    transport.setTempo(newTempo);
  };

  transportService.setAmplitude = function(newAmplitude) {
    amplitude = newAmplitude;
    transport.setAmplitude(newAmplitude);
  };

  transportService.setPatterns = function(newPatterns) {
    songPlayer.replacePatterns(newPatterns);
  };

  transportService.loop = function(newLoop) {
    loop = newLoop;
  };

  transportService.currentStep = function() {
    if (playing) {
      return transport.elapsedSteps();
    }
    else {
      return null;
    }
  };

  transportService.export = function(exportCompleteCallback) {
    var offlineTransport = new JSSynth.OfflineTransport(songPlayer, tempo, amplitude, exportCompleteCallback);
    offlineTransport.tick();
  };

  return transportService;
}]);
