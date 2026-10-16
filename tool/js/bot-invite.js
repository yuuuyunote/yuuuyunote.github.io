"use strict";

    // Discord API の権限ビット値。BigIntで扱い、32bit演算による桁落ちを防ぎます。
    const PERMISSIONS = {
      VIEW_CHANNEL: 0x400n,
      MANAGE_CHANNELS: 0x10n,
      MANAGE_ROLES: 0x10000000n,
      MANAGE_GUILD: 0x20n,
      ADMINISTRATOR: 0x8n,
      KICK_MEMBERS: 0x2n,
      BAN_MEMBERS: 0x4n,
      MODERATE_MEMBERS: 0x10000000000n,
      SEND_MESSAGES: 0x800n,
      SEND_MESSAGES_IN_THREADS: 0x4000000000n,
      MANAGE_MESSAGES: 0x2000n,
      EMBED_LINKS: 0x4000n,
      ATTACH_FILES: 0x8000n,
      READ_MESSAGE_HISTORY: 0x10000n,
      ADD_REACTIONS: 0x40n,
      CONNECT: 0x100000n,
      SPEAK: 0x200000n,
      MUTE_MEMBERS: 0x400000n,
      MOVE_MEMBERS: 0x1000000n
    };

    const appIdInput = document.getElementById("appId");
    const scopeBot = document.getElementById("scopeBot");
    const scopeCommands = document.getElementById("scopeCommands");
    const permissionInputs = [...document.querySelectorAll("[data-permission]")];
    const adminInput = document.getElementById("administrator");
    const resultUrl = document.getElementById("resultUrl");
    const generateButton = document.getElementById("generate");
    const copyButton = document.getElementById("copy");
    const status = document.getElementById("status");
    const permissionCount = document.getElementById("permissionCount");
    const permissionValue = document.getElementById("permissionValue");
    let generatedUrl = "";

    function getPermissions() {
      if (adminInput.checked) return PERMISSIONS.ADMINISTRATOR;
      return permissionInputs.reduce((total, input) => {
        if (input.checked) total |= PERMISSIONS[input.dataset.permission];
        return total;
      }, 0n);
    }

    function selectedPermissionCount() {
      if (adminInput.checked) return 1;
      return permissionInputs.filter(input => input.checked).length;
    }

    function updatePermissionSummary() {
      const value = getPermissions();
      permissionCount.textContent = `${selectedPermissionCount()} 個`;
      permissionValue.textContent = value.toString();
    }

    function invalidateResult() {
      generatedUrl = "";
      copyButton.disabled = true;
      status.textContent = "";
      resultUrl.innerHTML = '<span class="result-placeholder">設定が変更されました。URLを再生成してください。</span>';
    }

    adminInput.addEventListener("change", () => {
      if (adminInput.checked) {
        permissionInputs.forEach(input => {
          if (input !== adminInput) input.checked = false;
        });
      }
      updatePermissionSummary();
      invalidateResult();
    });

    permissionInputs.forEach(input => {
      if (input === adminInput) return;
      input.addEventListener("change", () => {
        if (input.checked) adminInput.checked = false;
        updatePermissionSummary();
        invalidateResult();
      });
    });

    [appIdInput, scopeBot, scopeCommands].forEach(input => {
      input.addEventListener("input", invalidateResult);
      input.addEventListener("change", invalidateResult);
    });

    document.getElementById("clearPermissions").addEventListener("click", () => {
      permissionInputs.forEach(input => input.checked = false);
      updatePermissionSummary();
      invalidateResult();
    });

    generateButton.addEventListener("click", () => {
      const appId = appIdInput.value.trim();
      if (!/^\d{17,20}$/.test(appId)) {
        status.textContent = "アプリケーションIDを確認してください（17〜20桁の数字）。";
        status.style.color = "#000";
        appIdInput.focus();
        return;
      }

      const scopes = [];
      if (scopeBot.checked) scopes.push("bot");
      // Discordでは bot scope に applications.commands が含まれるため重複追加しません。
      if (scopeCommands.checked && !scopeBot.checked) scopes.push("applications.commands");

      if (scopes.length === 0) {
        status.textContent = "OAuth2スコープを1つ以上選択してください。";
        status.style.color = "#000";
        return;
      }

      const params = new URLSearchParams({
        client_id: appId,
        scope: scopes.join(" ")
      });
      if (scopeBot.checked) params.set("permissions", getPermissions().toString());

      generatedUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;
      resultUrl.textContent = generatedUrl;
      copyButton.disabled = false;
      status.textContent = "URLを生成しました。内容を確認してコピーしてください。";
      status.style.color = "#000";
    });

    copyButton.addEventListener("click", async () => {
      if (!generatedUrl) return;
      try {
        await navigator.clipboard.writeText(generatedUrl);
        status.textContent = "URLをコピーしました。";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(resultUrl);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "自動コピーできませんでした。URLを選択して手動でコピーしてください。";
      }
      status.style.color = "#000";
    });

    updatePermissionSummary();
