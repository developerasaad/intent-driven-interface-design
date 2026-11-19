/* Formwork — shared interface behaviour. */

(function () {
  'use strict';

  const FW = window.FORMWORK;
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  document.documentElement.classList.add('js');

  const menuMarkup = `
    <dialog class="menu-dialog" id="menu-dialog" aria-labelledby="menu-title">
      <div class="menu">
        <div class="menu__top">
          <span class="wordmark" aria-hidden="true">formwork<span class="wordmark__dot">.</span></span>
          <button class="icon-btn icon-btn--text" type="button" data-menu-close>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <h2 class="sr-only" id="menu-title">Menu</h2>
        <nav class="menu__nav" aria-label="Mobile">
          <a href="index.html">Home <span class="mono">01</span></a>
          <a href="collection.html">Collection <span class="mono">02</span></a>
          <a href="studio.html">Studio <span class="mono">03</span></a>
          <a href="studio.html#visit">Visit <span class="mono">04</span></a>
          <a href="studio.html#contact">Contact <span class="mono">05</span></a>
        </nav>
        <div class="menu__foot">
          <p>418 SE Ash Street<br>Portland, OR 97214</p>
          <p><a href="mailto:studio@formwork.example">studio@formwork.example</a></p>
        </div>
      </div>
    </dialog>`;

  const enquiryMarkup = `
    <dialog class="dialog" id="enquiry-dialog" aria-labelledby="enquiry-title">
      <div class="dialog__inner">
        <div class="dialog__head">
          <p class="eyebrow">Enquiry</p>
          <button class="icon-btn" type="button" data-dialog-close aria-label="Close enquiry form">✕</button>
        </div>
        <h2 id="enquiry-title">Tell us what you are considering.</h2>
        <p class="dialog__piece" id="enquiry-piece-label" hidden></p>
        <p class="dialog__lede">Use this form to ask about a piece, a finish, or a visit to the studio.</p>
        <form class="form" id="enquiry-form" novalidate>
          <div class="field">
            <label for="enq-name">Name</label>
            <input id="enq-name" name="name" type="text" autocomplete="name" required data-error-required="Enter your name.">
            <p class="error" id="enq-name-error"></p>
          </div>
          <div class="field">
            <label for="enq-email">Email</label>
            <input id="enq-email" name="email" type="email" autocomplete="email" required data-error-required="Enter your email address.">
            <p class="error" id="enq-email-error"></p>
          </div>
          <div class="field">
            <label for="enq-message">Message <span class="optional">(optional)</span></label>
            <textarea id="enq-message" name="message" rows="4"></textarea>
            <p class="error" id="enq-message-error"></p>
          </div>
          <button class="btn btn--full" type="submit">Send enquiry</button>
          <p class="form-note">Demo site — this form does not send or store messages.</p>
        </form>
        <div class="form-success" id="enquiry-success" hidden tabindex="-1">
          <p class="eyebrow">Demo only</p>
          <h3>Nothing was sent.</h3>
          <p>This concept site has no backend. In a live site, your enquiry about <strong id="enquiry-success-piece">the studio</strong> would be delivered here.</p>
          <button class="btn btn--ghost" type="button" data-dialog-close>Close</button>
        </div>
      </div>
    </dialog>`;

  /* ---------------------------------------------------------------------- */
  /* Header                                                                  */
  /* ---------------------------------------------------------------------- */

  function initHeader() {
    const header = $('[data-header]');
    if (!header) return;

    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------------------------------------------------------------------- */
  /* Dialogs                                                                 */
  /* ---------------------------------------------------------------------- */

  function lockPage() {
    document.documentElement.classList.add('is-locked');
  }

  function unlockPage() {
    if (!$('dialog[open]')) document.documentElement.classList.remove('is-locked');
  }

  function initMenus() {
    const trigger = $('[data-menu-open]');
    if (!trigger) return;

    document.body.insertAdjacentHTML('beforeend', menuMarkup);
    const dialog = $('#menu-dialog');
    const close = $('[data-menu-close]', dialog);

    trigger.addEventListener('click', () => {
      if (dialog.open) return;
      dialog.showModal();
      lockPage();
      trigger.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => close.focus());
    });

    close.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => {
      trigger.setAttribute('aria-expanded', 'false');
      unlockPage();
      trigger.focus();
    });

    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('a[href]', dialog).forEach((link) => {
      const target = link.getAttribute('href').split('#')[0].toLowerCase();
      if (target === page) link.setAttribute('aria-current', 'page');
    });
  }

  function clearFormErrors(form) {
    $$('.field', form).forEach((field) => field.classList.remove('has-error'));
    $$('[aria-invalid]', form).forEach((input) => input.removeAttribute('aria-invalid'));
    $$('.error', form).forEach((error) => {
      error.textContent = '';
    });
  }

  function validateField(input) {
    const field = input.closest('.field');
    if (!field) return true;

    const error = $('.error', field);
    const value = input.value.trim();
    let message = '';

    if (input.required && !value) {
      message = input.dataset.errorRequired || 'This field is required.';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'Enter a valid email address.';
    } else if (input.minLength > 0 && value && value.length < input.minLength) {
      message = 'Please write at least ' + input.minLength + ' characters.';
    }

    if (message) {
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (error) error.textContent = message;
      return false;
    }

    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
    return true;
  }

  function initValidatedForm(form, onValid) {
    if (!form) return;

    const inputs = $$('input, textarea, select', form).filter((input) => input.type !== 'hidden');

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') validateField(input);
      });
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;

      inputs.forEach((input) => {
        const valid = validateField(input);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      onValid(form);
    });
  }

  function initEnquiry() {
    document.body.insertAdjacentHTML('beforeend', enquiryMarkup);

    const dialog = $('#enquiry-dialog');
    const form = $('#enquiry-form', dialog);
    const success = $('#enquiry-success', dialog);
    const pieceField = $('#enquiry-piece', dialog) || null;
    const pieceLabel = $('#enquiry-piece-label', dialog);
    const successPiece = $('#enquiry-success-piece', dialog);

    const open = (piece) => {
      form.reset();
      clearFormErrors(form);
      form.hidden = false;
      success.hidden = true;

      if (piece) {
        if (pieceField) pieceField.value = piece;
        pieceLabel.textContent = 'About: ' + piece;
        pieceLabel.hidden = false;
        successPiece.textContent = piece;
      } else {
        if (pieceField) pieceField.value = '';
        pieceLabel.hidden = true;
        successPiece.textContent = 'the studio';
      }

      if (!dialog.open) dialog.showModal();
      lockPage();
      requestAnimationFrame(() => $('#enq-name', dialog).focus());
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-enquiry]');
      if (!trigger) return;
      event.preventDefault();
      open(trigger.dataset.piece || '');
    });

    $$('[data-dialog-close]', dialog).forEach((button) => {
      button.addEventListener('click', () => dialog.close());
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', unlockPage);

    initValidatedForm(form, () => {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Scroll reveal                                                           */
  /* ---------------------------------------------------------------------- */

  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    items.forEach((item) => observer.observe(item));
  }

  /* ---------------------------------------------------------------------- */
  /* Catalogue cards                                                         */
  /* ---------------------------------------------------------------------- */

  function cardMarkup(product) {
    const href = 'product.html?id=' + encodeURIComponent(product.id);
    const cover = product.images[0];
    const position = product.imagePosition
      ? ' style="object-position:' + product.imagePosition + '"'
      : '';

    return (
      '<article class="card">' +
        '<a class="card__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + FW.image(cover.id, 900) + '" alt="" loading="lazy" width="900" height="1125"' + position + '>' +
        '</a>' +
        '<div class="card__body">' +
          '<div class="card__text">' +
            '<h3 class="card__name"><a href="' + href + '">' + product.name + '</a></h3>' +
            '<p class="card__meta">' + product.category + ' <span aria-hidden="true">·</span> ' + product.material + '</p>' +
          '</div>' +
          '<p class="card__price">' + FW.formatPrice(product.price) + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Collection page                                                         */
  /* ---------------------------------------------------------------------- */

  function initCollection() {
    const grid = $('#product-grid');
    if (!grid) return;

    const chips = $$('[data-filter]');
    const search = $('#search');
    const sort = $('#sort');
    const count = $('#result-count');
    const empty = $('#catalog-empty');
    const emptyQuery = $('#empty-query');
    const reset = $('#reset-filters');

    const params = new URLSearchParams(location.search);
    const categoryParam = (params.get('category') || '').toLowerCase();
    const initialCategory =
      FW.categories.find((category) => category.toLowerCase() === categoryParam) || 'All';

    const state = {
      category: initialCategory,
      query: params.get('q') || '',
      sort: params.get('sort') || 'featured'
    };

    if (search) search.value = state.query;
    if (sort) sort.value = state.sort;

    const allowedSorts = ['featured', 'price-asc', 'price-desc', 'name'];
    if (!allowedSorts.includes(state.sort)) state.sort = 'featured';

    function syncUrl() {
      const next = new URLSearchParams();
      if (state.category !== 'All') next.set('category', state.category.toLowerCase());
      if (state.query.trim()) next.set('q', state.query.trim());
      if (state.sort !== 'featured') next.set('sort', state.sort);

      const query = next.toString();
      const url = location.pathname + (query ? '?' + query : '');
      try {
        history.replaceState(null, '', url);
      } catch (error) {
        /* file:// histories can reject replaceState */
      }
    }

    function syncChips() {
      chips.forEach((chip) => {
        const active = chip.dataset.filter === state.category;
        chip.setAttribute('aria-pressed', active ? 'true' : 'false');
        chip.classList.toggle('is-active', active);
      });
    }

    function visibleProducts() {
      const query = state.query.trim().toLowerCase();

      const list = FW.products.filter((product) => {
        const inCategory = state.category === 'All' || product.category === state.category;
        if (!inCategory) return false;
        if (!query) return true;

        const haystack = [
          product.name,
          product.category,
          product.material,
          product.description,
          product.finishes.join(' ')
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });

      if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

      return list;
    }

    function render(initial) {
      const list = visibleProducts();
      grid.innerHTML = list.map(cardMarkup).join('');
      grid.hidden = list.length === 0;
      empty.hidden = list.length !== 0;

      if (count) {
        const total = FW.products.length;
        const filtered = state.category !== 'All' || state.query.trim() !== '';
        count.textContent = filtered
          ? list.length + ' of ' + total + ' pieces'
          : total + ' pieces';
      }

      if (emptyQuery) {
        emptyQuery.textContent = state.query.trim()
          ? 'No pieces match “' + state.query.trim() + '”.'
          : 'No pieces match these filters.';
      }

      if (!initial && list.length) {
        grid.classList.remove('is-updating');
        void grid.offsetWidth;
        grid.classList.add('is-updating');
      }

      syncChips();
      syncUrl();
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        state.category = chip.dataset.filter;
        render(false);
      });
    });

    if (search) {
      search.addEventListener('input', () => {
        state.query = search.value;
        render(false);
      });

      search.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && search.value) {
          event.preventDefault();
          search.value = '';
          state.query = '';
          render(false);
        }
      });
    }

    if (sort) {
      sort.addEventListener('change', () => {
        state.sort = sort.value;
        render(false);
      });
    }

    if (reset) {
      reset.addEventListener('click', () => {
        state.category = 'All';
        state.query = '';
        state.sort = 'featured';
        if (search) search.value = '';
        if (sort) sort.value = 'featured';
        render(false);
        const heading = $('#search') || $('.catalog__bar');
        if (heading) heading.focus();
      });
    }

    render(true);
  }

  /* ---------------------------------------------------------------------- */
  /* Product page                                                            */
  /* ---------------------------------------------------------------------- */

  function initProduct() {
    const view = $('#product-view');
    if (!view) return;

    const id = new URLSearchParams(location.search).get('id');
    const product = FW.products.find((item) => item.id === id);
    const error = $('#product-error');
    const context = $('#product-context');
    const related = $('#related');

    if (!product) {
      document.title = 'Piece not found — Formwork';
      if (error) error.hidden = false;
      view.hidden = true;
      if (context) context.hidden = true;
      if (related) related.hidden = true;
      return;
    }

    document.title = product.name + ' — Formwork';
    view.hidden = false;

    $('#product-category').textContent = product.category;
    $('#product-name').textContent = product.name;
    $('#product-price').textContent = FW.formatPrice(product.price);
    $('#product-description').textContent = product.description;
    $('#spec-dimensions').textContent = product.dimensions;
    $('#spec-material').textContent = product.material;
    $('#spec-reference').textContent = product.ref;
    $('#product-care').textContent = product.care;
    $('#crumb-category').textContent = product.category;
    $('#crumb-category').href = 'collection.html?category=' + product.category.toLowerCase();
    $('#crumb-name').textContent = product.name;

    const mainImage = $('#gallery-main');
    const thumbs = $('#gallery-thumbs');
    const finishWrap = $('#finish-options');
    const finishSpec = $('#spec-finish');

    function setMain(index) {
      const image = product.images[index] || product.images[0];
      mainImage.src = FW.image(image.id, 1800);
      mainImage.alt = image.alt;
      mainImage.style.objectPosition = product.imagePosition || 'center';
      $$('.thumb', thumbs).forEach((thumb) => {
        thumb.setAttribute('aria-pressed', Number(thumb.dataset.index) === index ? 'true' : 'false');
      });
    }

    thumbs.innerHTML = product.images
      .map(
        (image, index) =>
          '<button class="thumb" type="button" data-index="' + index + '" aria-label="View image ' + (index + 1) + ': ' + image.alt + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' +
            '<img src="' + FW.image(image.id, 320) + '" alt="" width="320" height="400"' + (product.imagePosition ? ' style="object-position:' + product.imagePosition + '"' : '') + '>' +
          '</button>'
      )
      .join('');

    if (product.images.length < 2) thumbs.hidden = true;

    thumbs.addEventListener('click', (event) => {
      const button = event.target.closest('.thumb');
      if (!button) return;
      setMain(Number(button.dataset.index));
    });

    finishWrap.innerHTML = product.finishes
      .map(
        (finish, index) =>
          '<label class="finish__option">' +
            '<input type="radio" name="finish" value="' + finish + '"' + (index === 0 ? ' checked' : '') + '>' +
            '<span class="swatch" style="--swatch:' + (FW.finishColors[finish] || '#c9c6bc') + '"></span>' +
            '<span>' + finish + '</span>' +
          '</label>'
      )
      .join('');

    finishWrap.addEventListener('change', (event) => {
      if (event.target.name === 'finish') finishSpec.textContent = event.target.value;
    });

    setMain(0);

    const enquiryButton = $('[data-open-enquiry]', view);
    if (enquiryButton) enquiryButton.dataset.piece = product.name;

    const detail = product.images[1] || product.images[0];
    if (context) {
      const contextImage = $('#context-image');
      contextImage.src = FW.image(detail.id, 2000);
      contextImage.alt = detail.alt;
      $('#context-caption').textContent = detail.caption;
      context.hidden = false;
    }

    if (related) {
      const sameCategory = FW.products.filter(
        (item) => item.id !== product.id && item.category === product.category
      );
      const rest = FW.products.filter(
        (item) => item.id !== product.id && item.category !== product.category
      );
      const list = sameCategory.concat(rest).slice(0, 3);
      $('#related-grid').innerHTML = list.map(cardMarkup).join('');
      related.hidden = false;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Contact form                                                            */
  /* ---------------------------------------------------------------------- */

  function initContact() {
    const form = $('#contact-form');
    if (!form) return;

    const success = $('#contact-success');

    initValidatedForm(form, () => {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Boot                                                                    */
  /* ---------------------------------------------------------------------- */

  function init() {
    initHeader();
    initMenus();
    initEnquiry();
    initReveal();
    initCollection();
    initProduct();
    initContact();

    $$('[data-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
