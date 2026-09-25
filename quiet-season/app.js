/* ============================================================
   QUIET SEASON — application logic
   ============================================================ */

const STORAGE_KEY = "quiet-season-progress-v1";

/* ----------------------------- state ----------------------------- */

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.version === 1) return parsed;
    }
  }catch(e){}
  return {
    version: 1,
    seenIntro: false,
    sudoku: SUDOKU_PUZZLES.map(p => ({ filled: p.puzzle, solved: false })),
    wordsearch: WS_PUZZLES.map(() => ({ solved: false, found: [] }))
  };
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}
let state = loadState();

function sudokuSolvedCount(){ return state.sudoku.filter(p => p.solved).length; }
function wsSolvedCount(){ return state.wordsearch.filter(p => p.solved).length; }

/* ------------------------------- screens ------------------------------- */

const app = document.getElementById("app");
function go(renderFn){
  app.innerHTML = "";
  renderFn(app);
  window.scrollTo(0,0);
}
function flash(msg){
  const el = document.createElement("div");
  el.className = "flash-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => { el.classList.remove("show"); setTimeout(()=>el.remove(),300); }, 2200);
}

/* ---- intro ---- */
function renderIntro(){
  go(root => {
    root.innerHTML = `
      <div class="intro-screen">
        <div class="intro-card">
          <div class="intro-badge">❄</div>
          <h1 class="brand">Quiet Season</h1>
          <p class="brand-sub">200 Puzzles for a Calm Mind</p>
          <p class="brand-author">by Arnold Gregory</p>
          <div class="intro-body">
            <p><strong>What's inside</strong></p>
            <ul>
              <li><strong>100 Sudoku</strong> puzzles — Easy, Normal, and Hard, mixed throughout.</li>
              <li><strong>100 Word Search</strong> puzzles across ten cozy, nostalgic themes.</li>
              <li><strong>Bonus page</strong> — Daily Wisdom and a few witty monologues, open any time, no unlocking needed.</li>
            </ul>
            <p><strong>How it works</strong></p>
            <ul>
              <li>Sudoku: tap a square, then tap a number to fill it. Check your work, reset, or reveal the answer any time.</li>
              <li>Word Search: drag across a word, or tap its first letter then its last.</li>
              <li>Your progress saves automatically on this device, even mid-puzzle.</li>
              <li>Plays right in your browser — no app store, no install required.</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-big" id="startBtn">Begin</button>
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
    const wrap = document.createElement("div");
    wrap.className = "home-screen";
    wrap.innerHTML = `
      <header class="topbar home-topbar">
        <div>
          <h1 class="brand small">Quiet Season</h1>
          <p class="brand-sub">200 Puzzles for a Calm Mind</p>
          <p class="brand-author">by Arnold Gregory</p>
        </div>
      </header>
      <div class="home-cards">
        <button class="home-card" id="sudokuCard">
          <span class="home-card-icon">✎</span>
          <span class="home-card-title">Sudoku</span>
          <span class="home-card-sub">${sudokuSolvedCount()} / 100 solved</span>
        </button>
        <button class="home-card" id="wsCard">
          <span class="home-card-icon">◎</span>
          <span class="home-card-title">Word Search</span>
          <span class="home-card-sub">${wsSolvedCount()} / 100 solved</span>
        </button>
        <button class="home-card bonus-card" id="bonusCard">
          <span class="home-card-icon">✦</span>
          <span class="home-card-title">Bonus Page</span>
          <span class="home-card-sub">Daily Wisdom &amp; Witty Monologues</span>
        </button>
      </div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#sudokuCard").addEventListener("click", () => renderSudokuDifficulty());
    wrap.querySelector("#wsCard").addEventListener("click", () => renderWsThemes());
    wrap.querySelector("#bonusCard").addEventListener("click", () => renderBonus());
  });
}

/* ============================== SUDOKU ============================== */

function sudokuByDifficulty(diff){
  return SUDOKU_PUZZLES
    .map((p, idx) => ({p, idx}))
    .filter(x => x.p.difficulty === diff);
}

