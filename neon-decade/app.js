/* ============================================================
   NEON DECADE — Word Search: application logic
   ============================================================ */

const STORAGE_KEY = "neon-decade-progress-v2";

const DIRS_ALL = [
  [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]
];
const DIRS_EASY = [[1,0],[0,1]]; // right, down only

/* ----------------------------- state ----------------------------- */
/* Each puzzle's progress is {solved, found:[words]} so a half-finished
   puzzle is remembered too, not just fully-solved ones. */

function freshPuzzleProgress(){ return {solved:false, found:[]}; }

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.version === 2) return parsed;
    }
  }catch(e){}
  return {
    version: 2,
    seenIntro: false,
    themes: THEMES.map(t => t.puzzles.map(freshPuzzleProgress)),
    bonus: BONUS_PUZZLES.map(freshPuzzleProgress),
    secret: freshPuzzleProgress(),
    triviaBest: null
  };
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}
let state = loadState();

function totalSolved(){
  return state.themes.reduce((sum, arr) => sum + arr.filter(p => p.solved).length, 0);
}
function totalPuzzles(){
  return THEMES.reduce((sum, t) => sum + t.puzzles.length, 0);
}
function bonusUnlocked(){
  return totalSolved() >= totalPuzzles();
}

/* ------------------------ word search generator ------------------------ */

function makeGrid(words, size, dirs){
  const attempts = 300;
  let grid, placements;

  for(let tryAll = 0; tryAll < 40; tryAll++){
    grid = Array.from({length:size}, () => Array(size).fill(null));
    placements = [];
    const sorted = [...words].sort((a,b) => b.length - a.length);
    let ok = true;

    for(const word of sorted){
      let placed = false;
      for(let a = 0; a < attempts; a++){
        const dir = dirs[Math.floor(Math.random()*dirs.length)];
        const [dx,dy] = dir;
        const row = dy === 1 ? Math.floor(Math.random()*(size - word.length + 1))
                  : dy === -1 ? Math.floor(Math.random()*(size - word.length + 1)) + word.length - 1
                  : Math.floor(Math.random()*size);
        const col = dx === 1 ? Math.floor(Math.random()*(size - word.length + 1))
                  : dx === -1 ? Math.floor(Math.random()*(size - word.length + 1)) + word.length - 1
                  : Math.floor(Math.random()*size);

        let fits = true;
        const cells = [];
        for(let i=0;i<word.length;i++){
          const r = row + dy*i, c = col + dx*i;
          if(r<0||r>=size||c<0||c>=size){ fits=false; break; }
          const existing = grid[r][c];
          if(existing !== null && existing !== word[i]){ fits=false; break; }
          cells.push([r,c]);
        }
        if(fits){
          cells.forEach(([r,c],i) => grid[r][c] = word[i]);
          placements.push({word, cells});
          placed = true;
          break;
        }
      }
      if(!placed){ ok = false; break; }
    }
    if(ok) break;
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<size;r++) for(let c=0;c<size;c++)
    if(grid[r][c] === null) grid[r][c] = letters[Math.floor(Math.random()*26)];

  return {grid, placements};
}

/* ------------------------------- screens ------------------------------- */

const app = document.getElementById("app");
let currentPuzzleCtx = null; // {source, themeIdx, puzzleIdx, onComplete}

function go(renderFn){
  app.innerHTML = "";
  renderFn(app);
  window.scrollTo(0,0);
}

function progressLabel(){
  return `${totalSolved()} / ${totalPuzzles()} solved`;
}

/* ---- intro / how it works ---- */
function renderIntro(){
  go(root => {
    root.innerHTML = `
      <div class="intro-screen">
        <div class="intro-card">
          <div class="intro-sun"></div>
          <h1 class="brand">NEON DECADE</h1>
          <p class="brand-sub">Word Search — Tablet Edition</p>
          <div class="intro-body">
            <p><strong>How it works</strong></p>
            <ul>
              <li>Pick a theme, then pick a puzzle inside it.</li>
              <li><strong>Two ways to select a word:</strong> drag across it start to finish, <em>or</em> tap its first letter and then tap its last letter. Tap your starting letter again to cancel and pick a new one.</li>
              <li>Find every word on the list to clear the puzzle. Stuck? <strong>Reset</strong> clears your progress on that puzzle, and <strong>Reveal</strong> shows every word.</li>
              <li>Clear all 50 puzzles to unlock the <strong>Bonus Zone</strong>: extra puzzles, a secret finale puzzle, and an 80s trivia quiz.</li>
              <li>Your progress — including half-finished puzzles — saves automatically on this device.</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-big" id="startBtn">Let's Go</button>
        </div>
      </div>`;
    root.querySelector("#startBtn").addEventListener("click", () => {
      state.seenIntro = true; saveState();
      renderHome();
    });
  });
}

