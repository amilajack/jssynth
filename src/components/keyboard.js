"use strict";

import React from 'react';

class Key extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  render() {
    let noteLabel = this.props.noteName + this.props.octave;
    let cssClass = this.props.noteName.toLowerCase();
    let isWhiteKey = ["A", "B", "C", "D", "E", "F", "G"].includes(this.props.noteName);
    let keyColorClass = (isWhiteKey) ? "keyboard-white-key" : "keyboard-black-key";
    let pressedClass = this.props.isActive ? "pressed" : "";

    let rootNoteIndicator;
    if (this.props.rootNote === noteLabel) {
      rootNoteIndicator = <span className="keyboard-key-root-indicator">Root</span>;
    }

    return <span className={"inline-block keyboard-key " + keyColorClass + " " + pressedClass + " " + cssClass} data-note={this.props.noteName + "-" + this.props.octave}>
      <span className="keyboard-key-label">{rootNoteIndicator}<br />{noteLabel}</span>
    </span>;
  };
};

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.scrollLeftTimeoutID = undefined;
    this.scrollRightTimeoutID = undefined;

    this.touchHandler = this.touchHandler.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.gestureStart = this.gestureStart.bind(this);
    this.scroll = this.scroll.bind(this);

    this.touches = {};
  };

  touchHandler(touches) {
    const SCROLL_AMOUNT = 10;
    let key;
    let isLeftScrollActive = false;
    let isRightScrollActive = false;
    let activeNotes = [];

    for (key in touches) {
      let elementUnderCursor = this.getElementUnderCursor(touches[key].x, touches[key].y);

      if (elementUnderCursor !== undefined) {
        if (elementUnderCursor.classList.contains("js-keyboard-scroll-left")) {
          isLeftScrollActive = true;
          if (this.scrollLeftTimeoutID === undefined) {
            this.scrollLeftTimeoutID = setInterval(() => this.scroll(-SCROLL_AMOUNT), 15);
          }
        }
        else if (elementUnderCursor.classList.contains("js-keyboard-scroll-right")) {
          isRightScrollActive = true;
          if (this.scrollRightTimeoutID === undefined) {
            this.scrollRightTimeoutID = setInterval(() => this.scroll(SCROLL_AMOUNT), 15);
          }
        }
        else {
          activeNotes.push(elementUnderCursor.dataset.note);
        }
      }
    }

    if (!isLeftScrollActive && this.scrollLeftTimeoutID !== undefined) {
      clearInterval(this.scrollLeftTimeoutID);
      this.scrollLeftTimeoutID = undefined;
    }
    if (!isRightScrollActive && this.scrollRightTimeoutID !== undefined) {
      clearInterval(this.scrollRightTimeoutID);
      this.scrollRightTimeoutID = undefined;
    }

    this.props.setNotes(activeNotes);
  };

  getElementUnderCursor(x, y) {
    let elementUnderCursor = document.elementFromPoint(x, y);

    if (elementUnderCursor === null) {
      elementUnderCursor = undefined;
    }
    else if (elementUnderCursor.classList.contains("keyboard-key-label")) {
      elementUnderCursor = elementUnderCursor.parentElement;
    }
    else if (elementUnderCursor.classList.contains("keyboard-key-root-indicator")) {
      elementUnderCursor = elementUnderCursor.parentElement.parentElement;
    }
    else if (!elementUnderCursor.classList.contains("keyboard-key") &&
             !elementUnderCursor.classList.contains("js-keyboard-scroll-left") &&
             !elementUnderCursor.classList.contains("js-keyboard-scroll-right")) {
      elementUnderCursor = undefined;
    }

    return elementUnderCursor;
  };

  mouseDown(e) {
    const RIGHT_MOUSE_BUTTON = 2;

    if (e.button === RIGHT_MOUSE_BUTTON) {
      return;
    }

    this.props.activate();
    this.touches[-1] = { x: e.clientX, y: e.clientY };
    this.touchHandler(this.touches);
  };

  mouseUp(e) {
    this.props.deactivate();
    delete this.touches[-1];
    this.touchHandler(this.touches);
  };

  mouseMove(e) {
    if (this.props.active) {
      this.touches[-1] = { x: e.clientX, y: e.clientY };
      this.touchHandler(this.touches);
    }
  };

  mouseOut(e) {
    if (this.props.active) {
      this.touches[-1] = { x: e.clientX, y: e.clientY };
      this.touchHandler(this.touches);
    }
  };

  mouseOver(e) {
    if (e.buttons !== undefined && e.buttons === 0) {
      this.props.deactivate();
    }
    // Safari, as of v11, doesn't support `buttons`, but it does support the non-standard `which`
    else if (e.nativeEvent.which !== undefined && e.nativeEvent.which === 0) {
      this.props.deactivate();
    }
  };

  touchStart(e) {
    let i;
    let touch;
    let newTouches = e.changedTouches;

    this.props.activate();

    for (i = 0; i < newTouches.length; i++) {
      touch = newTouches.item(i);
      this.touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
    }

    this.touchHandler(this.touches);
  };

  touchEnd(e) {
    let i;
    let removedTouches = e.changedTouches;

    for (i = 0; i < removedTouches.length; i++) {
      delete this.touches[removedTouches.item(i).identifier];
    }

    this.touchHandler(this.touches);
    if (Object.keys(this.touches).length === 0) {
      this.props.deactivate();
    }

    // Prevent page zoom from double tap
    e.preventDefault();
  };

  touchMove(e) {
    let i;
    let touch;
    let newTouches = e.changedTouches;

    for (i = 0; i < newTouches.length; i++) {
      touch = newTouches.item(i);
      this.touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
    }

    this.touchHandler(this.touches);

    // Prevent page from scrolling vertically or zooming in while dragging on keyboard
    e.preventDefault();
  };

  gestureStart(e) {
    e.preventDefault();
  };

  scroll(delta) {
    this.keyboardContainer.scrollLeft += delta;
  };

  componentDidMount() {
    this.keyboardContainer.scrollLeft = (this.keyboardContainer.scrollWidth / 2) - (this.keyboardContainer.clientWidth / 2);

    // This event handler is added manually to the actual DOM element, instead of using the
    // normal React way of attaching events because React seems to have a bug that prevents
    // preventDefault() from working correctly in a "touchmove" handler (as of v16.4.2).
    // The preventDefault() is needed to prevent the "pinch zoom into page" gesture from
    // activating when using the keyboard on iOS.
    // See https://medium.com/@ericclemmons/react-event-preventdefault-78c28c950e46 and
    // https://github.com/facebook/react/issues/9809.
    this.keyboardOuterContainer.addEventListener("touchmove", this.touchMove, false);

    // This prevents the "three finger page zoom" gesture on iOS while using the piano keyboard,
    // because it makes it very difficult to play chords without accidentally changing the page zoom.
    // React doesn't support the "gesturestart" event, so adding it manually.
    this.keyboardOuterContainer.addEventListener("gesturestart", this.gestureStart, false);
  };

  componentWillUnmount() {
    const removeEvent = keyboardOuterContainer.removeEventListener || keyboardOuterContainer.detachEvent;
    removeEvent.removeEvent("touchmove", this.touchMove);
    removeEvent.removeEvent("gesturestart", this.gestureStart);
  };

  render() {
    let rootNote = this.props.rootNoteName + this.props.rootNoteOctave;

    return <div ref={(el) => { this.keyboardOuterContainer = el; }} className="keyboard-outer-container flex" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseMove={this.mouseMove} onMouseOut={this.mouseOut} onMouseOver={this.mouseOver} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
      <div className={"keyboard-scroll-button js-keyboard-scroll-left flex flex-align-center flex-justify-center full-height" + (this.scrollLeftTimeoutID !== undefined ? " pressed" : "")}>&larr;</div>
      <div className="keyboard-container center" ref={(div) => { this.keyboardContainer = div; }}>
        <div className="keyboard block border-box">
          <Key isActive={this.props.activeNotes.includes("A-0")} noteName="A" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-0")} noteName="A#" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-0")} noteName="B" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-0")} noteName="C" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-0")} noteName="C#" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-0")} noteName="D" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-0")} noteName="D#" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-0")} noteName="E" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-0")} noteName="F" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-0")} noteName="F#" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-0")} noteName="G" octave="0" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-0")} noteName="G#" octave="0" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-1")} noteName="A" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-1")} noteName="A#" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-1")} noteName="B" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-1")} noteName="C" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-1")} noteName="C#" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-1")} noteName="D" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-1")} noteName="D#" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-1")} noteName="E" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-1")} noteName="F" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-1")} noteName="F#" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-1")} noteName="G" octave="1" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-1")} noteName="G#" octave="1" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-2")} noteName="A" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-2")} noteName="A#" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-2")} noteName="B" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-2")} noteName="C" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-2")} noteName="C#" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-2")} noteName="D" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-2")} noteName="D#" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-2")} noteName="E" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-2")} noteName="F" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-2")} noteName="F#" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-2")} noteName="G" octave="2" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-2")} noteName="G#" octave="2" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-3")} noteName="A" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-3")} noteName="A#" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-3")} noteName="B" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-3")} noteName="C" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-3")} noteName="C#" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-3")} noteName="D" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-3")} noteName="D#" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-3")} noteName="E" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-3")} noteName="F" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-3")} noteName="F#" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-3")} noteName="G" octave="3" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-3")} noteName="G#" octave="3" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-4")} noteName="A" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-4")} noteName="A#" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-4")} noteName="B" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-4")} noteName="C" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-4")} noteName="C#" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-4")} noteName="D" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-4")} noteName="D#" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-4")} noteName="E" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-4")} noteName="F" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-4")} noteName="F#" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-4")} noteName="G" octave="4" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-4")} noteName="G#" octave="4" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-5")} noteName="A" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-5")} noteName="A#" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-5")} noteName="B" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-5")} noteName="C" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-5")} noteName="C#" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-5")} noteName="D" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-5")} noteName="D#" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-5")} noteName="E" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-5")} noteName="F" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-5")} noteName="F#" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-5")} noteName="G" octave="5" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-5")} noteName="G#" octave="5" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-6")} noteName="A" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-6")} noteName="A#" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-6")} noteName="B" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-6")} noteName="C" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-6")} noteName="C#" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-6")} noteName="D" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-6")} noteName="D#" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-6")} noteName="E" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-6")} noteName="F" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-6")} noteName="F#" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-6")} noteName="G" octave="6" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-6")} noteName="G#" octave="6" rootNote={rootNote} />

          <Key isActive={this.props.activeNotes.includes("A-7")} noteName="A" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("A#-7")} noteName="A#" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("B-7")} noteName="B" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C-7")} noteName="C" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("C#-7")} noteName="C#" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D-7")} noteName="D" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("D#-7")} noteName="D#" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("E-7")} noteName="E" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F-7")} noteName="F" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("F#-7")} noteName="F#" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G-7")} noteName="G" octave="7" rootNote={rootNote} />
          <Key isActive={this.props.activeNotes.includes("G#-7")} noteName="G#" octave="7" rootNote={rootNote} />
        </div>
      </div>
      <div className={"keyboard-scroll-button js-keyboard-scroll-right flex flex-align-center flex-justify-center full-height" + (this.scrollRightTimeoutID !== undefined ? " pressed" : "")}>&rarr;</div>
    </div>;
  };
};

export { Keyboard };
