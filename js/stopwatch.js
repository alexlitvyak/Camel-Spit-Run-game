/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Stopwatch..................................................................
//
// Like the real thing, you can start and stop a stopwatch, and you can
// find out the elapsed time the stopwatch has been running. After you stop
// a stopwatch, it's getElapsedTime() method returns the elapsed time
// between the start and stop.
//
// Stopwatches are used primarily for timing animations.

Stopwatch = function () {
    this.startTime = 0;
    this.running = false;
    this.elapsed = undefined;

    this.paused = false;
    this.startPause = 0;
    this.totalPausedTime = 0;
};

// You can get the elapsed time while the timer is running, or after it's
// stopped.

Stopwatch.prototype = {
    start: function () {
        this.startTime = +new Date();
        this.running = true;
        this.totalPausedTime = 0;
        this.startPause = 0;
    },

    stop: function () {
        if (this.paused) {
            this.unpause();
        }

        this.elapsed = (+new Date()) - this.startTime -
        this.totalPausedTime;
        this.running = false;
    },

    pause: function () {
        if (this.paused) {
            return;
        }

        this.startPause = +new Date();
        this.paused = true;
    },

    unpause: function () {
        if (!this.paused) {
            return;
        }

        this.totalPausedTime += (+new Date()) - this.startPause;
        this.startPause = 0;
        this.paused = false;
    },

    isPaused: function () {
        return this.paused;
    },

    getElapsedTime: function () {
        if (this.running) {
            return (+new Date()) - this.startTime - this.totalPausedTime;
        }
        else {
            return this.elapsed;
        }
    },

    isPaused: function () {
        return this.paused;
    },

    isRunning: function () {
        return this.running;
    },

    reset: function () {
        this.elapsed = 0;
        this.startTime = +new Date();
        this.running = false;
        this.totalPausedTime = 0;
        this.startPause = 0;
    }
};
