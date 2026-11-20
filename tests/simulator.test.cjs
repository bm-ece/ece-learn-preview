const { URL, URLSearchParams } = require('node:url');
// Run: node tests/simulator.test.cjs
// Tests execute the actual inline JavaScript from index.html in an isolated VM.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, 'inline simulator script must exist');
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('PASS', name); }
  catch (error) { console.error('FAIL', name, error.message); process.exitCode = 1; }
}
function boot(saved = null) {
  const elements = new Map();
  const storage = new Map(saved ? [['ece_learn_linux_progress_2026', JSON.stringify(saved)]] : []);
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', value: '', scrollTop: 0, scrollHeight: 0, focus() {} });
      return elements.get(id);
    },
    addEventListener() {}
  };
  const location = new URL('https://bm-ece.github.io/ece-learn/');
  const history = { replaceState() {}, pushState() {} };
  const context = vm.createContext({ document, localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) }, window: { location, history, scrollTo() {}, addEventListener() {} }, URL, URLSearchParams, console });
  vm.runInContext(source + '\nthis.simulator = { execute, state, initialFS, LABS, COMMANDS, submitLab };', context, { timeout: 5000 });
  return context.simulator;
}
const sim = boot();
const run = command => sim.execute(command);
const reset = () => { sim.state.cwd = '/home/student'; sim.state.fs = JSON.parse(JSON.stringify(sim.initialFS)); };
test('79 pedagogical notions and 7 laboratories', () => { assert.equal(sim.COMMANDS.length, 79); assert.equal(sim.LABS.length, 7); });
test('student account and root/home listings', () => {
  reset(); assert.equal(run('pwd').out.trim(), '/home/student');
  assert.match(run('ls').out, /README\.txt/); assert.match(run('ls /').out, /etc/);
  assert.equal(run('whoami').out.trim(), 'student'); assert.match(run('id').out, /uid=1000\(student\)/);
  assert.match(run('cat /etc/passwd').out, /student:.*\/home\/student/);
});
test('cd with no argument returns home', () => { reset(); run('cd /'); assert.equal(run('pwd').out.trim(), '/'); run('cd'); assert.equal(run('pwd').out.trim(), '/home/student'); });
test('filesystem creation, redirection, copy, move and deletion', () => {
  reset();
  for (const command of ['mkdir -p projets/demo', 'touch projets/demo/a.txt', 'echo bonjour > projets/demo/a.txt']) assert.equal(run(command).status, 0, command);
  assert.equal(run('cat projets/demo/a.txt').out.trim(), 'bonjour');
  assert.equal(run('cp projets/demo/a.txt projets/demo/b.txt').status, 0);
  assert.equal(run('mv projets/demo/b.txt projets/demo/c.txt').status, 0);
  assert.match(run('ls projets/demo').out, /c\.txt/);
  assert.equal(run('rm projets/demo/c.txt').status, 0);
  assert.doesNotMatch(run('ls projets/demo').out, /c\.txt/);
});
test('pipeline and stderr redirection', () => {
  reset(); assert.equal(run('grep ERROR /var/log/app.log | wc -l').out.trim(), '3');
  assert.notEqual(run('ls /absent 2> erreurs.txt').status, 0);
  assert.match(run('cat erreurs.txt').out, /absent/);
});
for (const [index, lab] of sim.LABS.entries()) {
  test('laboratory ' + (index + 1) + ': ' + lab.title, () => {
    reset();
    for (const [label, command, pattern] of lab.steps) {
      const result = run(command);
      assert.equal(result.status, 0, label + ': ' + result.error);
      assert.match(result.out, pattern, label);
    }
  });
}
test('restoration retains saved files and progress', () => {
  const migrated = boot({ done: [1, 4], labDone: [2], attempts: { 1: 3 },
    fs: { '/': { dir: true }, '/home': { dir: true }, '/home/alex': { dir: true },
      '/home/alex/notes.txt': { text: 'alex /home/alex' } } });
  assert.equal(migrated.execute('cat /home/student/notes.txt').out.trim(), 'student /home/student');
  assert.equal(migrated.state.done.size, 2); assert.equal(migrated.state.labDone.size, 1);
  assert.equal(migrated.state.attempts[1], 3);
});
test('restoration is idempotent', () => {
  const already = boot({ fs: { '/': { dir: true }, '/home': { dir: true },
    '/home/student': { dir: true }, '/home/student/a.txt': { text: 'saved' } } });
  assert.equal(already.execute('cat /home/student/a.txt').out.trim(), 'saved');
});
console.log(passed + ' checks passed');
if (process.exitCode) process.exit(process.exitCode);
