"use strict";

import { Score } from "./score";

export function SongPlayer() {
  var score = Score([]);

  var stepIndex;
  var isFinishedPlaying;
  var currentTime;

  var reset = function(newCurrentTime) {
    stepIndex = 0;
    isFinishedPlaying = false;
    currentTime = newCurrentTime;
  };

  var replaceScore = function(newScore) {
    score = newScore;
  };

  var tick = function(audioSource, notePlayer, endTime, stepDuration, loop) {
    var scheduledSteps = [];
    var noteTimeDuration;
    var incomingNotes;

    while (currentTime < endTime) {
      incomingNotes = score.notesAtStepIndex(stepIndex);
      incomingNotes.forEach(function(note) {
        noteTimeDuration = stepDuration * note.note().stepCount();
        notePlayer.scheduleNote(note.channelID(),
                                audioSource.audioContext(),
                                audioSource.destination(note.channelID()),
                                note.note(),
                                note.amplitude(),
                                currentTime,
                                currentTime + noteTimeDuration);
      });

      scheduledSteps.push({ step: stepIndex, time: currentTime });

      stepIndex += 1;
      if (stepIndex >= score.stepCount()) {
        if (loop) {
          stepIndex = 0;
        }
        else {
          isFinishedPlaying = true;
          return;
        }
      }

      currentTime += stepDuration;
    }

    return scheduledSteps;
  };

  var playbackTime = function(notePlayer, stepDuration) {
    var notesAtStepIndex;
    var note, noteEndTime;
    var i, j;

    var noteStartTime = 0.0;
    var maxNoteEndTime = 0.0;

    for (i = 0; i < score.stepCount(); i++) {
      notesAtStepIndex = score.notesAtStepIndex(i);

      for(j = 0; j < notesAtStepIndex.length; j++) {
        note = notesAtStepIndex[j];
        noteEndTime = noteStartTime + notePlayer.noteDuration(note.channelID(), note.note().stepCount(), stepDuration);
        if (noteEndTime > maxNoteEndTime) {
          maxNoteEndTime = noteEndTime;
        }
      }

      noteStartTime += stepDuration;
    }

    return maxNoteEndTime;
  };


  reset();


  return {
    reset: reset,
    stepCount: function() { return score.stepCount(); },
    isFinishedPlaying: function() { return isFinishedPlaying; },
    replaceScore: replaceScore,
    tick: tick,
    playbackTime: playbackTime,
  };
};