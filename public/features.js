// Dictionary Data
const TACTILE_DICTIONARY = {
  confirmation: [
    { word: 'YA', pattern: '•' },
    { word: 'TIDAK', pattern: '-' },
    { word: 'MUNGKIN', pattern: '••-•' },
    { word: 'TIDAK TAHU', pattern: '---•' },
    { word: 'MENGERTI', pattern: '•-••' },
    { word: 'TIDAK MENGERTI', pattern: '-•••' },
  ],
  needs: [
    { word: 'MAKAN', pattern: '••' },
    { word: 'MINUM', pattern: '--' },
    { word: 'MANDI', pattern: '•-' },
    { word: 'TIDUR', pattern: '-•' },
    { word: 'TOILET', pattern: '•••-' },
    { word: 'OBAT', pattern: '--•-' },
    { word: 'DUDUK', pattern: '•--' },
    { word: 'BERDIRI', pattern: '-••' },
  ],
  condition: [
    { word: 'LAPAR', pattern: '•••' },
    { word: 'HAUS', pattern: '---' },
    { word: 'SAKIT', pattern: '•-•' },
    { word: 'CAPEK', pattern: '-•-' },
    { word: 'DINGIN', pattern: '••-' },
    { word: 'PANAS', pattern: '-•' },
    { word: 'PUSING', pattern: '•--•' },
    { word: 'SESAK', pattern: '-•••' },
  ],
  emotion: [
    { word: 'SENANG', pattern: '•-••' },
    { word: 'SEDIH', pattern: '-••-' },
    { word: 'TAKUT', pattern: '••-•' },
    { word: 'MARAH', pattern: '--••' },
    { word: 'TENANG', pattern: '•--' },
    { word: 'GELISAH', pattern: '-••' },
  ],
  help: [
    { word: 'TOLONG', pattern: '••••' },
    { word: 'DARURAT', pattern: '----' },
    { word: 'PULANG', pattern: '•--•' },
    { word: 'BUTUH BANTUAN', pattern: '-••-' },
    { word: 'ULANGI', pattern: '••--' },
    { word: 'SELESAI', pattern: '--••' },
    { word: 'DATANG', pattern: '•-••' },
    { word: 'PERGI', pattern: '-•--' },
  ],
  interaction: [
    { word: 'DENGARKAN', pattern: '•-•-' },
    { word: 'TUNGGU', pattern: '-•••' },
    { word: 'CEPAT', pattern: '••-•' },
    { word: 'PELAN', pattern: '---•' },
    { word: 'LAGI', pattern: '•--•' },
  ],
  time: [
    { word: 'SEKARANG', pattern: '•••-' },
    { word: 'NANTI', pattern: '-••-' },
    { word: 'PAGI', pattern: '•--•' },
    { word: 'MALAM', pattern: '-•-•' },
  ],
};

function renderDictionaryTab(tab) {
  const content = document.getElementById('dictContent');
  if (!content) return;
  content.innerHTML = '';
  const items = TACTILE_DICTIONARY[tab] || [];
  items.forEach(item => {
    const box = document.createElement('div');
    box.className = 'rounded-xl bg-stone-100 dark:bg-stone-700 p-4 mb-2 flex flex-col shadow';
    box.innerHTML = `
      <div class="font-bold text-lg mb-2">${item.word}</div>
      <div class="text-xs text-stone-500 dark:text-stone-400 mb-1">Tactile Pattern</div>
      <div class="font-mono text-lg bg-white dark:bg-stone-800 rounded p-2 mb-1">${item.pattern}</div>
      <div class="text-xs text-stone-400 dark:text-stone-500">Tap to preview vibration</div>
    `;
    content.appendChild(box);
  });
}

  // Fungsi untuk mengubah pola morse (•, —) menjadi array durasi getaran
  function morsePatternToVibration(pattern) {
    // Aturan: • = 100ms getar, — = 300ms getar, antar elemen 100ms jeda
    const arr = [];
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '•') {
        arr.push(100); // getar
      } else if (pattern[i] === '—') {
        arr.push(300); // getar
      } else {
        continue;
      }
      // Tambah jeda jika bukan terakhir
      if (i < pattern.length - 1 && (pattern[i+1] === '•' || pattern[i+1] === '—')) {
        arr.push(100); // jeda antar getar
      }
    }
    return arr;
  }

  function renderDictionaryTab(tab) {
    const content = document.getElementById('dictContent');
    if (!content) return;
    content.innerHTML = '';
    const items = TACTILE_DICTIONARY[tab] || [];
    items.forEach(item => {
      const box = document.createElement('div');
      box.className = 'rounded-xl bg-stone-100 dark:bg-stone-700 p-4 mb-2 flex flex-col shadow cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition';
      box.innerHTML = `
        <div class="font-bold text-lg mb-2">${item.word}</div>
        <div class="text-xs text-stone-500 dark:text-stone-400 mb-1">Tactile Pattern</div>
        <div class="font-mono text-lg bg-white dark:bg-stone-800 rounded p-2 mb-1">${item.pattern}</div>
        <div class="text-xs text-stone-400 dark:text-stone-500">Tap to preview vibration</div>
      `;
      box.addEventListener('click', function() {
        if (window.navigator && navigator.vibrate) {
          const vib = morsePatternToVibration(item.pattern);
          navigator.vibrate(vib);
          box.classList.add('ring', 'ring-emerald-400');
          setTimeout(() => box.classList.remove('ring', 'ring-emerald-400'), 500);
        } else {
          alert('Vibration API tidak didukung di perangkat ini');
        }
      });
      content.appendChild(box);
    });
  }