/* ---- home ---- */
function renderHome(){
  go(root => {
    const unlocked = bonusUnlocked();
    const wrap = document.createElement("div");
    wrap.className = "home-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <div>
          <h1 class="brand small">NEON DECADE</h1>
          <p class="brand-sub">Word Search</p>
        </div>
        <div class="progress-chip">${progressLabel()}</div>
      </header>
      <div class="theme-grid" id="themeGrid"></div>
      <div class="bonus-tile ${unlocked ? "unlocked" : "locked"}" id="bonusTile">
        <div class="bonus-tile-inner">
          <span class="bonus-title">${unlocked ? "★ BONUS ZONE ★" : "BONUS ZONE"}</span>
          <span class="bonus-sub">${unlocked ? "Extra puzzles, a secret finale, and the 80s trivia quiz" : `Solve all ${totalPuzzles()} puzzles to unlock — ${progressLabel()}`}</span>
        </div>
      </div>
    `;
    root.appendChild(wrap);

    const grid = wrap.querySelector("#themeGrid");
    THEMES.forEach((theme, idx) => {
      const solved = state.themes[idx].filter(p => p.solved).length;
      const el = document.createElement("button");
      el.className = "theme-tile";
      el.style.setProperty("--tile-hue", `${(idx*36) % 360}`);
      el.innerHTML = `
        <span class="theme-name">${theme.name}</span>
        <span class="theme-tagline">${theme.tagline}</span>
        <span class="theme-progress">${solved}/${theme.puzzles.length} solved</span>
      `;
      el.addEventListener("click", () => renderThemeList(idx));
      grid.appendChild(el);
    });

    wrap.querySelector("#bonusTile").addEventListener("click", () => {
      if(unlocked) renderBonusZone();
      else flash("Solve every puzzle first — " + progressLabel());
    });
  });
}

function flash(msg){
  const el = document.createElement("div");
  el.className = "flash-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => { el.classList.remove("show"); setTimeout(()=>el.remove(),300); }, 2200);
}

/* ---- theme puzzle list ---- */
function renderThemeList(themeIdx){
  const theme = THEMES[themeIdx];
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock">
          <h1 class="brand small">${theme.name}</h1>
          <p class="brand-sub">${theme.tagline}</p>
        </div>
      </header>
      <div class="puzzle-list" id="puzzleList"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderHome);

    const list = wrap.querySelector("#puzzleList");
    theme.puzzles.forEach((p, i) => {
      const prog = state.themes[themeIdx][i];
      const inProgress = !prog.solved && prog.found.length > 0;
      const row = document.createElement("button");
      row.className = "puzzle-row" + (prog.solved ? " solved" : inProgress ? " inprogress" : "");
      row.innerHTML = `
        <span class="puzzle-num">${i+1}</span>
        <span class="puzzle-meta">
          <span class="puzzle-diff diff-${p.difficulty}">${p.difficulty}</span>
          <span class="puzzle-count">${p.words.length} words</span>
        </span>
        <span class="puzzle-status">${prog.solved ? "✓ Solved" : inProgress ? `${prog.found.length}/${p.words.length} found` : "Play"}</span>
      `;
      row.addEventListener("click", () => {
        currentPuzzleCtx = {source:"theme", themeIdx, puzzleIdx:i};
        renderPuzzle(p.words, p.difficulty === "easy" ? 10 : 13,
          p.difficulty === "easy" ? DIRS_EASY : DIRS_ALL,
          `${theme.name} — Puzzle ${i+1}`,
          prog,
          () => onPuzzleSolved());
      });
      list.appendChild(row);
    });
  });
}

function onPuzzleSolved(){
  const ctx = currentPuzzleCtx;
  if(ctx.source === "theme"){
    renderQuote(() => renderThemeList(ctx.themeIdx));
  } else if(ctx.source === "bonus"){
    renderQuote(() => renderBonusZone());
  } else if(ctx.source === "secret"){
    renderQuote(() => renderBonusZone());
  }
}

/* ---- quote interstitial ---- */
function renderQuote(nextFn){
  const quote = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  go(root => {
    root.innerHTML = `
      <div class="quote-screen">
        <div class="quote-card">
          <div class="quote-mark">"</div>
          <p class="quote-text">${quote}</p>
          <button class="btn btn-primary btn-big" id="continueBtn">Continue</button>
        </div>
      </div>`;
    root.querySelector("#continueBtn").addEventListener("click", nextFn);
  });
}

/* ---- bonus zone ---- */
function renderBonusZone(){
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock">
          <h1 class="brand small">★ Bonus Zone ★</h1>
          <p class="brand-sub">You earned this</p>
        </div>
      </header>
      <div class="bonus-sections">
        <section>
          <h2 class="section-head">Bonus Puzzle Pack</h2>
          <div class="puzzle-list" id="bonusList"></div>
        </section>
        <section>
          <h2 class="section-head">Secret Finale Puzzle</h2>
          <div class="puzzle-list" id="secretList"></div>
        </section>
        <section>
          <h2 class="section-head">80s Trivia Quiz</h2>
          <div class="puzzle-list" id="triviaList"></div>
        </section>
      </div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderHome);

    const bonusList = wrap.querySelector("#bonusList");
    BONUS_PUZZLES.forEach((p, i) => {
      const prog = state.bonus[i];
      const inProgress = !prog.solved && prog.found.length > 0;
      const row = document.createElement("button");
      row.className = "puzzle-row" + (prog.solved ? " solved" : inProgress ? " inprogress" : "");
      row.innerHTML = `
        <span class="puzzle-num">${i+1}</span>
        <span class="puzzle-meta"><span class="puzzle-count">${p.title} — ${p.words.length} words</span></span>
        <span class="puzzle-status">${prog.solved ? "✓ Solved" : inProgress ? `${prog.found.length}/${p.words.length} found` : "Play"}</span>`;
      row.addEventListener("click", () => {
        currentPuzzleCtx = {source:"bonus", puzzleIdx:i};
        renderPuzzle(p.words, 11, DIRS_ALL, p.title, prog, onPuzzleSolved);
      });
      bonusList.appendChild(row);
    });

    const secretList = wrap.querySelector("#secretList");
    const sprog = state.secret;
    const srow = document.createElement("button");
    srow.className = "puzzle-row" + (sprog.solved ? " solved" : sprog.found.length ? " inprogress" : "");
    srow.innerHTML = `
      <span class="puzzle-num">★</span>
      <span class="puzzle-meta"><span class="puzzle-count">${SECRET_PUZZLE.title}</span></span>
      <span class="puzzle-status">${sprog.solved ? "✓ Solved" : sprog.found.length ? `${sprog.found.length}/${SECRET_PUZZLE.words.length} found` : "Play"}</span>`;
    srow.addEventListener("click", () => {
      currentPuzzleCtx = {source:"secret"};
      renderPuzzle(SECRET_PUZZLE.words, 13, DIRS_ALL, SECRET_PUZZLE.title, sprog, onPuzzleSolved);
    });
    secretList.appendChild(srow);

    const triviaList = wrap.querySelector("#triviaList");
    const trow = document.createElement("button");
    trow.className = "puzzle-row" + (state.triviaBest !== null ? " solved" : "");
    trow.innerHTML = `
      <span class="puzzle-num">?</span>
      <span class="puzzle-meta"><span class="puzzle-count">${TRIVIA.length} questions</span></span>
      <span class="puzzle-status">${state.triviaBest !== null ? `Best: ${state.triviaBest}/${TRIVIA.length}` : "Play"}</span>`;
    trow.addEventListener("click", renderTrivia);
    triviaList.appendChild(trow);
  });
}

/* ---- trivia quiz ---- */
function renderTrivia(){
  let idx = 0, score = 0;
  const order = TRIVIA.map((_,i)=>i);

  function showQuestion(){
    const t = TRIVIA[order[idx]];
    go(root => {
      root.innerHTML = `
        <div class="trivia-screen">
          <header class="topbar">
            <button class="btn btn-back" id="backBtn">&larr; Exit</button>
            <div class="progress-chip">Question ${idx+1} / ${TRIVIA.length}</div>
          </header>
          <div class="trivia-card">
            <p class="trivia-q">${t.q}</p>
            <div class="trivia-options" id="opts"></div>
          </div>
        </div>`;
      root.querySelector("#backBtn").addEventListener("click", renderBonusZone);
      const optsWrap = root.querySelector("#opts");
      t.options.forEach((opt, oi) => {
        const b = document.createElement("button");
        b.className = "trivia-opt";
        b.textContent = opt;
        b.addEventListener("click", () => {
          const correct = oi === t.answer;
          if(correct) score++;
          [...optsWrap.children].forEach((c,ci) => {
            c.disabled = true;
            if(ci === t.answer) c.classList.add("correct");
            else if(ci === oi) c.classList.add("wrong");
          });
          setTimeout(() => {
            idx++;
            if(idx < TRIVIA.length) showQuestion();
            else showResult();
          }, 900);
        });
        optsWrap.appendChild(b);
      });
    });
  }

  function showResult(){
    if(state.triviaBest === null || score > state.triviaBest){
      state.triviaBest = score; saveState();
    }
    go(root => {
      root.innerHTML = `
        <div class="quote-screen">
          <div class="quote-card">
            <p class="quote-text" style="font-size:1.6rem;">You scored</p>
            <p class="trivia-score">${score} / ${TRIVIA.length}</p>
            <button class="btn btn-primary btn-big" id="doneBtn">Back to Bonus Zone</button>
          </div>
        </div>`;
      root.querySelector("#doneBtn").addEventListener("click", renderBonusZone);
    });
  }

  showQuestion();
}

/* ---- puzzle play ----
   Selection supports BOTH continuous drag AND a two-tap mode (tap the first
   letter, then tap the last letter). Window-level pointer listeners are
   registered ONCE at boot (see bottom of file); `activePuzzle` is swapped
   per puzzle instead of re-registering handlers, so re-entering puzzles
   never stacks duplicate listeners. */
let activePuzzle = null;

function renderPuzzle(words, size, dirs, title, progress, onAllFound){
  const {grid, placements} = makeGrid(words, size, dirs);
  const found = new Set(progress.found.filter(w => words.includes(w)));

  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "puzzle-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Exit</button>
        <div class="titleblock"><h1 class="brand small">${title}</h1></div>
      </header>
      <p class="puzzle-hint">Drag across a word, or tap its first letter then its last. Tap the start letter again to cancel.</p>
      <div class="puzzle-body">
        <div class="grid-wrap"><div class="wordgrid" id="wordgrid" style="--gridsize:${size}"></div></div>
        <div class="wordlist-wrap">
          <div class="wordlist-head">
            <h2 class="section-head">Find these</h2>
            <span class="found-count" id="foundCount">${found.size}/${words.length} found</span>
          </div>
          <ul class="wordlist" id="wordlist"></ul>
          <div class="puzzle-actions">
            <button class="btn ghost-btn" id="resetPuzzleBtn">Reset puzzle</button>
            <button class="btn ghost-btn" id="revealBtn">Reveal all words</button>
          </div>
          <div class="ws-status" id="wsStatus"></div>
        </div>
      </div>
    `;
    root.appendChild(wrap);
    root.querySelector("#backBtn").addEventListener("click", () => {
      if(currentPuzzleCtx.source === "theme") renderThemeList(currentPuzzleCtx.themeIdx);
      else renderBonusZone();
    });

    const wlEl = wrap.querySelector("#wordlist");
    const foundCountEl = wrap.querySelector("#foundCount");
    const statusEl = wrap.querySelector("#wsStatus");
    words.forEach(w => {
      const li = document.createElement("li");
      li.dataset.word = w;
      li.textContent = w;
      if(found.has(w)) li.classList.add("found");
      wlEl.appendChild(li);
    });

    const gridEl = wrap.querySelector("#wordgrid");
    const cellEls = [];
    for(let r=0;r<size;r++){
      const rowEls = [];
      for(let c=0;c<size;c++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = grid[r][c];
        cell.dataset.r = r; cell.dataset.c = c;
        gridEl.appendChild(cell);
        rowEls.push(cell);
      }
      cellEls.push(rowEls);
    }
    // paint back in any already-found words (restored progress)
    placements.forEach(p => {
      if(found.has(p.word)){
        p.cells.forEach(([r,c]) => cellEls[r][c].classList.add("found"));
      }
    });

    function updateFoundCount(){
      foundCountEl.textContent = `${found.size}/${words.length} found`;
    }
    function persist(){
      progress.found = [...found];
      saveState();
    }

    function cellFromPoint(x,y){
      const el = document.elementFromPoint(x,y);
      if(!el || !el.classList || !el.classList.contains("cell")) return null;
      return {r: +el.dataset.r, c: +el.dataset.c};
    }
    function straightPath(a,b){
      const dr = b.r - a.r, dc = b.c - a.c;
      if(dr === 0 && dc === 0) return [a];
      const adr = Math.abs(dr), adc = Math.abs(dc);
      if(!(dr === 0 || dc === 0 || adr === adc)) return null;
      const steps = Math.max(adr,adc);
      const sr = dr === 0 ? 0 : dr/adr, sc = dc === 0 ? 0 : dc/adc;
      const out = [];
      for(let i=0;i<=steps;i++) out.push({r: a.r + sr*i, c: a.c + sc*i});
      return out;
    }
    gridEl.style.touchAction = "none";

    activePuzzle = {
      anchor: null,
      pointerActive: false,
      didMove: false,
      tempPath: [],

      clearTemp(){
        this.tempPath.forEach(({r,c}) => {
          const el = cellEls[r][c];
          if(!el.classList.contains("found")) el.classList.remove("active");
        });
        this.tempPath = [];
      },
      updatePath(a,b){
        this.clearTemp();
        const path = straightPath(a,b);
        if(!path) return;
        this.tempPath = path;
        path.forEach(({r,c}) => {
          const el = cellEls[r][c];
          if(!el.classList.contains("found")) el.classList.add("active");
        });
      },
      updateStatus(){
        statusEl.textContent = this.anchor
          ? "Selecting… tap the last letter, drag, or tap the start letter again to cancel."
          : "";
      },
      onDown(x,y){
        const pos = cellFromPoint(x,y);
        if(!pos) return;
        this.pointerActive = true;
        this.didMove = false;
        if(this.anchor === null){
          this.anchor = pos;
          this.updatePath(pos,pos);
        } else {
          this.updatePath(this.anchor, pos);
          this.didMove = true;
        }
        this.updateStatus();
      },
      onMove(x,y){
        if(!this.pointerActive || this.anchor === null) return;
        const pos = cellFromPoint(x,y);
        if(!pos) return;
        if(pos.r !== this.anchor.r || pos.c !== this.anchor.c) this.didMove = true;
        this.updatePath(this.anchor, pos);
      },
      onUp(){
        if(!this.pointerActive) return;
        this.pointerActive = false;
        if(this.didMove) this.finalize();
      },
      finalize(){
        if(this.tempPath.length > 1){
          const str = this.tempPath.map(({r,c}) => grid[r][c]).join("");
          const rev = str.split("").reverse().join("");
          const match = placements.find(p => !found.has(p.word) && (p.word === str || p.word === rev));
          if(match){
            found.add(match.word);
            this.tempPath.forEach(({r,c}) => {
              cellEls[r][c].classList.remove("active");
              cellEls[r][c].classList.add("found");
            });
            const li = wlEl.querySelector(`[data-word="${match.word}"]`);
            if(li) li.classList.add("found");
            updateFoundCount();
            statusEl.textContent = `Found ${match.word}!`;
            if(found.size === words.length){
              progress.solved = true;
              persist();
              statusEl.textContent = "All words found!";
              setTimeout(() => onAllFound(), 500);
            } else {
              persist();
            }
          } else {
            // visible "wrong attempt" feedback instead of silently clearing
            this.tempPath.forEach(({r,c}) => cellEls[r][c].classList.add("wrong"));
            statusEl.textContent = "Not quite — try again.";
            setTimeout(() => {
              this.tempPath.forEach(({r,c}) => cellEls[r][c].classList.remove("wrong"));
            }, 350);
          }
        }
        this.clearTemp();
        this.anchor = null;
        this.updateStatus();
      }
    };

    gridEl.addEventListener("pointerdown", e => { e.preventDefault(); activePuzzle.onDown(e.clientX, e.clientY); });

    wrap.querySelector("#resetPuzzleBtn").addEventListener("click", () => {
      found.clear();
      progress.solved = false;
      persist();
      wlEl.querySelectorAll("li.found").forEach(li => li.classList.remove("found"));
      cellEls.forEach(row => row.forEach(el => el.classList.remove("found","active","wrong")));
      updateFoundCount();
      statusEl.textContent = "Puzzle reset.";
      if(activePuzzle){ activePuzzle.anchor = null; activePuzzle.tempPath = []; activePuzzle.pointerActive = false; }
    });

    wrap.querySelector("#revealBtn").addEventListener("click", () => {
      placements.forEach(p => {
        if(found.has(p.word)) return;
        found.add(p.word);
        p.cells.forEach(([r,c]) => cellEls[r][c].classList.add("found"));
        const li = wlEl.querySelector(`[data-word="${p.word}"]`);
        if(li) li.classList.add("found");
      });
      progress.solved = true;
      persist();
      updateFoundCount();
      statusEl.textContent = "Solution revealed.";
      if(activePuzzle){ activePuzzle.anchor = null; activePuzzle.tempPath = []; activePuzzle.pointerActive = false; }
    });
  });
}

/* ------------------------------- boot ------------------------------- */

// Single, permanent window-level listeners for puzzle-grid drag/tap selection.
window.addEventListener("pointermove", e => { if(activePuzzle) activePuzzle.onMove(e.clientX, e.clientY); });
window.addEventListener("pointerup", () => { if(activePuzzle) activePuzzle.onUp(); });

if(state.seenIntro) renderHome();
else renderIntro();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