function renderSudokuDifficulty(){
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock"><h1 class="brand small">Sudoku</h1><p class="brand-sub">Pick a difficulty</p></div>
      </header>
      <div class="diff-cards" id="diffCards"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderHome);
    const diffCards = wrap.querySelector("#diffCards");
    [["easy","Easy",40],["normal","Normal",30],["hard","Hard",30]].forEach(([key,label,count]) => {
      const items = sudokuByDifficulty(key);
      const solved = items.filter(x => state.sudoku[x.idx].solved).length;
      const card = document.createElement("button");
      card.className = "diff-card diff-" + key;
      card.innerHTML = `<span class="diff-card-label">${label}</span><span class="diff-card-sub">${solved}/${count} solved</span>`;
      card.addEventListener("click", () => renderSudokuGrid(key));
      diffCards.appendChild(card);
    });
  });
}

function renderSudokuGrid(diff){
  const items = sudokuByDifficulty(diff);
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock"><h1 class="brand small">Sudoku — ${diff[0].toUpperCase()+diff.slice(1)}</h1></div>
      </header>
      <div class="number-grid" id="numberGrid"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderSudokuDifficulty);
    const ng = wrap.querySelector("#numberGrid");
    items.forEach((x, i) => {
      const solved = state.sudoku[x.idx].solved;
      const started = !solved && state.sudoku[x.idx].filled !== SUDOKU_PUZZLES[x.idx].puzzle;
      const tile = document.createElement("button");
      tile.className = "number-tile" + (solved ? " solved" : started ? " inprogress" : "");
      tile.textContent = i + 1;
      tile.addEventListener("click", () => renderSudokuPlay(x.idx));
      ng.appendChild(tile);
    });
  });
}

function renderSudokuPlay(idx){
  const puzzle = SUDOKU_PUZZLES[idx];
  const progress = state.sudoku[idx];
  let filled = progress.filled.split("");
  let selected = null;

  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "puzzle-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Exit</button>
        <div class="titleblock"><h1 class="brand small">Sudoku &mdash; ${puzzle.difficulty[0].toUpperCase()+puzzle.difficulty.slice(1)}</h1></div>
      </header>
      <div class="sudoku-body">
        <div class="sudoku-grid" id="sudokuGrid"></div>
        <div class="numpad" id="numpad"></div>
      </div>
      <div class="puzzle-actions">
        <button class="btn ghost-btn" id="checkBtn">Check</button>
        <button class="btn ghost-btn" id="resetBtn">Reset</button>
        <button class="btn ghost-btn" id="revealBtn">Reveal</button>
      </div>
      <div class="ws-status" id="status"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", () => renderSudokuGrid(puzzle.difficulty));

    const gridEl = wrap.querySelector("#sudokuGrid");
    const statusEl = wrap.querySelector("#status");
    const cellEls = [];

    function persist(){
      progress.filled = filled.join("");
      saveState();
    }
    function checkWin(){
      if(filled.join("") === puzzle.solution){
        progress.solved = true;
        persist();
        statusEl.textContent = "Solved! Well done.";
        cellEls.forEach(el => el.classList.add("solved-flash"));
      }
    }
    function renderCells(){
      gridEl.innerHTML = "";
      cellEls.length = 0;
      for(let i=0;i<81;i++){
        const r = Math.floor(i/9), c = i%9;
        const cell = document.createElement("div");
        cell.className = "sd-cell";
        if(r%3===0) cell.classList.add("border-top");
        if(c%3===0) cell.classList.add("border-left");
        if(r===8) cell.classList.add("border-bottom");
        if(c===8) cell.classList.add("border-right");
        const isGiven = puzzle.puzzle[i] !== "0";
        if(isGiven) cell.classList.add("given");
        if(selected === i) cell.classList.add("selected");
        cell.textContent = filled[i] === "0" ? "" : filled[i];
        cell.addEventListener("click", () => {
          if(isGiven) return;
          selected = i;
          renderCells();
        });
        gridEl.appendChild(cell);
        cellEls.push(cell);
      }
    }
    renderCells();

    const numpad = wrap.querySelector("#numpad");
    for(let n=1;n<=9;n++){
      const b = document.createElement("button");
      b.className = "num-btn";
      b.textContent = n;
      b.addEventListener("click", () => {
        if(selected === null){ statusEl.textContent = "Tap an empty square first."; return; }
        filled[selected] = String(n);
        persist();
        renderCells();
        if(!filled.includes("0")) checkWin();
      });
      numpad.appendChild(b);
    }
    const clearBtn = document.createElement("button");
    clearBtn.className = "num-btn clear-btn";
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", () => {
      if(selected === null) return;
      filled[selected] = "0";
      persist();
      renderCells();
    });
    numpad.appendChild(clearBtn);

    wrap.querySelector("#checkBtn").addEventListener("click", () => {
      let wrongCount = 0;
      cellEls.forEach((el, i) => {
        if(filled[i] !== "0" && filled[i] !== puzzle.solution[i]){
          el.classList.add("wrong-flash");
          wrongCount++;
        }
      });
      statusEl.textContent = wrongCount === 0 ? "Looks correct so far!" : `${wrongCount} square${wrongCount>1?"s":""} may need another look.`;
      setTimeout(() => cellEls.forEach(el => el.classList.remove("wrong-flash")), 1200);
    });
    wrap.querySelector("#resetBtn").addEventListener("click", () => {
      filled = puzzle.puzzle.split("");
      progress.solved = false;
      selected = null;
      persist();
      renderCells();
      statusEl.textContent = "Puzzle reset.";
    });
    wrap.querySelector("#revealBtn").addEventListener("click", () => {
      filled = puzzle.solution.split("");
      progress.solved = true;
      persist();
      renderCells();
      statusEl.textContent = "Solution revealed.";
    });
  });
}

