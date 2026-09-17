// Переключение языка страницы: русский, английский, испанский.
//
// Все три версии текста лежат в одном файле, у каждого блока атрибут data-lang.
// Скрипт показывает нужный язык и прячет остальные.
// Порядок выбора: адрес с #en/#es/#ru → язык, выбранный раньше → язык браузера.

(function () {
  var languages = ["ru", "en", "es"];
  var root = document.documentElement;

  function readSaved() {
    // В приватном режиме браузер может запретить хранилище — тогда просто нет сохранённого языка.
    try {
      return localStorage.getItem("streakly-lang");
    } catch (error) {
      return null;
    }
  }

  function save(language) {
    try {
      localStorage.setItem("streakly-lang", language);
    } catch (error) {
      // Не сохранилось — не страшно, язык всё равно переключится.
    }
  }

  function pickInitial() {
    var fromHash = location.hash.replace("#", "");
    if (languages.indexOf(fromHash) !== -1) return fromHash;

    var saved = readSaved();
    if (languages.indexOf(saved) !== -1) return saved;

    var browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (languages.indexOf(browser) !== -1) return browser;
    return "en";
  }

  function show(language) {
    root.setAttribute("data-show", language);
    root.setAttribute("lang", language);
    root.classList.add("lang-ready");

    // Заголовок вкладки браузера тоже на выбранном языке
    var title = document.querySelector('meta[name="title-' + language + '"]');
    if (title) document.title = title.getAttribute("content");

    var buttons = document.querySelectorAll(".lang-switch button");
    for (var i = 0; i < buttons.length; i++) {
      var isCurrent = buttons[i].getAttribute("data-set-lang") === language;
      buttons[i].setAttribute("aria-pressed", isCurrent ? "true" : "false");
    }
  }

  // Скрипт подключён в <head>: язык выбирается до отрисовки, и три версии
  // текста не мелькают. Кнопок в этот момент ещё нет — отмечаем их после загрузки.
  show(pickInitial());
  document.addEventListener("DOMContentLoaded", function () {
    show(root.getAttribute("data-show"));
  });

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-set-lang]");
    if (!button) return;
    var language = button.getAttribute("data-set-lang");
    save(language);
    show(language);
  });
})();
