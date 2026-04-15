/**
 * Cyber Samurai Software Solutions - jQuery Interactions
 * All custom interactions use jQuery only (no vanilla JavaScript)
 */

$(document).ready(function () {

  // Smooth scroll to anchor links
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80
      }, 1000, 'swing');
    }
  });

  // Back to top button
  var $backToTop = $('<div class="back-to-top text-center pt-2"><i class="fas fa-arrow-up"></i></div>');
  $('body').append($backToTop);

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $backToTop.fadeIn();
    } else {
      $backToTop.fadeOut();
    }
  });

  $backToTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  // Projects filter functionality
  if ($('.filter-btn').length) {
    $('.filter-btn').on('click', function () {
      var filter = $(this).data('filter');

      // Update active state
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');

      // Filter projects
      if (filter === 'all') {
        $('.project-item').fadeIn(500);
      } else {
        $('.project-item').each(function () {
          if ($(this).data('category') === filter) {
            $(this).fadeIn(500);
          } else {
            $(this).fadeOut(300);
          }
        });
      }
    });
  }

  // Contact form validation and submission
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    var name = $('#name').val().trim();
    var email = $('#email').val().trim();
    var subject = $('#subject').val().trim();
    var message = $('#message').val().trim();

    // Remove previous error messages
    $('.error-message').remove();
    $('.form-control').removeClass('is-invalid');

    // Validate name
    if (name === '') {
      showError('#name', 'Name is required');
      isValid = false;
    }

    // Validate email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      showError('#email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('#email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate subject
    if (subject === '') {
      showError('#subject', 'Subject is required');
      isValid = false;
    }

    // Validate message
    if (message === '') {
      showError('#message', 'Message is required');
      isValid = false;
    }

    if (isValid) {
      // Simulate form submission
      var $alert = $('<div class="alert alert-success alert-dismissible fade show" role="alert">' +
        '<strong>Success!</strong> Your message has been sent. We will get back to you soon.' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
        '</div>');

      $('#contactForm').before($alert);
      $('#contactForm')[0].reset();

      // Auto-dismiss alert after 5 seconds
      setTimeout(function () {
        $alert.fadeOut(function () {
          $(this).remove();
        });
      }, 5000);

      // Scroll to alert
      $('html, body').animate({
        scrollTop: $alert.offset().top - 100
      }, 500);
    }
  });

  // Helper function to show error messages
  function showError(selector, message) {
    var $error = $('<div class="error-message text-danger small mt-1">' + message + '</div>');
    $(selector).addClass('is-invalid').after($error);
  }

  // Blog search/filter
  if ($('#blogSearch').length) {
    $('#blogSearch').on('keyup', function () {
      var searchTerm = $(this).val().toLowerCase();

      $('.blog-post').each(function () {
        var title = $(this).find('.blog-title').text().toLowerCase();
        var excerpt = $(this).find('.blog-excerpt').text().toLowerCase();
        var content = title + ' ' + excerpt;

        if (content.indexOf(searchTerm) !== -1) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(300);
        }
      });
    });
  }

  // Blog category filter
  if ($('.blog-category').length) {
    $('.blog-category').on('click', function () {
      var category = $(this).data('category');

      $('.blog-category').removeClass('active');
      $(this).addClass('active');

      if (category === 'all') {
        $('.blog-post').fadeIn(300);
      } else {
        $('.blog-post').each(function () {
          if ($(this).data('category') === category) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(300);
          }
        });
      }
    });
  }

  // Timeline expand/collapse
  $('.timeline-toggle').on('click', function () {
    var $content = $(this).siblings('.timeline-details');
    var $icon = $(this).find('i');

    if ($content.is(':visible')) {
      $content.slideUp(300);
      $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else {
      $content.slideDown(300);
      $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
  });

  // Gallery lightbox
  // $('.gallery-item img').on('click', function () {
  //   var imgSrc = $(this).attr('src');
  //   var imgAlt = $(this).attr('alt') || 'Image';

  //   var modalHtml = '<div class="modal fade" id="galleryModal" tabindex="-1">' +
  //     '<div class="modal-dialog modal-lg modal-dialog-centered">' +
  //     '<div class="modal-content">' +
  //     '<div class="modal-header">' +
  //     '<h5 class="modal-title">' + imgAlt + '</h5>' +
  //     '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>' +
  //     '</div>' +
  //     '<div class="modal-body text-center">' +
  //     '<img src="' + imgSrc + '" class="img-fluid" alt="' + imgAlt + '">' +
  //     '</div>' +
  //     '</div>' +
  //     '</div>' +
  //     '</div>';

  //   $('body').append(modalHtml);
  //   var modal = new bootstrap.Modal(document.getElementById('galleryModal'));
  //   modal.show();

  //   // Remove modal from DOM after it's hidden
  //   $('#galleryModal').on('hidden.bs.modal', function () {
  //     $(this).remove();
  //   });
  // });

  // Project gallery lightbox
  var currentImageIndex = 0;
  var galleryImages = [];

  $('.project-gallery img').on('click', function () {
    galleryImages = [];
    $('.project-gallery img').each(function () {
      galleryImages.push({
        src: $(this).attr('src'),
        alt: $(this).attr('alt') || 'Project Image'
      });
    });
    currentImageIndex = $(this).closest('[class]').index();
    openGalleryModal(currentImageIndex);
  });

  function buildThumbs(activeIdx) {
    var html = '';
    $.each(galleryImages, function (i, img) {
      html += '<img src="' + img.src + '" alt="' + img.alt + '" ' +
        'class="gallery-thumb' + (i === activeIdx ? ' gallery-thumb-active' : '') + '" ' +
        'data-idx="' + i + '" ' +
        'style="height:70px;width:90px;object-fit:cover;border-radius:6px;cursor:pointer;' +
        'border:2px solid ' + (i === activeIdx ? '#0d6efd' : 'transparent') + ';' +
        'opacity:' + (i === activeIdx ? '1' : '0.55') + ';' +
        'transition:all .2s;">';
    });
    return html;
  }

  function openGalleryModal(index) {
    if (!galleryImages[index]) return;
    currentImageIndex = index;

    // If modal already exists just update its contents
    if ($('#projectGalleryModal').length) {
      updateGalleryModal(index);
      return;
    }

    // Build thumbnail strip
    var thumbsHtml = buildThumbs(index);

    var modalHtml =
      '<div class="modal fade" id="projectGalleryModal" tabindex="-1" style="background:rgba(0,0,0,.92);">' +
      '<div class="modal-dialog m-0 p-0" style="max-width:100%;width:100%;height:100vh;display:flex;flex-direction:column;">' +
      '<div class="modal-content border-0 rounded-0" style="flex:1;display:flex;flex-direction:column;height:100vh;background:transparent;">' +

      // Header
      '<div class="modal-header border-0 px-4 py-2" style="background:rgba(0,0,0,.6);flex-shrink:0;">' +
      '<h6 class="modal-title text-white mb-0" id="galleryModalLabel">' +
      galleryImages[index].alt + ' &nbsp;<span class="text-white-50">(' + (index + 1) + ' / ' + galleryImages.length + ')</span>' +
      '</h6>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +

      // Main image viewer
      '<div class="modal-body d-flex align-items-center justify-content-center p-0 position-relative" id="galleryViewport" style="flex:1;overflow:hidden;min-height:0;">' +

      // Prev arrow
      '<button id="galleryPrev" class="btn position-absolute start-0 top-50 translate-middle-y ms-3" ' +
      'style="z-index:10;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:1.6rem;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;' +
      (index === 0 ? 'visibility:hidden;' : '') + '">' +
      '<i class="fas fa-chevron-left"></i>' +
      '</button>' +

      '<img id="galleryMainImg" src="' + galleryImages[index].src + '" alt="' + galleryImages[index].alt + '" ' +
      'style="max-height:100%;max-width:100%;object-fit:contain;transition:opacity .25s;">' +

      // Next arrow
      '<button id="galleryNext" class="btn position-absolute end-0 top-50 translate-middle-y me-3" ' +
      'style="z-index:10;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:1.6rem;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;' +
      (index >= galleryImages.length - 1 ? 'visibility:hidden;' : '') + '">' +
      '<i class="fas fa-chevron-right"></i>' +
      '</button>' +
      '</div>' +

      // Thumbnail strip
      '<div id="galleryThumbStrip" style="flex-shrink:0;background:rgba(0,0,0,.7);padding:10px 16px;display:flex;gap:8px;overflow-x:auto;align-items:center;justify-content:center;">' +
      thumbsHtml +
      '</div>' +

      '</div>' +
      '</div>' +
      '</div>';

    $('body').append(modalHtml);
    var bsModal = new bootstrap.Modal(document.getElementById('projectGalleryModal'), { backdrop: 'static' });
    bsModal.show();

    // Delegated thumb click
    $(document).on('click.galleryThumb', '.gallery-thumb', function () {
      updateGalleryModal(parseInt($(this).data('idx')));
    });

    // Arrow clicks
    $(document).on('click.galleryNav', '#galleryPrev', function () {
      if (currentImageIndex > 0) updateGalleryModal(currentImageIndex - 1);
    });
    $(document).on('click.galleryNav', '#galleryNext', function () {
      if (currentImageIndex < galleryImages.length - 1) updateGalleryModal(currentImageIndex + 1);
    });

    // Keyboard navigation
    $(document).on('keydown.galleryKeys', function (e) {
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) updateGalleryModal(currentImageIndex - 1);
      if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) updateGalleryModal(currentImageIndex + 1);
    });

    // Cleanup on close
    $('#projectGalleryModal').on('hidden.bs.modal', function () {
      $(document).off('click.galleryThumb click.galleryNav keydown.galleryKeys');
      $(this).remove();
    });
  }

  function updateGalleryModal(index) {
    if (!galleryImages[index]) return;
    currentImageIndex = index;
    var img = galleryImages[index];

    // Fade-swap main image
    var $main = $('#galleryMainImg');
    $main.fadeTo(150, 0, function () {
      $main.attr('src', img.src).attr('alt', img.alt).fadeTo(200, 1);
    });

    // Update title
    $('#galleryModalLabel').html(img.alt + ' &nbsp;<span class="text-white-50">(' + (index + 1) + ' / ' + galleryImages.length + ')</span>');

    // Update arrow visibility
    $('#galleryPrev').css('visibility', index === 0 ? 'hidden' : 'visible');
    $('#galleryNext').css('visibility', index >= galleryImages.length - 1 ? 'hidden' : 'visible');

    // Update thumbnails
    $('#galleryThumbStrip').html(buildThumbs(index));

    // Scroll active thumb into view
    var $strip = $('#galleryThumbStrip');
    var $active = $strip.find('.gallery-thumb-active');
    if ($active.length) {
      $strip[0].scrollLeft = $active[0].offsetLeft - $strip[0].clientWidth / 2 + $active[0].clientWidth / 2;
    }
  }

  // Lazy load images (fallback for browsers that don't support native lazy loading)
  if ('loading' in HTMLImageElement.prototype === false) {
    $('img[loading="lazy"]').each(function () {
      var $img = $(this);
      var src = $img.data('src') || $img.attr('src');

      var imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            $img.attr('src', src);
            observer.unobserve(entry.target);
          }
        });
      });

      imageObserver.observe(this);
    });
  }

  // Fade in elements on scroll
  function fadeInOnScroll() {
    $('.fade-in-on-scroll').each(function () {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).addClass('fade-in');
      }
    });
  }

  $(window).on('scroll', fadeInOnScroll);
  fadeInOnScroll(); // Initial check

  // owl cerosel
  if ($('.owl-carousel').length && typeof $.fn.owlCarousel === 'function') {
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      responsiveClass: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1,
          nav: false,
          loop: true
        },
        600: {
          items: 2,
          nav: false,
          loop: true
        },
        1000: {
          items: 1,
          nav: false,
          loop: true
        }
      }
    });
  }

  // Certificate modal — triggered by "View Certificate" button
  $(document).off('click', '.view-cert-btn').on('click', '.view-cert-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $card = $(this).closest('.certificate-card');
    var certImage = $card.data('image');
    var certTitle = $card.find('.cert-title').text().trim();
    var certOrg = $card.find('.cert-org').text().trim();
    var certDate = $card.find('.cert-date').text().trim();

    // Remove any existing modal
    var $existing = $('#certModal');
    if ($existing.length) {
      bootstrap.Modal.getInstance(document.getElementById('certModal')) && bootstrap.Modal.getInstance(document.getElementById('certModal')).dispose();
      $existing.remove();
    }

    var modalHtml =
      '<div class="modal fade" id="certModal" tabindex="-1" role="dialog" aria-labelledby="certModalLabel" aria-modal="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<h5 class="modal-title" id="certModalLabel">' + certTitle + '</h5>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '</div>' +
      '<div class="modal-body text-center py-4">' +
      '<p class="text-accent mb-3">' +
      '<i class="fas fa-building me-1"></i>' + certOrg +
      ' &nbsp;|&nbsp; ' +
      '<i class="fas fa-calendar me-1"></i>' + certDate +
      '</p>' +
      '<img src="' + certImage + '" class="img-fluid rounded shadow" alt="' + certTitle + '" style="max-height:65vh;width:auto;">' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    $('body').append(modalHtml);

    var certModalEl = document.getElementById('certModal');
    var certModal = new bootstrap.Modal(certModalEl, { keyboard: true });
    certModal.show();

    certModalEl.addEventListener('hidden.bs.modal', function () {
      certModal.dispose();
      $('#certModal').remove();
    });
  });

  // Load more projects (pagination)
  var projectsToShow = 6;
  var $projectItems = $('.project-item');

  if ($projectItems.length > projectsToShow) {
    $projectItems.slice(projectsToShow).hide();

    $('#loadMoreProjects').on('click', function () {
      $projectItems.filter(':hidden').slice(0, projectsToShow).fadeIn(500);

      if ($projectItems.filter(':hidden').length === 0) {
        $(this).fadeOut();
      }
    });
  } else {
    $('#loadMoreProjects').hide();
  }

  // Team member bio modal
  $('.view-bio-btn').on('click', function (e) {
    e.stopPropagation();
    var $card = $(this).closest('.team-member-card');
    var bio = $card.data('bio');
    var name = $card.find('.card-title').text();
    var role = $card.find('.text-accent').text();
    var photo = $card.find('.team-photo').attr('src');

    var modalHtml = '<div class="modal fade" id="teamBioModal" tabindex="-1">' +
      '<div class="modal-dialog modal-dialog-centered">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<h5 class="modal-title">' + name + '</h5>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>' +
      '</div>' +
      '<div class="modal-body text-center">' +
      (photo ? '<img src="' + photo + '" class="img-circle mb-3" alt="' + name + '" style="width: 150px; height: 150px;">' : '') +
      '<p class="text-accent mb-3">' + role + '</p>' +
      '<p class="text-secondary">' + bio + '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    $('body').append(modalHtml);
    var modal = new bootstrap.Modal(document.getElementById('teamBioModal'));
    modal.show();

    $('#teamBioModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  });

});


// admin

$(document).ready(function () {
  // Sidebar toggle for mobile
  $('#sidebarToggle').on('click', function (e) {
    e.stopImmediatePropagation();
    $('#adminSidebar').toggleClass('show');
  });

  // Update stats (simulated)
  // In a real app, these would come from an API
});

// Global Admin Table Helper
window.AdminTable = function(config) {
    this.data = config.data || [];
    this.tableBody = $(config.tableBody);
    this.wrap = this.tableBody.closest('.ma-admin-table-wrap');
    this.rowRender = config.rowRender;
    this.searchFields = config.searchFields || ['title'];
    this.sortField = config.sortField || 'title';
    this.state = { page: 1, limit: 5, search: '', sortDir: 'asc' };

    var self = this;

    // Initialize arrows style
    this.wrap.find('.ma-sort-arrow').removeClass('active text-accent').addClass('text-secondary');
    this.wrap.find('.ma-sort-arrow[data-dir="asc"]').removeClass('text-secondary').addClass('active text-accent');

    // Fix mobile layout gap that causes Sort controls to overflow on small screens
    this.wrap.find('.gap-5').removeClass('gap-5').addClass('gap-2 gap-sm-4 flex-wrap justify-content-between');

    // Ensure arrows remain side by side
    this.wrap.find('.ma-sort-controls').css({
        'display': 'inline-flex',
        'flex-wrap': 'nowrap',
        'align-items': 'center',
        'gap': '4px'
    });

    // Fix clickability issues globally by padding, and ensuring pointer events
    this.wrap.find('.ma-sort-arrow')
        .addClass('small')
        .css({
            'font-size': '',
            'padding': '0.2rem',
            'cursor': 'pointer',
            'pointer-events': 'auto',
            'position': 'relative',
            'z-index': '10',
            'transition': 'all 0.2s ease'
        });

    // Delegated Events for robustness
    this.wrap.on('mouseenter', '.ma-sort-arrow', function() { 
        if (!$(this).hasClass('active')) {
            $(this).removeClass('text-secondary').css('color', 'var(--accent-silver)');
        }
    });

    this.wrap.on('mouseleave', '.ma-sort-arrow', function() { 
        if (!$(this).hasClass('active')) {
            $(this).addClass('text-secondary').css('color', '');
        }
    });

    this.wrap.on('change', '.js-admin-entries', function() { self.state.limit = parseInt($(this).val()); self.state.page = 1; self.render(); });
    this.wrap.on('input', '.js-admin-search', function() { self.state.search = $(this).val().toLowerCase(); self.state.page = 1; self.render(); });
    
    this.wrap.on('click', '.ma-sort-arrow', function(e) { 
        e.preventDefault();
        e.stopPropagation();
        self.wrap.find('.ma-sort-arrow').removeClass('active text-accent').addClass('text-secondary').css('color', ''); 
        $(this).removeClass('text-secondary').addClass('active text-accent').css('color', '');
        self.state.sortDir = $(this).data('dir'); 
        self.render(); 
    });
    this.wrap.on('click', '.js-admin-pagination .page-link', function(e) {
        e.preventDefault();
        var p = $(this).data('page');
        if (p && !$(this).parent().hasClass('disabled')) {
            self.state.page = p;
            self.render();
        }
    });

    this.setData = function(newData) {
        this.data = newData;
        this.render();
    };

    this.render = function() {
        var filtered = this.data.map(function(item, idx) { return { item: item, origIndex: idx }; });
        
        if (this.state.search) {
            var searchStr = this.state.search;
            var sf = this.searchFields;
            filtered = filtered.filter(function(row) {
                return sf.some(function(field) {
                    return row.item[field] && String(row.item[field]).toLowerCase().indexOf(searchStr) > -1;
                });
            });
        }
        
        var sortF = this.sortField;
        var dir = this.state.sortDir;
        filtered.sort(function(a, b) {
            var valA = String(a.item[sortF]).toLowerCase();
            var valB = String(b.item[sortF]).toLowerCase();
            if (valA < valB) return dir === 'asc' ? -1 : 1;
            if (valA > valB) return dir === 'asc' ? 1 : -1;
            return 0;
        });

        var total = filtered.length;
        var totalPages = Math.ceil(total / this.state.limit) || 1;
        if (this.state.page > totalPages) this.state.page = totalPages || 1;
        var start = (this.state.page - 1) * this.state.limit;
        var paginated = filtered.slice(start, start + this.state.limit);

        this.tableBody.empty();
        paginated.forEach(function (data) {
            self.tableBody.append(self.rowRender(data.item, data.origIndex));
        });

        this.wrap.find('.js-admin-footer-info').text('Showing ' + (total === 0 ? 0 : start + 1) + ' to ' + Math.min(start + this.state.limit, total) + ' of ' + total + ' entries');
        var pageHtml = '';
        pageHtml += '<li class="page-item ' + (this.state.page === 1 ? 'disabled' : '') + '"><a class="page-link bg-dark text-light border-secondary" href="#" data-page="' + (this.state.page - 1) + '">Previous</a></li>';
        
        var dStart = Math.max(1, this.state.page - 1);
        var dEnd = Math.min(totalPages, this.state.page + 1);
        if (this.state.page === 1) dEnd = Math.min(totalPages, 3);
        if (this.state.page === totalPages) dStart = Math.max(1, totalPages - 2);

        var pages = [];
        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= dStart && i <= dEnd)) {
                pages.push(i);
            }
        }
        
        var pagesWithDots = [];
        var l;
        for (var p = 0; p < pages.length; p++) {
            if (l) {
                if (pages[p] - l === 2) {
                    pagesWithDots.push(l + 1);
                } else if (pages[p] - l !== 1) {
                    pagesWithDots.push('...');
                }
            }
            pagesWithDots.push(pages[p]);
            l = pages[p];
        }

        pagesWithDots.forEach(function(i) {
            if (i === '...') {
                pageHtml += '<li class="page-item disabled"><span class="page-link bg-dark text-light border-secondary">...</span></li>';
            } else {
                pageHtml += '<li class="page-item ' + (self.state.page === i ? 'active' : '') + '"><a class="page-link ' + (self.state.page === i ? 'bg-primary border-primary text-white' : 'bg-dark text-light border-secondary') + '" href="#" data-page="' + i + '">' + i + '</a></li>';
            }
        });

        pageHtml += '<li class="page-item ' + (this.state.page === totalPages ? 'disabled' : '') + '"><a class="page-link bg-dark text-light border-secondary" href="#" data-page="' + (this.state.page + 1) + '">Next</a></li>';
        this.wrap.find('.js-admin-pagination').html(pageHtml);
    };
};

