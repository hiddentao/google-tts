# Google TTS

A Javascript API for the Google's ext-to-Speech engine and is based on code at http://weston.ruter.net/projects/google-tts/.

**NOTE:** Playback (`.play()` below) will only work when running the script locally as Google's server only
returns audio if you can prevent the browser from sending the Referrer HTTP Header to their server. If you want to add
background playback to your online site perhaps [SoundManager](http://www.schillmania.com/projects/soundmanager2/)
will do the trick (I haven't tested this). On the other hand, I'm assumng this will still work in Phonegap apps.

## Features

* Converts upto 42 languages
* Supports playback through [HTML5 Audio tag](https://developer.mozilla.org/En/HTML/Element/Audio) if available in browser.
* Asynchronous playback API
* Small and compact: ~1 KB minified and gzipped

## Installation

Add the following inside your HTML `<body>` tag, near the bottom:

    <script type="text/javascript" src="https://raw.github.com/hiddentao/google-tts/master/google-tts.min.js"></script>

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

### .canPlay()

Get whether the Text-to-Speech audio can be played by the browser.

**Returns:** `true` if so, `false` otherwise.

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

## Demo

Checkout the code and double-click `index.html`.

## License

(The MIT License)

Copyright (c) 2012 Ramesh Nair &lt;www.hiddentao.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
