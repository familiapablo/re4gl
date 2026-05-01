/* GamePush STUB — eponesh bypass
 * Framework bu dosyayi yuklediginde window.onGPInit(fakeGP) cagirir
 * GamePushUnityInner constructor bunlari bekliyor:
 *   gp.player.on('change/sync/load/login/logout/fetch/unlock...')
 *   gp.ads.showPreloader()
 *   gp.player.ready  (Promise)
 */
(function() {
  'use strict';

  function Emitter() { this._h = {}; }
  Emitter.prototype.on = function(ev, fn) {
    (this._h[ev] = this._h[ev] || []).push(fn); return this;
  };
  Emitter.prototype.off = function(ev, fn) {
    if (this._h[ev]) this._h[ev] = this._h[ev].filter(function(f){ return f !== fn; });
    return this;
  };
  Emitter.prototype.emit = function(ev) {
    var args = [].slice.call(arguments, 1);
    (this._h[ev] || []).forEach(function(f){ f.apply(null, args); });
    return this;
  };

  /* player */
  var player = new Emitter();
  player.ready = Promise.resolve(true);
  player.isLoggedIn         = false;
  player.hasAnyCredentials  = false;
  player.id                 = '0';
  player.name               = 'Guest';
  player.avatar             = '';
  player.isStub             = true;
  player.getActiveAvatars   = function(){ return []; };
  player.getField           = function(){ return ''; };
  player.setField           = function(){};
  player.getScore           = function(){ return 0; };
  player.addScore           = function(){};
  player.sync               = function(){ setTimeout(function(){ player.emit('sync', true); }, 10); };
  player.load               = function(){ setTimeout(function(){ player.emit('load', true); }, 10); };
  player.fetch              = function(){ return Promise.resolve(); };
  player.login              = function(){
    player.emit('login', false);
    return Promise.resolve(false);
  };
  player.logout             = function(){
    player.emit('logout', true);
    return Promise.resolve(true);
  };

  /* achievements */
  var achievements = new Emitter();
  achievements.unlock          = function(){ return Promise.resolve(); };
  achievements.has             = function(){ return false; };
  achievements.getProgress     = function(){ return 0; };
  achievements.fetch           = function(){ return Promise.resolve([]); };

  /* leaderboard */
  var leaderboard = new Emitter();
  leaderboard.open             = function(){};
  leaderboard.close            = function(){};
  leaderboard.fetchEntries     = function(){ return Promise.resolve([]); };
  leaderboard.fetchPlayerEntry = function(){ return Promise.resolve(null); };
  leaderboard.setScore         = function(){ return Promise.resolve(); };
  leaderboard.addScore         = function(){ return Promise.resolve(); };

  /* ads */
  var ads = new Emitter();
  ads.isAdblockEnabled    = false;
  ads.isStickyPlaying     = false;
  ads.isFullscreenPlaying = false;
  ads.isRewardedPlaying   = false;
  ads.showPreloader = function(opts) {
    opts = opts || {};
    if (opts.onStart)   opts.onStart();
    setTimeout(function(){
      if (opts.onClose)   opts.onClose();
      if (opts.onComplete)opts.onComplete();
      ads.emit('preloader:close');
      ads.emit('preloader:complete');
    }, 100);
  };
  ads.showFullscreen = function(opts) {
    opts = opts || {};
    if (opts.onStart)   opts.onStart();
    setTimeout(function(){
      if (opts.onClose)   opts.onClose();
      if (opts.onComplete)opts.onComplete();
      ads.emit('fullscreen:close');
    }, 100);
  };
  ads.showRewarded = function(opts) {
    opts = opts || {};
    if (opts.onStart)   opts.onStart();
    setTimeout(function(){
      if (opts.onReward)  opts.onReward();
      if (opts.onClose)   opts.onClose();
      if (opts.onComplete)opts.onComplete();
      ads.emit('rewarded:reward');
      ads.emit('rewarded:close');
    }, 300);
  };
  ads.showSticky  = function(){};
  ads.closeSticky = function(){};
  ads.refreshSticky = function(){};
  ads.minimum = { fullscreen: 0, rewarded: 0 };

  /* socials */
  var socials = new Emitter();
  socials.isSupported    = false;
  socials.isSubscribed   = false;
  socials.canSubscribe   = false;
  socials.subscribe      = function(){ return Promise.resolve(false); };
  socials.postToWall     = function(){ return Promise.resolve(false); };
  socials.inviteFriends  = function(){ return Promise.resolve(false); };

  /* payments */
  var payments = new Emitter();
  payments.isAvailable   = false;
  payments.purchase      = function(){ return Promise.reject('unavailable'); };
  payments.consume       = function(){ return Promise.reject('unavailable'); };
  payments.has           = function(){ return false; };

  /* documents */
  var documents = new Emitter();
  documents.open = function(){};

  /* gamesCollections */
  var gamesCollections = new Emitter();

  /* gameStart / gameStop */
  var fakeGP = {
    isReady:          true,
    isDev:            false,
    language:         'en',
    lang:             'en',
    country:          'us',
    tld:              'com',
    player:           player,
    ads:              ads,
    achievements:     achievements,
    leaderboard:      leaderboard,
    socials:          socials,
    payments:         payments,
    documents:        documents,
    gamesCollections: gamesCollections,
    on:               Emitter.prototype.on.bind(new Emitter()),
    off:              Emitter.prototype.off.bind(new Emitter()),
    emit:             Emitter.prototype.emit.bind(new Emitter()),
    gameStart:        function(){ fakeGP.emit('game:start'); },
    gameStop:         function(){ fakeGP.emit('game:stop'); },
    ready:            Promise.resolve(true)
  };

  window.gp = fakeGP;

  console.log('[GP Stub] Loaded. Calling onGPInit...');

  /* Framework'un beklediği callback'i cagir */
  if (typeof window.onGPInit === 'function') {
    try { window.onGPInit(fakeGP); } catch(e) { console.warn('[GP Stub] onGPInit error:', e); }
  } else {
    /* onGPInit henuz tanimlanmamissa bekle */
    var _check = setInterval(function() {
      if (typeof window.onGPInit === 'function') {
        clearInterval(_check);
        try { window.onGPInit(fakeGP); } catch(e) { console.warn('[GP Stub] onGPInit error:', e); }
      }
    }, 50);
    /* 5sn sonra timeout */
    setTimeout(function(){ clearInterval(_check); }, 5000);
  }

})();
