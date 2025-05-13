export const sectionNav = {
    upButton: null,
    downButton: null,
    indicatorRow: null,
    sections: [],
    currentSectionIndex: 0,
    isSmoothScrolling: false,
  
    init: function () {
      this.upButton = document.querySelector('[data-section-nav="up"]');
      this.downButton = document.querySelector('[data-section-nav="down"]');
      this.indicatorRow = document.querySelector('[data-section-nav="indicator"]');
      this.sections = Array.from(document.querySelectorAll('section')).filter(
        (el) => el.offsetParent !== null
      );
  
      if (!this.upButton || !this.downButton || !this.indicatorRow || this.sections.length < 2) {
        console.warn('[sectionNav] Not enough sections or missing nav elements.');
        return;
      }
  
      this.upButton.addEventListener('click', () =>
        this.scrollToSection(this.currentSectionIndex - 1)
      );
      this.downButton.addEventListener('click', () =>
        this.scrollToSection(this.currentSectionIndex + 1)
      );
      window.addEventListener('scroll', this.updateIndicatorOnScroll.bind(this));
  
      this.updateButtons();
      this.updateIndicator();
    },
  
    updateButtons: function () {
      this.upButton.setAttribute(
        'aria-disabled',
        this.currentSectionIndex === 0 ? 'true' : 'false'
      );
      this.downButton.setAttribute(
        'aria-disabled',
        this.currentSectionIndex === this.sections.length - 1 ? 'true' : 'false'
      );
    },
  
    updateIndicator: function () {
      const indicatorWidth = this.indicatorRow.offsetWidth;
      const afterWidth = parseFloat(getComputedStyle(this.indicatorRow, '::after').width);
      const maxMovement = indicatorWidth - afterWidth;
      const step = maxMovement / (this.sections.length - 1);
      const position = step * this.currentSectionIndex;
      this.indicatorRow.style.setProperty('--indicator-position', `${position}px`);
    },
  
    updateIndicatorOnScroll: function () {
      if (this.isSmoothScrolling) return;
  
      const totalScrollableHeight =
        this.sections[this.sections.length - 1].offsetTop - this.sections[0].offsetTop;
      const scrollPosition = window.scrollY - this.sections[0].offsetTop;
      const scrollRatio = Math.max(0, Math.min(scrollPosition / totalScrollableHeight, 1));
  
      const indicatorWidth = this.indicatorRow.offsetWidth;
      const afterWidth = parseFloat(getComputedStyle(this.indicatorRow, '::after').width);
      const maxMovement = indicatorWidth - afterWidth;
      const position = maxMovement * scrollRatio;
      this.indicatorRow.style.setProperty('--indicator-position', `${position}px`);
  
      const sectionOffsets = this.sections.map(
        (section) => section.getBoundingClientRect().top + window.scrollY
      );
      const midpoint = window.scrollY + window.innerHeight / 2;
  
      const newIndex = sectionOffsets.findIndex((offset, i) => {
        const nextOffset = sectionOffsets[i + 1] || Infinity;
        return midpoint >= offset && midpoint < nextOffset;
      });
  
      if (newIndex !== -1 && newIndex !== this.currentSectionIndex) {
        this.currentSectionIndex = newIndex;
        this.updateButtons();
      }
    },
  
    scrollToSection: function (index) {
      if (index >= 0 && index < this.sections.length) {
        this.currentSectionIndex = index;
        this.isSmoothScrolling = true;
        this.sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.updateIndicator();
        setTimeout(() => {
          this.isSmoothScrolling = false;
        }, 500);
        this.updateButtons();
      }
    },
  };
  