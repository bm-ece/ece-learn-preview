import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('.');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      .replace(/^\/(?:linux-nexus-preview|ece-learn)\//, '/');
    const file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
    if (file !== root && !file.startsWith(root + sep)) throw Error('Invalid path');
    const ext = file.slice(file.lastIndexOf('.'));
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}/linux-nexus-preview/`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const [label, viewport] of [
    ['desktop', { width: 1366, height: 768 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    const failedAssets = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) {
        failedAssets.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(base, { waitUntil: 'load' });
    assert.equal(await page.locator('#courses .course').count(), 0, `${label}: no courses before level selection`);
    for (const level of ['ING1', 'ING2']) {
      await page.locator('#level').selectOption(level);
      assert.equal(await page.locator('#courses .course').count(), 0, `${label}: no unassigned courses for ${level}`);
      assert.match(await page.locator('#course-message').innerText(), /Aucun cours/, `${label}: empty state for ${level}`);
    }
    await page.locator('#level').selectOption('ING3');
    assert.equal(await page.locator('#courses .course').count(), 1, `${label}: only ING3 Linux course`);
    assert.equal(await page.locator('#courses a').count(), 1, `${label}: Linux is linked`);
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.locator('#level').inputValue(), 'ING3', `${label}: selected level persists`);
    assert.equal(await page.locator('#courses a').count(), 1, `${label}: Linux remains visible after reload`);
    await page.locator('#courses a').click();
    assert.ok(page.url().includes('/linux/'), `${label}: Linux course URL`);
    assert.equal(await page.locator('a.back-to-portal').count(), 1, `${label}: back-to-portal link exists`);
    assert.equal(await page.locator('a.back-to-portal').getAttribute('href'), '../', `${label}: relative portal path`);
    await page.locator('a.back-to-portal').click();
    assert.equal(new URL(page.url()).pathname, '/linux-nexus-preview/', `${label}: return to portal`);
    assert.equal(await page.locator('#level').inputValue(), 'ING3', `${label}: level preserved on return`);
    await page.locator('#courses a').click();

    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100, null, { timeout: 10000 });
    assert.ok((await page.locator('#nav').innerText()).trim().length > 0, `${label}: navigation empty`);
    assert.ok((await page.locator('#domains').innerText()).trim().length > 0, `${label}: domains empty`);
    assert.ok((await page.locator('#app').innerText()).trim().length > 100, `${label}: content empty`);
    assert.deepEqual(errors, [], `${label}: JavaScript errors`);
    assert.deepEqual(failedAssets, [], `${label}: missing files`);
    const key = await page.evaluate(() => {
      localStorage.setItem('linux_nexus_preview_complete_2026', JSON.stringify({ done: [] }));
      return localStorage.getItem('linux_nexus_preview_complete_2026');
    });
    assert.ok(key, `${label}: preview storage unavailable`);
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100, null, { timeout: 10000 });
    assert.deepEqual(errors, [], `${label}: errors after reload`);
    // A direct lesson link must survive refresh and preserve the Preview storage key.
    await page.goto(base + 'linux/?view=learn&notion=12', { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100);
    assert.equal(await page.evaluate(() => state.view), 'learn', `${label}: direct lesson view`);
    assert.equal(await page.evaluate(() => state.active), 11, `${label}: direct lesson index`);
    await page.evaluate(() => window.ECE_STORAGE.save({ done: [11], labDone: [0], labStarted: [], attempts: {}, fs: {} }));
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100);
    assert.equal(await page.evaluate(() => state.view), 'learn', `${label}: lesson after refresh`);
    assert.equal(await page.evaluate(() => state.active), 11, `${label}: lesson index after refresh`);
    assert.equal(await page.evaluate(() => state.done.has(11)), true, `${label}: completed notion persists`);
    assert.equal(await page.evaluate(() => state.labDone.has(0)), true, `${label}: completed lab persists`);
    assert.deepEqual(errors, [], `${label}: errors after deep link refresh`);
    await page.goto(base + 'linux/?view=lab&lab=1', { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100);
    assert.equal(await page.evaluate(() => state.view), 'lab', `${label}: direct lab view`);
    assert.equal(await page.evaluate(() => state.lab), 0, `${label}: direct lab index`);
    assert.deepEqual(failedAssets, [], `${label}: missing assets on direct links`);
    // Vérifier les liens générés par la navigation et l'historique navigateur.
    await page.evaluate(() => goto('catalog'));
    assert.equal(new URL(page.url()).searchParams.get('view'), 'catalog', `${label}: catalog URL`);
    await page.evaluate(() => goto('progress'));
    assert.equal(new URL(page.url()).searchParams.get('view'), 'progress', `${label}: progress URL`);
    await page.goBack({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.view), 'catalog', `${label}: back restores catalog`);
    await page.goForward({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.view), 'progress', `${label}: forward restores progress`);
    assert.equal(await page.evaluate(() => state.done.has(11)), true, `${label}: navigation keeps notion progress`);
    assert.equal(await page.evaluate(() => state.labDone.has(0)), true, `${label}: navigation keeps lab progress`);
    assert.deepEqual(errors, [], `${label}: history navigation JavaScript errors`);
    // Audit exhaustif des 79 fiches : cinq cartes, navigation, QCM et mission de commande.
    await page.evaluate(() => window.ECE_STORAGE.save({ done: [], labDone: [], labStarted: [], attempts: {}, fs: window.LINUX_NEXUS_INITIAL_FS }));
    for (let notion = 1; notion <= 79; notion++) {
      await page.goto(base + `linux/?view=learn&notion=${notion}`, { waitUntil: 'load' });
      assert.equal(await page.evaluate(() => state.active), notion - 1, `${label}: notion ${notion} URL`);
      const lesson = await page.evaluate(() => {
        const c = COMMANDS[state.active];
        return { title: c.name, expected: c.task || c.example, correct: (4 - (state.active * 3) % 4) % 4 };
      });
      assert.equal(await page.locator('#app h1').innerText(), lesson.title, `${label}: notion ${notion} title`);
      for (const section of ['COMPRENDRE', 'OBSERVER', 'VÉRIFIER LA COMPRÉHENSION', 'S’ENTRAÎNER', 'RETENIR']) {
        assert.ok((await page.locator('#app').innerText()).includes(section), `${label}: notion ${notion} section ${section}`);
      }
      assert.equal(await page.locator('[data-choice]').count(), 4, `${label}: notion ${notion} quiz choices`);
      await page.locator(`[data-choice="${(lesson.correct + 1) % 4}"]`).click();
      assert.match(await page.locator('#quizfeedback').innerText(), /pas la bonne fonction/, `${label}: notion ${notion} wrong quiz answer`);
      await page.locator(`[data-choice="${lesson.correct}"]`).click();
      assert.match(await page.locator('#quizfeedback').innerText(), /Exact/, `${label}: notion ${notion} correct quiz answer`);
      await page.locator('[data-check="1"]').click();
      assert.match(await page.locator('#answerfeedback').innerText(), /Écris d’abord/, `${label}: notion ${notion} empty mission`);
      await page.locator('#answer').fill('commande volontairement incorrecte');
      await page.locator('[data-check="1"]').click();
      assert.match(await page.locator('#answerfeedback').innerText(), /Pas encore reconnu/, `${label}: notion ${notion} wrong mission feedback`);
      assert.equal(await page.evaluate(() => state.done.has(state.active)), false, `${label}: notion ${notion} not completed by error`);
      await page.locator('#answer').fill(lesson.expected);
      await page.locator('[data-check="1"]').click();
      assert.match(await page.locator('#answerfeedback').innerText(), /Compétence enregistrée/, `${label}: notion ${notion} correct mission`);
      assert.equal(await page.evaluate(() => state.done.has(state.active)), true, `${label}: notion ${notion} completed`);
      assert.equal(await page.evaluate(() => state.attempts[state.active]), 2, `${label}: notion ${notion} attempts counted`);
      if (notion === 1) assert.equal(await page.locator('[data-next="-1"]').isDisabled(), true, `${label}: first lesson boundary`);
      if (notion === 79) assert.equal(await page.locator('[data-next="79"]').count(), 0, `${label}: last lesson boundary`);
      else assert.equal(await page.locator(`[data-next="${notion}"]`).count(), 1, `${label}: notion ${notion} next navigation`);
    }
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.done.size), 79, `${label}: all 79 notions persist`);
    assert.equal(await page.evaluate(() => Object.keys(state.attempts).length), 79, `${label}: all notion attempts persist`);
    assert.equal(await page.evaluate(() => state.attempts[78]), 2, `${label}: last notion attempts persist`);
    assert.deepEqual(errors, [], `${label}: all notions JavaScript errors`);
    assert.deepEqual(failedAssets, [], `${label}: all notions missing assets`);
    // Les URLs pédagogiques invalides doivent revenir à l'accueil Linux sans planter.
    for (const invalid of ['?view=learn&notion=0', '?view=learn&notion=80', '?view=learn&notion=abc', '?view=lab&lab=8', '?view=unknown']) {
      await page.goto(base + 'linux/' + invalid, { waitUntil: 'load' });
      assert.equal(await page.evaluate(() => state.view), 'home', `${label}: invalid URL ${invalid} fallback`);
      assert.equal(new URL(page.url()).search, '', `${label}: invalid URL ${invalid} normalized`);
    }
    await page.goto(base + 'linux/?view=learn&notion=79', { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.done.size), 79, `${label}: invalid URLs preserve progress`);
    // Chaque laboratoire doit rester accessible par son URL directe, y compris après rechargement.
    for (let labNumber = 1; labNumber <= 7; labNumber++) {
      await page.goto(base + `linux/?view=lab&lab=${labNumber}`, { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100);
      assert.equal(await page.evaluate(() => state.view), 'lab', `${label}: lab ${labNumber} view`);
      assert.equal(await page.evaluate(() => state.lab), labNumber - 1, `${label}: lab ${labNumber} index`);
      assert.ok((await page.locator('#app').innerText()).includes(await page.evaluate(n => window.LINUX_NEXUS_LABS[n - 1].title, labNumber)), `${label}: lab ${labNumber} title`);
    }
    // Exécuter toutes les étapes des 7 laboratoires avec le terminal pédagogique.
    for (let labNumber = 1; labNumber <= 7; labNumber++) {
      await page.goto(base + `linux/?view=lab&lab=${labNumber}`, { waitUntil: 'load' });
      await page.evaluate(() => {
        state.fs = JSON.parse(JSON.stringify(window.LINUX_NEXUS_INITIAL_FS));
        state.cwd = '/home/student';
        state.labDone.delete(state.lab);
        save();
      });
      await page.locator('[data-labreset="1"]').click();
      const commands = await page.evaluate(n => window.LINUX_NEXUS_LABS[n - 1].steps.map(step => step[1]), labNumber);
      for (const [stepIndex, command] of commands.entries()) {
        await page.locator('#labcmd').fill(command);
        await page.locator('#labcmd').press('Enter');
        assert.equal(await page.evaluate(n => labSteps[n - 1], labNumber), stepIndex + 1,
          `${label}: lab ${labNumber} command ${stepIndex + 1} (${command}) validated`);
      }
      assert.match(await page.locator('#app').innerText(), /Mission accomplie/,
        `${label}: lab ${labNumber} completion displayed`);
      assert.equal(await page.evaluate(n => state.labDone.has(n - 1), labNumber), true,
        `${label}: lab ${labNumber} completed`);
      await page.reload({ waitUntil: 'load' });
      assert.equal(await page.evaluate(n => state.labDone.has(n - 1), labNumber), true,
        `${label}: lab ${labNumber} completion persists after refresh`);
    }
    // Erreur de commande : pas de progression, puis réinitialisation de la mission.
    await page.goto(base + 'linux/?view=lab&lab=2', { waitUntil: 'load' });
    await page.locator('[data-labreset="1"]').click();
    await page.locator('#labcmd').fill('echo resultat incorrect');
    await page.locator('#labcmd').press('Enter');
    assert.equal(await page.evaluate(() => labSteps[1]), 0, `${label}: invalid lab command does not advance`);
    assert.match(await page.locator('#labout').innerText(), /ne répond pas encore/, `${label}: invalid lab feedback`);
    await page.locator('#labcmd').fill('grep ERROR /var/log/app.log');
    await page.locator('#labcmd').press('Enter');
    assert.equal(await page.evaluate(() => labSteps[1]), 1, `${label}: valid command advances after error`);
    await page.locator('[data-labreset="1"]').click();
    assert.equal(await page.evaluate(() => labSteps[1]), 0, `${label}: lab reset restores first step`);
    assert.match(await page.locator('#app').innerText(), /Étape 1 sur 4/, `${label}: lab reset visible`);
    // Terminal : exécution, erreur, historique et conservation des fichiers fictifs.
    await page.evaluate(() => goto('terminal'));
    await page.locator('#cmd').fill('pwd');
    await page.locator('#cmd').press('Enter');
    assert.match(await page.locator('#termout').innerText(), /home\/student/, `${label}: terminal pwd output`);
    await page.locator('#cmd').fill('cat /chemin/inexistant');
    await page.locator('#cmd').press('Enter');
    assert.match(await page.locator('#termout').innerText(), /fichier absent/, `${label}: terminal missing file error`);
    await page.locator('#cmd').press('ArrowUp');
    assert.equal(await page.locator('#cmd').inputValue(), 'cat /chemin/inexistant', `${label}: terminal history up`);
    await page.locator('#cmd').fill('echo verification > /tmp/audit-ece.txt');
    await page.locator('#cmd').press('Enter');
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.fs['/tmp/audit-ece.txt']?.text?.trim()), 'verification',
      `${label}: virtual terminal file persists`);
    // Atelier Bash : script valide et erreur de syntaxe explicitement signalée.
    await page.evaluate(() => goto('bash'));
    await page.locator('#script').fill('NOM=ECE\necho Bonjour $NOM\nfor x in un deux; do echo $x; done');
    await page.locator('[data-script="1"]').click();
    assert.match(await page.locator('#scriptout').innerText(), /Bonjour ECE/, `${label}: Bash variable expansion`);
    assert.match(await page.locator('#scriptout').innerText(), /un[\s\S]*deux/, `${label}: Bash loop`);
    await page.locator('#script').fill('for x in un deux; do\necho $x');
    await page.locator('[data-script="1"]').click();
    assert.match(await page.locator('#scriptout').innerText(), /done manquant/, `${label}: Bash missing done error`);
    assert.deepEqual(errors, [], `${label}: laboratory JavaScript errors`);
    assert.deepEqual(failedAssets, [], `${label}: laboratory assets`);
    await page.evaluate(() => goto('sim'));
    await page.waitForFunction(() => document.querySelector('#simcontent')?.textContent?.includes('Ordonnancement CPU'));
    assert.equal(await page.locator('[data-sim]').count(), 4, `${label}: four simulator choices`);
    for (const kind of ['permissions', 'memory', 'network', 'process']) {
      await page.locator(`[data-sim="${kind}"]`).click();
      assert.ok((await page.locator('#simcontent').innerText()).trim().length > 100, `${label}: ${kind} simulator empty`);
    }
    // Interactions réelles : permissions octales, curseur mémoire et ordonnanceur.
    await page.locator('[data-sim="permissions"]').click();
    await page.locator('[data-perm="0"]').selectOption('7');
    await page.locator('[data-perm="1"]').selectOption('0');
    await page.locator('[data-perm="2"]').selectOption('0');
    assert.equal(await page.evaluate(() => state.perm), '700', `${label}: permissions selection updates state`);
    assert.ok((await page.locator('#simcontent').innerText()).includes('chmod 700 fichier.txt'), `${label}: octal permissions rendered`);
    await page.locator('[data-sim="memory"]').click();
    await page.locator('#ram').fill('92');
    assert.equal(await page.evaluate(() => state.ram), 92, `${label}: memory slider updates state`);
    assert.match(await page.locator('#simcontent').innerText(), /ÉLEVÉE/, `${label}: high memory pressure displayed`);
    await page.locator('[data-sim="process"]').click();
    const initialTick = await page.evaluate(() => state.simTick);
    await page.locator('[data-tick="1"]').click();
    assert.equal(await page.evaluate(() => state.simTick), initialTick + 1, `${label}: scheduler advances`);
    await page.locator('[data-tickreset="1"]').click();
    assert.equal(await page.evaluate(() => state.simTick), 0, `${label}: scheduler resets`);
    await page.locator('[data-sim="network"]').click();
    for (const stage of ['DNS', 'ROUTAGE', 'INTERFACE', 'SOCKET']) {
      assert.ok((await page.locator('#simcontent').innerText()).includes(stage), `${label}: network stage ${stage}`);
    }
    assert.deepEqual(errors, [], `${label}: simulator JavaScript errors`);
    // Préparer une seconde matière sans publier de cours fictif ni modifier le catalogue réel.
    const futurePage = await browser.newPage({ viewport });
    const futureErrors = [];
    futurePage.on('pageerror', error => futureErrors.push(error.message));
    await futurePage.route('**/js/catalog.js', async route => {
      const response = await route.fetch();
      const original = await response.text();
      const fixture = original.replace("levels: [], available: false, path: null }),",
        "levels: ['ING1', 'ING3'], available: false, path: null }),");
      assert.notEqual(fixture, original, `${label}: future catalog fixture injected`);
      await route.fulfill({ response, body: fixture });
    });
    await futurePage.goto(base, { waitUntil: 'load' });
    await futurePage.locator('#level').selectOption('ING1');
    assert.equal(await futurePage.locator('#courses .course').count(), 1,
      `${label}: future course visible at ING1`);
    assert.match(await futurePage.locator('#courses .course').innerText(), /Réseaux/,
      `${label}: future course label`);
    assert.equal(await futurePage.locator('#courses a').count(), 0,
      `${label}: unpublished course has no link`);
    await futurePage.locator('#level').selectOption('ING3');
    assert.equal(await futurePage.locator('#courses .course').count(), 2,
      `${label}: future multi-level course visible alongside Linux`);
    assert.equal(await futurePage.locator('#courses a').count(), 1,
      `${label}: only published Linux course is linked`);
    assert.deepEqual(futureErrors, [], `${label}: future catalog JavaScript errors`);
    await futurePage.close();
    console.log(`PASS browser startup, navigation, assets and reload: ${label}`);
    await page.close();
  }
  // Recette pre-migration: servir les memes fichiers sous le futur chemin GitHub Pages.
  // Verifier surtout la cle historique et l'absence de contamination Preview.
  for (const [label, viewport] of [
    ['desktop', { width: 1366, height: 768 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:')) missing.push(response.url());
    });
    const target = `http://127.0.0.1:${address.port}/ece-learn/`;
    await page.goto(target, { waitUntil: 'load' });
    await page.locator('#level').selectOption('ING3');
    assert.equal(await page.locator('#courses a').count(), 1, `${label}: ece-learn Linux available`);
    await page.locator('#courses a').click();
    assert.equal(new URL(page.url()).pathname, '/ece-learn/linux/', `${label}: future Linux URL`);
    await page.goto(target + 'linux/?view=learn&notion=12', { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#app')?.textContent?.trim().length > 100);
    assert.equal(await page.evaluate(() => state.active), 11, `${label}: future deep link notion 12`);
    await page.evaluate(() => {
      localStorage.setItem('linux_nexus_preview_complete_2026', JSON.stringify({ done: [55] }));
      window.ECE_STORAGE.save({ done: [11], labDone: [0], labStarted: [], attempts: {}, fs: window.LINUX_NEXUS_INITIAL_FS });
    });
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('linux_nexus_complete_2026')).done[0]), 11,
      `${label}: future site writes historical Linux progress key`);
    await page.reload({ waitUntil: 'load' });
    assert.equal(await page.evaluate(() => state.done.has(11)), true, `${label}: historical progress survives reload`);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('linux_nexus_preview_complete_2026')).done[0]), 55,
      `${label}: preview data stays untouched`);
    await page.locator('a.back-to-portal').click();
    assert.equal(new URL(page.url()).pathname, '/ece-learn/', `${label}: return to future portal`);
    assert.deepEqual(errors, [], `${label}: future path JS errors`);
    assert.deepEqual(missing, [], `${label}: future path missing assets`);
    await page.close();
    console.log(`PASS future /ece-learn/ path, historical storage and assets: ${label}`);
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
