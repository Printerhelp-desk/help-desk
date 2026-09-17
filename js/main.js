/**
 * PRINTEREXPERT - PRINTER SUPPORT JAVASCRIPT (printerexpert.site)
 * Interactive Troubleshooter, Mobile Navigation, FAQ Accordions, Web3Forms Integration, JivoChat
 */

// ==========================================================================
// 1. PURE DIRECT JIVOCHAT CONTROLLER
// ==========================================================================
window._wantsJivoOpen = false;

window.openJivoChat = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  // 1. If Jivo API is ready, open immediately
  if (window.jivo_api && typeof window.jivo_api.open === 'function') {
    try {
      window.jivo_api.open();
      return;
    } catch (err) {
      try {
        window.jivo_api.open({ start: 'chat' });
        return;
      } catch (e2) {}
    }
  }

  // 2. Click Jivo widget elements if rendered in DOM
  try {
    var jBtn = document.querySelector('jdiv[class*="label"], jdiv[class*="button"], [class*="jivo"], #jivo_container');
    if (jBtn && typeof jBtn.click === 'function') {
      jBtn.click();
    }
  } catch(e) {}

  // 3. Mark intent to open as soon as Jivo script finishes loading
  window._wantsJivoOpen = true;

  // 4. Poll every 50ms for Jivo API
  var pollCount = 0;
  var pollTimer = setInterval(function() {
    pollCount++;
    if (window.jivo_api && typeof window.jivo_api.open === 'function') {
      try {
        window.jivo_api.open();
        window._wantsJivoOpen = false;
        clearInterval(pollTimer);
        return;
      } catch (err) {}
    }
    if (pollCount > 100) {
      clearInterval(pollTimer);
    }
  }, 50);
};

// Jivo Native Load Callback
window.jivo_onLoadCallback = function() {
  if (window._wantsJivoOpen && window.jivo_api && typeof window.jivo_api.open === 'function') {
    try {
      window.jivo_api.open();
      window._wantsJivoOpen = false;
    } catch (err) {}
  }
};

// ==========================================================================
// 2. DOM READY INTERACTIVE LOGIC
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside or link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // Interactive Printer Troubleshooter Wizard
  const troubleshootBtns = document.querySelectorAll('.troubleshoot-btn');
  const resultTitle = document.getElementById('troubleshootTitle');
  const resultDesc = document.getElementById('troubleshootDesc');
  const resultEta = document.getElementById('troubleshootEta');
  const resultSteps = document.getElementById('troubleshootSteps');

  const issueData = {
    offline: {
      title: "Printer Offline / Not Responding",
      desc: "Usually caused by stuck print spoolers, IP address lease changes, or communication port mismatches between your computer and printer.",
      eta: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Avg fix: 5 mins`,
      steps: [
        "Restart print spooler service in Windows/Mac",
        "Verify printer IP address matches TCP/IP port",
        "Speak to our technician for an immediate remote fix"
      ]
    },
    wifi: {
      title: "Wi-Fi & Network Connection Loss",
      desc: "Most printers only operate on 2.4GHz Wi-Fi bands and lose connection when modern mesh routers dynamically switch bands.",
      eta: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Avg fix: 7 mins`,
      steps: [
        "Ensure printer connects to router's 2.4GHz frequency",
        "Assign static IP to prevent recurring dropouts",
        "Our tech can remotely configure permanent wireless ports"
      ]
    },
    driver: {
      title: "Driver Unavailable or Corrupted",
      desc: "Occurs when system updates overwrite printer drivers with generic stubs that cannot communicate with the print engine.",
      eta: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Avg fix: 8 mins`,
      steps: [
        "Completely remove corrupted OEM driver packages",
        "Install certified WHQL signed driver package",
        "Technician verifies full scan & print utility access"
      ]
    },
    paperjam: {
      title: "Paper Jam & Feed Roller Errors",
      desc: "Caused by dust on rubber pickup rollers, misaligned paper guides, or false optical sensor flags.",
      eta: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Avg fix: 10 mins`,
      steps: [
        "Inspect front and rear access doors with a flashlight",
        "Clean pickup rollers gently with a dry lint-free cloth",
        "Call our technician for sensor reset guidance"
      ]
    }
  };

  troubleshootBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      troubleshootBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const issueKey = btn.getAttribute('data-issue');
      const data = issueData[issueKey];
      if (data) {
        if (resultTitle) resultTitle.textContent = data.title;
        if (resultDesc) resultDesc.textContent = data.desc;
        if (resultEta) resultEta.innerHTML = data.eta;
        if (resultSteps && data.steps) {
          resultSteps.innerHTML = data.steps.map(s => `<li><span>✓</span> ${s}</li>`).join('');
        }
      }
    });
  });

  // FAQ Accordion Handling
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const answer = otherItem.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          const answer = item.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });

  // Toast Notification System
  function showToast(message, isSuccess = true) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.style.borderLeftColor = isSuccess ? 'var(--success)' : 'var(--danger)';
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // Web3Forms Lead Form Submission (Email Direct Connection: 446c3e52-56fd-40a4-aaec-87e2ec3d92ee)
  const leadForms = document.querySelectorAll('form[action*="web3forms"], .smartfix-form, .printerexpert-form');
  leadForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Request...</span>';
        submitBtn.disabled = true;
      }

      try {
        const formData = new FormData(form);
        if (!formData.get('access_key')) {
          formData.append('access_key', '446c3e52-56fd-40a4-aaec-87e2ec3d92ee');
        }
        if (!formData.get('subject')) {
          formData.append('subject', 'New Printer Support Request - PrinterExpert');
        }

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          form.reset();
          showToast("Thank you! Your request has been sent directly to our technical team. A technician will contact you shortly.");
        } else {
          showToast(data.message || "Submission failed. Please call our direct helpline at +1-888-804-7080.", false);
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback: Submit form naturally if AJAX fails
        form.submit();
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
        }
      }
    });
  });
});