/* =========================== WORD SEARCH =========================== */

const DIRS_ALL = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
const DIRS_EASY = [[1,0],[0,1]];

function makeGrid(words, size, dirs){
  const attempts = 400;
  let grid, placements;
  for(let tryAll = 0; tryAll < 60; tryAll++){
    grid = Array.from({length:size}, () => Array(size).fill(null));
    placements = [];
    const sorted = [...words].sort((a,b) => b.length - a.length);
    let ok = true;
    for(const word of sorted){
      let placed = false;
      for(let a = 0; a < attempts; a++){
        const [dx,dy] = dirs[Math.floor(Math.random()*dirs.length)];
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

function renderWsThemes(){
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "home-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock"><h1 class="brand small">Word Search</h1><p class="brand-sub">${wsSolvedCount()} / 100 solved</p></div>
      </header>
      <div class="theme-grid" id="themeGrid"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderHome);
    const grid = wrap.querySelector("#themeGrid");
    WS_THEMES.forEach((theme, idx) => {
      const puzzlesInTheme = WS_PUZZLES.map((p,i)=>({p,i})).filter(x => x.p.theme === theme.id);
      const solved = puzzlesInTheme.filter(x => state.wordsearch[x.i].solved).length;
      const el = document.createElement("button");
      el.className = "theme-tile";
      el.style.setProperty("--tile-hue", `${(idx*36) % 360}`);
      el.innerHTML = `
        <span class="theme-name">${theme.name}</span>
        <span class="theme-tagline">${theme.tagline}</span>
        <span class="theme-progress">${solved}/${puzzlesInTheme.length} solved</span>
      `;
      el.addEventListener("click", () => renderWsPuzzleList(theme.id));
      grid.appendChild(el);
    });
  });
}

function renderWsPuzzleList(themeId){
  const theme = WS_THEMES.find(t => t.id === themeId);
  const items = WS_PUZZLES.map((p,i)=>({p,i})).filter(x => x.p.theme === themeId);
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock"><h1 class="brand small">${theme.name}</h1><p class="brand-sub">${theme.tagline}</p></div>
      </header>
      <div class="puzzle-list" id="puzzleList"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderWsThemes);
    const list = wrap.querySelector("#puzzleList");
    items.forEach((x, i) => {
      const prog = state.wordsearch[x.i];
      const inProgress = !prog.solved && prog.found.length > 0;
      const row = document.createElement("button");
      row.className = "puzzle-row" + (prog.solved ? " solved" : inProgress ? " inprogress" : "");
      row.innerHTML = `
        <span class="puzzle-num">${i+1}</span>
        <span class="puzzle-meta">
          <span class="puzzle-diff diff-${x.p.difficulty}">${x.p.difficulty}</span>
          <span class="puzzle-count">${x.p.words.length} words</span>
        </span>
        <span class="puzzle-status">${prog.solved ? "✓ Solved" : inProgress ? `${prog.found.length}/${x.p.words.length} found` : "Play"}</span>
      `;
      row.addEventListener("click", () => renderWsPlay(x.i, () => renderWsPuzzleList(themeId)));
      list.appendChild(row);
    });
  });
}

