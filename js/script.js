// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
      var expanded = header.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (header) header.classList.remove('open');
    });
  });

  // Animate route-line paths when they scroll into view
  var paths = document.querySelectorAll('.route-line .path');
  if ('IntersectionObserver' in window && paths.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'dash 2.4s linear forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    paths.forEach(function (p) { observer.observe(p); });
  }

  // WhatsApp floating button toggle
  var waBtn = document.getElementById('wa-float-btn');
  var waMenu = document.getElementById('wa-menu');
  if (waBtn && waMenu) {
    waBtn.addEventListener('click', function () {
      waMenu.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!waMenu.contains(e.target) && !waBtn.contains(e.target)) {
        waMenu.classList.remove('open');
      }
    });
  }

  // Contact form: send enquiry via email API
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button");
      submitBtn.disabled = true;
      var name = document.getElementById('f-name').value.trim();
      var phone = document.getElementById('f-phone').value.trim();
      var email = document.getElementById('f-email').value.trim();
      var pickup = document.getElementById('f-pickup').value.trim();
      var dest = document.getElementById('f-dest').value.trim();
      var message = document.getElementById('f-message').value.trim();

      var status = document.getElementById('form-status');

      fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, phone: phone, email: email, pickup: pickup, destination: dest, details: message })
      })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Server error');
          return data;
        });
      })
      .then(function () {
        if (status) {
          status.textContent = 'Thank you, ' + (name || 'you') + '! Your enquiry has been sent. We\'ll get back to you shortly.';
          status.style.color = '#1a7a3a';
          status.style.display = 'block';
        }
        form.reset();
      })
      .catch(function () {
        if (status) {
          status.textContent = 'Something went wrong. Please try again or call us directly at +91 81411 67986.';
          status.style.color = '#D7263D';
          status.style.display = 'block';
        }
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
    });
  }

  // Scroll-reveal for elements marked .reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Animated stat counters (data-count-to="30" style)
  var counters = document.querySelectorAll('[data-count-to]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var startTime = null;
        var duration = 1200;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.floor(progress * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }
  // Credit badge tooltip — pop it up when the visitor scrolls it into view, then hover-only after
  var creditBadges = document.querySelectorAll('.credit-line');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (creditBadges.length && !prefersReducedMotion) {
    if ('IntersectionObserver' in window) {
      var creditObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var tip = entry.target.querySelector('.credit-tooltip');
          if (tip) {
            tip.classList.add('is-visible');
            setTimeout(function () { tip.classList.remove('is-visible'); }, 7000);
          }
          creditObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      creditBadges.forEach(function (b) { creditObserver.observe(b); });
    } else {
      creditBadges.forEach(function (b) {
        var tip = b.querySelector('.credit-tooltip');
        if (tip) tip.classList.add('is-visible');
      });
    }
  }
  // Leadership card tilt (desktop pointer only)
  if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
});


// Refined header state: a quieter, denser navigation bar after the first scroll.
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 18); }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
});