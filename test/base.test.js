/**
 * Test utilities
 */
'use strict';


var util = require('util');


var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var chai = require("chai");
chai.use(sinonChai);
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();


var GoogleTTS = require('../src/google-tts');


var mocker = null;

var test = {
  beforeEach: function() {
    mocker = sinon.sandbox.create();

    this.inst = new GoogleTTS();
  },
  afterEach: function() {
    mocker.restore();
  }
};


test['constructor'] = {
  'no language': function() {
    var inst = new GoogleTTS();

    expect(inst.defaultLanguage).to.eql('en');
  },
  'language set': function() {
    var inst = new GoogleTTS('fr');

    expect(inst.defaultLanguage).to.eql('fr');
  }
};



test['default players'] = function() {
  var self = this;

  expect(self.inst._players[0]).to.be.instanceOf(GoogleTTS.HTML5Player);
  expect(self.inst._players[1]).to.be.instanceOf(GoogleTTS.SM2Player);
};



test['languages'] = function() {
  expect(this.inst.languages()).to.eql({
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
  });
};






test['construct URLs'] = {
  'empty text': function() {
    var self = this;

    expect(function() {
      self.inst.urls('')
    }).throws('Need some text');
  },
  'default language': function() {
    var self = this;

    self.inst.defaultLanguage = 'fr';
    var urls = self.inst.urls('test');

    expect(urls).to.eql([
      'http://translate.google.com/translate_tts?ie=UTF-8&tl=fr&q=test&textlen=4&idx=0&total=1'
    ]);
  },
  'non-default language': function() {
    var self = this;

    self.inst.defaultLanguage = 'fr';
    var urls = self.inst.urls('test', 'en');

    expect(urls).to.eql([
      'http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=test&textlen=4&idx=0&total=1'
    ]);
  },
  'slices at 100 characters': function() {
    var self = this;

    var spy = mocker.stub(self.inst, '_sliceInput', function() {
      return ['abc', 'def'];
    });

    var urls = self.inst.urls('test', 'en');

    expect(urls).to.eql([
      'http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=abc&textlen=3&idx=0&total=2',
      'http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=def&textlen=3&idx=1&total=2'
    ]);

    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWithExactly('test', 100);
  }
};



test['slice input'] = {
  'empty': function() {
    var self = this;

    var slices = self.inst._sliceInput('', 10);

    expect(slices).to.eql(['']);
  },
  'not more than max slice size': function() {
    var self = this;

    var slices = self.inst._sliceInput('1234567890', 10);

    expect(slices).to.eql(['1234567890']);
  },
  'more than max slice size': function() {
    var self = this;

    var slices = self.inst._sliceInput('12345678901234567890', 10);
    expect(slices).to.eql(['1234567890', '1234567890']);

    slices = self.inst._sliceInput('1234567890123456789012345678', 10);
    expect(slices).to.eql(['1234567890', '1234567890', '12345678']);
  }
};


/**
 * Dummy playback mechanism.
 * @param name {String} name of player.
 * @param available {Boolean} whether this player is available or not.
 * @constructor
 */
var DummyPlayer = function(name, available) {
  var self = this;

  self.available = function(cb) {
    cb(available);
  };

  self.play = function(url, cb) {
    cb();
  };

  self.toString = function() {
    return name;
  };
};
util.inherits(DummyPlayer, GoogleTTS.Player);



test['add player'] = {
  'invalid instance' : function() {
    var self = this;

    expect(function() {
      self.inst.addPlayer('test');
    }).throws('Must be a instance of base Player class');
  },
  'valid instance': function() {
    var self = this;

    var player = new DummyPlayer();

    self.inst.addPlayer(player);

    expect(self.inst._players[self.inst._players.length-1]).to.eql(player);
  }
};



test['get player'] = {
  'checks cache first': function(done) {
    var self = this;

    self.inst.availablePlayer = 'test';

    self.inst.getPlayer(function (err, player) {
      if (err) return done(err);

      expect(player).to.eql('test');

      done();
    });
  },
  'if no players available': {
    beforeEach: function() {
      var self = this;

      self.inst._players = [
        new DummyPlayer('p', false)
      ]
    },
    'returns empty': function(done) {
      var self = this;

      self.inst.getPlayer(function (err, player) {
        expect(player).to.be.undefined;

        done(err);
      });
    },
    'does not change cached value': function(done) {
      var self = this;

      self.inst.availablePlayer = 'test';

      self.inst.getPlayer(function (err) {
        expect(self.inst.availablePlayer).to.eql('test');

        done(err);
      });
    }
  },
  'if players available': {
    beforeEach: function() {
      var self = this;

      self.inst._players = [
        new DummyPlayer('p1', false),
        new DummyPlayer('p2', true),
        new DummyPlayer('p3', true)
      ]
    },
    'returns first available': function(done) {
      var self = this;

      self.inst.getPlayer(function (err, player) {
        expect(player).to.eql(self.inst._players[1]);

        done(err);
      });
    },
    'sets cache': function(done) {
      var self = this;

      self.inst.availablePlayer = undefined;
      self.inst.getPlayer(function (err, player) {
        expect(self.inst.availablePlayer).to.eql(player);

        done(err);
      });
    }
  }
};



test['play audio'] = {
  'error getting player': function(done) {
    var self = this;

    mocker.stub(self.inst, 'getPlayer', function(cb) {
      cb(new Error('blah'));
    });

    self.inst.play('test', 'en', function(err) {
      expect(err.message).to.eql('blah');

      done();
    });
  },
  'no player available': function(done) {
    var self = this;

    mocker.stub(self.inst, 'getPlayer', function(cb) {
      cb();
    });

    self.inst.play('test', 'en', function(err) {
      expect(err.message).to.eql('No playback mechanism is available');

      done();
    });
  },
  'gets URLs and plays them one-by-one': function(done) {
    var self = this;

    var player = {
      play: mocker.spy(function(url, cb) {
        cb();
      })
    };

    mocker.stub(self.inst, 'getPlayer', function(cb) {
      cb(null, player);
    });

    mocker.stub(self.inst, 'urls', function() {
      return [
        'url1',
        'url2'
      ];
    });

    self.inst.play('test', 'en', function(err) {
      if (err) return done(err);

      player.play.should.have.been.calledTwice;
      expect(player.play.getCall(0).args[0]).to.eql('url1');
      expect(player.play.getCall(1).args[0]).to.eql('url2');

      done();
    });

  }
};




module.exports['Unit tests'] = test;


