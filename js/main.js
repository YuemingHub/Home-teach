/**
 * 月明家庭教育 - 主脚本
 * 包含：汉堡菜单、折叠展开、滚动渐现动画
 */

(function() {
  'use strict';

  /* ==========================================
     Hamburger Menu
     ========================================== */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobile);
    }

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    function closeMobile() {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================
     Pyramid layer expand/collapse
     ========================================== */
  document.querySelectorAll('.pyramid__layer').forEach(layer => {
    layer.addEventListener('click', () => {
      const detail = layer.nextElementSibling;
      if (detail && detail.classList.contains('pyramid__detail')) {
        const isOpen = detail.classList.contains('open');
        // Close all
        document.querySelectorAll('.pyramid__detail').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.pyramid__expand').forEach(icon => {
          icon.textContent = '+';
        });
        // Open clicked if was closed
        if (!isOpen) {
          detail.classList.add('open');
          const icon = layer.querySelector('.pyramid__expand');
          if (icon) icon.textContent = '−';
        }
      }
    });
  });

  /* ==========================================
     Scroll reveal (Intersection Observer)
     ========================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================
     翻转错误卡片
     ========================================== */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  /* ==========================================
     价值四圈 · 同心圆交互（重新设计版）
     ========================================== */
  const ringData = [
    {
      label: '第一圈 · 自我圈',
      title: '我能管住自己',
      def: '孩子看到——我的行为对我自己有积极影响。',
      speech1: '"你自己设了闹钟，这说明你是能管理自己的人。"',
      speech2: '"你今天没有发脾气就把事情说清楚了。这叫自我控制。"',
      question: '你觉得，这件事里你做得最好的是什么？',
      note: '最核心的一圈，也是所有价值的起点'
    },
    {
      label: '第二圈 · 父母圈',
      title: '我让家里好了一点',
      def: '孩子看到——我的行为对父母和重要关系有积极影响。',
      speech1: '"你这样做，让我觉得你真的在长大。"',
      speech2: '"你自己做了这个决定——这是你对自己有力量。"',
      question: '你有没有发现，其实你能做到？',
      note: '不是让孩子为父母的情绪负责，是让他看到他对关系的影响力'
    },
    {
      label: '第三圈 · 家庭圈',
      title: '我是家里重要的人',
      def: '孩子看到——我是家庭系统中有价值的一员。',
      speech1: '"你帮忙收拾了客厅，家里因为你好了一点。"',
      speech2: '"你帮忙做了饭，家里今天因为你好了一点。"',
      question: '你觉得家里因为你好在哪里？',
      note: '归属感从这里开始'
    },
    {
      label: '第四圈 · 社会圈',
      title: '我能帮助别人',
      def: '孩子看到——我能对更大的世界产生积极影响。',
      speech1: '"你帮了同学，你的存在让别人的生活好了一点。"',
      speech2: '"你帮同学讲了一道题——你觉得这对别人来说意味着什么？"',
      question: '你觉得你做的事对别人有什么影响？',
      note: '这是最高层，前面三圈稳了才能真正触达'
    }
  ];

  const rings = document.querySelectorAll('.vc-ring');
  const bubble = document.getElementById('vc-bubble');

  function closeBubble() {
    if (bubble) {
      bubble.classList.remove('visible');
    }
    rings.forEach(r => r.classList.remove('active'));
  }

  // Make closeBubble available globally for the inline onclick
  window.closeBubble = closeBubble;

  rings.forEach(ring => {
    ring.addEventListener('click', (e) => {
      // Prevent bubbling when clicking inner rings
      if (e.target !== ring && !ring.contains(e.target)) return;

      const idx = parseInt(ring.dataset.ring, 10) - 1;
      if (idx < 0 || idx >= ringData.length) return;

      const data = ringData[idx];

      // Update bubble content
      document.getElementById('vc-bubble-label').textContent = data.label;
      document.getElementById('vc-bubble-title').textContent = data.title;
      document.getElementById('vc-bubble-def').textContent = data.def;
      document.getElementById('vc-bubble-speech1').textContent = data.speech1;
      document.getElementById('vc-bubble-speech2').textContent = data.speech2;
      document.getElementById('vc-bubble-question').textContent = data.question;
      document.getElementById('vc-bubble-note').textContent = data.note;

      // Show speech2 if exists
      const speech2El = document.getElementById('vc-bubble-speech2');
      if (speech2El) {
        speech2El.style.display = data.speech2 ? '' : 'none';
      }

      // Toggle: click same ring closes bubble
      if (ring.classList.contains('active')) {
        closeBubble();
        return;
      }

      // Remove active from all, set on clicked
      rings.forEach(r => r.classList.remove('active'));
      ring.classList.add('active');

      // Position bubble: alternate left/right per ring
      const isLeftSide = (idx % 2 === 1); // 2nd (idx=1) and 4th (idx=3) on left
      const containerRect = ring.closest('.vc-circles').getBoundingClientRect();

      if (isLeftSide) {
        bubble.style.left = '20px';
        bubble.style.right = 'auto';
        bubble.style.top = '50%';
        bubble.style.transform = 'translateY(-50%) scale(0.9)';
      } else {
        bubble.style.right = '20px';
        bubble.style.left = 'auto';
        bubble.style.top = '50%';
        bubble.style.transform = 'translateY(-50%) scale(0.9)';
      }

      // Show bubble with animation
      bubble.classList.add('visible');
      requestAnimationFrame(() => {
        bubble.style.transform = isLeftSide
          ? 'translateY(-50%) scale(1)'
          : 'translateY(-50%) scale(1)';
      });

      // Scroll to keep bubble visible
      bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (bubble && bubble.classList.contains('visible')) {
      if (!bubble.contains(e.target) && !e.target.closest('.vc-ring')) {
        closeBubble();
      }
    }
  });

  /* ==========================================
     Active nav link highlight
     ========================================== */
  const navLinks = document.querySelectorAll('.nav__links a:not(.nav__cta)');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile nav active highlight
  const mobileLinks = document.querySelectorAll('.nav__mobile a');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
