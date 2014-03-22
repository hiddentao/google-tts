# Google TTS

[![Build Status](https://secure.travis-ci.org/hiddentao/google-tts.png?branch=master)](http://travis-ci.org/hiddentao/google-tts)

A Javascript API for the Google's text-to-Speech engine and is based on code at http://weston.ruter.net/projects/google-tts/.

**NOTE: Playbackwill only work when running the script locally as Google's server only
returns audio if you can prevent the browser from sending the Referrer HTTP Header to their server. So this library is
at the moment only really good for use in browser plugins and Phonegap apps.**

## Features

* Converts upto 42 languages
* Supports playback through [HTML5 Audio tag](https://developer.mozilla.org/En/HTML/Element/Audio) if available in browser.
* Asynchronous playback API
* Splits up large inputs (>100 chars) into multiple consecutive requests (just like Google Translates does).
* Small and compact: ~1.5 KB minified and gzipped

## Installation

Add the following inside your HTML `<body>` tag, near the bottom:

    <script type="text/javascript" src="https://rawgithub.com/hiddentao/google-tts/master/google-tts.min.js"></script>

You can also install using [bower](https://github.com/bower/bower):

    $ bower install google-tts

## API

### new GoogleTTS(language)

Initialize a new instance of the library, e.g:

    var tts = new GoogleTTS('zh-CN');

**Params:**

  * `language` - the default language to speak in when not otherwise specified. If omitted then English is assumed.


### .languages()

Get the full list of supported languages.

**Returns:** An object such as:

    {
        ...
        'en' : 'English',
        'zh-CN' : 'Mandarin (simplified)',
        ...
    }

### .url(text, language)

Construct the URL to fetch the speech audio for given text and language.

**Params:**

  * `text` - the text to convert to speech.
  * `language` - the language to speak it in. If omitted then the default language (see above) is assumed.

**Returns:** a URL to the audio file.

### .play(text, language, cb)

Fetch and play the speech audio for given text and language, if possible (see top).

**Params:**

  * `text` - the text to convert to speech.
  * `language` - the language to speak it in. If omitted then the default language (see above) is assumed.
  * `cb` - Completion callback function with signature `(err)`, where `err` holds information on any errors which may occur.


### .getPlayer(cb)

Get the active playback mechanism (see below).

**Params:**

  * `cb` - Completion callback function with signature `(err, player)`, where `err` holds information on any errors which may occur. `player` is an instance of `GoogleTTS.Player`.


### .addPlayer(player)

Add a playback mechanism (see below).

**Params:**

  * `player` - An instance of `GoogleTTS.Player`.


## Playback mechanisms

At the mmoent there are two supported playback mechanisms:

  * HTML5 audio tag
    * As of June 10th 2013 only Safari and Chrome support MP3 playback
  * [SoundManager2](http://www.schillmania.com/projects/soundmanager2/)
    * On Firefox we need this to do MP3 playback, using Flash.

When you first call `play()` the library calls `getPlayer()`, which then cycles through the available playback
mechanisms until a supported one is found. If no playback mechanism is supported in the current browser then an error
get thrown - *No playback mechanism is available*.

Each playback mechanism is implemented as a sub-class of `GoogleTTS.Player`. You can implement your own playback
mechanism by extending this class and then adding an instance of your custom mechanism via `addPlayer()`.


## Demo

For browsers which support HTML5 Audio MP3 playback (e.g. Firefox) you can launch `index.html` directly in the browser.

For browsers which need to use the SoundManager2 Flash player (e.g. Chrome) there is at the moment no way of getting it work without running a local dev server which serves up the files. This is necessary so that the flash player works, yet it means that the request to Google's servers will be rejected because of the HTTP referrer header. If you would still like to try then run the following:

1. Run `grunt dev` to start the simple HTTP server
2. Open `127.0.0.1:8888` in your browser


## Build and Test

If you make changes, before you raise a pull request build the project:

    $ npm install
    $ grunt

## License

MIT - see [LICENSE.md](https://github.com/hiddentao/google-tts/blob/master/LICENSE.md)
