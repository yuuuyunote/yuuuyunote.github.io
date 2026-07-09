// Guide Base + Tools — 共通コピー/トースト機能
function gbpToast(msg){
  var toast = document.getElementById('gbp-toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'gbp-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg || 'コピーしました';
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 1800);
}

function gbpCopy(text, msg){
  if(!text){ gbpToast('コピーする内容がありません'); return; }
  var done = function(){ gbpToast(msg || 'コピーしました'); };
  var fail = function(){
    try{
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }catch(e){
      gbpToast('コピーに失敗しました');
    }
  };
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done).catch(fail);
  } else {
    fail();
  }
}

// data-copy-target="#elementId" のボタンをクリックしたら、その要素のテキストをコピーする共通ハンドラ
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-copy-target]');
  if(!btn) return;
  var sel = btn.getAttribute('data-copy-target');
  var el = document.querySelector(sel);
  if(!el) return;
  var text = ('value' in el) ? el.value : el.textContent;
  gbpCopy(text, btn.getAttribute('data-copy-msg') || 'コピーしました');
});
