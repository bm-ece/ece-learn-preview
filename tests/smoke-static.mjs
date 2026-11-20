import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('linux/index.html');
const portal = read('index.html');
const css = read('css/styles.css');
const app = read('js/app.js');
const storage = read('js/storage.js');
const progress = read('js/progress.js');

function check(name, fn) {
  try { fn(); console.log('PASS', name); }
  catch (error) { console.error('FAIL', name, error.message); process.exitCode = 1; }
}

check('All referenced local JavaScript files exist and parse', () => {
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/g)].map(match => match[1].replace(/^\.\.\//, '').split('?')[0]);
  assert.deepEqual(scripts, ['courses/linux/lessons/data.js', 'courses/linux/labs/data.js', 'courses/linux/terminal/fs.js', 'courses/linux/simulators/index.js', 'js/routing.js', 'js/storage.js', 'js/progress.js', 'components/navigation.js', 'components/lesson.js', 'components/quiz.js', 'courses/linux/terminal/engine.js', 'courses/linux/labs/engine.js', 'courses/linux/terminal/bash.js', 'js/app.js'], 'Unexpected script loading sequence');
  for (const path of scripts) {
    assert.ok(!path.startsWith('/') && !path.includes('..'), 'Unsafe script path');
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing script: ' + path);
    new Script(read(path), { filename: path });
  }
});
check('HTML loads the stylesheet and application exactly once', () => {
  assert.equal(html.includes('href="../css/styles.css"'), true);
  assert.equal(html.includes('src="../js/app.js?v=modular-20261120-2"'), true);
  assert.equal((html.match(/<script\b/g) || []).length, 14);
  assert.equal((html.match(/<style\b/g) || []).length, 0);
  assert.equal((html.match(/<\/script>/g) || []).length, 14);
});
check('Stylesheet and branding assets exist', () => {
  assert.match(css, /@import url\('\.\/tokens\.css'\)/);
  assert.match(css, /@import url\('\.\/layout\.css'\)/);
  assert.match(css, /@import url\('\.\/components\.css'\)/);
  assert.ok(['css/tokens.css','css/layout.css','css/components.css'].reduce((n,p)=>n+read(p).length,0) > 10000);
  assert.ok(existsSync(new URL('../assets/favicon.svg', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/ece-logo.jpg', import.meta.url)));
});
check('Linux teaching dataset remains intact', () => {
  const source = read('courses/linux/lessons/data.js').trim();
  const prefix = 'window.LINUX_NEXUS_DATA=';
  assert.ok(source.startsWith(prefix) && source.endsWith(';'), 'Linux dataset must be assigned before application startup');
  assert.ok(app.includes('const DATA=window.LINUX_NEXUS_DATA;'));
  const data = JSON.parse(source.slice(prefix.length, -1));
  assert.ok(Array.isArray(data.commands) && data.commands.length === 79, '79 Linux commands must remain');
  assert.ok(Array.isArray(data.parts) && data.parts.length === 7);
  assert.ok(data.parts.every(part => part && typeof part === 'object'));
});
check('Preview progress key is distinct from production', () => {
  assert.ok(storage.includes("location.pathname.startsWith('/ece-learn-preview/')") && storage.includes("location.pathname.startsWith('/linux-nexus-preview/')"));
  assert.ok(storage.includes("'linux_nexus_preview_complete_2026'"));
  assert.ok(storage.includes("'linux_nexus_complete_2026'"));
  assert.ok(app.includes('window.ECE_STORAGE.load()'));
  assert.ok(app.includes('window.ECE_STORAGE.save('));
  const memory = new Map();
  const makeContext = pathname => {
    const context = {
      window: {}, location: { pathname },
      localStorage: {
        getItem: key => memory.get(key) ?? null,
        setItem: (key, value) => memory.set(key, value)
      }
    };
    runInNewContext(storage, context);
    return context.window.ECE_STORAGE;
  };
  const prod = makeContext('/ece-learn/linux/');
  const preview = makeContext('/ece-learn-preview/linux/');
  const legacyPreview = makeContext('/linux-nexus-preview/linux/');
  prod.save({ done: [1], labDone: [], labStarted: [], attempts: {}, fs: {} });
  preview.save({ done: [2], labDone: [], labStarted: [], attempts: {}, fs: {} });\n  assert.deepEqual(Array.from(legacyPreview.load().done), [2], 'Legacy Preview URL uses the same isolated key');
  assert.deepEqual(Array.from(prod.load().done), [1]);
  assert.deepEqual(Array.from(preview.load().done), [2]);
  assert.ok(memory.has('linux_nexus_complete_2026'));
  assert.ok(memory.has('linux_nexus_preview_complete_2026'));
  memory.set('linux_nexus_preview_complete_2026', '{invalid');
  assert.equal(Object.keys(preview.load()).length, 0, 'Malformed data should not crash startup');
});
check('Interactive entry points remain present', () => {
  for (const [name, path] of [['render','js/app.js'],['terminalView','courses/linux/terminal/engine.js'],['submitCommand','courses/linux/terminal/engine.js'],['labView','courses/linux/labs/engine.js'],['submitLab','courses/linux/labs/engine.js'],['progressView','js/app.js']]) {
    assert.match(read(path), new RegExp(String.raw`function\s+${name}\s*\(`), name);
  }
  assert.match(app, /\brender\(\);/);
});

check('No missing local stylesheet or image references', () => {
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1].replace(/^\.\.\//, '').split('?')[0]);
  for (const path of references) {
    if (/^(https?:|mailto:|#|data:)/.test(path)) continue;
    assert.ok(!path.startsWith('/') && !path.includes('..'), 'Invalid relative path: ' + path);
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing local file: ' + path);
  }
});
check('Interactive lessons, labs and simulators remain defined', () => {
  const context = { window: {} };
  runInNewContext(read('courses/linux/labs/data.js'), context);
  assert.equal(context.window.LINUX_NEXUS_LABS.length, 7, 'Seven labs must remain');
  assert.ok(context.window.LINUX_NEXUS_LABS.every(lab => lab.title && lab.story && Array.isArray(lab.steps) && lab.steps.length > 0));
  assert.ok(read('courses/linux/terminal/engine.js').includes('const LABS=window.LINUX_NEXUS_LABS;'));
  const terminalContext = { window: {} };
  runInNewContext(read('courses/linux/terminal/fs.js'), terminalContext);
  assert.ok(terminalContext.window.LINUX_NEXUS_INITIAL_FS['/home/student']);
  assert.ok(terminalContext.window.LINUX_NEXUS_INITIAL_FS['/etc/passwd']);
  assert.ok(app.includes('const initialFS=window.LINUX_NEXUS_INITIAL_FS;'));
  assert.match(read('components/lesson.js'), /\bfunction lesson\s*\(/);
  assert.match(read('components/quiz.js'), /\bfunction checkQuiz\s*\(/);
  assert.match(read('courses/linux/terminal/bash.js'), /\bfunction runScript\s*\(/);
  assert.match(read('courses/linux/simulators/index.js'), /\bfunction simContent\s*\(/);
  assert.match(read('courses/linux/simulators/index.js'), /\bfunction simView\s*\(/);
  for (const name of ['process', 'permissions', 'memory', 'network']) assert.ok(read('courses/linux/simulators/index.js').includes(name));
});

check('Progress calculations preserve XP and domain counts', () => {
  const context = { window: {} };
  runInNewContext(progress, context);
  const api = context.window.ECE_PROGRESS;
  const state = { done: new Set([0, 2]), labDone: new Set([0]) };
  const summary = api.summary(state, 79);
  assert.equal(summary.notions, 2);
  assert.equal(summary.labs, 1);
  assert.equal(summary.xp, 200);
  assert.equal(api.summary({ done: new Set(), labDone: new Set() }, 79).xp, 0);
  const domains = api.byDomain([{ title: 'A' }, { title: 'B' }], [{ part: 0 }, { part: 1 }, { part: 0 }], state.done);
  assert.deepEqual(Array.from(domains, item => Array.from(item).slice(1)), [[2, 2], [1, 0]]);
  assert.ok(app.includes('window.ECE_PROGRESS.summary('));
  assert.ok(app.includes('window.ECE_PROGRESS.byDomain('));
});

check('ECE Learn catalog lists four subjects without premature links', () => {
  const context = { window: {} };
  new Script(read('js/catalog.js'), { filename: 'js/catalog.js' }).runInNewContext(context);
  const courses = context.window.ECE_CATALOG;
  assert.equal(courses.length, 4);
  assert.deepEqual(Array.from(courses, course => course.id), ['linux', 'networks', 'programming', 'cybersecurity']);
  assert.equal(courses.filter(course => course.available).length, 1);
  assert.equal(courses[0].title, 'Linux');
  assert.ok(courses.every(course => typeof course.description === 'string' && course.description.length > 0));
  assert.deepEqual(Array.from(courses[0].levels), ['ING3']);
  assert.equal(courses[0].path, 'linux/');
  assert.ok(courses.slice(1).every(course => course.path === null && course.levels.length === 0), 'Unassigned courses must not be advertised');
});

check('ECE Learn portal and Linux entry point exist', () => {
  assert.ok(portal.includes('ECE Learn'));
  assert.ok(portal.includes('Votre espace d\'apprentissage interactif'));
  assert.ok(portal.includes('js/catalog.js') && portal.includes('js/portal.js'));
  assert.ok(existsSync(new URL('../linux/index.html', import.meta.url)));
  assert.ok(existsSync(new URL('../css/portal.css', import.meta.url)));
  new Script(read('js/portal.js'));
  const linux = read('linux/index.html');
  assert.ok(linux.includes('../js/app.js'));
  assert.ok(linux.includes('../css/styles.css'));
});

check('Portal visual palette matches Linux without changing course styles', () => {
  const portalCss = read('css/portal.css');
  for (const color of ['#070d1b', '#111d31', '#172842', '#2a4161', '#ecf6ff', '#a2b8d2', '#54e6ed']) {
    assert.ok(portalCss.includes(color), 'Missing shared Linux palette color ' + color);
  }
  assert.ok(portal.includes('name="theme-color" content="#091528"'));
  assert.ok(portalCss.includes('@media(max-width:600px)'));
  assert.ok(portalCss.includes(':focus-visible'));
});

check('Linux syllabus matches all 79 existing notions and 7 domains', () => {
  const syllabus = JSON.parse(read('courses/linux/syllabus/syllabus.json'));
  const course = JSON.parse(read('courses/linux/course.json'));
  const dataText = read('courses/linux/lessons/data.js');
  const data = JSON.parse(dataText.slice(dataText.indexOf('=') + 1).trim().replace(/;$/, ''));
  assert.equal(course.syllabus, 'courses/linux/syllabus/syllabus.json');
  assert.equal(course.notionCount, 79);
  assert.equal(course.labCount, 7);
  assert.equal(syllabus.domains.length, 7);
  assert.equal(syllabus.domains.reduce((n, domain) => n + domain.notions.length, 0), 79);
  assert.equal(syllabus.domains.reduce((n, domain) => n + domain.sessions.length, 0), 14);
  const notions = syllabus.domains.flatMap(domain => domain.notions);
  assert.deepEqual(notions.map(n => n.id), Array.from({length: 79}, (_, i) => i + 1));
  assert.deepEqual(notions.map(n => n.title), data.commands.map(c => c.name));
  assert.deepEqual(syllabus.domains.map(d => d.title), data.parts.map(p => p.title));
});

check('Exact target architecture paths exist', () => {
  for (const path of [
    'index.html','linux/index.html','assets/favicon.svg',
    'css/tokens.css','css/layout.css','css/components.css',
    'js/app.js','js/routing.js','js/catalog.js','js/storage.js','js/progress.js',
    'components/lesson.js','components/quiz.js','components/navigation.js',
    'courses/linux/course.json','courses/linux/syllabus/syllabus.json',
    'courses/linux/lessons/data.js','courses/linux/labs/data.js',
    'courses/linux/simulators/index.js','courses/linux/terminal/engine.js',
    'tests/smoke-browser.mjs','docs/ARCHITECTURE.md',
    'docs/PLAN-MIGRATION.md','docs/DEPLOIEMENT-PREVIEW.md',
    '.github/workflows/verify-development.yml','README.md'
  ]) assert.ok(read(path).length > 0, path);
});
