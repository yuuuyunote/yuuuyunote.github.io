// Guide Base + Tools — ツール一覧データ
// soon: true のものは近日公開（カードはクリック不可）
var GBP_TOOLS = [
  { id:'ansi-color', title:'文字色変換ツール', desc:'ANSIカラーコードでDiscordのコードブロック内テキストに色をつける。プレビュー確認しながらコピー。', cat:'text', catLabel:'テキスト装飾', href:'/gbp/tools/ansi-color.html' },
  { id:'markdown-copy', title:'マークダウンコピー', desc:'太字・斜体・見出し・リストなどをGUIで組み立てて、Discord用マークダウンとしてコピー。', cat:'text', catLabel:'テキスト装飾', href:'/gbp/tools/markdown-copy.html' },
  { id:'id-copy', title:'各種ID形式コピー', desc:'ユーザー・ロール・チャンネル・サーバーIDから、メンション形式やID単体をワンクリックでコピー。', cat:'id', catLabel:'ID・特殊リンク', href:'/gbp/tools/id-copy.html' },
  { id:'timestamp', title:'タイムスタンプタグ生成', desc:'日時を選ぶだけで <t:unix:R> 形式のタイムスタンプタグを生成。表示形式もその場でプレビュー。', cat:'text', catLabel:'テキスト装飾', href:'/gbp/tools/timestamp.html' },
  { id:'id-customize', title:'スマホ非対応リンクコピー', desc:'<id:customize> など、スマホアプリのUIから直接コピーできない公式リンクタグの一覧とコピー機能。', cat:'id', catLabel:'ID・特殊リンク', href:'/gbp/tools/id-customize.html' },
  { id:'snowflake', title:'Snowflake ID変換', desc:'Discord ID(Snowflake)から作成日時を逆算。日時からIDの概算範囲を求める逆変換にも対応。', cat:'id', catLabel:'ID・特殊リンク', href:'/gbp/tools/snowflake.html' },
  { id:'emoji-copy', title:'絵文字コピー用テキスト生成', desc:'カスタム絵文字の名前とIDから <:name:id> / <a:name:id> 形式のコピー用テキストを生成。', cat:'text', catLabel:'テキスト装飾', href:'/gbp/tools/emoji-copy.html' },
  { id:'cheatsheet', title:'装飾記法＆メンションチートシート', desc:'スポイラー・引用・コードブロック言語指定・@everyone等のメンション形式を一覧でコピー。', cat:'text', catLabel:'テキスト装飾', href:'/gbp/tools/cheatsheet.html' },
  { id:'webhook-gform', title:'Googleフォーム→Discord連携コード生成', desc:'フォーム回答をWebhook経由でDiscordチャンネルへ送るApps Scriptコードを、入力項目に合わせて自動生成。', cat:'webhook', catLabel:'Webhook連携', href:'/gbp/tools/webhook-gform.html' },
  { id:'reference', title:'用語集＆ショートカットキー', desc:'Discord運営でよく使う略語・スラングの解説と、覚えておきたいショートカットキー一覧。', cat:'reference', catLabel:'リファレンス', href:'/gbp/tools/reference.html' },

  { id:'channel-url-extract', title:'チャンネルURLからID抽出', desc:'チャンネルやメッセージのURLを貼るだけで、各種IDを分解して表示。', cat:'id', catLabel:'ID・特殊リンク', soon:true },
  { id:'sheet-webhook', title:'スプレッドシート→Discord通知コード生成', desc:'スプレッドシートの更新をトリガーに、Discordへ自動通知するGASコードを生成。', cat:'webhook', catLabel:'Webhook連携', soon:true },
  { id:'rss-forward', title:'RSS/Xポスト→Discord転送ガイド', desc:'RSSフィードやXの投稿をDiscordチャンネルへ自動転送する設定手順とコード。', cat:'webhook', catLabel:'Webhook連携', soon:true },
  { id:'permission-matrix', title:'ロール権限マトリクス表', desc:'よくあるサーバー構成向けの、ロール別おすすめ権限設定テンプレート。', cat:'server', catLabel:'サーバー運営', soon:true },
  { id:'channel-permission-cheatsheet', title:'チャンネル権限設定チートシート', desc:'お知らせ専用・モデレーター専用など、目的別チャンネル権限プリセット集。', cat:'server', catLabel:'サーバー運営', soon:true },
  { id:'automod-preset', title:'AutoMod設定プリセット', desc:'スパム・招待リンク荒らし対策など、目的別の自動化ルール設定例。', cat:'server', catLabel:'サーバー運営', soon:true },
  { id:'server-templates', title:'サーバー構成テンプレート集', desc:'コミュニティ系・学習系・ゲーム系など、目的別のチャンネル構成テンプレート。', cat:'server', catLabel:'サーバー運営', soon:true },
  { id:'invite-presets', title:'招待リンク設定早見表', desc:'有効期限・使用回数のおすすめ組み合わせを、用途別に一覧化。', cat:'server', catLabel:'サーバー運営', soon:true },
  { id:'banner-sizes', title:'バナー/アイコン推奨サイズ一覧', desc:'サーバーアイコン・バナー・絵文字など、各種画像の推奨サイズと容量制限。', cat:'reference', catLabel:'リファレンス', soon:true },
  { id:'audit-log-glossary', title:'監査ログの見方', desc:'監査ログに出てくる操作名・用語の意味を、実際の表示画面つきで解説。', cat:'reference', catLabel:'リファレンス', soon:true }
];

