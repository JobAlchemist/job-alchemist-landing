// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const imageModal = document.getElementById('image-modal');
  const imageModalImg = document.getElementById('image-modal-img');
  const imageModalClose = document.getElementById('image-modal-close');
  const imageModalTitle = document.getElementById('image-modal-title');
  const imageModalCaption = document.getElementById('image-modal-caption');
  const proofImageLinks = document.querySelectorAll('[data-image-modal]');

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

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    console.warn("Navigation toggle/menu not found.");
  }

}); // End DOMContentLoaded listener
