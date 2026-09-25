/* Interactive engagement geography. No third-party runtime or map service. */
(() => {
  'use strict';

  const scriptURL = document.currentScript?.src || new URL('assets/global-map.js', document.baseURI).href;
  const outlineURL = new URL('maps/world-outline.svg', scriptURL);
  const svgNS = 'http://www.w3.org/2000/svg';
  const regions = [
    { id: 'australia', name: 'Australia', label: 'Australia', point: [134, -25], country: 'AUS', clients: ['Alinta Energy', 'Bupa', 'Telstra', 'Woolworths Group', 'NBN'], note: 'Selected engagements across Australia' },
    { id: 'uk', name: 'United Kingdom', label: 'United Kingdom', point: [-2.5, 54.5], country: 'GBR', clients: ['Barclays'], note: 'United Kingdom engagement experience', labelSide: 'left' },
    { id: 'europe', name: 'Europe', label: 'Europe', point: [17, 51], country: null, clients: ['Lenovo'], note: 'Regional engagement experience across Europe' },
    { id: 'chicago', name: 'Chicago, USA', label: 'Chicago', point: [-87.6298, 41.8781], country: 'USA', clients: ['Willis Towers Watson'], note: 'Chicago engagement experience' },
    { id: 'south-africa', name: 'South Africa', label: 'South Africa', point: [25, -29], country: 'ZAF', clients: ['Edcon'], note: 'South Africa engagement experience' },
    { id: 'india', name: 'India', label: 'India', point: [79, 22.5], country: 'IND', clients: ['Unilever'], note: 'India engagement experience', labelSide: 'left' },
    { id: 'china', name: 'China', label: 'China', point: [104, 35.5], country: 'CHN', clients: ['Motorola'], note: 'China engagement experience' },
    { id: 'singapore', name: 'Singapore', label: 'Singapore', point: [103.8198, 1.3521], country: null, clients: ['Singtel'], note: 'Singapore engagement experience' },
    { id: 'new-zealand', name: 'New Zealand', label: 'New Zealand', point: [172, -41], country: 'NZL', clients: ['Vector Limited'], note: 'New Zealand engagement experience', labelSide: 'left' },
  ];

  const project = ([longitude, latitude]) => [500 + longitude * 2.55, 239 - latitude * 2.55];
  const element = (name, attributes = {}) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  document.querySelectorAll('[data-global-map]').forEach((root) => {
    const stage = root.querySelector('[data-map-stage]');
    const detail = root.querySelector('[data-map-detail]');
    const heading = root.querySelector('[data-map-region-name]');
    const note = root.querySelector('[data-map-region-note]');
    const clients = root.querySelector('[data-map-clients]');
    const buttons = Array.from(root.querySelectorAll('[data-map-region]'));
    if (!stage || !detail || !heading || !note || !clients || !buttons.length) return;

    let selected = 'australia';
    let svg;
    let route;
    let revealFrame;

    const paintMap = (region) => {
      if (!svg) return;
      svg.querySelectorAll('[data-country]').forEach((country) => {
        country.classList.toggle('is-active', country.dataset.country === region.country);
      });
      svg.querySelectorAll('[data-map-point]').forEach((point) => {
        const active = point.dataset.mapPoint === region.id;
        point.classList.toggle('is-active', active);
        point.setAttribute('aria-pressed', String(active));
      });
      const [startX, startY] = project(regions[0].point);
      const [endX, endY] = project(region.point);
      route.setAttribute('d', region.id === 'australia' ? '' : `M${startX},${startY} Q${(startX + endX) / 2},${Math.min(startY, endY) - 62} ${endX},${endY}`);
      route.classList.remove('is-drawing');
      requestAnimationFrame(() => route.classList.add('is-drawing'));
    };

    const selectRegion = (id) => {
      const region = regions.find((candidate) => candidate.id === id);
      if (!region) return;
      const changed = selected !== id;
      selected = id;
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mapRegion === id)));
      heading.textContent = region.name;
      note.textContent = region.note;
      clients.replaceChildren(...region.clients.map((name) => {
        const item = document.createElement('li');
        item.textContent = name;
        return item;
      }));
      paintMap(region);
      if (changed) {
        cancelAnimationFrame(revealFrame);
        detail.classList.remove('is-changing');
        revealFrame = requestAnimationFrame(() => detail.classList.add('is-changing'));
      }
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => selectRegion(button.dataset.mapRegion));
      button.addEventListener('focus', () => selectRegion(button.dataset.mapRegion));
      button.addEventListener('keydown', (event) => {
        const offsets = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let next;
        if (event.key in offsets) next = (index + offsets[event.key] + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        buttons[next].focus();
      });
    });
    root.classList.add('global-map-enhanced');
    selectRegion(selected);

    fetch(outlineURL, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw new Error(`Map outline returned ${response.status}`);
        return response.text();
      })
      .then((markup) => {
        const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml');
        if (parsed.querySelector('parsererror') || parsed.documentElement.localName !== 'svg') throw new Error('Invalid map SVG');
        svg = document.importNode(parsed.documentElement, true);
        svg.removeAttribute('aria-hidden');
        svg.removeAttribute('focusable');
        svg.setAttribute('role', 'group');
        svg.setAttribute('aria-label', 'World engagement map. Select a gold location or use the location buttons below.');
        route = element('path', { class: 'global-map-route', 'aria-hidden': 'true' });
        svg.append(route);

        regions.forEach((region) => {
          const [x, y] = project(region.point);
          const point = element('g', {
            class: 'global-map-point', transform: `translate(${x},${y})`, role: 'button', tabindex: 0,
            'data-map-point': region.id, 'aria-label': `${region.name}: ${region.clients.join(', ')}`,
            'aria-pressed': String(region.id === selected),
          });
          point.append(
            element('circle', { class: 'point-target', r: 18 }),
            element('circle', { class: 'point-ring', r: 9, 'aria-hidden': 'true' }),
            element('circle', { class: 'point-core', r: 3.5, 'aria-hidden': 'true' }),
          );
          const label = element('text', {
            class: 'point-label', x: region.labelSide === 'left' ? -17 : 17, y: 3,
            'text-anchor': region.labelSide === 'left' ? 'end' : 'start', 'aria-hidden': 'true',
          });
          label.textContent = region.label;
          point.append(label);
          point.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'touch') selectRegion(region.id);
          });
          point.addEventListener('focus', () => selectRegion(region.id));
          point.addEventListener('click', () => selectRegion(region.id));
          point.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectRegion(region.id);
          });
          svg.append(point);
        });
        stage.replaceChildren(svg);
        paintMap(regions.find((region) => region.id === selected));
      })
      .catch(() => {
        // A readable, local SVG and the location buttons remain available if the enhancement cannot load.
        stage.setAttribute('aria-label', 'World outline. Select a location using the buttons below.');
      });
  });
})();