let activeWs = null;

function renderWsPlay(puzzleIdx, onExit){
  const p = WS_PUZZLES[puzzleIdx];
  const progress = state.wordsearch[puzzleIdx];
  const dirs = p.difficulty === "easy" ? DIRS_EASY : DIRS_ALL;
  const {grid, placements} = makeGrid(p.words, p.grid, dirs);
  const found = new Set(progress.found.filter(w => p.words.includes(w)));

  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "puzzle-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Exit</button>
        <div class="titleblock"><h1 class="brand small">${p.themeName}</h1></div>
      </header>
      <p class="puzzle-hint">Drag across a word, or tap its first letter then its last. Tap the start letter again to cancel.</p>
      <div class="puzzle-body">
        <div class="grid-wrap"><div class="wordgrid" id="wordgrid" style="--gridsize:${p.grid}"></div></div>
        <div class="wordlist-wrap">
          <div class="wordlist-head">
            <h2 class="section-head">Find these</h2>
            <span class="found-count" id="foundCount">${found.size}/${p.words.length} found</span>
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
    root.querySelector("#backBtn").addEventListener("click", onExit);

    const wlEl = wrap.querySelector("#wordlist");
    const foundCountEl = wrap.querySelector("#foundCount");
    const statusEl = wrap.querySelector("#wsStatus");
    p.words.forEach(w => {
      const li = document.createElement("li");
      li.dataset.word = w;
      li.textContent = w;
      if(found.has(w)) li.classList.add("found");
      wlEl.appendChild(li);
    });

    const gridEl = wrap.querySelector("#wordgrid");
    const cellEls = [];
    for(let r=0;r<p.grid;r++){
      const rowEls = [];
      for(let c=0;c<p.grid;c++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = grid[r][c];
        cell.dataset.r = r; cell.dataset.c = c;
        gridEl.appendChild(cell);
        rowEls.push(cell);
      }
      cellEls.push(rowEls);
    }
    placements.forEach(pl => {
      if(found.has(pl.word)) pl.cells.forEach(([r,c]) => cellEls[r][c].classList.add("found"));
    });

    function updateFoundCount(){ foundCountEl.textContent = `${found.size}/${p.words.length} found`; }
    function persist(){ progress.found = [...found]; saveState(); }

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

    activeWs = {
      anchor: null, pointerActive: false, didMove: false, tempPath: [],
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
        statusEl.textContent = this.anchor ? "Selecting… tap the last letter, drag, or tap the start letter again to cancel." : "";
      },
      onDown(x,y){
        const pos = cellFromPoint(x,y);
        if(!pos) return;
        this.pointerActive = true; this.didMove = false;
        if(this.anchor === null){ this.anchor = pos; this.updatePath(pos,pos); }
        else { this.updatePath(this.anchor, pos); this.didMove = true; }
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
          const match = placements.find(pl => !found.has(pl.word) && (pl.word === str || pl.word === rev));
          if(match){
            found.add(match.word);
            this.tempPath.forEach(({r,c}) => { cellEls[r][c].classList.remove("active"); cellEls[r][c].classList.add("found"); });
            const li = wlEl.querySelector(`[data-word="${match.word}"]`);
            if(li) li.classList.add("found");
            updateFoundCount();
            statusEl.textContent = `Found ${match.word}!`;
            if(found.size === p.words.length){
              progress.solved = true;
              persist();
              statusEl.textContent = "All words found!";
            } else {
              persist();
            }
          } else {
            this.tempPath.forEach(({r,c}) => cellEls[r][c].classList.add("wrong"));
            statusEl.textContent = "Not quite — try again.";
            setTimeout(() => { this.tempPath.forEach(({r,c}) => cellEls[r][c].classList.remove("wrong")); }, 350);
          }
        }
        this.clearTemp();
        this.anchor = null;
        this.updateStatus();
      }
    };

    gridEl.addEventListener("pointerdown", e => { e.preventDefault(); activeWs.onDown(e.clientX, e.clientY); });

    wrap.querySelector("#resetPuzzleBtn").addEventListener("click", () => {
      found.clear();
      progress.solved = false;
      persist();
      wlEl.querySelectorAll("li.found").forEach(li => li.classList.remove("found"));
      cellEls.forEach(row => row.forEach(el => el.classList.remove("found","active","wrong")));
      updateFoundCount();
      statusEl.textContent = "Puzzle reset.";
      if(activeWs){ activeWs.anchor = null; activeWs.tempPath = []; activeWs.pointerActive = false; }
    });
    wrap.querySelector("#revealBtn").addEventListener("click", () => {
      placements.forEach(pl => {
        if(found.has(pl.word)) return;
        found.add(pl.word);
        pl.cells.forEach(([r,c]) => cellEls[r][c].classList.add("found"));
        const li = wlEl.querySelector(`[data-word="${pl.word}"]`);
        if(li) li.classList.add("found");
      });
      progress.solved = true;
      persist();
      updateFoundCount();
      statusEl.textContent = "Solution revealed.";
      if(activeWs){ activeWs.anchor = null; activeWs.tempPath = []; activeWs.pointerActive = false; }
    });
  });
}

