/**
 * GamePush STUB
 * eponesh CDN bloklu oldugunda kullanilir (okul filtreleri vs.)
 * GamePushUnityInner.trigger() cagrilarini yakalar, Unity'ye bos mesajlar gonderir
 */
(function(window, urls, projectId, publicToken) {
  'use strict';
  console.log('[GP Stub] GamePush stub loaded. Project:', projectId);

  /* Minimal EventEmitter */
  function Emitter() { this._events = {}; }
  Emitter.prototype.on = function(ev, fn) {
    (this._events[ev] = this._events[ev] || []).push(fn); return this;
  };
  Emitter.prototype.emit = function(ev) {
    var args = Array.prototype.slice.call(arguments, 1);
    var fns  = this._events[ev] || [];
    for (var i = 0; i < fns.length; i++) fns[i].apply(this, args);
    return this;
  };

  /* Fake player */
  var player = new Emitter();
  player.isLoggedIn     = false;
  player.hasAnyCredentials = false;
  player.id             = '0';
  player.name           = 'Guest';
  player.avatar         = '';
  player.getField       = function() { return ''; };
  player.setField       = function() {};
  player.getScore       = function() { return 0; };
  player.get            = function(k) { try { return JSON.parse(localStorage.getItem('gp_'+k)||'null'); } catch(e){ return null; } };
  player.set            = function(k,v){ try { localStorage.setItem('gp_'+k, JSON.stringify(v)); } catch(e){} };
  player.sync           = function(){ setTimeout(function(){ player.emit('sync', true); }, 50); };
  player.load           = function(){ setTimeout(function(){ player.emit('load',  true); }, 50); };
  player.login          = function(){ setTimeout(function(){ player.emit('login', false); }, 50); };
  player.logout         = function(){ setTimeout(function(){ player.emit('logout', true); }, 50); };

  /* Fake ads */
  var adv = new Emitter();
  adv.showFullscreen = function(o) {
    o = o || {};
    if (o.onStart)   o.onStart();
    if (o.onClose)   setTimeout(function(){ o.onClose(false); }, 100);
    if (o.onComplete)setTimeout(function(){ o.onComplete();   }, 100);
  };
  adv.showRewarded = function(o) {
    o = o || {};
    if (o.onStart)   o.onStart();
    /* Ödülü ver - okullarda gerçek reklam yok, stub her zaman ödül verir */
    if (o.onReward)  setTimeout(function(){ o.onReward();   }, 300);
    if (o.onClose)   setTimeout(function(){ o.onClose();    }, 400);
    if (o.onComplete)setTimeout(function(){ o.onComplete(); }, 400);
  };
  adv.minimum = { fullscreen: 0, rewarded: 0 };
  adv.isAdblockEnabled = false;

  /* Diğer modüller */
  var leaderboard = new Emitter();
  leaderboard.open         = function(){};
  leaderboard.fetchEntries = function(){ return Promise.resolve([]); };
  leaderboard.setScore     = function(){ return Promise.resolve(); };

  var achievements = new Emitter();
  achievements.unlock = function(){ return Promise.resolve(); };

  var socials = new Emitter();

  var payments = new Emitter();
  payments.purchase = function(){ return Promise.reject('unavailable'); };

  /* GamePush global nesnesi */
  var gp = {
    player:       player,
    adv:          adv,
    leaderboard:  leaderboard,
    achievements: achievements,
    socials:      socials,
    payments:     payments,
    isReady:      false,
    language:     'en',
    lang:         'en',
    on:           Emitter.prototype.on.bind(new Emitter()),
    emit:         Emitter.prototype.emit.bind(new Emitter()),
    init: function() { return Promise.resolve(gp); }
  };

  window.gp = gp;

  /* GamePushUnityInner bekliyorsa */
  setTimeout(function() {
    gp.isReady = true;
    try {
      if (window.unityInstance || window.myGameInstance) {
        var inst = window.unityInstance || window.myGameInstance;
        /* SDK hazir sinyali gonder */
        inst.SendMessage('GamePushSDK', 'CallOnSDKReady');
      }
    } catch(e) {}
    console.log('[GP Stub] Ready');
  }, 500);

})(window, [], '__STUB__', '__STUB__');