var GBP_CATEGORIES = [
  { key:'all', label:'すべて' },
  { key:'text', label:'テキスト装飾' },
  { key:'id', label:'ID・特殊リンク' },
  { key:'webhook', label:'Webhook連携' },
  { key:'server', label:'サーバー運営' },
  { key:'reference', label:'リファレンス' }
];

(function(){
  var grid = document.getElementById('tool-grid');
  if(!grid) return;

  var searchInput = document.getElementById('tool-search');
  var chipsWrap = document.getElementById('category-chips');
  var countEl = document.getElementById('result-count');
  var activeCat = 'all';

  function cardHTML(t){
    if(t.soon){
      return '' +
        '<div class="card disabled">' +
          '<div class="card-top">' +
            '<span class="card-tag">'+ t.catLabel +'</span>' +
            '<span class="badge-soon">近日公開</span>' +
          '</div>' +
          '<h3>'+ t.title +'</h3>' +
          '<p>'+ t.desc +'</p>' +
        '</div>';
    }
    return '' +
      '<a class="card" href="'+ t.href +'">' +
        '<div class="card-top">' +
          '<span class="card-tag">'+ t.catLabel +'</span>' +
        '</div>' +
        '<h3>'+ t.title +'</h3>' +
        '<p>'+ t.desc +'</p>' +
      '</a>';
  }

  function render(){
    var q = (searchInput.value || '').trim().toLowerCase();
    var results = GBP_TOOLS.filter(function(t){
      var matchesCat = activeCat === 'all' || t.cat === activeCat;
      var matchesQuery = !q || (t.title + t.desc + t.catLabel).toLowerCase().indexOf(q) !== -1;
      return matchesCat && matchesQuery;
    });

    countEl.textContent = results.length + ' 件のツール';

    if(results.length === 0){
      grid.innerHTML = '<div class="empty-state">該当するツールが見つかりませんでした。</div>';
      grid.style.display = 'block';
      return;
    }
    grid.style.display = 'grid';
    grid.innerHTML = results.map(cardHTML).join('');
  }

  function buildChips(){
    chipsWrap.innerHTML = GBP_CATEGORIES.map(function(c){
      return '<button type="button" class="chip'+(c.key==='all'?' active':'')+'" data-cat="'+c.key+'">'+c.label+'</button>';
    }).join('');

    chipsWrap.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        chipsWrap.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat');
        render();
      });
    });
  }

  buildChips();
  render();
  searchInput.addEventListener('input', render);
})();
