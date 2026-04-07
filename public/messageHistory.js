/**
 * Message History Management
 * Persist messages ke localStorage
 */

const HISTORY_KEY = 'kaito_whale_history';
const MAX_HISTORY = 100; // Max messages to store

function saveMessage(message) {
  try {
    let history = loadHistory();
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    // 🧹 Remove messages older than 7 days
    history = history.filter(msg => {
      const ts = msg.timestamp || msg.savedAt;
      return ts && (now - ts <= ONE_WEEK);
    });

    // ➕ Add new message
    history.push({
      ...message,
      savedAt: now
    });

    // 🔒 Keep max limit
    if (history.length > MAX_HISTORY) {
      history.shift();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.error('Error saving message:', e);
    return false;
  }
}

function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading history:', e);
    return [];
  }
}

function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing history:', e);
    return false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { saveMessage, loadHistory, clearHistory };
} else {
  window.MessageHistory = { saveMessage, loadHistory, clearHistory };
}
