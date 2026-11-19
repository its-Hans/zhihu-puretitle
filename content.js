(function () {
  "use strict";

  // 匹配标题开头形如 "(3 封私信 / 5 条消息) " 的前缀，只处理包含“私信”或“消息”的括号。
  const PREFIX_RE = /^\s*\((?=[^)]*(?:私信|消息))[^)]*\)\s*/;
  function clean(title) {
    return title.replace(PREFIX_RE, "");
  }

  // 页面脚本修改 document.title 时会改动 <title> 的文本或子节点，
  // 这些 DOM 变化对内容脚本可见，因此用 MutationObserver 清理即可。
  // clean 是幂等的：标题已无前缀时不会再写入，因此不会循环。
  function fixTitle() {
    const el = document.querySelector("title");
    if (!el) return;
    const cleaned = clean(el.textContent);
    if (cleaned !== el.textContent) {
      el.textContent = cleaned;
    }
  }

  const observer = new MutationObserver(fixTitle);
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
