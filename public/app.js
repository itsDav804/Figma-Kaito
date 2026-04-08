/**
 * Kaito Whale - Web App
 * Braille → Getaran, WebSocket chat
 */
(function () {
  'use strict';
  // --- Ensure Braille input UI is initialized for all users ---
  document.addEventListener('DOMContentLoaded', function () {
    // --- Morse Input Logic ---
    // Morse code map (A-Z, 0-9)
    const MORSE_MAP = {
      'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
      'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
      'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
      'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
      'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
      'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
    // Reverse map: Morse string → char
    const REVERSE_MORSE_MAP = {};
    Object.keys(MORSE_MAP).forEach(function (ch) {
      REVERSE_MORSE_MAP[MORSE_MAP[ch]] = ch;
    });

    // Temporary Morse storage
    window.tempMorse = '';
    function addMorse(char) { window.tempMorse += char === '•' ? '.' : '-'; }
    function deleteMorse() { window.tempMorse = window.tempMorse.slice(0, -1); }

    var morseInput = '';
    var messageInput = document.getElementById('messageInput');
    var charCount = document.getElementById('charCount');
    
    function syncMorseUI() {
      const morseInputPreview = document.getElementById('morseInputPreview');
      const morseResultPreview = document.getElementById('morseResultPreview');
    if (morseInputPreview) morseInputPreview.textContent = morseInput || ' ';
      if (morseResultPreview) {
        const translatedChar = REVERSE_MORSE_MAP[morseInput] || '';
        morseResultPreview.textContent = translatedChar;
      }
    }

    // document.getElementById('morseDotBtn').addEventListener('click', function () {
    //   morseInput += '.';
    //   addMorse('•');
    //   syncMorseUI();
    // });

    // document.getElementById('morseDashBtn').addEventListener('click', function () {
    //   morseInput += '-';
    //   addMorse('—');
    //   syncMorseUI();
    // });

    // document.getElementById('morseDeleteBtn').addEventListener('click', function () {
    //   morseInput = morseInput.slice(0, -1);
    //   deleteMorse();
    //   syncMorseUI();
    // });
    
    // document.getElementById('morseAddCharBtn').addEventListener('click', function () {
    //   const ch = REVERSE_MORSE_MAP[morseInput];
    //   if (ch !== undefined) {
    //     messageInput.value += ch;
    //     if (charCount) charCount.textContent = messageInput.value.length;
    //     document.getElementById('sendBtn').disabled = !messageInput.value.trim();
    //     if (typeof updateSendPreview === 'function') updateSendPreview();
    //   } else if (messageInput.value.length <= 0 && window.tempMorse && ch === undefined) {
    //     // Check for tactile dictionary conversion in Morse mode
    //     var word = MORSE_TO_WORD[window.tempMorse];
    //     if (word) {
    //       messageInput.value = word;
    //       window.tempMorse = '';
    //     }
    //   }
    //   morseInput = '';
    //   syncMorseUI();
    //   updatePatternPreviewUI();
    // });

    let morseSequence = '';
    let inputStartTime = null;

    let charTimer = null;   // 2s → convert
    let sendTimer = null;   // 5s → send

    const DOT = 300;
    const DASH = 500;

    // const messageInput = document.getElementById('messageInput');
    const morseInputBtn = document.getElementById('morseInput');
    const sendBtn = document.getElementById('sendBtn');

    function resetCharTimer() {
      if (charTimer) clearTimeout(charTimer);

      charTimer = setTimeout(() => {
        if (!morseSequence.trim()) return;

        const letter = REVERSE_MORSE_MAP[morseSequence.trim()] || '?';
        messageInput.value += letter;

        console.log('Converted:', morseSequence, '→', letter);

        morseSequence = '';
      }, 2000);
    }

    function resetSendTimer() {
      if (sendTimer) clearTimeout(sendTimer);

      sendTimer = setTimeout(() => {
        if (messageInput.value.trim()) {
          console.log('Sending message:', messageInput.value);

          sendBtn.disabled = false; // ✅ enable first
          sendBtn.click();
        }
      }, 5000);
    }

    if (morseInputBtn) {
      morseInputBtn.addEventListener('mousedown', () => {
        inputStartTime = Date.now();
      });

      morseInputBtn.addEventListener('mouseup', () => {
        if (!inputStartTime) return;

        const duration = Date.now() - inputStartTime;

        if (duration < DOT) {
          morseSequence += '.';
        } else if (duration < DASH) {
          morseSequence += '-';
        } else {
          // ␣ SPACE detected → instant apply
          messageInput.value += ' ';
          morseSequence = '';
          console.log('Space added');
        }

        inputStartTime = null;

        console.log('Current Morse:', morseSequence);

        resetCharTimer(); // 2s letter convert
        resetSendTimer(); // 5s send message
      });
    }

    // Synchronize: when textarea changes, clear Morse input
    messageInput.addEventListener('input', function () {
      morseInput = '';
      syncMorseUI();
    });

    // document.getElementById('morseSpaceBtn').addEventListener('click', function () {
    //   messageInput.value = messageInput.value + ' ';
    //   if (charCount) charCount.textContent = messageInput.value.length;
    //   document.getElementById('sendBtn').disabled = !isConnected() || !messageInput.value.trim();
    //   updateSendPreview();
    //   updatePatternPreviewUI();
    // });

    // document.getElementById('morseBackspaceBtn').addEventListener('click', function () {
    //   if (messageInput.value.length > 0) {
    //     messageInput.value = messageInput.value.slice(0, -1);
    //     syncMorseUI();
    //     updatePatternPreviewUI();
    //   }
      
    // });

    // document.getElementById('morseClearBtn').addEventListener('click', function () {
    //   messageInput.value = '';
    //   syncMorseUI();
    //   updatePatternPreviewUI();
    // });

    syncMorseUI();
  });

  // --- Morse encoder ---
  // Morse code map (A-Z, 0-9)
  const MORSE_MAP = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };
  // Reverse map: Morse string → char
  const REVERSE_MORSE_MAP = {};
  Object.keys(MORSE_MAP).forEach(function (ch) {
    REVERSE_MORSE_MAP[MORSE_MAP[ch]] = ch;
  });
  const DURATIONS = {
    SHORT: 200,
    LONG: 500,
    DOT_PAUSE: 100,
    CHAR_PAUSE: 300,
    WORD_PAUSE: 500
  };
  const TACTILE_DICTIONARY = {
    "YA": ".",
    "TIDAK": "-",
    "MUNGKIN": "••—•",
    "TIDAK TAHU": "———•",
    "MENGERTI": "•—••",
    "TIDAK MENGERTI": "—•••",
    "MAKAN": "••",
    "MINUM": "——",
    "MANDI": "•—",
    "TIDUR": "—•",
    "TOILET": "•••—",
    "OBAT": "——•—",
    "DUDUK": "•——",
    "BERDIRI": "—••",
    "LAPAR": "•••",
    "HAUS": "———",
    "SAKIT": "•—•",
    "CAPEK": "—•—",
    "DINGIN": "••—",
    "PANAS": "——•",
    "PUSING": "•——•",
    "SESAK": "—•••",
    "SENANG": "•—••",
    "SEDIH": "—••—",
    "TAKUT": "••—•",
    "MARAH": "——••",
    "TENANG": "•——",
    "GELISAH": "—••",
    "TOLONG": "••••",
    "DARURAT": "————",
    "PULANG": "•——•",
    "BUTUH BANTUAN": "—••—",
    "ULANGI": "••——",
    "SELESAI": "——••",
    "DATANG": "•—••",
    "PERGI": "—•——",
    "DENGARKAN": "•—•—",
    "TUNGGU": "—•••",
    "CEPAT": "••—•",
    "PELAN": "———•",
    "LAGI": "•——•",
    "SEKARANG": "•••—",
    "NANTI": "—••—",
    "PAGI": "•——•",
    "MALAM": "—•—•"
  };
  // Reverse map for Morse to word (normalized)
  const MORSE_TO_WORD = {};
  for (let word in TACTILE_DICTIONARY) {
    let morse = TACTILE_DICTIONARY[word].replace(/•/g, '.').replace(/—/g, '-');
    MORSE_TO_WORD[morse] = word;
  }

  // --- Helper: Update Morse Preview UI ---
  function updatePatternPreviewUI() {
    var text = messageInput.value;
    var previewSection = document.getElementById('previewSection');
    var patternPreviewEl = document.getElementById('patternPreview');
    var sendBtn = document.getElementById('sendBtn');
    var longWarn = document.getElementById('longMessageWarning');

    if (charCount) {
      charCount.textContent = text.length;
      charCount.className = text.length > 900 ? 'text-xs text-amber-600 mt-1 text-right' : 'text-xs text-stone-400 mt-1 text-right';
    }

    if (longWarn) {
      longWarn.classList.toggle('hidden', text.length < 200);
    }

    if (previewSection && patternPreviewEl) {
      if (text.length > 0) {
        previewSection.classList.remove('hidden');
        patternPreviewEl.textContent = getPatternPreview(text);
      } else {
        previewSection.classList.add('hidden');
      }
    }

    if (sendBtn) sendBtn.disabled = !isConnected() || !text.trim();
  }

  function textToVibrationPattern(text) {
    const patterns = [];
    const t = text.toUpperCase();
    for (let i = 0; i < t.length; i++) {
      const char = t[i];
      if (char === ' ') {
        patterns.push({ type: 'pause', duration: DURATIONS.WORD_PAUSE });
        continue;
      }
      const morse = MORSE_MAP[char];
      if (!morse) continue;
      for (let j = 0; j < morse.length; j++) {
      if (morse[j] === '.') patterns.push({ type: 'vibrate', duration: DURATIONS.SHORT });
      else if (morse[j] === '-') patterns.push({ type: 'vibrate', duration: DURATIONS.LONG });
      if (j < morse.length - 1) patterns.push({ type: 'pause', duration: DURATIONS.DOT_PAUSE });
      }
    if (i < t.length - 1 && t[i + 1] !== ' ') patterns.push({ type: 'pause', duration: DURATIONS.CHAR_PAUSE });
    }
    return patterns;
  }

  function getPatternPreview(text) {
    let preview = '';
    const t = text.toUpperCase();
    for (const char of t) {
      if (char === ' ') {
        preview += '[SPACE] ';
        continue;
      }
      if (char === '\n') {
        preview += '[ENTER] ';
        continue;
      }
      const morse = MORSE_MAP[char];
      if (!morse) {
        preview += '[?] ';
        continue;
      }
      preview += char + ':' + morse + ' ';
    }
    return preview.trim();
  }
  
  function textToVibrationPatternGrade2(text) {
    var FEAT = window.KaitoWhaleFeatures;
    if (!FEAT || !FEAT.GRADE2_WORDS) return textToVibrationPattern(text);
    var patterns = [];
    var words = text.toLowerCase().split(/\s+/);
    for (var i = 0; i < words.length; i++) {
      var word = words[i].replace(/[^a-z0-9]/g, '');
      if (FEAT.GRADE2_WORDS[word]) {
        var dots = FEAT.GRADE2_WORDS[word];
        for (var j = 0; j < dots.length; j++) {
          patterns.push({ type: dots[j] === 1 ? 'vibrate' : 'pause', duration: dots[j] === 1 ? DURATIONS.LONG : DURATIONS.SHORT });
          if (j < dots.length - 1) patterns.push({ type: 'pause', duration: DURATIONS.DOT_PAUSE });
        }
      } else {
        var letterPatterns = textToVibrationPattern(words[i]);
        patterns = patterns.concat(letterPatterns);
      }
      if (i < words.length - 1) patterns.push({ type: 'pause', duration: DURATIONS.WORD_PAUSE });
    }
    return patterns;
  }
  // --- Audio (Web Audio API) ---
  let audioContext = null;
  let audioSettings = { enabled: true, volume: 0.3, dotFrequency: 800, dashFrequency: 600 };

  function initAudioContext() {
    if (!audioContext && typeof AudioContext !== 'undefined') {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Resume audio context if suspended (required by some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
    return audioContext;
  }

  function isAudioSupported() {
    return typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
  }

  function playTone(frequency, duration, volume = audioSettings.volume) {
    if (!audioSettings.enabled || !isAudioSupported()) return Promise.resolve();

    const ctx = initAudioContext();
    if (!ctx) return Promise.resolve();

    return new Promise((resolve) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration / 1000 - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);

      oscillator.onended = () => resolve();
    });
  }

  function playAudioPattern(patterns, onProgress, speedOverride) {
    if (!audioSettings.enabled || !isAudioSupported()) {
      if (onProgress) onProgress({ current: 0, total: patterns.length });
      return Promise.resolve();
    }

    const speedMultiplier = speedOverride !== undefined ? speedOverride : (settings.vibrationSpeed || 1.0);

    return patterns.reduce((promise, pattern, index) => {
      return promise.then(() => {
        if (pattern.type === 'vibrate') {
          const frequency = pattern.duration >= DURATIONS.LONG ? audioSettings.dashFrequency : audioSettings.dotFrequency;
          return playTone(frequency, pattern.duration * speedMultiplier, audioSettings.volume);
        } else if (pattern.type === 'pause') {
          return new Promise(resolve => setTimeout(resolve, pattern.duration * speedMultiplier));
        }
        return Promise.resolve();
      }).then(() => {
        if (onProgress) {
          onProgress({
            current: index + 1,
            total: patterns.length,
            pattern: pattern
          });
        }
      });
    }, Promise.resolve());
  }
// --- Vibration (Web API) ---
  function isVibrationSupported() {
    return typeof navigator !== 'undefined' && navigator.vibrate;
  }
  // Vibration queue untuk handle multiple vibrations
  let vibrationQueue = [];
  let isPlayingVibration = false;
  let settings = { vibrationIntensity: 1.0, vibrationSpeed: 1.0, autoPlay: true };

  function playVibrationPattern(patterns, onProgress, speedOverride) {
    if (!isVibrationSupported() && !isAudioSupported()) {
      if (onProgress) onProgress({ current: 0, total: patterns.length });
      return Promise.resolve();
    }
    // speedOverride > 1 = lebih pelan (untuk belajar), < 1 = lebih cepat
    const speedMultiplier = speedOverride !== undefined ? speedOverride : (settings.vibrationSpeed || 1.0);
    const arr = patterns.map(p => Math.round(p.duration * speedMultiplier));
    
    // Queue jika sedang play
    if (isPlayingVibration) {
      return new Promise(function(resolve) {
        vibrationQueue.push({ patterns: arr, onProgress, resolve });
      });
    }
    
    isPlayingVibration = true;
    
    // Play vibration if supported
    if (isVibrationSupported()) {
      navigator.vibrate(arr);
    }
    
    // Play audio if enabled
    const audioPromise = playAudioPattern(patterns, null, speedOverride);
    
    if (onProgress) onProgress({ current: patterns.length, total: patterns.length });
    const totalMs = arr.reduce((a, b) => a + b, 0);
    
    return Promise.all([
      audioPromise,
      new Promise(function (resolve) {
        setTimeout(() => {
          isPlayingVibration = false;
          resolve();
          // Play next in queue
          if (vibrationQueue.length > 0) {
            const next = vibrationQueue.shift();
            playVibrationPattern(next.patterns.map(d => ({ duration: d })), next.onProgress).then(next.resolve);
          }
        }, totalMs);
      })
    ]).then(() => undefined);
  }

  // Putar pola mentah (array ms) — untuk darurat, role, mood
  function playRawPattern(arr) {
    if ((!isVibrationSupported() && !isAudioSupported()) || !arr.length) return Promise.resolve();
    
    // Play vibration if supported
    if (isVibrationSupported()) {
      navigator.vibrate(arr);
    }
    
    // Play audio if enabled - convert raw array to pattern format
    const audioPromise = audioSettings.enabled && isAudioSupported() ? 
      playTone(audioSettings.dashFrequency, arr.reduce((a, b) => a + b, 0), audioSettings.volume) : 
      Promise.resolve();
    
    return Promise.all([
      audioPromise,
      new Promise(function(resolve) {
        setTimeout(resolve, arr.reduce(function(a, b) { return a + b; }, 0));
      })
    ]).then(() => undefined);
  }
  // --- WebSocket ---
  function getDefaultWsUrl() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return proto + '//' + location.host;
  }

  let ws = null;
  let clientId = null;
  let userName = '';
  let lastReceivedMessageId = null;
  let lastReceivedMessageData = null;
  let messageIdToElement = {};

  function setStatus(status, text) {
    const dot = document.getElementById('statusDot');
    const label = document.getElementById('statusText');
    var dotCls = 'w-2.5 h-2.5 rounded-full shrink-0 ';
    if (status === 'connected') dotCls += 'bg-emerald-500';
    else if (status === 'connecting') dotCls += 'bg-amber-500 animate-pulse';
    else if (status === 'error') dotCls += 'bg-red-500';
    else dotCls += 'bg-stone-300';
    dot.className = dotCls;
    label.textContent = text;
  }

  function connect() {
    console.log('🔌 Attempting to connect...');
  
    const urlInput = document.getElementById('serverUrl');
    const nameInput = document.getElementById('userName');
    const connectBtn = document.getElementById('connectBtn');
    
    let wsUrl = (urlInput?.value || '').trim() || getDefaultWsUrl();
    if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
      wsUrl = 'ws://' + wsUrl;
    }
    
    userName = (nameInput?.value || '').trim();
    
    // Close existing connection
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    
    setStatus('connecting', '⏳ Menghubungkan...');
    if (connectBtn) connectBtn.disabled = true;
    
    try {
      ws = new WebSocket(wsUrl);
      console.log('📡 WebSocket created:', wsUrl);
    } catch (e) {
      console.error('❌ WebSocket creation failed:', e);
      setStatus('error', '✗ Error');
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.textContent = '🔗 Hubungkan';
      }
      return;
    }

    ws.onmessage = function(event) {
      try {
        const msg = JSON.parse(event.data);
        console.log('📩 Received:', msg);

        if (msg.type === 'broadcast' || msg.type === 'message') {
          addMessage(msg.data, false);

          // Optional: vibration/audio playback
          playMessageVibration(msg.data);

          // Track last message
          lastReceivedMessageId = msg.data.messageId;
          lastReceivedMessageData = msg.data;

          // Show read receipt UI
          const row = document.getElementById('readReceiptRow');
          if (row) row.classList.remove('hidden');
        }

        if (msg.type === 'typing') {
          showTypingIndicator(msg.data);
        }

      } catch (e) {
        console.error('❌ Failed to parse message:', e);
      }
    };
    
    ws.onopen = function() {
      console.log('✅ WebSocket connected');
      loadRecentMessages();
      setStatus('connected', '✓ Terhubung');
      if (connectBtn) {
        connectBtn.textContent = '🔌 Putuskan';
        connectBtn.disabled = false;
      }
    };
    
    ws.onerror = function(error) {
      console.error('❌ WebSocket error:', error);
      setStatus('error', '✗ Error koneksi');
      if (connectBtn) connectBtn.disabled = false;
    };
    
    ws.onclose = function(event) {
      console.log('🔌 WebSocket closed:', event.code, event.reason);
      ws = null;
      setStatus('', 'Terputus');
      if (connectBtn) {
        connectBtn.textContent = '🔗 Hubungkan';
        connectBtn.disabled = false;
      }
    };
  }
  // Auto-connect on load
  connect();

  function send(obj) {
    if (ws && ws.readyState === WebSocket.OPEN)
      ws.send(JSON.stringify({ ...obj, timestamp: Date.now() }));
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return minutes + ' menit lalu';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + ' jam lalu';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
  
  function scheduleTimeUpdate(element, timestamp) {
    function update() {
      const now = Date.now();
      const diff = now - timestamp;

      let nextUpdate;

      if (diff < 60 * 60 * 1000) {
        // < 1 hour → update every minute
        nextUpdate = 60 * 1000;
      } else if (diff < 24 * 60 * 60 * 1000) {
        // < 1 day → update every hour
        nextUpdate = 60 * 60 * 1000;
      } else {
        // >= 1 day → update every day
        nextUpdate = 24 * 60 * 60 * 1000;
      }

      element.textContent = formatTime(timestamp);

      setTimeout(update, nextUpdate);
    }

    update();
  }

  function addMessage(data, isOwn) {
    const list = document.getElementById('messagesList');
    const empty = document.getElementById('emptyMessages');
    if (empty) empty.classList.add('hidden');
    const timestamp = data.timestamp || Date.now();
    const time = formatTime(timestamp);
    const div = document.createElement('div');
    if (data.messageId) {
      div.setAttribute('data-message-id', data.messageId);
      messageIdToElement[data.messageId] = div;
    }
    div.className = isOwn
      ? 'rounded-lg p-2.5 max-w-[85%] ml-auto bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50'
      : 'rounded-lg p-2.5 max-w-[85%] bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700';
    div.setAttribute('role', 'article');
    div.setAttribute('aria-label', 'Pesan dari ' + (data.from ? (data.from.name || 'Anonymous') : 'Saya'));
    const sender = document.createElement('span');
    sender.className = 'block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-0.5';
    sender.textContent = data.from ? (data.from.name || 'Anonymous') : 'Saya';
    
    const text = document.createElement('p');
    text.className = 'text-sm text-stone-900 dark:text-stone-100 mb-0.5 break-words whitespace-pre-wrap';
    text.textContent = data.text || '';
    
    const morse = document.createElement('p');
    morse.className = 'text-xs text-stone-500 dark:text-stone-400 font-mono mb-0.5 break-words whitespace-pre-wrap';
    morse.textContent = textToMorseWithSlashes(data.text || '');
    
    const timeEl = document.createElement('span');
    timeEl.className = 'text-xs text-stone-400 dark:text-stone-500';
    timeEl.textContent = time;
    scheduleTimeUpdate(timeEl, timestamp);
    timeEl.setAttribute('aria-label', 'Dikirim ' + time);
    
    div.appendChild(sender);
    div.appendChild(text);
    div.appendChild(morse);
    div.appendChild(timeEl);
    list.appendChild(div);
    
    // Sound feedback (default off) — announce pesan masuk lewat suara
    if (settings.soundEnabled && 'speechSynthesis' in window && !isOwn) {
      const utterance = new SpeechSynthesisUtterance('Pesan baru dari ' + (data.from ? data.from.name : 'Anonymous') + ': ' + data.text);
      utterance.lang = 'id-ID';
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    }
    
    // Smooth scroll
    setTimeout(() => {
      list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    }, 10);
  }

  function loadRecentMessages() {
    if (!window.MessageHistory) return;

    const history = window.MessageHistory.loadHistory();
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    // Filter: only messages within last week
    const recent = history.filter(msg => {
      const ts = msg.timestamp || msg.savedAt;
      return ts && (now - ts <= ONE_WEEK);
    });

    // Take last 5
    const lastFive = recent.slice(-5);

    // Render them
    lastFive.forEach(msg => {
      addMessage(msg, msg.isOwn || false);
    });
  }

  let typingTimeout = null;
  function showTypingIndicator(data) {
    const indicator = document.getElementById('typingIndicator');
    if (!indicator) return;
    if (data.isTyping) {
      indicator.classList.remove('hidden');
      indicator.textContent = (data.from.name || 'Anonymous') + ' sedang mengetik...';
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        indicator.classList.add('hidden');
      }, 3000);
    } else {
      indicator.classList.add('hidden');
    }
  }

  function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      setTimeout(() => errorEl.classList.add('hidden'), 5000);
    } else {
      alert(message);
    }
  }

  function textToMorseWithSlashes(text) {
    if (!text) return '';
    const upperText = text.toUpperCase();
    const morseArray = [];
    for (const char of upperText) {
      if (char === ' ') {
        morseArray.push('SPACE');
      } else if (char === '\n') {
        morseArray.push('ENTER');
      } else if (MORSE_MAP[char]) {
        morseArray.push(MORSE_MAP[char]);
      }
    }
    return morseArray.join(' / ');
  }

  // Validate & sanitize message
  function validateMessage(text) {
    if (!text || typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (trimmed.length === 0) return null;
    if (trimmed.length > 1000) return trimmed.substring(0, 1000); // Max 1000 chars
    return trimmed;
  }

  function updateProgress(p) {
    const el = document.getElementById('progressSection');
    const text = document.getElementById('progressText');
    if (p.current >= p.total) {
      el.classList.add('hidden');
      return;
    }
    el.classList.remove('hidden');
    text.textContent = 'Memutar: ' + p.current + ' / ' + p.total;
  }

  function playMessageVibration(data) {
    if (!data || !data.text) return Promise.resolve();
    var FEAT = window.KaitoWhaleFeatures;
    var chain = Promise.resolve();
    if (data.emergency && FEAT && FEAT.EMERGENCY_PATTERN) {
      chain = chain.then(function() { return playRawPattern(FEAT.EMERGENCY_PATTERN); });
    }
    if (data.from && data.from.role && FEAT && FEAT.ROLE_PATTERNS && FEAT.ROLE_PATTERNS[data.from.role]) {
      chain = chain.then(function() { return playRawPattern(FEAT.ROLE_PATTERNS[data.from.role]); });
    }
    if (data.mood && FEAT && FEAT.MOOD_PATTERNS && FEAT.MOOD_PATTERNS[data.mood]) {
      chain = chain.then(function() { return playRawPattern(FEAT.MOOD_PATTERNS[data.mood]); });
    }
    var useG2 = document.getElementById('useGrade2') && document.getElementById('useGrade2').checked;
    var patterns = useG2 ? textToVibrationPatternGrade2(data.text) : textToVibrationPattern(data.text);
    var repeat = parseInt(document.getElementById('repeatCount') && document.getElementById('repeatCount').value, 10) || 1;
    for (var r = 0; r < repeat; r++) {
      chain = chain.then(function() { return playVibrationPattern(patterns, updateProgress); });
    }
    chain.catch(function() {});
    return chain;
  }
  // Dark mode toggle
  function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    if (window.SettingsManager) {
      window.SettingsManager.updateSetting('darkMode', isDark);
      settings = window.SettingsManager.loadSettings(); // Update settings
    }
    // Update theme-color meta
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#0c0a09' : '#1c1917');
    }
    return isDark;
  }
  // --- UI ---
  function init() {
    // Load settings (harus di-load dulu sebelum digunakan)
    if (window.SettingsManager) {
      settings = window.SettingsManager.loadSettings();
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      }
      // Load audio settings
      if (settings.audioEnabled !== undefined) {
        audioSettings.enabled = settings.audioEnabled;
      }
    } else {
      // Fallback jika SettingsManager belum load
      setTimeout(() => {
        if (window.SettingsManager) {
          settings = window.SettingsManager.loadSettings();
          // Load audio settings in fallback
          if (settings.audioEnabled !== undefined) {
            audioSettings.enabled = settings.audioEnabled;
          }
        }
      }, 100);
    }

    // Initialize audio context on first user interaction
    document.addEventListener('click', function initAudioOnFirstClick() {
      initAudioContext();
      document.removeEventListener('click', initAudioOnFirstClick);
    }, { once: true });

    var trustedEl = document.getElementById('trustedNames');
    var repeatEl = document.getElementById('repeatCount');
    var grade2El = document.getElementById('useGrade2');
    if (trustedEl && settings.trustedNames !== undefined) trustedEl.value = settings.trustedNames || '';
    if (repeatEl) repeatEl.value = String(settings.repeatMessageCount !== undefined ? settings.repeatMessageCount : 1);
    if (grade2El && settings.useGrade2 !== undefined) grade2El.checked = settings.useGrade2;
    var usageModeEl = document.getElementById('usageMode');
    var autoSendAfterVoiceEl = document.getElementById('autoSendAfterVoice');
    // if (usageModeEl) usageModeEl.value = settings.bothDeafBlind ? 'bothDeafBlind' : 'standard';
    if (autoSendAfterVoiceEl && settings.autoSendAfterVoice !== undefined) autoSendAfterVoiceEl.checked = settings.autoSendAfterVoice;

    var appBody = document.getElementById('appBody');
    var simpleViewCheckbox = document.getElementById('simpleViewCheckbox');
    if (appBody && simpleViewCheckbox) {
      simpleViewCheckbox.checked = !!settings.simpleView;
      if (settings.simpleView) {
        appBody.classList.add('simple-view');
        appBody.classList.remove('advanced-open');
      } else {
        appBody.classList.remove('simple-view');
      }
      simpleViewCheckbox.addEventListener('change', function() {
        var on = this.checked;
        if (window.SettingsManager) window.SettingsManager.updateSetting('simpleView', on);
        settings.simpleView = on;
        if (on) {
          appBody.classList.add('simple-view');
          appBody.classList.remove('advanced-open');
        } else {
          appBody.classList.remove('simple-view');
        }
      });
    }
    var toggleAdvancedBtn = document.getElementById('toggleAdvancedBtn');
    var advancedSection = document.getElementById('advancedSection');
    if (toggleAdvancedBtn && advancedSection) {
      toggleAdvancedBtn.addEventListener('click', function() {
        var open = appBody.classList.toggle('advanced-open');
        toggleAdvancedBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // Check vibration support
    if (!isVibrationSupported()) {
      const warning = document.createElement('div');
      warning.className = 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 text-sm text-amber-800 dark:text-amber-200';
      warning.setAttribute('role', 'alert');
      warning.textContent = '⚠️ Browser tidak mendukung Vibration API. Getaran tidak akan bekerja.';
      document.querySelector('main').insertBefore(warning, document.querySelector('main').firstChild);
    }

    var serverUrl = document.getElementById('serverUrl');
    if (serverUrl) {
      if (!serverUrl.value) serverUrl.placeholder = 'Kosongkan = pakai server ini';
      serverUrl.value = serverUrl.value || '';
    } else {
      console.warn('Input serverUrl tidak ditemukan');
    }

    // Keyboard shortcuts
    document.getElementById('messageInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        document.getElementById('sendBtn').click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.blur();
      }
    });

    // Dark mode: toggle sudah di-handle via onclick di HTML (window.toggleDarkMode)



    var messageInput = document.getElementById('messageInput');
    var charCount = document.getElementById('charCount');
    var updateTimeout = null;
    
    messageInput.addEventListener('input', function () {
      var text = messageInput.value;
      
      if (charCount) {
        charCount.textContent = text.length;
        charCount.className = text.length > 900 ? 'text-xs text-amber-600 mt-1 text-right' : 'text-xs text-stone-400 mt-1 text-right';
      }
      var longWarn = document.getElementById('longMessageWarning');
      if (longWarn) longWarn.classList.toggle('hidden', text.length < 200);
      
      // Auto-resize textarea: expand to 5 rows max when content overflows 2 rows
      messageInput.style.height = 'auto'; // Reset height
      var scrollHeight = messageInput.scrollHeight;
      var computedStyle = getComputedStyle(messageInput);
      var lineHeight = parseInt(computedStyle.lineHeight) || 18; // Fallback to 18px
      var paddingTop = parseInt(computedStyle.paddingTop) || 0;
      var paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
      
      // Calculate height for 2 rows and 5 rows
      var twoRowHeight = (lineHeight * 2) + paddingTop + paddingBottom;
      var fiveRowHeight = (lineHeight * 5) + paddingTop + paddingBottom;
      
      if (scrollHeight > twoRowHeight) {
        messageInput.style.height = Math.min(scrollHeight, fiveRowHeight) + 'px';
      } else {
        messageInput.style.height = twoRowHeight + 'px';
      }
      
      // Debounce preview update
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(function() {
        var preview = document.getElementById('previewSection');
        var patternPreview = document.getElementById('patternPreview');
        if (text.length > 0) {
          preview.classList.remove('hidden');
          patternPreview.textContent = getPatternPreview(text);
        } else {
          preview.classList.add('hidden');
        }
      }, 300);
      
      // Typing indicator (debounced)
      clearTimeout(window.typingTimeout);
      if (isConnected() && text.length > 0) {
        window.typingTimeout = setTimeout(() => {
          if (isConnected()) send({ type: 'typing', data: { isTyping: true } });
        }, 500);
      } else if (isConnected()) {
        send({ type: 'typing', data: { isTyping: false } });
      }
      
      document.getElementById('sendBtn').disabled = !isConnected() || !text.trim();
      // document.getElementById('playBtn').disabled = !text.trim();
    });

    // Initialize textarea height
    (function() {
      var computedStyle = getComputedStyle(messageInput);
      var lineHeight = parseInt(computedStyle.lineHeight) || 18;
      var paddingTop = parseInt(computedStyle.paddingTop) || 0;
      var paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
      var twoRowHeight = (lineHeight * 2) + paddingTop + paddingBottom;
      messageInput.style.height = twoRowHeight + 'px';
    })();

    function sendMessage(text, opts) {
      opts = opts || {};
      var msgId = opts.messageId || ('msg_' + Date.now() + '_' + (clientId || ''));
      var roleEl = document.getElementById('senderRole');
      var moodEl = document.getElementById('moodSelect');
      var role = (roleEl && roleEl.value) || undefined;
      var mood = (moodEl && moodEl.value) || undefined;
      var pattern = (document.getElementById('useGrade2') && document.getElementById('useGrade2').checked) ? textToVibrationPatternGrade2(text) : textToVibrationPattern(text);
      send({
        type: 'message',
        data: {
          messageId: msgId,
          text: text,
          vibrationPattern: pattern,
          role: role,
          mood: mood,
          emergency: !!opts.emergency
        }
      });
      var msg = {
        from: { name: userName || 'Saya', role: role },
        text: text,
        timestamp: Date.now(),
        isOwn: true,
        messageId: msgId
      };
      addMessage(msg, true);
      if (window.MessageHistory) window.MessageHistory.saveMessage(msg);
    }

    document.getElementById('sendBtn').addEventListener('click', function () {
      var text = validateMessage(messageInput.value);
      
      // Tactile dictionary fallback
      if (text && text.length === 1 && window.tempMorse) {
        var word = MORSE_TO_WORD[window.tempMorse];
        if (word) {
          text = word;
          window.tempMorse = '';
        }
      }

      if (!text || !isConnected()) {
        if (text && text.length > 1000) alert('Pesan terlalu panjang (max 1000 karakter)');
        return;
      }

      var moodEl = document.getElementById('moodSelect');
      if (moodEl) moodEl.value = '';
      
      sendMessage(text);
      
      messageInput.value = '';
      if (charCount) charCount.textContent = '0';
      document.getElementById('previewSection').classList.add('hidden');
      document.getElementById('sendBtn').disabled = true;
      
      if (isConnected()) send({ type: 'typing', data: { isTyping: false } });
    });

    // ✅ Ensure isConnected() actually checks the WebSocket correctly
    function isConnected() {
      return ws && ws.readyState === WebSocket.OPEN;
    }

    document.getElementById('markReadBtn').addEventListener('click', function () {
      if (lastReceivedMessageId && isConnected) {
        send({ type: 'read_receipt', data: { messageId: lastReceivedMessageId } });
        document.getElementById('readReceiptRow').classList.add('hidden');
      }
    });
    var replayVibrationBtn = document.getElementById('replayVibrationBtn');
    if (replayVibrationBtn) {
      replayVibrationBtn.addEventListener('click', function () {
        if (lastReceivedMessageData && lastReceivedMessageData.text) {
          playMessageVibration(lastReceivedMessageData);
        }
      });
    }

    var quickWrap = document.getElementById('quickPhrasesWrap');
    if (quickWrap && window.KaitoWhaleFeatures && window.KaitoWhaleFeatures.QUICK_PHRASES) {
      window.KaitoWhaleFeatures.QUICK_PHRASES.forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-phrase-btn shrink-0 px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-700';
        btn.textContent = p.label;
        btn.addEventListener('click', function () {
          if (isConnected()) sendMessage(p.text);
        });
        quickWrap.appendChild(btn);
      });
    }
    
    function updateSendPreview() {
      var preview = document.getElementById('sendPreviewText');
      // var sendDb = document.getElementById('sendBtnDeafBlind');
      var playPreviewBtn = document.getElementById('playPreviewVibrationBtn');
      if (!messageInput) return;
      var txt = messageInput.value.trim();
      if (preview) preview.textContent = txt || '— Rekam suara, teks akan muncul di sini —';
      if (sendDb) sendDb.disabled = !isConnected() || !txt;
      if (playPreviewBtn) playPreviewBtn.disabled = !txt;
    }

    var onboardingOverlay = document.getElementById('onboardingOverlay');
    var onboardingClose = document.getElementById('onboardingClose');
    if (onboardingOverlay && onboardingClose) {
      if (!settings.onboardingSeen) onboardingOverlay.classList.remove('hidden');
      onboardingClose.addEventListener('click', function () {
        onboardingOverlay.classList.add('hidden');
        if (window.SettingsManager) window.SettingsManager.updateSetting('onboardingSeen', true);
      });
    }

    // Mode belajar: putar getaran pelan (0.6x) untuk latihan
    document.querySelectorAll('.learn-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = (this.getAttribute('data-learn') || '').trim();
        if (!text) return;
        var progressSection = document.getElementById('progressSection');
        var progressText = document.getElementById('progressText');
        progressSection.classList.remove('hidden');
        progressText.textContent = 'Mode belajar (pelan): ' + text;
        playVibrationPattern(textToVibrationPattern(text), function (p) {
          progressText.textContent = 'Mode belajar: ' + p.current + ' / ' + p.total;
          if (p.current >= p.total) progressSection.classList.add('hidden');
        }, 1.8);
      });
    });

    function isConnected() { return ws && ws.readyState === WebSocket.OPEN; }
    window.isConnected = isConnected; // Expose globally for debugging
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function clearMessages() {
    const messagesList = document.getElementById('messagesList');
    const emptyMessages = document.getElementById('emptyMessages');
    
    if (!messagesList) return;
    
    // Remove all dynamic messages
    messagesList.innerHTML = '';
    
    // Restore empty state placeholder
    if (emptyMessages) {
      emptyMessages.classList.remove('hidden');
      messagesList.appendChild(emptyMessages);
    }
    
    // Optional: Reset receipt tracking
    lastReceivedMessageId = null;
    lastReceivedMessageData = null;
    messageIdToElement = {};
  }
})();