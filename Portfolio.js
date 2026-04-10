/* ── Viewport scaling ── */
function applyScale() {
    const scale = window.innerWidth / 1920;
    document.documentElement.style.setProperty('--site-scale', scale);
    const nav = document.querySelector('.nav');
    if (nav) {
      // Natural nav height × scale = its true visual height on screen
      const navVisualHeight = nav.offsetHeight * scale;
      document.documentElement.style.setProperty('--nav-visual-height', navVisualHeight + 'px');
    }
    // Let #site-wrapper grow to its natural content height.
    // Only compensate body so the scaled wrapper's visual height fills the viewport.
    const wrapper = document.getElementById('site-wrapper');
    if (wrapper) {
      wrapper.style.height = '';  // clear any previously set height
      // After layout, sync body height to the wrapper's scaled visual height
      requestAnimationFrame(function () {
        const naturalHeight = wrapper.scrollHeight;
        document.body.style.height = (naturalHeight * scale) + 'px';
      });
    }
  }
  applyScale();
  window.addEventListener('resize', applyScale);
})();
document.addEventListener('DOMContentLoaded', () => {

  /* ─── LUCIDE ─── */
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* ─── GEAR (only runs if the element exists) ─── */
  const gear = document.getElementById('Gear_Wheel');
  if (gear) {
    let gearTimer = null, gearPaused = false;
    const gearHover = document.getElementById('gear-hover-target');
    if (gearHover) {
      gearHover.addEventListener('mouseenter', () => {
        clearTimeout(gearTimer);
        gear.style.animationDuration = '12s';
        gearTimer = setTimeout(() => {
          gear.style.animationPlayState = 'paused';
          gearPaused = true;
        }, 800);
      });
      gearHover.addEventListener('mouseleave', () => {
        clearTimeout(gearTimer);
        gear.style.animationPlayState = 'running';
        gear.style.animationDuration = '4s';
        gearPaused = false;
      });
    }
  }

  // --- Fullscreen detection for hero SVG ---
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      if (isFullscreen) {
        heroSection.classList.add('fullscreen');
      } else {
        heroSection.classList.remove('fullscreen');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    handleFullscreenChange();
  }

  /* ─── NAVIGATION ─── */
/* ─── NAVIGATION ─── */
const items = document.querySelectorAll(".nav-item");
const indicator = document.getElementById("indicator");
const indicatorWidth = 30;

function moveIndicator(item) {
  const manualX = item.dataset.indicatorX;
  if (manualX) {
    indicator.setAttribute("x", manualX);
  } else {
    const box = item.getBBox();
    const centerX = box.x + box.width / 2;
    indicator.setAttribute("x", centerX - indicatorWidth / 2);
  }
  indicator.setAttribute("width", indicatorWidth);
}

// Global fullscreen state tracker
let isFullscreenMode = false;

// Per-section scroll stop offsets — normal view
const sectionScrollOffsets = {
  'hero': 0,                 // Hero section (top of page)
  'about': 60,             // Adjust offset for About section
  'portfolio': 140,          // Adjust offset for Portfolio section
  'services': 150,           // Adjust offset for Services section
  'contact': 60             // Adjust offset for Contact section
};

// Per-section scroll stop offsets — fullscreen view
const sectionScrollOffsetsFullscreen = {
  'hero': 0,                 // Hero section (top of page)
  'about': 100,              // Adjust offset for About section (fullscreen)
  'portfolio': 80,           // Adjust offset for Portfolio section (fullscreen)
  'services': 100,           // Adjust offset for Services section (fullscreen)
  'contact': 400              // Adjust offset for Contact section (fullscreen)
};

// Update fullscreen state on change
document.addEventListener('fullscreenchange', () => {
  isFullscreenMode = !!document.fullscreenElement;
});
document.addEventListener('webkitfullscreenchange', () => {
  isFullscreenMode = !!document.webkitFullscreenElement;
});
document.addEventListener('mozfullscreenchange', () => {
  isFullscreenMode = !!document.mozFullScreenElement;
});
document.addEventListener('MSFullscreenChange', () => {
  isFullscreenMode = !!document.msFullscreenElement;
});

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Use getBoundingClientRect so we get the *visual* (rendered) position,
  // not the DOM position which is offset by negative margins.
  const navEl = document.querySelector('.nav');
  const navHeight = navEl ? navEl.offsetHeight : 0;
  const visualTop = section.getBoundingClientRect().top + window.scrollY - navHeight;
  
  // Get custom offset based on fullscreen mode
  const offsetCollection = isFullscreenMode ? sectionScrollOffsetsFullscreen : sectionScrollOffsets;
  const customOffset = offsetCollection[sectionId] || 0;
  const finalScrollTop = visualTop + customOffset;

  window.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
}

const firstItem = document.getElementById("house");
if (firstItem) {
  moveIndicator(firstItem);
  firstItem.classList.add("active");
}

items.forEach(item => {
  item.addEventListener("click", () => {
    items.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    moveIndicator(item);
    
    // Get the section ID from the nav item's data attribute
    const sectionId = item.getAttribute("data-section");
    
    if (sectionId) {
      scrollToSection(sectionId);
    }
  });
});

  /* ─── THEME TOGGLE ─── */
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    document.querySelector('.sun-icon')?.classList.toggle('hidden', dark);
    document.querySelector('.moon-icon')?.classList.toggle('hidden', !dark);
  }
  if (themeBtn) {
    const saved = localStorage.getItem('theme');
    const lastSet = localStorage.getItem('themeLastSet');
    if (saved && lastSet === new Date().toDateString()) {
      applyTheme(saved === 'dark');
    } else {
      const h = new Date().getHours();
      applyTheme(h >= 19 || h < 7);
    }
    themeBtn.addEventListener('click', e => {
      const isDark = !document.body.classList.contains('dark-mode');
      applyTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      localStorage.setItem('themeLastSet', new Date().toDateString());
      const r = document.createElement('span');
      r.classList.add('ripple');
      const rect = themeBtn.getBoundingClientRect();
      const s = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - rect.left - s / 2}px;top:${e.clientY - rect.top - s / 2}px`;
      themeBtn.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  }

  /* ─── MOBILE MENU ─── */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileBtn.querySelector('.menu-icon')?.classList.toggle('hidden');
      mobileBtn.querySelector('.close-icon')?.classList.toggle('hidden');
    });
  }

  // ==================== PROJECTS DATA (FIXED SYNTAX) ====================
  const projectsData = [
    { id: 1, title: "Portfolio", description: "Complete Portfolio site which you are on now.", fullDescription: "This project involved a complete overhaul of an existing e-commerce platform. I conducted user research, created wireframes, designed high-fidelity mockups, and built a responsive frontend using React. The result was a 40% increase in conversion rate and a 25% decrease in bounce rate.", category: "Development", client: "Fashion Boutique", year: "2026", imageUrl:"https://digifloat.io/wp-content/uploads/2024/12/Royalty-Free-Illustrations-Twitter.jpg", link: "https://lynn-matthew.github.io/", galleryImages: ["Resources/Development/Portfolio/Portfolio.png"] },
    { id: 2, title: "Cheat Sheet - Adobe Illustrator", description: "Custom cheat sheet designed specifically for Adobe Illustrator.", category: "Print Design", client: "Poster", year: "2026", technologies: ["Adobe Illustrator"], imageUrl: "https://img.freepik.com/free-vector/tiny-graphic-designer-drawing-with-big-pen-computer-screen-creators-work-creative-woman-working-laptop-flat-vector-illustration-digital-design-concept-banner-landing-web-page_74855-25342.jpg?semt=ais_hybrid&w=740&q=80", link:"", galleryImages: ["Resources/Print-Design/Cheat-Sheet/Cheat-Sheet.jpg"] },
    { id: 3, title: "Queue Management System", description: "Responsive web design and development for an AI-powered productivity platform with dynamic interactions.", category: "Development", client: "FlowAI", year: "2026", imageUrl: "https://img.freepik.com/premium-vector/illustration-showing-hospital-building-with-several-ambulances-parked-front-it_697880-24512.jpg?semt=ais_incoming&w=740&q=80", link: "#", galleryImages: ["hosp/Screenshot (1).png", "hosp/Screenshot (2).png", "hosp/Screenshot (3).png","hosp/Screenshot (4).png","hosp/Screenshot (5).png","hosp/Screenshot (6).png","hosp/Screenshot (7).png","hosp/Screenshot (8).png","hosp/Screenshot (9).png","hosp/Screenshot (10).png","hosp/Screenshot (11).png","hosp/Screenshot (12).png","hosp/Screenshot (13).png","hosp/Screenshot (14).png","hosp/Screenshot (15).png"] },
  ];

  let currentCategory = "Top";
  let scrollY = 0;
  let maxScroll = 0;
  let clipHeight = 0;
  let contentHeight = 0;
  let animating = false;
  let animationFrame = null;

  // ==================== MODAL FUNCTIONS (DEFINED BEFORE USE) ====================
  let currentGallery = [];
  let currentImageIndex = 0;

  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.querySelector('.close-modal');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const imageCounter = document.getElementById('imageCounter');

  function updateModalImage() {
    if (modalImage && currentGallery[currentImageIndex]) {
      modalImage.src = currentGallery[currentImageIndex];
      if (imageCounter) imageCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
    }
  }

  function openGallery(images, startIndex = 0) {
    if (!images || images.length === 0) {
      showMessage('No additional images available for this project.');
      return;
    }
    currentGallery = images;
    currentImageIndex = startIndex;
    updateModalImage();
    if (modal) modal.classList.add('active');
  }

  function nextImage() {
    if (currentImageIndex < currentGallery.length - 1) {
      currentImageIndex++;
      updateModalImage();
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateModalImage();
    }
  }

  if (closeModal) closeModal.onclick = () => modal?.classList.remove('active');
  if (prevBtn) prevBtn.onclick = prevImage;
  if (nextBtn) nextBtn.onclick = nextImage;
  if (modal) modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

  document.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('active')) return;
    if (e.key === 'Escape') modal.classList.remove('active');
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Details Modal
  const detailsModal = document.getElementById('detailsModal');
  const detailsTitle = document.getElementById('detailsTitle');
  const detailsDescription = document.getElementById('detailsDescription');
  const detailsClient = document.getElementById('detailsClient');
  const detailsYear = document.getElementById('detailsYear');
  const detailsTech = document.getElementById('detailsTech');
  const detailsProjectLink = document.getElementById('detailsProjectLink');
  const closeDetailsBtn = document.getElementById('closeDetailsBtn');
  const closeDetailsSpan = document.querySelector('.close-details');
  let currentProjectLink = '#';

  function openDetailsModal(project) {
    if (detailsTitle) detailsTitle.textContent = project.title;
    if (detailsDescription) detailsDescription.textContent = project.fullDescription || project.description;
    if (detailsClient) detailsClient.textContent = project.client || 'Not specified';
    if (detailsYear) detailsYear.textContent = project.year || 'Not specified';
    currentProjectLink = project.link || '#';
    if (detailsTech) {
      detailsTech.innerHTML = '';
      if (project.technologies && project.technologies.length > 0) {
        project.technologies.forEach(tech => {
          const tag = document.createElement('span');
          tag.className = 'tech-tag';
          tag.textContent = tech;
          detailsTech.appendChild(tag);
        });
      } else {
        const noTech = document.createElement('span');
        noTech.className = 'detail-value';
        noTech.textContent = 'No technologies listed';
        detailsTech.appendChild(noTech);
      }
    }
    if (detailsModal) detailsModal.classList.add('active');
  }

  function closeDetailsModal() {
    if (detailsModal) detailsModal.classList.remove('active');
  }

  if (closeDetailsBtn) closeDetailsBtn.onclick = closeDetailsModal;
  if (closeDetailsSpan) closeDetailsSpan.onclick = closeDetailsModal;
  if (detailsProjectLink) {
    detailsProjectLink.onclick = () => {
      if (currentProjectLink && currentProjectLink !== '#') {
        window.open(currentProjectLink, '_blank');
      } else {
        showMessage('🔗 No project link available');
      }
    };
  }
  if (detailsModal) detailsModal.onclick = (e) => { if (e.target === detailsModal) closeDetailsModal(); };

  // ==================== BUTTON RIPPLE EFFECT ====================
  function addRippleEffect(buttonElement) {
    const rect = buttonElement.querySelector('rect');
    if (!rect) return;
    buttonElement.addEventListener('click', (e) => {
      const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const bbox = rect.getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;
      ripple.setAttribute('cx', centerX);
      ripple.setAttribute('cy', centerY);
      ripple.setAttribute('r', '5');
      ripple.setAttribute('fill', 'rgba(255,255,255,0.6)');
      ripple.setAttribute('stroke-width', '0');
      buttonElement.appendChild(ripple);
      let radius = 5;
      let opacity = 0.6;
      const animate = () => {
        radius += 8;
        opacity -= 0.05;
        ripple.setAttribute('r', radius);
        ripple.setAttribute('fill', `rgba(255,255,255,${opacity})`);
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          ripple.remove();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  // ==================== PROJECT CORE FUNCTIONS ====================
  function showMessage(msg) {
    const alertDiv = document.getElementById('svgAlert');
    if (alertDiv) {
      alertDiv.textContent = msg;
      alertDiv.style.opacity = '1';
      setTimeout(() => alertDiv.style.opacity = '0', 2000);
    }
  }

  function getFilteredProjects() {
    if (currentCategory === "Top") return projectsData;
    return projectsData.filter(p => p.category === currentCategory);
  }

  function clearOldImages() {
    for (let i = 1; i <= 6; i++) {
      let imageGroup;
      if (i === 1) imageGroup = document.querySelector('#Project-1 #Project-image');
      else if (i === 2) imageGroup = document.querySelector('#Project-2 #Project-image-2');
      else if (i === 3) imageGroup = document.querySelector('#Project-3 #Project-Image');
      else if (i === 4) imageGroup = document.querySelector('#Project-4 #Project-image-4');
      else if (i === 5) imageGroup = document.querySelector('#Project-5 #Project-image-5');
      else if (i === 6) imageGroup = document.querySelector('#Project-6 #Project-Image-6');
      if (imageGroup) {
        const oldImg = imageGroup.querySelector('image');
        if (oldImg) oldImg.remove();
      }
      const existingClip = document.querySelector(`#clipPath${i}`);
      if (existingClip) existingClip.remove();
    }
  }

  function updateScrollLimits() {
    const bgRect = document.getElementById('Background-2');
    if (!bgRect) return;
    const bboxRect = bgRect.getBBox();
    clipHeight = bboxRect.height;
    const scrollContent = document.getElementById('scrollable-content');
    if (!scrollContent) return;
    const contentBBox = scrollContent.getBBox();
    contentHeight = contentBBox.height + 190;
    maxScroll = Math.max(0, contentHeight - clipHeight);
    scrollY = Math.min(Math.max(scrollY, -maxScroll), 0);
    applyScrollTransform();
  }

  function applyScrollTransform() {
    const scrollContent = document.getElementById('scrollable-content');
    if (scrollContent) scrollContent.setAttribute('transform', `translate(0, ${scrollY})`);
  }

  function smoothScrollTo(targetY) {
    if (animating) return;
    const startY = scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 0.5) return;
    const startTime = performance.now();
    const duration = 300;
    function step(now) {
      const elapsed = now - startTime;
      let t = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const newY = startY + diff * ease;
      scrollY = newY;
      applyScrollTransform();
      if (t < 1) animationFrame = requestAnimationFrame(step);
      else {
        scrollY = targetY;
        applyScrollTransform();
        animating = false;
        animationFrame = null;
        updateScrollLimits();
      }
    }
    animating = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(step);
  }

  function toggleScroll() {
    if (animating) return;
    const epsilon = 5;
    const isAtTop = scrollY > -epsilon;
    const isAtBottom = scrollY <= -maxScroll + epsilon;
    let target;
    if (isAtTop && maxScroll > 0) target = -maxScroll;
    else target = 0;
    smoothScrollTo(target);
  }

  function updateProjectCards() {
    const filtered = getFilteredProjects();
    const projectsToShow = filtered.slice(0, 6);
    clearOldImages();

    for (let idx = 0; idx < projectsToShow.length; idx++) {
      const project = projectsToShow[idx];
      const cardNum = idx + 1;

      const titleElem = document.getElementById(`Project-Title${cardNum === 1 ? '' : cardNum === 2 ? '-2' : cardNum === 3 ? '-3' : cardNum === 4 ? '-4' : cardNum === 5 ? '-5' : '-6'}`);
      if (titleElem) {
        while (titleElem.firstChild) titleElem.removeChild(titleElem.firstChild);
        titleElem.textContent = project.title;
        titleElem.setAttribute("text-anchor", "middle");
      }

      const pathElem = document.getElementById(`imgPath${cardNum}`);
      if (!pathElem) continue;
      const bbox = pathElem.getBBox();
      const { x, y, width, height } = bbox;

      const clipId = `clipPath${cardNum}_${Date.now()}_${idx}`;
      const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      clipPath.setAttribute("id", clipId);
      const usePath = document.createElementNS("http://www.w3.org/2000/svg", "use");
      usePath.setAttribute("href", `#imgPath${cardNum}`);
      clipPath.appendChild(usePath);
      document.querySelector('svg').appendChild(clipPath);

      const svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
      svgImage.setAttribute("href", project.imageUrl);
      svgImage.setAttribute("x", x);
      svgImage.setAttribute("y", y);
      svgImage.setAttribute("width", width);
      svgImage.setAttribute("height", height);
      svgImage.setAttribute("preserveAspectRatio", "xMidYMid slice");
      svgImage.setAttribute("clip-path", `url(#${clipId})`);

      let imageGroup;
      if (cardNum === 1) imageGroup = document.querySelector('#Project-1 #Project-image');
      else if (cardNum === 2) imageGroup = document.querySelector('#Project-2 #Project-image-2');
      else if (cardNum === 3) imageGroup = document.querySelector('#Project-3 #Project-Image');
      else if (cardNum === 4) imageGroup = document.querySelector('#Project-4 #Project-image-4');
      else if (cardNum === 5) imageGroup = document.querySelector('#Project-5 #Project-image-5');
      else if (cardNum === 6) imageGroup = document.querySelector('#Project-6 #Project-Image-6');

      if (imageGroup) {
        imageGroup.insertBefore(svgImage, imageGroup.firstChild);
        svgImage.addEventListener('load', () => requestAnimationFrame(() => updateScrollLimits()));
      }

      const detailsBtn = document.querySelector(`#Project-${cardNum} #Details_button, #Project-${cardNum} #Details_button-${cardNum === 2 ? '2' : cardNum === 3 ? '3' : cardNum === 4 ? '4' : cardNum === 5 ? '5' : '6'}`);
      const linkBtn = document.querySelector(`#Project-${cardNum} #Link_button, #Project-${cardNum} #Link_button-${cardNum === 2 ? '2' : cardNum === 3 ? '3' : cardNum === 4 ? '4' : cardNum === 5 ? '5' : '6'}`);
      const imagesBtn = document.querySelector(`#Project-${cardNum} #Images_button, #Project-${cardNum} #Images_button-${cardNum === 2 ? '2' : cardNum === 3 ? '3' : cardNum === 4 ? '4' : cardNum === 5 ? '5' : '6'}`);

      if (detailsBtn) {
        const newDetails = detailsBtn.cloneNode(true);
        detailsBtn.parentNode.replaceChild(newDetails, detailsBtn);
        newDetails.addEventListener('click', (e) => {
          e.stopPropagation();
          openDetailsModal(project);
        });
        addRippleEffect(newDetails);
      }
      if (linkBtn) {
        const newLink = linkBtn.cloneNode(true);
        linkBtn.parentNode.replaceChild(newLink, linkBtn);
        newLink.addEventListener('click', (e) => {
          e.stopPropagation();
          if (project.link && project.link !== '#') window.open(project.link, '_blank');
          else showMessage(`🔗 Link for "${project.title}" – add your URL in projectsData`);
        });
        addRippleEffect(newLink);
      }
      if (imagesBtn) {
        const newImagesBtn = imagesBtn.cloneNode(true);
        imagesBtn.parentNode.replaceChild(newImagesBtn, imagesBtn);
        newImagesBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (project.galleryImages && project.galleryImages.length > 0) {
            openGallery(project.galleryImages, 0);
          } else {
            showMessage(`📸 No additional images for "${project.title}" yet.`);
          }
        });
        addRippleEffect(newImagesBtn);
      }
    }

    for (let i = projectsToShow.length + 1; i <= 6; i++) {
      const titleElem = document.getElementById(`Project-Title${i === 1 ? '' : i === 2 ? '-2' : i === 3 ? '-3' : i === 4 ? '-4' : i === 5 ? '-5' : '-6'}`);
      if (titleElem) {
        while (titleElem.firstChild) titleElem.removeChild(titleElem.firstChild);
        titleElem.textContent = "— No Project —";
      }
      let imageGroup;
      if (i === 1) imageGroup = document.querySelector('#Project-1 #Project-image');
      else if (i === 2) imageGroup = document.querySelector('#Project-2 #Project-image-2');
      else if (i === 3) imageGroup = document.querySelector('#Project-3 #Project-Image');
      else if (i === 4) imageGroup = document.querySelector('#Project-4 #Project-image-4');
      else if (i === 5) imageGroup = document.querySelector('#Project-5 #Project-image-5');
      else if (i === 6) imageGroup = document.querySelector('#Project-6 #Project-Image-6');
      if (imageGroup) {
        const oldImg = imageGroup.querySelector('image');
        if (oldImg) oldImg.remove();
      }
    }
    updateScrollLimits();
  }

  function initFilters() {
    const filterGroups = ['Top', 'Illustration', 'Printdesign', 'SocialMediaDesign', 'Development'];
    filterGroups.forEach(groupId => {
      const group = document.getElementById(groupId);
      if (!group) return;
      group.style.cursor = 'pointer';
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        let newCategory = "Top";
        if (groupId === 'Illustration') newCategory = "Illustration";
        else if (groupId === 'Printdesign') newCategory = "Print Design";
        else if (groupId === 'SocialMediaDesign') newCategory = "Social Media Design";
        else if (groupId === 'Development') newCategory = "Development";
        currentCategory = newCategory;
        filterGroups.forEach(g => {
          const rectElem = document.querySelector(`#${g} rect`);
          if (rectElem) rectElem.setAttribute('fill', '#927ea6');
        });
        const activeRect = document.querySelector(`#${groupId} rect`);
        if (activeRect) activeRect.setAttribute('fill', '#6b4e7e');
        updateProjectCards();
        showMessage(`Filter: ${currentCategory} (${getFilteredProjects().length} projects)`);
        scrollY = 0;
        applyScrollTransform();
        updateScrollLimits();
      });
    });
  }

  // ==================== LEVER INTERACTION ====================
  const leverFrames = [];
  for (let i = 0; i <= 23; i++) {
    leverFrames.push(document.getElementById(`frame-${i}`));
  }

  let currentLeverFrame = 0;
  let isDraggingLever = false;
  let snapBackTimer = null;
  const pivotY = 3114;
  const maxPullDist = 226;
  const TRIGGER_FRAME = 16;

  function showLeverFrame(index) {
    index = Math.min(Math.max(index, 0), leverFrames.length - 1);
    leverFrames.forEach((frame, i) => {
      if (frame) frame.style.display = i === index ? '' : 'none';
    });
    currentLeverFrame = index;
  }

  function getMouseY(event) {
    const svgElem = document.querySelector('.projects-svg');
    if (!svgElem) return 0;
    const pt = svgElem.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svgElem.getScreenCTM().inverse());
    return svgP.y;
  }

  function onLeverMouseDown(e) {
    if (!e.target.closest('.knob')) return;
    e.preventDefault();
    isDraggingLever = true;
    if (snapBackTimer) clearTimeout(snapBackTimer);
  }

  function onLeverMouseMove(e) {
    if (!isDraggingLever) return;
    const mouseY = getMouseY(e);
    let dragDist = mouseY - pivotY;
    dragDist = Math.min(Math.max(dragDist, 0), maxPullDist);
    const ratio = dragDist / maxPullDist;
    let frameIndex = Math.floor(ratio * (leverFrames.length - 1));
    if (frameIndex !== currentLeverFrame) showLeverFrame(frameIndex);
  }

  function onLeverMouseUp(e) {
    if (!isDraggingLever) return;
    isDraggingLever = false;
    const triggered = currentLeverFrame >= TRIGGER_FRAME;
    if (triggered) {
      toggleScroll();
      showMessage('🎰 JACKPOT!');
    }
    let idx = currentLeverFrame;
    function stepBack() {
      if (idx <= 0) {
        showLeverFrame(0);
        return;
      }
      idx--;
      showLeverFrame(idx);
      snapBackTimer = setTimeout(stepBack, 1);
    }
    stepBack();
  }

  const leverGroup = document.getElementById('new-lever');
  if (leverGroup) {
    leverGroup.addEventListener('mousedown', onLeverMouseDown);
    window.addEventListener('mousemove', onLeverMouseMove);
    window.addEventListener('mouseup', onLeverMouseUp);
    showLeverFrame(0);
  }

  // Initialize projects after DOM is ready
  setTimeout(() => {
    initFilters();
    updateProjectCards();
    const topRect = document.querySelector('#Top rect');
    if (topRect) topRect.setAttribute('fill', '#6b4e7e');
    updateScrollLimits();
  }, 100);

}); 
// SERVICES SECTION
// Click handler for navigation/modal (customizable)
const cards = ['Social-Media-Design', 'Illustration-2', 'Print_Design', 'Web-Dev'];
cards.forEach(cardId => {
  const card = document.getElementById(cardId);
  if (card) {
    card.addEventListener('click', () => {
      console.log(`${cardId} clicked — you can add navigation or modal here`);
      // Example: alert(`You clicked on ${cardId.replace('-', ' ')} service`);
    });
  }

// Gear for contact section (Gear_Wheel-4)
const contactGear = document.getElementById('Gear_Wheel-4');
if (contactGear) {
  // Compute the true bounding‑box center
  const bbox = contactGear.getBBox();
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;
  contactGear.style.transformOrigin = `${cx}px ${cy}px`;
  contactGear.style.animation = 'spin-4 4s linear infinite';
}

});
