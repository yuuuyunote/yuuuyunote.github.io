(function(){
  var KEY = 'gbp-theme';
  var saved = null;
  try{ saved = localStorage.getItem(KEY); }catch(e){}
  if(saved === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function applyToggleHandler(){
    var btn = document.querySelector('[data-theme-toggle]');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if(isDark){
        document.documentElement.removeAttribute('data-theme');
        try{ localStorage.setItem(KEY, 'light'); }catch(e){}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try{ localStorage.setItem(KEY, 'dark'); }catch(e){}
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applyToggleHandler);
  } else {
    applyToggleHandler();
  }
})();