/* ================================ BONUS ================================ */

function renderBonus(){
  go(root => {
    const wrap = document.createElement("div");
    wrap.className = "list-screen";
    wrap.innerHTML = `
      <header class="topbar">
        <button class="btn btn-back" id="backBtn">&larr; Back</button>
        <div class="titleblock"><h1 class="brand small">Bonus Page</h1></div>
      </header>
      <div class="bonus-tabs">
        <button class="bonus-tab active" id="wisdomTab">Daily Wisdom</button>
        <button class="bonus-tab" id="monologueTab">Witty Monologues</button>
      </div>
      <div class="bonus-content" id="bonusContent"></div>
    `;
    root.appendChild(wrap);
    wrap.querySelector("#backBtn").addEventListener("click", renderHome);

    const content = wrap.querySelector("#bonusContent");
    const wisdomTab = wrap.querySelector("#wisdomTab");
    const monologueTab = wrap.querySelector("#monologueTab");

    function showList(items, iconChar){
      content.innerHTML = "";
      items.forEach(text => {
        const card = document.createElement("div");
        card.className = "bonus-card-item";
        card.innerHTML = `<span class="bonus-item-icon">${iconChar}</span><p>${text}</p>`;
        content.appendChild(card);
      });
    }
    wisdomTab.addEventListener("click", () => {
      wisdomTab.classList.add("active"); monologueTab.classList.remove("active");
      showList(DAILY_WISDOM, "❄");
    });
    monologueTab.addEventListener("click", () => {
      monologueTab.classList.add("active"); wisdomTab.classList.remove("active");
      showList(WITTY_MONOLOGUES, "☺");
    });
    showList(DAILY_WISDOM, "❄");
  });
}

/* ------------------------------- boot ------------------------------- */

window.addEventListener("pointermove", e => { if(activeWs) activeWs.onMove(e.clientX, e.clientY); });
window.addEventListener("pointerup", () => { if(activeWs) activeWs.onUp(); });

if(state.seenIntro) renderHome();
else renderIntro();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
