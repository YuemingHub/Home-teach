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
      def: '孩子看到——我做的事，对我自己有意义。自我品格、自我能力、自我控制。',
      speech1: '"你自己设了闹钟，这是你管住了自己。"',
      speech2: '"你今天没有发脾气就把事情说清楚了，这叫自我控制。"',
      question: '你觉得这件事里，你哪一点做得最好？',
      note: '所有价值的起点——从这里开始'
    },
    {
      label: '第二圈 · 父母圈',
      title: '我让家里好了一点',
      def: '孩子看到——我做的事，让父母轻松了、开心了、有力量了。不是为父母的情绪负责，是让他看见自己对关系的影响。',
      speech1: '"你帮妈妈把碗端到了桌上，你做这件事让我也轻松了一些，这就叫帮了家里。"',
      speech2: '"你这样做了，我觉得你在长大。"',
      question: '你有没有发现，其实你能让爸妈轻松？',
      note: '不是讨好，是真实的影响力'
    },
    {
      label: '第三圈 · 家庭圈',
      title: '我是家里重要的人',
      def: '孩子看到——我做的事，让家里好了一点。我在家庭中有位置、有价值、有归属。',
      speech1: '"你帮忙收拾了客厅，家里因为你好走了一步。"',
      speech2: '"你帮忙做了饭，今天家里比昨天顺一些。"',
      question: '你觉得家里因为你好在哪里？',
      note: '归属感从这里生长'
    },
    {
      label: '第四圈 · 社会圈',
      title: '我能帮助别人',
      def: '孩子看到——我不只属于家里，我在更大的世界中有价值。我在影响别人。',
      speech1: '"你帮同学讲了一道题，他因为你会了这道题。"',
      speech2: '"你在班级里做的事，让同学们好走了一步。"',
      question: '你觉得你做的事对别人有什么影响？',
      note: '这是最高层——前三圈稳了才能真正触达'
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

  /* ==========================================
     四层自评工具
     ========================================== */
  const quizData = [
    {
      text: '孩子愿意主动跟你说话吗？',
      opts: [
        { label: '很少，几乎不', val: 1 },
        { label: '偶尔，但态度冷淡', val: 2 },
        { label: '基本愿意，但一说就吵', val: 3 },
        { label: '愿意，能正常交流', val: 4 }
      ]
    },
    {
      text: '家里有明确的规矩吗？',
      opts: [
        { label: '没有，孩子说了算', val: 1 },
        { label: '有，但经常变', val: 2 },
        { label: '有，执行不稳定', val: 3 },
        { label: '有，基本能执行', val: 4 }
      ]
    },
    {
      text: '定了规矩之后，能坚持执行吗？',
      opts: [
        { label: '说了就忘', val: 1 },
        { label: '孩子一闹就算了', val: 2 },
        { label: '有时坚持，有时放弃', val: 3 },
        { label: '基本能坚持', val: 4 }
      ]
    },
    {
      text: '孩子做完事情后，你会怎么说？',
      opts: [
        { label: '"真棒！"（没有具体内容）', val: 1 },
        { label: '"好了，去玩吧"', val: 2 },
        { label: '"不错，下次继续"', val: 3 },
        { label: '"你自己搞定了，这是自律"', val: 4 }
      ]
    }
  ];

  const quizTool = document.getElementById('self-eval');
  if (quizTool) {
    const startPage = document.getElementById('self-eval-start');
    const qsPage = document.getElementById('self-eval-qs');
    const resultPage = document.getElementById('self-eval-result');
    const qText = document.getElementById('self-eval-q-text');
    const qOpts = document.getElementById('self-eval-options');
    const resultLayer = document.getElementById('result-layer');
    const resultDesc = document.getElementById('result-desc');

    let currentQ = 0;
    const answers = [];

    // 开始
    document.getElementById('self-eval-start-btn').addEventListener('click', () => {
      startPage.style.display = 'none';
      qsPage.style.display = '';
      currentQ = 0;
      showQ(0);
    });

    function showQ(n) {
      const q = quizData[n];
      qText.textContent = (n + 1) + '. ' + q.text;
      qOpts.innerHTML = '';
      q.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'self-eval__opt';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => selectAns(n, opt.val));
        qOpts.appendChild(btn);
      });
    }

    function selectAns(n, val) {
      answers[n] = val;
      if (n < quizData.length - 1) {
        showQ(n + 1);
      } else {
        showResult();
      }
    }

    function showResult() {
      qsPage.style.display = 'none';
      resultPage.style.display = '';

      const avg = answers.reduce((a, b) => a + b, 0) / answers.length;
      let layer, desc;

      if (avg <= 1.5) {
        layer = '第一层 · 关系底盘';
        desc = '亲子沟通出现断裂，孩子不想跟家长说话。这个时候谈规矩和价值都没有意义，先修复关系。';
      } else if (avg <= 2.5) {
        layer = '第二层 · 规则驱动';
        desc = '家里缺少明确的边界和规矩。孩子的安全感需要来自清晰的规则，先写下来，再慢慢执行。';
      } else if (avg <= 3.5) {
        layer = '第三层 · 一致执行';
        desc = '规矩说了不算，执行不稳定。孩子知道规矩存在，但没有内化。需要家长保持一致，不轻易松口。';
      } else {
        layer = '第四层 · 价值长出';
        desc = '孩子不是不想做，是还没有看见自己的价值。需要帮他在具体行为中看到自己的力量，从价值四圈开始。';
      }

      resultLayer.textContent = layer;
      resultDesc.textContent = desc;
    }

    // 重置
    document.getElementById('self-eval-reset').addEventListener('click', () => {
      answers.length = 0;
      resultPage.style.display = 'none';
      qsPage.style.display = 'none';
      startPage.style.display = '';
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (bubble && bubble.classList.contains('visible')) {
      if (!bubble.contains(e.target) && !e.target.closest('.vc-ring')) {
        closeBubble();
      }
    }
  });

  /* ==========================================
     价值四圈 - 渐进展开动画 (首页)
     ========================================== */
  const vc4Anim = document.getElementById('vc4-anim');
  if (vc4Anim && 'IntersectionObserver' in window) {
    let played = false;
    const vc4Observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !played) {
          played = true;
          vc4Anim.classList.add('playing');

          // 逐步高亮步骤说明
          const steps = vc4Anim.querySelectorAll('.vc4-step');
          const times = [0.2, 0.7, 1.2, 1.7];
          steps.forEach((step, i) => {
            setTimeout(() => {
              step.classList.add('active');
            }, times[i] * 1000);
          });
        }
      });
    }, { threshold: 0.3 });

    vc4Observer.observe(vc4Anim);
  }

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

  /* ==========================================
     翻转卡片弹窗 (value.html)
     ========================================== */
  const flipData = [
    {
      title: '空洞夸奖',
      ex: '"你真棒！""你真聪明！""你好厉害！"',
      note: '为什么不对：没有事实支撑的夸奖听起来假，孩子会免疫。',
      right: '正确做法："我注意到你自己把手机放下了。这说明你能管住自己。"'
    },
    {
      title: '条件式价值',
      ex: '"你考好了，真棒！""你听话，才是个好孩子。"',
      note: '为什么不对：价值感和表现绑定，一旦表现不好，价值感就崩塌。',
      right: '正确做法："你按时完成了作业，这叫自律。"（不绑成绩，只绑行为）'
    },
    {
      title: '跳过事实评价',
      ex: '"你是个好孩子。"（没有事实支撑）',
      note: '为什么不对：价值判断必须从具体事实出发，否则是空中楼阁。',
      right: '正确做法："你把书放回了书架，笔收到了笔筒里——这是你自己管住了自己。"'
    },
    {
      title: '价值加压',
      ex: '"以后都要这样！""你得保持住啊！"',
      note: '为什么不对：夸奖变成压力，孩子下次反而不敢做了。',
      right: '正确做法："你今天自己收了书桌——这说明你可以管好自己的地方。你觉得明天会怎样？"'
    },
    {
      title: '忽视微小变化',
      ex: '"才做这么一点。""这有什么好说的。"',
      note: '为什么不对：微小的变化才是真正的进步。',
      right: '正确做法："今天你放好了5分钟——比昨天多放了3分钟。你自己发现了吗？"'
    },
    {
      title: '比较抹杀',
      ex: '"你看人家XXX。""你怎么不如人家。"',
      note: '为什么不对：比较是价值感的天敌。',
      right: '正确做法："你自己把衣服叠好了——这跟别人没关系，这是你自己做到的。"'
    },
    {
      title: '价值反转',
      ex: '"做得不错，但是……""好是好，不过……"',
      note: '为什么不对：一句"但是"毁掉所有努力。',
      right: '正确做法："不错。你这次是怎么做到的？"（删掉"但是"，换成追问过程）'
    }
  ];

  window.openFlipModal = function(idx) {
    const modal = document.getElementById('flip-modal');
    const data = flipData[idx];
    if (!modal || !data) return;
    document.getElementById('fm-title').textContent = data.title;
    document.getElementById('fm-ex').textContent = data.ex;
    document.getElementById('fm-note').textContent = data.note;
    document.getElementById('fm-right').textContent = data.right;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeFlipModal = function(e) {
    if (e && e.target !== e.currentTarget && !e.target.closest('.flip-modal__close')) return;
    const modal = document.getElementById('flip-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };
    const anim = document.getElementById('vc4-anim');
    if (!anim) return;
    anim.classList.remove('playing');
    void anim.offsetWidth; // reflow
    anim.classList.add('playing');
    const steps = anim.querySelectorAll('.vc4-step');
    const times = [0.2, 0.7, 1.2, 1.7];
    steps.forEach((step, i) => {
      step.classList.remove('active');
      setTimeout(() => step.classList.add('active'), times[i] * 1000);
    });
  };

})();