// Seed dummy data for preview purposes
function seedDummyData() {
    // Clear once if missing IDs (to ensure smooth update)
    if (localStorage.getItem('adminProjects') && JSON.parse(localStorage.getItem('adminProjects')).length > 0 && !JSON.parse(localStorage.getItem('adminProjects'))[0].id) {
        localStorage.clear();
    }

    // Projects
    if (!localStorage.getItem('adminProjects') || JSON.parse(localStorage.getItem('adminProjects')).length < 50) {
        var projects = [];
        var categories = ['web', 'mobile', 'backend', 'automation'];
        var techs = ['React', 'Node.js', 'Python', 'Docker', 'AWS', 'MongoDB', 'TypeScript', 'PHP'];
        for(var i=1; i<=55; i++) {
            projects.push({
                id: 'PRJ-' + (1000 + i),
                title: 'Cyber Project ' + i,
                category: categories[i % 4],
                description: 'A comprehensive project demonstrating modern architecture and design principles.',
                techStack: [techs[i % techs.length], techs[(i+1) % techs.length]],
                liveLink: 'https://example.com',
                githubLink: 'https://github.com/example',
                thumbnail: '',
                gallery: []
            });
        }
        localStorage.setItem('adminProjects', JSON.stringify(projects));
    }

    // Blog Posts
    if (!localStorage.getItem('adminBlogPosts') || JSON.parse(localStorage.getItem('adminBlogPosts')).length < 50) {
        var blogs = [];
        var bCats = ['web', 'mobile', 'automation', 'tutorial', 'news'];
        for(var i=1; i<=55; i++) {
            blogs.push({
                id: 'BLG-' + (1000 + i),
                title: 'Development Insights ' + i,
                category: bCats[i % 5],
                description: 'Deep dive into modern software engineering practices.',
                content: 'This is the detailed content for post ' + i,
                thumbnail: '',
                wordCount: 350 + (i * 10),
                date: new Date(Date.now() - i * 86400000).toISOString()
            });
        }
        localStorage.setItem('adminBlogPosts', JSON.stringify(blogs));
    }

    // Testimonials
    if (!localStorage.getItem('adminTestimonials') || JSON.parse(localStorage.getItem('adminTestimonials')).length < 50) {
        var tests = [];
        for(var i=1; i<=55; i++) {
            tests.push({
                id: 'TST-' + (1000 + i),
                name: 'Client Name ' + i,
                company: 'Tech Corp ' + i,
                role: 'Director of Engineering',
                rating: (i % 2 === 0) ? 5 : 4,
                text: 'Outstanding delivery and exceptional code quality! Highly recommended partner.',
                date: new Date().toISOString()
            });
        }
        localStorage.setItem('adminTestimonials', JSON.stringify(tests));
    }

    // Services
    if (!localStorage.getItem('adminServices') || JSON.parse(localStorage.getItem('adminServices')).length < 50) {
        var srvs = [];
        var icons = ['globe', 'mobile-alt', 'server', 'shield-alt', 'cloud', 'code'];
        for(var i=1; i<=55; i++) {
            srvs.push({
                id: 'SRV-' + (1000 + i),
                title: 'Enterprise Service ' + i,
                description: 'We offer robust and scalable solutions tailored for your business needs using ' + icons[i%6] + ' technologies.',
                icon: icons[i % 6],
                pricing: 'Starting at $' + (999 + i*100)
            });
        }
        localStorage.setItem('adminServices', JSON.stringify(srvs));
    }

    // Certifications
    if (!localStorage.getItem('adminCertifications') || JSON.parse(localStorage.getItem('adminCertifications')).length < 50) {
        var certs = [];
        var months = ['January', 'March', 'June', 'September', 'November'];
        for(var i=1; i<=55; i++) {
            certs.push({
                id: 'CRT-' + (1000 + i),
                title: 'Certified Professional ' + i,
                org: 'Global Standard Board',
                year: 2020 + (i % 5),
                month: months[i % 5],
                image: ''
            });
        }
        localStorage.setItem('adminCertifications', JSON.stringify(certs));
    }
}
seedDummyData();