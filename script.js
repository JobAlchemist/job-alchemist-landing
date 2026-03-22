// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navPanel = document.querySelector('.nav-panel') || navMenu;
  const imageModal = document.getElementById('image-modal');
  const imageModalImg = document.getElementById('image-modal-img');
  const imageModalClose = document.getElementById('image-modal-close');
  const imageModalTitle = document.getElementById('image-modal-title');
  const imageModalCaption = document.getElementById('image-modal-caption');
  const proofImageLinks = document.querySelectorAll('[data-image-modal]');
  const testimonialCarousel = document.querySelector('.testimonials-carousel');
  const testimonialDots = testimonialCarousel ? Array.from(document.querySelectorAll('.testimonial-dot')) : [];
  const workflowTabsRoot = document.querySelector('[data-workflow-tabs]');

  // --- Proof Image Modal Functions ---
  function openImageModal(event) {
    event.preventDefault();

    if (!imageModal || !imageModalImg) {
      console.error("Image modal elements not found!");
      return;
    }

    const trigger = event.currentTarget;
    const src = trigger.getAttribute('data-image-modal');
    const alt = trigger.getAttribute('data-image-alt') || '';
    const title = trigger.getAttribute('data-image-title') || '';
    const caption = trigger.getAttribute('data-image-caption') || '';

    if (!src) {
      console.error("Image modal source not found!");
      return;
    }

    imageModalImg.src = src;
    imageModalImg.alt = alt;
    if (imageModalTitle) {
      imageModalTitle.textContent = title;
    }
    if (imageModalCaption) {
      imageModalCaption.textContent = caption;
    }
    imageModal.style.display = 'flex';
    setTimeout(() => {
      imageModal.classList.add('active');
    }, 10);
  }

  function closeImageModal() {
    if (!imageModal || !imageModalImg) {
      return;
    }

    imageModal.classList.remove('active');
    setTimeout(() => {
      imageModal.style.display = 'none';
      imageModalImg.src = '';
      imageModalImg.alt = '';
      if (imageModalTitle) {
        imageModalTitle.textContent = '';
      }
      if (imageModalCaption) {
        imageModalCaption.textContent = '';
      }
    }, 300);
  }

  // --- Add Event Listeners ---

  // Proof Image Modal Listeners
  if (proofImageLinks.length) {
    proofImageLinks.forEach((link) => {
      link.addEventListener('click', openImageModal);
    });
  } else {
    console.warn("Proof image links not found.");
  }

  if (imageModalClose) {
    imageModalClose.addEventListener('click', closeImageModal);
  } else {
    console.warn("Image modal close button not found.");
  }

  if (imageModal) {
    imageModal.addEventListener('click', (event) => {
      if (event.target === imageModal) {
        closeImageModal();
      }
    });
  } else {
    console.warn("Image modal container not found.");
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
      closeImageModal();
    }
  });

  // --- Testimonials Carousel ---
  if (testimonialCarousel) {
    const testimonialQuotes = Array.from(testimonialCarousel.querySelectorAll('.quote'));
    const rotateEveryMs = 4500;
    let currentIndex = testimonialQuotes.findIndex((quote) => quote.classList.contains('is-active'));
    let rotateTimer = null;

    if (currentIndex < 0) {
      currentIndex = 0;
    }

    function setActiveTestimonial(index) {
      if (!testimonialQuotes.length) {
        return;
      }

      currentIndex = (index + testimonialQuotes.length) % testimonialQuotes.length;

      testimonialQuotes.forEach((quote, quoteIndex) => {
        const isActive = quoteIndex === currentIndex;
        quote.classList.toggle('is-active', isActive);
        quote.setAttribute('aria-hidden', String(!isActive));
      });

      testimonialDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', String(isActive));
      });
    }

    function stopRotation() {
      if (rotateTimer) {
        clearInterval(rotateTimer);
        rotateTimer = null;
      }
    }

    function startRotation() {
      if (testimonialQuotes.length < 2) {
        return;
      }
      stopRotation();
      rotateTimer = setInterval(() => {
        setActiveTestimonial(currentIndex + 1);
      }, rotateEveryMs);
    }

    testimonialDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const dotIndex = Number(dot.getAttribute('data-testimonial-dot'));
        if (Number.isNaN(dotIndex)) {
          return;
        }
        setActiveTestimonial(dotIndex);
        startRotation();
      });
    });

    testimonialCarousel.addEventListener('mouseenter', stopRotation);
    testimonialCarousel.addEventListener('mouseleave', startRotation);
    testimonialCarousel.addEventListener('focusin', stopRotation);
    testimonialCarousel.addEventListener('focusout', (event) => {
      if (!testimonialCarousel.contains(event.relatedTarget)) {
        startRotation();
      }
    });

    setActiveTestimonial(currentIndex);
    startRotation();
  }

  // --- Workflow Tabs ---
  if (workflowTabsRoot) {
    const workflowMobileBreakpoint = 600;
    const workflowTabButtons = Array.from(workflowTabsRoot.querySelectorAll('[data-workflow-tab]'));
    const workflowPanels = Array.from(workflowTabsRoot.querySelectorAll('[data-workflow-panel]'));
    const workflowDots = Array.from(workflowTabsRoot.querySelectorAll('[data-workflow-dot]'));
    const workflowStepCounter = workflowTabsRoot.querySelector('[data-workflow-step-counter]');
    const workflowPrevButton = workflowTabsRoot.querySelector('[data-workflow-prev]');
    const workflowNextButton = workflowTabsRoot.querySelector('[data-workflow-next]');
    const workflowPanelFrame = workflowTabsRoot.querySelector('.workflow-panel-frame');
    const rotateEveryMs = 5000;
    let workflowIndex = workflowTabButtons.findIndex((tab) => tab.classList.contains('is-active'));
    let workflowTimer = null;
    let workflowHasInteracted = false;
    let workflowTouchStartX = 0;
    let workflowTouchStartY = 0;

    if (workflowIndex < 0) {
      workflowIndex = 0;
    }

    function setActiveWorkflow(index, shouldFocus = false) {
      if (!workflowTabButtons.length || !workflowPanels.length) {
        return;
      }

      workflowIndex = (index + workflowTabButtons.length) % workflowTabButtons.length;

      workflowTabButtons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === workflowIndex;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      workflowPanels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === workflowIndex;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });

      workflowDots.forEach((dot) => {
        const dotPosition = Number(dot.getAttribute('data-workflow-dot'));
        const isActiveDot = !Number.isNaN(dotPosition) && dotPosition === workflowIndex;
        dot.classList.toggle('is-active', isActiveDot);
      });

      if (workflowStepCounter) {
        workflowStepCounter.textContent = `Step ${workflowIndex + 1} of ${workflowTabButtons.length}`;
      }

      if (workflowPrevButton) {
        workflowPrevButton.disabled = workflowIndex === 0;
      }

      if (workflowNextButton) {
        workflowNextButton.disabled = workflowIndex === workflowTabButtons.length - 1;
      }

      if (shouldFocus) {
        workflowTabButtons[workflowIndex].focus();
      }
    }

    function isWorkflowMobileView() {
      return window.innerWidth <= workflowMobileBreakpoint;
    }

    function syncWorkflowLayoutMode() {
      workflowTabsRoot.classList.toggle('is-mobile-layout', isWorkflowMobileView());
    }

    function stopWorkflowAutoAdvance() {
      if (workflowTimer) {
        clearInterval(workflowTimer);
        workflowTimer = null;
      }
    }

    function startWorkflowAutoAdvance() {
      if (workflowHasInteracted || workflowTabButtons.length < 2) {
        return;
      }
      stopWorkflowAutoAdvance();
      workflowTimer = setInterval(() => {
        setActiveWorkflow(workflowIndex + 1);
      }, rotateEveryMs);
    }

    function markWorkflowInteracted() {
      workflowHasInteracted = true;
      stopWorkflowAutoAdvance();
    }

    workflowTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetIndex = Number(button.getAttribute('data-workflow-tab'));
        if (Number.isNaN(targetIndex)) {
          return;
        }
        markWorkflowInteracted();
        setActiveWorkflow(targetIndex);
      });

      button.addEventListener('keydown', (event) => {
        let nextIndex = null;
        const currentTabIndex = Number(button.getAttribute('data-workflow-tab'));

        if (Number.isNaN(currentTabIndex)) {
          return;
        }

        if (event.key === 'ArrowRight') {
          nextIndex = currentTabIndex + 1;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = currentTabIndex - 1;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = workflowTabButtons.length - 1;
        }

        if (nextIndex === null) {
          return;
        }

        event.preventDefault();
        markWorkflowInteracted();
        setActiveWorkflow(nextIndex, true);
      });
    });

    if (workflowPrevButton) {
      workflowPrevButton.addEventListener('click', () => {
        if (workflowIndex === 0) {
          return;
        }
        markWorkflowInteracted();
        setActiveWorkflow(workflowIndex - 1);
      });
    }

    if (workflowNextButton) {
      workflowNextButton.addEventListener('click', () => {
        if (workflowIndex === workflowTabButtons.length - 1) {
          return;
        }
        markWorkflowInteracted();
        setActiveWorkflow(workflowIndex + 1);
      });
    }

    if (workflowPanelFrame) {
      workflowPanelFrame.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        if (!touch) {
          return;
        }
        workflowTouchStartX = touch.clientX;
        workflowTouchStartY = touch.clientY;
      }, { passive: true });

      workflowPanelFrame.addEventListener('touchend', (event) => {
        if (!isWorkflowMobileView()) {
          return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
          return;
        }

        const deltaX = touch.clientX - workflowTouchStartX;
        const deltaY = touch.clientY - workflowTouchStartY;
        const isHorizontalSwipe = Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalSwipe) {
          return;
        }

        if (deltaX < 0 && workflowIndex < workflowTabButtons.length - 1) {
          markWorkflowInteracted();
          setActiveWorkflow(workflowIndex + 1);
        } else if (deltaX > 0 && workflowIndex > 0) {
          markWorkflowInteracted();
          setActiveWorkflow(workflowIndex - 1);
        }
      }, { passive: true });
    }

    workflowTabsRoot.addEventListener('pointerdown', markWorkflowInteracted, { once: true });
    workflowTabsRoot.addEventListener('focusin', markWorkflowInteracted, { once: true });
    workflowTabsRoot.addEventListener('touchstart', markWorkflowInteracted, { once: true, passive: true });

    syncWorkflowLayoutMode();
    window.addEventListener('resize', syncWorkflowLayoutMode);
    setActiveWorkflow(workflowIndex);
    startWorkflowAutoAdvance();
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navPanel.classList.toggle('active');
    });
    navPanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navPanel.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.warn("Navigation toggle/menu not found.");
  }

}); // End DOMContentLoaded listener
