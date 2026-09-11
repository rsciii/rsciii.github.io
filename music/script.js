/* =========================================================
   THE JERSEY RAMBLE — combo calculator
   Everyone sings; most play more than one thing. The point of
   this widget is instrument COVERAGE, not just headcount.
   NOTE: roster is mirrored in the lineup cards in index.html.
   ========================================================= */

const PLAYERS = [
  { id:'bob',    name:'Bob',     plays:'Vocals · Guitar · Keys · Organ', covers:['gtr','keys'], space:26, power:3, load:20, vol:3 },
  { id:'steve',  name:'Steve',   plays:'Vocals · Guitar',                covers:['gtr'],        space:16, power:1, load:12, vol:3 },
  { id:'christ', name:'Chris T', plays:'Vocals · Guitar',                covers:['gtr'],        space:16, power:1, load:12, vol:3 },
  { id:'chriss', name:'Chris S', plays:'Bass · Vocals',                  covers:['bass'],       space:16, power:1, load:12, vol:3 },
  { id:'bobby',  name:'Bobby',   plays:'Keys · Organ · Vocals',          covers:['keys'],       space:22, power:2, load:16, vol:2 },
  { id:'ono',    name:'Ono',     plays:'Drums · Vocals',                 covers:['drums'],      space:38, power:0, load:25, vol:4 },
];

/* every player sings — that's the whole pitch */
PLAYERS.forEach(p => p.covers.push('vox'));

const INSTRUMENTS = [
  { key:'gtr',   label:'Guitar' },
  { key:'bass',  label:'Bass'   },
  { key:'keys',  label:'Keys'   },
  { key:'drums', label:'Drums'  },
];

const PRESETS = {
  duo:     ['bob','steve'],
  trio:    ['bob','steve','chriss'],
  quartet: ['bob','steve','chriss','christ'],
  full:    PLAYERS.map(p => p.id),
};

const SIZE_NAMES = ['Empty Stage','Solo','Duo','Trio','Quartet','Quintet','The Full Ramble'];
const HARMONY    = ['No vocals','Single voice','2-part','3-part','4-part','5-part','6-part'];
const MAX_VOL    = PLAYERS.reduce((n,p) => n + p.vol, 0);

const active = new Set(PRESETS.full);

/* ---------- toggles ---------- */
const playersEl = document.getElementById('players');

playersEl.innerHTML = PLAYERS.map(p => `
  <button class="player on" type="button" data-id="${p.id}" aria-pressed="true">
    <span class="player-led" aria-hidden="true"></span>
    <span class="player-txt">
      <span class="player-role">${p.name}</span>
      <span class="player-inst">${p.plays}</span>
    </span>
  </button>
`).join('');

playersEl.addEventListener('click', e => {
  const btn = e.target.closest('.player');
  if (!btn) return;
  const id = btn.dataset.id;
  active.has(id) ? active.delete(id) : active.add(id);
  render();
});

document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    active.clear();
    PRESETS[btn.dataset.preset].forEach(id => active.add(id));
    render();
  });
});

/* ---------- copy that reacts to who's actually on stage ---------- */
function bestFor(n, has) {
  if (n === 0) return "Nobody. Pick at least one — somebody's got to play.";
  if (n === 1) return 'Cocktail hours, ceremonies, and rooms where conversation still matters.';

  const kit = has.bass && has.drums;   // full rhythm section
  const low = has.bass && !has.drums;  // low end, no kit — quiet but not bare

  if (n === 2) return kit
    ? 'Small bars and patios — stripped down but still a rhythm section.'
    : low
    ? 'Restaurants and cocktail hours that still want some bottom end.'
    : 'Cocktail hours, dinner sets, ceremonies, and restaurant gigs.';

  if (n === 3) return kit
    ? 'Bars, backyards, and anywhere a power trio beats a crowd.'
    : low
    ? 'Cocktail hours, dinner sets, and listening rooms — band feel, half the volume.'
    : 'Private dinners, wineries, and long acoustic afternoons.';

  if (n === 4) return kit
    ? 'Bars, house parties, corporate events, and most of a wedding.'
    : low
    ? 'Ceremonies, cocktail hours, and corporate rooms with a noise ordinance.'
    : 'Cocktail-to-dinner transitions and rooms that want songs, not volume.';

  if (n === 5) return kit
    ? 'Wedding receptions, club stages, and town events with real sound.'
    : low
    ? 'Large cocktail hours and corporate rooms that want a band, not a concert.'
    : 'Big acoustic sets — a lot of voices and not a lot of amplifier.';

  return 'Festivals, big rooms, and anything with a dance floor.';
}

function volumeLabel(pct) {
  if (pct === 0) return 'Silence';
  if (pct <= 25) return 'Background';
  if (pct <= 45) return 'Conversational';
  if (pct <= 70) return 'Party';
  if (pct <= 88) return 'Loud';
  return 'Full send';
}

function noteFor(n, has) {
  if (n === 0) return 'An empty stage is technically the quietest option available.';
  if (!has.bass && !has.drums) return 'No rhythm section — this is the acoustic setup. Voices carry it.';
  if (!has.drums) return 'No kit. Lighter load-in, easier sound check, happier neighbors.';
  if (!has.bass)  return 'No bass — guitars and the organ pedals cover the low end.';
  if (n >= 5)     return 'Full PA and a proper stage recommended. The organ needs a dolly.';
  return 'Drums in play. Check the room before you promise the neighbors anything.';
}

/* ---------- render ---------- */
const coverEl = document.getElementById('rd-cover');

function render() {
  const on = PLAYERS.filter(p => active.has(p.id));
  const n  = on.length;

  const covered = new Set(on.flatMap(p => p.covers));
  const has = { gtr:covered.has('gtr'), bass:covered.has('bass'),
                keys:covered.has('keys'), drums:covered.has('drums') };

  playersEl.querySelectorAll('.player').forEach(btn => {
    const isOn = active.has(btn.dataset.id);
    btn.classList.toggle('on', isOn);
    btn.setAttribute('aria-pressed', String(isOn));
  });

  const key = [...active].sort().join(',');
  document.querySelectorAll('.preset').forEach(btn => {
    btn.classList.toggle('is-on', PRESETS[btn.dataset.preset].slice().sort().join(',') === key);
  });

  coverEl.innerHTML = INSTRUMENTS.map(i => `
    <li class="cov ${has[i.key] ? 'yes' : 'no'}">
      <span class="cov-mark" aria-hidden="true">${has[i.key] ? '✓' : '✕'}</span>${i.label}
    </li>
  `).join('');

  document.getElementById('rd-harm').textContent = HARMONY[n];

  const sum = f => on.reduce((t,p) => t + p[f], 0);
  const volPct = Math.round((sum('vol') / MAX_VOL) * 100);

  document.getElementById('rd-name').textContent  = SIZE_NAMES[n];
  document.getElementById('rd-count').textContent = n;
  document.getElementById('rd-space').textContent = sum('space');
  document.getElementById('rd-power').textContent = n ? sum('power') + 2 : 0; // +2 for PA
  document.getElementById('rd-load').textContent  = n ? sum('load') + 15 : 0;

  document.getElementById('rd-vol').style.width     = volPct + '%';
  document.getElementById('rd-vol-lbl').textContent = volumeLabel(volPct);

  document.getElementById('rd-best').textContent = bestFor(n, has);
  document.getElementById('rd-note').textContent = noteFor(n, has);
}

render();

document.getElementById('yr').textContent = new Date().getFullYear();
