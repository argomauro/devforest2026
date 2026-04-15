(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = nav ? nav.querySelectorAll("a[href^='#']") : [];

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = document.querySelectorAll("section[id]");
  var scrollSpy = function () {
    var y = window.scrollY + 120;
    var current = "top";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = sec.id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === "#" + current) a.classList.add("active");
      else a.classList.remove("active");
    });
  };
  window.addEventListener("scroll", scrollSpy, { passive: true });
  scrollSpy();

  var root = document.documentElement;
  var themeButtons = document.querySelectorAll("[data-theme-set]");
  var stored = null;
  try {
    stored = localStorage.getItem("devfest-theme");
  } catch (e) {}

  function applyTheme(name) {
    if (!name) name = "default";
    root.removeAttribute("data-theme");
    if (name !== "default") root.setAttribute("data-theme", name);
    themeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-theme-set") === name ? "true" : "false");
    });
    try {
      localStorage.setItem("devfest-theme", name);
    } catch (e) {}
  }

  if (stored) applyTheme(stored);
  else applyTheme("green");

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(btn.getAttribute("data-theme-set") || "default");
    });
  });

  function syncEmailConfirmValidity() {
    var form = document.getElementById("registration-form");
    if (!form) return;
    var email = document.getElementById("email");
    var confirm = document.getElementById("email_confirm");
    if (!email || !confirm) return;
    if (confirm.value && email.value !== confirm.value) {
      confirm.setCustomValidity("Le due email devono coincidere.");
    } else {
      confirm.setCustomValidity("");
    }
  }

  var regForm = document.getElementById("registration-form");
  if (regForm) {
    var emailEl = document.getElementById("email");
    var confirmEl = document.getElementById("email_confirm");
    if (emailEl) emailEl.addEventListener("input", syncEmailConfirmValidity);
    if (confirmEl) confirmEl.addEventListener("input", syncEmailConfirmValidity);
    regForm.addEventListener("submit", function (e) {
      syncEmailConfirmValidity();
      if (!regForm.checkValidity()) {
        e.preventDefault();
        regForm.reportValidity();
      }
    });
  }

  var flash = document.getElementById("form-flash");
  if (flash) {
    try {
      var params = new URLSearchParams(window.location.search);
      var reg = params.get("reg");
      if (reg === "ok") {
        flash.hidden = false;
        flash.className = "form-flash form-flash--ok";
        flash.textContent = "Registrazione inviata correttamente. Ti contatteremo all’indirizzo indicato.";
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      } else if (reg === "fail") {
        flash.hidden = false;
        flash.className = "form-flash form-flash--err";
        flash.textContent =
          "Invio non riuscito. Riprova più tardi o scrivi direttamente agli organizzatori.";
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
    } catch (err) {}
  }

  var heroSlider = document.getElementById("hero-slider");
  if (heroSlider) {
    var slides = heroSlider.querySelectorAll(".hero-slide");
    var dots = heroSlider.querySelectorAll(".hero-slider-dot");
    var prevBtn = heroSlider.querySelector("[data-slide-dir='prev']");
    var nextBtn = heroSlider.querySelector("[data-slide-dir='next']");
    var index = 0;
    var timer = null;

    function renderSlide(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restartAuto() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () {
        renderSlide(index + 1);
      }, 4500);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        renderSlide(index - 1);
        restartAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        renderSlide(index + 1);
        restartAuto();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var rawIndex = Number(dot.getAttribute("data-slide-to"));
        if (Number.isNaN(rawIndex)) return;
        renderSlide(rawIndex);
        restartAuto();
      });
    });

    renderSlide(0);
    restartAuto();
  }
})();
