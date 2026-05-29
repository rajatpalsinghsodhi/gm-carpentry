// GM Carpentry — AI Chatbot Widget
(function () {
  /* ---- HTML scaffold ---- */
  const html = `
    <button class="gm-chat-fab" id="gmChatFab" type="button" aria-label="Open chat" aria-expanded="false">
      <span class="material-symbols-outlined gm-chat-fab-icon" id="gmChatFabIcon" aria-hidden="true">chat</span>
      <span class="gm-chat-fab-badge" aria-hidden="true"></span>
    </button>
    <div class="gm-chat-welcome" id="gmChatWelcome" role="status" aria-live="polite" hidden>
      <div class="gm-chat-welcome-inner">
        <p class="gm-chat-welcome-text">Have a question about trim or finish carpentry? Tap to chat with our mockup assistant — simulated responses, not live AI.</p>
        <button class="gm-chat-welcome-close" id="gmChatWelcomeClose" type="button" aria-label="Dismiss welcome message">
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
    <div class="gm-chat-panel" id="gmChatPanel" role="dialog" aria-label="Chat with GM Carpentry">
      <div class="gm-chat-header">
        <div class="gm-chat-header-avatar">GM</div>
        <div class="gm-chat-header-info">
          <div class="gm-chat-header-name">GM Carpentry</div>
          <div class="gm-chat-header-status">Mockup simulation · Not real AI</div>
        </div>
        <button class="gm-chat-header-close" id="gmChatClose" aria-label="Close chat">
          <span class="material-symbols-outlined" style="font-size:20px;">close</span>
        </button>
      </div>
      <div class="gm-chat-body" id="gmChatBody"></div>
      <form class="gm-chat-composer" id="gmChatForm" autocomplete="off">
        <input class="gm-chat-input" id="gmChatInput" type="text"
               placeholder="Type a message…" aria-label="Type a message" maxlength="500">
        <button class="gm-chat-send" type="submit" id="gmChatSend" aria-label="Send" disabled>
          <span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1,'wght' 400;">send</span>
        </button>
      </form>
      <div class="gm-chat-disclaimer">This is a mockup chat — responses are simulated, not live AI.</div>
      <div class="gm-chat-brand">GM Carpentry · Oakville, ON</div>
    </div>`;

  const mount = document.createElement('div');
  mount.innerHTML = html;
  while (mount.firstChild) {
    document.body.appendChild(mount.firstChild);
  }

  /* ---- Elements ---- */
  const fab     = document.getElementById('gmChatFab');
  const fabIcon = document.getElementById('gmChatFabIcon');
  const panel   = document.getElementById('gmChatPanel');
  const body    = document.getElementById('gmChatBody');
  const form    = document.getElementById('gmChatForm');
  const input   = document.getElementById('gmChatInput');
  const sendBtn = document.getElementById('gmChatSend');
  const closeBtn= document.getElementById('gmChatClose');
  const welcomeEl = document.getElementById('gmChatWelcome');
  const welcomeCloseBtn = document.getElementById('gmChatWelcomeClose');

  const WELCOME_STORAGE_KEY = 'gmChatWelcomeDismissed';
  let isOpen = false;
  let welcomeVisible = false;

  /* ---- Open / close ---- */
  function setFabIcon(name) {
    if (fabIcon.textContent === name) return;
    fabIcon.classList.add('is-swapping');
    window.setTimeout(function () {
      fabIcon.textContent = name;
      fabIcon.classList.remove('is-swapping');
    }, 150);
  }

  function dismissWelcome() {
    if (!welcomeEl) return;
    welcomeVisible = false;
    welcomeEl.classList.remove('is-visible');
    welcomeEl.setAttribute('hidden', '');
    try {
      sessionStorage.setItem(WELCOME_STORAGE_KEY, '1');
    } catch (e) {}
  }

  function showWelcome() {
    if (!welcomeEl) return;
    try {
      if (sessionStorage.getItem(WELCOME_STORAGE_KEY)) return;
    } catch (e) {}
    if (isOpen) return;
    welcomeVisible = true;
    welcomeEl.removeAttribute('hidden');
    var revealed = false;
    function revealWelcome() {
      if (revealed) return;
      revealed = true;
      welcomeEl.classList.add('is-visible');
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(revealWelcome);
    } else {
      revealWelcome();
    }
    window.setTimeout(revealWelcome, 50);
  }

  function toggle(open) {
    isOpen = typeof open === 'boolean' ? open : !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.classList.toggle('open', isOpen);
    fab.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
    fab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    setFabIcon(isOpen ? 'close' : 'chat');
    if (isOpen) {
      dismissWelcome();
      fab.classList.add('seen');
      input.focus();
    }
  }
  fab.addEventListener('click', function () { toggle(); });
  if (welcomeCloseBtn) {
    welcomeCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dismissWelcome();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', function () { toggle(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) toggle(false);
  });

  /* ---- Messaging helpers ---- */
  function addMessage(text, from) {
    const el = document.createElement('div');
    el.className = 'gm-chat-msg ' + from;
    if (from === 'bot') {
      el.innerHTML = '<span class="gm-msg-label">GM Carpentry</span>' + escapeHTML(text);
    } else {
      el.textContent = text;
    }
    body.appendChild(el);
    scrollToBottom();
    return el;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'gm-chat-typing';
    el.id = 'gmTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(el);
    scrollToBottom();
    return el;
  }
  function hideTyping() {
    const el = document.getElementById('gmTyping');
    if (el) el.remove();
  }

  function showQuickReplies(options) {
    const wrap = document.createElement('div');
    wrap.className = 'gm-chat-quick';
    wrap.id = 'gmQuick';
    options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        removeQuickReplies();
        handleUserMessage(opt);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }
  function removeQuickReplies() {
    var el = document.getElementById('gmQuick');
    if (el) el.remove();
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      body.scrollTop = body.scrollHeight;
    });
  }

  function escapeHTML(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---- Booking flow ---- */
  var bookingState = { active: false, step: 0, data: {} };

  var bookingSteps = [
    { key: 'name', question: "What's your full name?" },
    { key: 'contact', question: "What's the best phone number or email to reach you?" },
    { key: 'service', question: "What type of carpentry service do you need? (e.g. crown moulding, baseboards, built-ins, wainscoting)" },
    { key: 'address', question: "What's the project address or location?" },
    { key: 'datetime', question: "When would you prefer a visit? Share a preferred date/time or your general availability." },
    { key: 'description', question: "Could you briefly describe the work you'd like done?" },
    { key: 'notes', question: "Any other details we should know? (Type \"none\" or \"skip\" if not applicable.)" }
  ];

  var bookingAcks = ['Got it!', 'Thanks!', 'Perfect.', 'Noted.', 'Great.', 'Understood.'];

  function isBookingIntent(text) {
    return text.toLowerCase().match(/\b(book(ing)?|schedule|appointment|reserve|reservation|consultation|set up a visit|visit)\b/);
  }

  function startBookingFlow() {
    bookingState.active = true;
    bookingState.step = 0;
    bookingState.data = {};
    botReplyWithDelay(
      "I'd be happy to walk you through booking a visit with Gary. This is a mockup — your details won't be sent anywhere, but let's see what a real booking would look like.\n\n" + bookingSteps[0].question
    );
  }

  function handleBookingStep(answer) {
    var step = bookingSteps[bookingState.step];
    var value = answer.trim();
    if (step.key === 'notes' && value.toLowerCase().match(/^(none|skip|n\/a|no)$/)) {
      value = '—';
    }
    bookingState.data[step.key] = value;
    bookingState.step++;

    if (bookingState.step >= bookingSteps.length) {
      bookingState.active = false;
      showBookingSummary();
      return;
    }

    var ack = bookingAcks[bookingState.step % bookingAcks.length];
    botReplyWithDelay(ack + ' ' + bookingSteps[bookingState.step].question);
  }

  function showBookingSummary() {
    var d = bookingState.data;
    var summary =
      "Here's your booking summary (mockup only — not submitted):\n\n" +
      '• Name: ' + d.name + '\n' +
      '• Contact: ' + d.contact + '\n' +
      '• Service: ' + d.service + '\n' +
      '• Location: ' + d.address + '\n' +
      '• Preferred time: ' + d.datetime + '\n' +
      '• Description: ' + d.description + '\n' +
      '• Additional notes: ' + d.notes;

    botReplyWithDelay(summary, function () {
      botReplyWithDelay(
        "In a live version, Gary's team would confirm this by phone or email. For now, you can reach him directly at (647) 289-5306 or studio@gmcarpentry.ca.",
        showDefaultQuickReplies
      );
    });
  }

  function showDefaultQuickReplies() {
    showQuickReplies([
      'Book an appointment',
      'Get a free quote',
      'What services do you offer?',
      'Where do you work?',
      'Tell me about pricing'
    ]);
  }

  function botReplyWithDelay(text, callback) {
    var delay = 600 + Math.random() * 800;
    showTyping();
    setTimeout(function () {
      hideTyping();
      addMessage(text, 'bot');
      if (callback) callback();
    }, delay);
  }

  /* ---- Bot responses (simulated) ---- */
  var responses = {
    'Book an appointment': '__BOOKING__',
    'Get a free quote': "Great choice! You can request a free quote by calling (647) 289-5306 or by visiting our contact page. Just let us know the room, what trim work you're thinking about, and your timeline — photos help too!",
    'What services do you offer?': "We specialize in crown moulding, baseboards, casing, wainscoting, waffle & coffered ceilings, built-ins, cabinetry, doors & hardware, and full interior finish carpentry. Every job is measured, cut, and installed by Gary personally.",
    'Where do you work?': "We serve Halton Region and nearby areas — Oakville, Burlington, Milton, Georgetown, Halton Hills, and Mississauga. If you're just outside that list, send us your address and scope and we'll let you know!",
    'Tell me about pricing': "Every project is different, so we provide clear written quotes after understanding the scope. Most single-room trim jobs take a few days to a couple of weeks. Call (647) 289-5306 or send photos for a free estimate — no surprises, no hidden costs."
  };

  var fallbacks = [
    "Thanks for reaching out! For detailed questions, the best way is to call Gary directly at (647) 289-5306 or email studio@gmcarpentry.ca. He'll follow up during business hours.",
    "That's a great question! I'd recommend reaching out directly so Gary can give you the best answer. You can call (647) 289-5306 or visit our contact page.",
    "I appreciate you asking! For anything specific to your project, Gary can help best over a quick call at (647) 289-5306 or via email at studio@gmcarpentry.ca."
  ];
  var fallbackIdx = 0;

  function getBotReply(userText) {
    var lower = userText.toLowerCase();

    if (responses[userText]) {
      if (responses[userText] === '__BOOKING__') return '__BOOKING__';
      return responses[userText];
    }

    if (isBookingIntent(userText)) return '__BOOKING__';

    if (lower.match(/\b(quote|price|pric|cost|how much|estimate|budget)\b/))
      return responses['Tell me about pricing'];
    if (lower.match(/\b(service|offer|do you do|what do you|crown|trim|wainscot|baseboard|ceiling|cabinet|door|built.?in|mould|molding)\b/))
      return responses['What services do you offer?'];
    if (lower.match(/\b(where|area|city|oakville|burlington|milton|georgetown|halton|mississauga|location|nearby)\b/))
      return responses['Where do you work?'];
    if (lower.match(/\b(hi|hello|hey|good morning|good afternoon)\b/))
      return "Hello! Welcome to GM Carpentry. How can I help you today? Feel free to ask about our services, pricing, or service area.";
    if (lower.match(/\b(thank|thanks|thx)\b/))
      return "You're welcome! Don't hesitate to reach out anytime. You can call Gary at (647) 289-5306 or visit our contact page for a free quote.";
    if (lower.match(/\b(phone|call|number|contact|email|reach)\b/))
      return "You can reach GM Carpentry at (647) 289-5306 or email studio@gmcarpentry.ca. Gary responds during business hours and is happy to discuss your project!";

    var reply = fallbacks[fallbackIdx % fallbacks.length];
    fallbackIdx++;
    return reply;
  }

  function handleUserMessage(text) {
    text = text.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    removeQuickReplies();

    var delay = 600 + Math.random() * 800;
    showTyping();

    setTimeout(function () {
      hideTyping();

      if (bookingState.active) {
        handleBookingStep(text);
        return;
      }

      var reply = getBotReply(text);
      if (reply === '__BOOKING__') {
        startBookingFlow();
        return;
      }

      addMessage(reply, 'bot');
    }, delay);
  }

  /* ---- Form handling ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleUserMessage(input.value);
  });
  input.addEventListener('input', function () {
    sendBtn.disabled = !input.value.trim();
  });

  /* ---- Welcome popup ---- */
  setTimeout(showWelcome, 1500);

  /* ---- Welcome sequence ---- */
  setTimeout(function () {
    addMessage("Hi! I'm a mockup assistant for GM Carpentry — this chat simulates an AI helper but isn't connected to live AI. How can I help with your carpentry needs?", 'bot');
    setTimeout(function () {
      showDefaultQuickReplies();
    }, 400);
  }, 600);
})();