function setupDictionaryTabs() {
  const tabs = document.querySelectorAll('.dict-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('bg-emerald-700', 'dark:bg-emerald-600', 'text-white'));
      tabs.forEach(t => t.classList.add('bg-stone-200', 'dark:bg-stone-700', 'text-stone-700', 'dark:text-stone-100'));
      this.classList.add('bg-emerald-700', 'dark:bg-emerald-600', 'text-white');
      this.classList.remove('bg-stone-200', 'dark:bg-stone-700', 'text-stone-700', 'dark:text-stone-100');
      renderDictionaryTab(this.dataset.tab);
    });
  });
  renderDictionaryTab('confirmation');
}

document.addEventListener('DOMContentLoaded', function () {
  setupDictionaryTabs();
  // Tombol Kamus di halaman utama
  const openBtn = document.getElementById('openDictionaryBtn');
  if (openBtn) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'dictionary.html';
    });
  }
  // Tombol Training di halaman utama
  const trainingBtn = document.getElementById('openTrainingBtn');
  if (trainingBtn) {
    trainingBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'training.html';
    });
  }
});
/**
 * Konstanta untuk fitur tambahan: darurat, role, mood, Braille Grade 2
 */
window.KaitoWhaleFeatures = {
  // Pola getaran DARURAT: 3x panjang (mudah dikenali)
  EMERGENCY_PATTERN: [500, 200, 500, 200, 500],

  // Pola pengenal pengirim (role) - pendek, unik per role
  ROLE_PATTERNS: {
    ibu: [200, 100, 200],
    ayah: [200, 100, 200, 100, 200],
    pengasuh: [500, 200, 500],
    teman: [500, 200, 500, 200, 500]
  },

  // Pola suasana (mood) - singkat
  MOOD_PATTERNS: {
    senang: [200, 100, 200, 100, 200],
    sedih: [500, 300, 500],
    marah: [200, 200, 200],
    tenang: [500, 100, 500],
    sayang: [200, 100, 200]
  },

  // Braille Grade 2: kata utuh -> 6 titik (kontraksi)
  GRADE2_WORDS: {
    'yang': [1, 0, 1, 1, 1, 1],
    'dan': [1, 1, 0, 0, 1, 0],
    'tidak': [0, 1, 1, 1, 1, 0],
    'untuk': [1, 0, 1, 0, 0, 1],
    'dengan': [1, 1, 0, 1, 0, 0],
    'ini': [0, 1, 1, 1, 0, 0],
    'itu': [0, 1, 1, 1, 1, 0],
    'ada': [1, 0, 0, 0, 0, 0],
    'sudah': [0, 1, 1, 1, 0, 0],
    'akan': [1, 0, 0, 0, 0, 0],
    'bisa': [1, 1, 0, 0, 0, 0],
    'telah': [0, 1, 1, 1, 1, 0],
    'atau': [1, 0, 1, 0, 0, 0],
    'juga': [0, 1, 0, 1, 1, 0],
    'saya': [0, 1, 1, 1, 0, 0],
    'kamu': [1, 0, 1, 0, 0, 0],
    'dia': [1, 0, 0, 1, 0, 0],
    'kita': [1, 0, 1, 0, 0, 0],
    'mereka': [1, 1, 1, 0, 0, 0]
  },

  // Frasa cepat (shortcuts)
  QUICK_PHRASES: [
    { label: 'Iya', text: 'iya' },
    { label: 'Tidak', text: 'tidak' },
    { label: 'Butuh bantuan', text: 'butuh bantuan' },
    { label: 'Ke toilet', text: 'ke toilet' },
    { label: 'Lapar', text: 'lapar' },
    { label: 'Haus', text: 'haus' },
    { label: 'Sakit', text: 'sakit' },
    { label: 'Aman', text: 'aman' },
    { label: 'Terima kasih', text: 'terima kasih' },
    { label: 'Apa kabar', text: 'apa kabar' }
  ]
};
