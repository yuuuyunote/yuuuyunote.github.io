(function () {
  var grid = document.getElementById('botGrid');
  var countEl = document.getElementById('botCount');
  var emptyEl = document.getElementById('botEmpty');
  var errorEl = document.getElementById('botError');
  var searchInput = document.getElementById('botSearch');
  if (!grid) { return; }

  var bots = [];

  function cardHtml(bot) {
    var tags = (bot.tags || []).map(function (t) {
      return '<span class="tag">' + escapeHtml(t) + '</span>';
    }).join(' ');
    var link = bot.url
      ? '<a href="' + escapeAttr(bot.url) + '" class="cta-btn ghost" target="_blank" rel="noopener"><span class="cta-label">詳細を見る</span><span class="cta-badge"><svg class="cta-arrow" viewBox="0 0 16 16"><path d="M4 8 H12 M8 4 L12 8 L8 12" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>'
      : '';
    return (
      '<div class="card bot-card">' +
      '<div class="bot-card-tags">' + tags + '</div>' +
      '<h3>' + escapeHtml(bot.name || '') + '</h3>' +
      '<p>' + escapeHtml(bot.description || '') + '</p>' +
      (link ? '<div class="bot-card-link">' + link + '</div>' : '') +
      '</div>'
    );
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(str) { return escapeHtml(str); }

  function render(list) {
    grid.innerHTML = list.map(cardHtml).join('');
    countEl.textContent = list.length + '件のBotが見つかりました';
    emptyEl.hidden = list.length !== 0;
  }

  function applyFilter() {
    var q = (searchInput.value || '').trim().toLowerCase();
    if (!q) { render(bots); return; }
    var filtered = bots.filter(function (bot) {
      var haystack = [bot.name, bot.description].concat(bot.tags || []).join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
    render(filtered);
  }

  searchInput.addEventListener('input', applyFilter);

  fetch('bots.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('failed to load bots.json'); }
      return res.json();
    })
    .then(function (data) {
      bots = Array.isArray(data) ? data : [];
      render(bots);
    })
    .catch(function () {
      errorEl.hidden = false;
      countEl.textContent = '';
    });
})();
