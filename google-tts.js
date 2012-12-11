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
  return function(defaultLanguage) {
    /**
     * Default language (code).
     * @type {String}
     */
    defaultLanguage = defaultLanguage || 'en';

    /**
     * Whether we can play MP3 audio or not. Gets set further down.
     * @type {Boolean}
     */
    var canPlayHTML5MP3Audio = undefined;

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


    /**
     * Check if we can play MP3 Audio using the HMTL5 Audio tag.
     */
    (function(cb) {
      try {
        var audio = new Audio();

        //Shortcut which doesn't work in Chrome (always returns ""); pass through
        // if "maybe" to do asynchronous check by loading MP3 data: URI
        if('probably' === audio.canPlayType('audio/mpeg'))
          cb(null, true);

        //If this event fires, then MP3s can be played
        audio.addEventListener('canplaythrough', function() {
          cb(null, true);
        }, false);

        //If this is fired, then client can't play MP3s
        audio.addEventListener('error', function() {
          cb(this.error, false)
        }, false);

        //Smallest base64-encoded MP3 I could come up with (less than 0.000001 seconds long)
        audio.src = "data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"

        audio.load();
      }
      catch(e){
        cb(e, false);
      }
    })(function (err, canPlay) {
      canPlayHTML5MP3Audio = canPlay;
    });

    /**
     * Get supported languages.
     * @return {Object} hashtable (language code -> description)
     */
    this.languages = function() {
      return languages;
    };

    /**
     * Get whether the Text-to-Speech audio can be played by the browser.
     * @return true if so, false if not.
     */
    this.canPlay = function(cb) {
      return canPlayHTML5MP3Audio;
    };

    /**
     * Construct the URL to fetch the speech audio for given text and language.
     * @param txt the text.
     * @param lang the language of the text. If omitted then default language is used.
     */
    this.url = function(txt, lang) {
      lang = lang || defaultLanguage;

      if (!txt || 0 >= txt.length)
        throw new Error('Need some text');

      return 'http://translate.google.com/translate_tts?ie=utf-8&tl=' + lang + '&q=' + txt;
    };

    /**
     * Fetch and play the speech audio for given text and language.
     * @param txt the text.
     * @param lang the language of the text. If omitted then default language is used.
     * @param cb Completion callback with signature (err).
     */
    this.play = function(txt, lang, cb) {
      var self = this;

      if (!canPlayHTML5MP3Audio)
        return cb(new Error('Sorry, your browser cannot play HTML5 MP3 Audio.'));

      // load the MP3
      try {
        var audio = new Audio();
        audio.src = self.url(txt, lang);
        audio.play();

        cb();
      } catch (e) {
        return cb(e);
      }
    };
  }
});
