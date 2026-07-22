/* ==========================================================================
   参加Bot一覧: データの取得・検索・タグ絞り込み
   ========================================================================== */

(function () {
  "use strict";

  var grid = document.querySelector("[data-bot-grid]");
  var searchInput = document.querySelector("[data-bot-search]");
  var tagContainer = document.querySelector("[data-tag-filters]");
  var metaEl = document.querySelector("[data-bots-meta]");
  var emptyState = document.querySelector("[data-state-empty]");
  var errorState = document.querySelector("[data-state-error]");

  if (!grid) return;

  var allBots = [];
  var activeTag = "all";
  var activeQuery = "";

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getInitial(name) {
    return (name || "?").trim().charAt(0).toUpperCase();
  }

  function renderTagFilters(bots) {
    if (!tagContainer) return;

    var tagSet = new Set();
    bots.forEach(function (bot) {
      (bot.tags || []).forEach(function (tag) {
        tagSet.add(tag);
      });
    });

    var tags = ["all"].concat(Array.from(tagSet).sort());

    tagContainer.innerHTML = tags
      .map(function (tag) {
        var label = tag === "all" ? "すべて" : tag;
        var isActive = tag === activeTag;
        return (
          '<button type="button" class="tag-filter' +
          (isActive ? " active" : "") +
          '" data-tag="' +
          escapeHtml(tag) +
          '" aria-pressed="' +
          (isActive ? "true" : "false") +
          '">' +
          escapeHtml(label) +
          "</button>"
        );
      })
      .join("");

    tagContainer.querySelectorAll(".tag-filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeTag = btn.getAttribute("data-tag");
        renderTagFilters(allBots);
        renderBots();
      });
    });
  }

  function renderBotCard(bot) {
    var tags = (bot.tags || [])
      .map(function (tag) {
        return '<span class="bot-tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");

    var link = bot.url
      ? '<a class="bot-link" href="' +
        escapeHtml(bot.url) +
        '" target="_blank" rel="noopener">詳細をみる' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        "</a>"
      : "";

    return (
      '<article class="bot-card">' +
      '<div class="bot-card-head">' +
      '<div class="bot-avatar" aria-hidden="true">' +
      escapeHtml(getInitial(bot.name)) +
      "</div>" +
      "<h3>" +
      escapeHtml(bot.name) +
      "</h3>" +
      "</div>" +
      "<p>" +
      escapeHtml(bot.description || "説明は準備中です。") +
      "</p>" +
      '<div class="bot-tags">' +
      tags +
      "</div>" +
      link +
      "</article>"
    );
  }

  function renderBots() {
    var query = activeQuery.trim().toLowerCase();

    var filtered = allBots.filter(function (bot) {
      var matchesTag =
        activeTag === "all" || (bot.tags || []).indexOf(activeTag) !== -1;

      if (!matchesTag) return false;
      if (!query) return true;

      var haystack = (
        (bot.name || "") +
        " " +
        (bot.description || "") +
        " " +
        (bot.tags || []).join(" ")
      ).toLowerCase();

      return haystack.indexOf(query) !== -1;
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", filtered.length === 0);
    }

    grid.innerHTML = filtered.map(renderBotCard).join("");

    if (metaEl) {
      metaEl.textContent = filtered.length + " 件のBotが登録されています";
    }
  }

  function showError() {
    if (errorState) errorState.classList.add("is-visible");
    if (metaEl) metaEl.textContent = "";
  }

  function init() {
    fetch("bots.json")
      .then(function (res) {
        if (!res.ok) throw new Error("bots.json の取得に失敗しました");
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) {
          if (emptyState) emptyState.classList.add("is-visible");
          if (metaEl) metaEl.textContent = "0 件のBotが登録されています";
          return;
        }
        allBots = data;
        renderTagFilters(allBots);
        renderBots();
      })
      .catch(function () {
        showError();
      });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        activeQuery = searchInput.value;
        renderBots();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
