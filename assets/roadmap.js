/* The same building blocks evolve from an idea into an operating model. */
(() => {
  'use strict';

  const stages = [
    {
      name: 'Educate', caption: 'One shared starting point.',
      description: 'A single point of understanding starts the journey.',
      nodes: [[400, 165, 'Shared', 'understanding', 'primary']],
      edges: [],
    },
    {
      name: 'Enable', caption: 'Open the pathways into daily work.',
      description: 'Learning branches into people, tools and guardrails, then into practical use and ownership.',
      nodes: [[248, 165, 'Learning', '', 'primary'], [400, 75, 'People'], [400, 165, 'Tools'], [400, 255, 'Guardrails'], [552, 75, 'Apply'], [552, 165, 'Use'], [552, 255, 'Own']],
      edges: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6]],
    },
    {
      name: 'Big rocks', caption: 'Find the constraints. Choose what matters.',
      description: 'Three business constraints are broken down and prioritised into one valuable problem.',
      nodes: [[255, 110, 'Effort', '', 'rock'], [400, 93, 'Delay', '', 'rock'], [545, 110, 'Cost', '', 'rock'], [400, 245, 'Priority', 'problem', 'primary']],
      edges: [[0, 3], [1, 3], [2, 3]],
    },
    {
      name: 'Business case', caption: 'Make the economics visible.',
      description: 'Costs, benefits and risk feed a financial model and a decision on long-term return.',
      nodes: [[255, 80, 'Full costs'], [400, 80, 'Benefits'], [545, 80, 'Risk'], [400, 258, 'Long-term', 'ROI', 'primary']],
      edges: [[0, 3], [1, 3], [2, 3]],
    },
    {
      name: 'Scope & prove', caption: 'Pick one area. Prove the value.',
      description: 'One area of the business is selected for a bounded proof, with the surrounding organisation visible.',
      nodes: [[255, 70, 'Sales', '', 'muted'], [400, 70, 'Data', '', 'muted'], [545, 70, 'Operations', '', 'muted'], [255, 165, 'Technology', '', 'muted'], [400, 165, 'One area', 'one proof', 'primary'], [545, 165, 'Risk', '', 'muted'], [255, 260, 'Finance', '', 'muted'], [400, 260, 'People', '', 'muted'], [545, 260, 'Service', '', 'muted']],
      edges: [[0, 1], [1, 2], [0, 3], [2, 5], [3, 6], [5, 8], [6, 7], [7, 8]],
    },
    {
      name: 'Build', caption: 'Build. Test. Learn. Improve.',
      description: 'An MVP moves through a test, learn and refine cycle to become a working solution.',
      nodes: [[265, 78, 'MVP', '', 'primary'], [535, 78, 'Test'], [535, 252, 'Learn'], [265, 252, 'Refine'], [400, 165, 'Working', 'solution', 'primary']],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
    },
    {
      name: 'Expand', caption: 'Repeat the value across the business.',
      description: 'A proven component is reused in sales, operations and service, with a value check in every area.',
      nodes: [[400, 75, 'Proven', 'component', 'primary'], [250, 222, 'Sales', 'value check'], [400, 222, 'Operations', 'value check'], [550, 222, 'Service', 'value check']],
      edges: [[0, 1], [0, 2], [0, 3]],
    },
    {
      name: 'Scale', caption: 'One connected operating model.',
      description: 'People, process, technology, data, controls and value become a connected enterprise with measurable returns.',
      nodes: [[280, 112, 'People'], [400, 112, 'Process'], [520, 112, 'Technology'], [280, 207, 'Data'], [400, 207, 'Controls'], [520, 207, 'Value'], [400, 33, 'Business', '', 'primary'], [400, 298, 'Measured', 'returns', 'primary']],
      edges: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5], [6, 1], [4, 7]],
    },
  ];

  const state = new WeakMap();
  let sequence = 0;
  const ns = 'http://www.w3.org/2000/svg';

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  }

  function createRoadmap(figure) {
    const uid = `roadmap-${++sequence}`;
    figure.classList.add('roadmap');
    figure.innerHTML = `
      <figcaption class="roadmap-caption">
        <span class="roadmap-stage" data-roadmap-stage>01 / Educate</span>
        <span class="roadmap-thought" data-roadmap-caption>One shared starting point.</span>
      </figcaption>
      <div class="roadmap-canvas">
        <svg class="roadmap-scene" viewBox="0 0 800 340" role="img" aria-labelledby="${uid}-title ${uid}-desc">
          <title id="${uid}-title">Educate</title>
          <desc id="${uid}-desc">A single point of understanding starts the journey.</desc>
          <defs>
            <pattern id="${uid}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="currentColor"/></pattern>
            <marker id="${uid}-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1L5 3.5L1 6" fill="none" stroke="currentColor" stroke-width="1.2"/></marker>
          </defs>
          <rect class="roadmap-grid" width="800" height="340" fill="url(#${uid}-grid)"/>
          <g class="roadmap-guides" aria-hidden="true"><path d="M46 165H168M632 165H754"/><circle cx="47" cy="165" r="3"/><circle cx="753" cy="165" r="3"/><text x="48" y="148">UNDERSTAND</text><text x="753" y="148" text-anchor="end">CREATE VALUE</text></g>
          <g class="roadmap-scene-layer roadmap-education" data-scene="0"><circle cx="400" cy="165" r="74"/><circle cx="400" cy="165" r="107"/><path d="M290 165H329M471 165H510"/></g>
          <g class="roadmap-scene-layer roadmap-financial" data-scene="3"><rect class="roadmap-model" x="312" y="135" width="176" height="65" rx="3"/><path d="M328 186H473M328 149V186"/><rect class="roadmap-cost" x="341" y="171" width="23" height="15"/><rect class="roadmap-return" x="374" y="158" width="23" height="28"/><rect class="roadmap-return" x="407" y="146" width="23" height="40"/><path class="roadmap-trend" d="M338 164L376 151L412 140L457 130"/></g>
          <g class="roadmap-scene-layer roadmap-scope" data-scene="4"><rect x="330" y="121" width="140" height="88" rx="9"/><path d="M321 133V112H345M455 112H479V133M479 197V218H455M345 218H321V197"/></g>
          <g class="roadmap-scene-layer roadmap-build" data-scene="5"><circle cx="400" cy="165" r="67"/><path d="M387 219L398 230L419 207"/></g>
          <g class="roadmap-scene-layer roadmap-expand" data-scene="6"><path d="M194 272H606M250 259V278M400 259V278M550 259V278"/><text x="400" y="310" text-anchor="middle">REUSE · ADAPT · REVALIDATE</text></g>
          <g class="roadmap-scene-layer roadmap-enterprise" data-scene="7"><rect x="215" y="66" width="370" height="191" rx="14"/><path d="M234 244H566"/></g>
          <g data-roadmap-edges></g>
          <g data-roadmap-nodes></g>
        </svg>
      </div>
      <div class="roadmap-progress" aria-hidden="true">
        <span class="roadmap-progress-line"><span data-roadmap-progress></span></span>
        ${stages.map((stage, index) => `<span class="roadmap-stop" data-roadmap-stop="${index}"><span>${String(index + 1).padStart(2, '0')}</span><i></i></span>`).join('')}
      </div>
      <p class="roadmap-hint">Hover, tap or use the arrow keys on the stages above.</p>`;

    const svg = figure.querySelector('svg');
    const nodeLayer = svg.querySelector('[data-roadmap-nodes]');
    const edgeLayer = svg.querySelector('[data-roadmap-edges]');
    // The model sits above the connecting lines, keeping the chart legible.
    svg.insertBefore(svg.querySelector('.roadmap-financial'), nodeLayer);
    const nodes = Array.from({ length: 9 }, (_, i) => {
      const group = svgElement('g', { class: 'roadmap-node', 'aria-hidden': 'true' });
      group.style.setProperty('--node-delay', `${i * 22}ms`);
      group.appendChild(svgElement('rect', { x: '-53', y: '-28', width: '106', height: '56', rx: '7' }));
      group.appendChild(svgElement('path', { class: 'roadmap-rock', d: 'M-53 12L-38-25L-4-35L39-23L55 9L33 32L-22 32Z' }));
      const title = svgElement('text', { class: 'roadmap-node-title', 'text-anchor': 'middle', y: '5' });
      const subtitle = svgElement('text', { class: 'roadmap-node-subtitle', 'text-anchor': 'middle', y: '16' });
      group.append(title, subtitle);
      group.style.transform = 'translate(400px,165px)';
      nodeLayer.appendChild(group);
      return { group, title, subtitle };
    });
    const edges = Array.from({ length: 9 }, () => {
      const path = svgElement('path', { class: 'roadmap-edge', d: 'M400 165C400 165 400 165 400 165', 'marker-end': `url(#${uid}-arrow)` });
      edgeLayer.appendChild(path);
      return path;
    });
    const data = { figure, svg, nodes, edges, title: svg.querySelector('title'), desc: svg.querySelector('desc'), index: -1 };
    state.set(figure, data);
    return data;
  }

  function lineBetween(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const start = [a[0] + (horizontal ? Math.sign(dx) * 56 : 0), a[1] + (horizontal ? 0 : Math.sign(dy) * 31)];
    const end = [b[0] - (horizontal ? Math.sign(dx) * 61 : 0), b[1] - (horizontal ? 0 : Math.sign(dy) * 35)];
    const mx = (start[0] + end[0]) / 2, my = (start[1] + end[1]) / 2;
    return horizontal
      ? `M${start[0]} ${start[1]}C${mx} ${start[1]} ${mx} ${end[1]} ${end[0]} ${end[1]}`
      : `M${start[0]} ${start[1]}C${start[0]} ${my} ${end[0]} ${my} ${end[0]} ${end[1]}`;
  }

  window.updateRoadmap = function updateRoadmap(root, index) {
    const figure = root.matches('[data-roadmap]') ? root : root.querySelector('[data-roadmap]');
    if (!figure) return;
    const data = state.get(figure) || createRoadmap(figure);
    const selected = Math.max(0, Math.min(stages.length - 1, Number(index) || 0));
    if (data.index === selected) return;
    data.index = selected;
    const stage = stages[selected];
    figure.dataset.stage = String(selected + 1);
    figure.querySelector('[data-roadmap-stage]').textContent = `${String(selected + 1).padStart(2, '0')} / ${stage.name}`;
    figure.querySelector('[data-roadmap-caption]').textContent = stage.caption;
    data.title.textContent = `${selected + 1} of 8: ${stage.name}`;
    data.desc.textContent = stage.description;

    data.nodes.forEach(({ group, title, subtitle }, i) => {
      const node = stage.nodes[i];
      group.classList.toggle('is-visible', Boolean(node));
      if (!node) return;
      group.style.transform = `translate(${node[0]}px,${node[1]}px)`;
      group.classList.toggle('is-primary', node[4] === 'primary');
      group.classList.toggle('is-muted', node[4] === 'muted');
      group.classList.toggle('is-rock', node[4] === 'rock');
      title.textContent = node[2];
      title.setAttribute('y', node[3] ? '-3' : '5');
      subtitle.textContent = node[3] || '';
    });
    data.edges.forEach((path, i) => {
      const pair = stage.edges[i];
      path.classList.toggle('is-visible', Boolean(pair));
      if (pair) path.setAttribute('d', lineBetween(stage.nodes[pair[0]], stage.nodes[pair[1]]));
    });
    figure.querySelectorAll('[data-scene]').forEach(layer => layer.classList.toggle('is-active', Number(layer.dataset.scene) === selected));
    figure.querySelectorAll('[data-roadmap-stop]').forEach((stop, i) => {
      stop.classList.toggle('is-past', i < selected);
      stop.classList.toggle('is-current', i === selected);
    });
    figure.querySelector('[data-roadmap-progress]').style.width = `${selected / (stages.length - 1) * 100}%`;
  };

  function initialise() {
    document.querySelectorAll('[data-method]').forEach(root => {
      const tabs = [...root.querySelectorAll('[role="tab"]')];
      window.updateRoadmap(root, Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
