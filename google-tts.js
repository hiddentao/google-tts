/*! google-tts v1.0.0 | https://github.com/hiddentao/google-tts */
(function (name, definition){
  if ('function' === typeof define){ // AMD
    define(definition);
  } else if ('undefined' !== typeof module && module.exports) { // Node.js
    module.exports = definition();
  } else { // Browser
    var theModule = definition(), global = this, old = global[name];
    theModule.noConflict = function () {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})('GoogleTTS', function () {
  /**
   * The API instance.
   *
   * @param defaultLanguage Optional. The language to use when not specified. 'en' is default.
   * @constructor
   */
  var TTS = function(defaultLanguage) {
    var self = this;

    /**
     * Default language (code).
     * @type {String}
     */
    defaultLanguage = defaultLanguage || 'en';

    /**
     * Full list of languages.
     * @type {Object}
     */
    var languages = {
      'af' : 'Afrikaans',
      'sq' : 'Albanian',
      'ar' : 'Arabic',
      'hy' : 'Armenian',
      'ca' : 'Catalan',
      'zh-CN' : 'Mandarin (simplified)',
      'zh-TW' : 'Mandarin (traditional)',
      'hr' : 'Croatian',
      'cs' : 'Czech',
      'da' : 'Danish',
      'nl' : 'Dutch',
      'en' : 'English',
      'eo' : 'Esperanto',
      'fi' : 'Finnish',
      'fr' : 'French',
      'de' : 'German',
      'el' : 'Greek',
      'ht' : 'Haitian Creole',
      'hi' : 'Hindi',
      'hu' : 'Hungarian',
      'is' : 'Icelandic',
      'id' : 'Indonesian',
      'it' : 'Italian',
      'ja' : 'Japanese',
      'ko' : 'Korean',
      'la' : 'Latin',
      'lv' : 'Latvian',
      'mk' : 'Macedonian',
      'no' : 'Norwegian',
      'pl' : 'Polish',
      'pt' : 'Portuguese',
      'ro' : 'Romanian',
      'ru' : 'Russian',
      'sr' : 'Serbian',
      'sk' : 'Slovak',
      'es' : 'Spanish',
      'sw' : 'Swahili',
      'sv' : 'Swedish',
      'ta' : 'Tamil',
      'th' : 'Thai',
      'tr' : 'Turkish',
      'vi' : 'Vietnamese',
      'cy' : 'Welsh'
    };


    // audio players
    var players = [
        new TTS.HTML5Player,
        new TTS.SM2Player
    ];


    /**
     * Add in a playback mechanism.
     *
     * @param pm TTS.Player a concrete subclass instance.
     */
    self.addPlayer = function(pm) {
      players.push(pm);
    };



    /**
     * Get supported languages.
     * @return {Object} hashtable (language code -> description)
     */
    self.languages = function() {
      return languages;
    };


    /**
     * Get first available player.
     *
     * If the resulting playback mechanism is null then it means no playback mechanism is available for use.
     *
     * @param cb Function Result callback (Error err, TTS.Player pm)
     */
    self.getPlayer = function(cb) {
      if (self.availablePlayer) {
        return cb(null, self.availablePlayer);
      }

      var _testNextMechanism,
          index = -1;

      (_testNextMechanism = function() {
        // none available?
        if (players.length <= (++index)) {
          return cb();
        }

        players[index].available(function(canPlay) {
          if (canPlay) {
            self.availablePlayer = players[index];
            return cb(null, self.availablePlayer);
          } else {
            _testNextMechanism();
          }
        });
      })();
    };


    /**
     * Construct the URL to fetch the speech audio for given text and language.
     * @param txt the text.
     * @param lang the language of the text. If omitted then default language is used.
     */
    self.url = function(txt, lang) {
      lang = lang || defaultLanguage;

      if (!txt || 0 >= txt.length)
        throw new Error('Need some text');

      return 'http://translate.google.com/translate_tts?ie=utf-8&tl=' + lang + '&q=' + txt;
    };



    /**
     * Fetch and play the speech audio for given text and language.
     *
     * @param txt the text.
     * @param lang the language of the text. If omitted then default language is used.
     * @param cb Completion callback with signature (err).
     */
    self.play = function(txt, lang, cb) {
      self.getPlayer(function (err, player) {
        if (err) return cb(err);
        if (!player) return cb(new Error('No playback mechanism is avaialble'));

        player.play(self.url(txt, lang), cb);
      });
    };
  };


  // OOP inheritance
  var _inherits = function( childConstructor, parentClassOrObject ) {
    childConstructor.prototype = new parentClassOrObject;
    childConstructor.prototype.constructor = childConstructor;
    childConstructor.prototype.parent = parentClassOrObject.prototype;
  };


  /**
   * Represents a playback mechanism.
   * @constructor
   */
  TTS.Player = function() {
    var self = this;

    /**
     * Get whether this playback mechanism is available for use.
     * @param cb Function Result callback (Boolean available)
     */
    self.available = function(cb) { throw new Error('Not yet implemented'); };


    /**
     * Play given URL.
     * @param url String
     * @param cb Function Called after we start playing (Error err)
     */
    self.play = function(url, cb) { throw new Error('Not yet implemented'); };


    /**
     * Get name of this player.
     */
    self.toString = function() { throw new Error('Not yet implemented'); };
  };


  /**
   * Playback using HTML5 Audio.
   * @constructor
   */
  TTS.HTML5Player = function() {
    var self = this;

    self._available = null;

    self.available = function(cb) {
      if (null === self._available) {

        // check if HTML5 audio playback is possible
        (function(next) {
          try {
            if ('undefined' === typeof window.Audio)
              return next(null, false);

            var audio = new Audio();

            //Shortcut which doesn't work in Chrome (always returns ""); pass through
            // if "maybe" to do asynchronous check by loading MP3 data: URI
            if('probably' === audio.canPlayType('audio/mpeg'))
              return next(null, true);

            //If this event fires, then MP3s can be played
            audio.addEventListener('canplaythrough', function() {
              next(null, true);
            }, false);

            //If this is fired, then client can't play MP3s
            audio.addEventListener('error', function() {
              next(null, false);
            }, false);

            //Smallest base64-encoded MP3 I could come up with (less than 0.000001 seconds long)
            audio.src = "data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"

            audio.load();
          }
          catch(e){
            next(e);
          }
        })(function (err, canPlay) {
          if (err) console.log(err);

          self._available = canPlay;

          cb(self._available);
        });

        return;
      }

      cb(self._available);
    };

    self.play = function(url, cb) {
      // load the MP3
      try {
        var audio = new Audio();
        audio.src = url;
        audio.play();

        cb();
      } catch (e) {
        return cb(e);
      }
    };

    self.toString = function() { return 'HTML5 Audio'; }
  };
  _inherits(TTS.HTML5Player, TTS.Player);


  /**
   * Playback using SoundManager2 (https://github.com/scottschiller/SoundManager2).
   * @constructor
   */
  TTS.SM2Player = function() {
    var self = this;

    self._available = null;
    self._soundId = 0;
    self._unique_instance_id = parseInt(Math.random() * 1000);

    self.available = function(cb) {
      if (null === self._available) {
        if ('undefined' !== typeof window.soundManager && 'function' === typeof window.soundManager.ok) {
          self._available = window.soundManager.ok();
        }
      }

      cb(self._available);
    };

    self.play = function(url, cb) {
      try {
        (soundManager.createSound({
          id: 'googletts-' + self._unique_instance_id + '-' + (++self._soundId),
          url: url,
          onload: function() {
            console.log('Loaded: ' + url);
          }
        })).play();

        cb();
      } catch (err) {
        cb(err);
      }
    };

    self.toString = function() { return 'SoundManager2'; }
  };
  _inherits(TTS.SM2Player, TTS.Player);


  return TTS;
});
