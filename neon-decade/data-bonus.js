/* ============================================================
   NEON DECADE v2 — bonus content + per-puzzle intro lines
   ============================================================ */

/* Shown at the top of EVERY puzzle (sudoku or word search), picked at random */
const DAILY_MONOLOGUES = [
  "Rewind the doubt, hit play on your dreams. Every great decade started with someone brave enough to turn up the volume on their own life.",
  "You don't need a crystal ball to know where you're headed — just a little grit, a lot of heart, and the guts to keep pressing forward.",
  "Some people wait for the spotlight. The rest of us bring our own.",
  "Every champion was once a beginner who refused to put the controller down.",
  "The best comebacks are never rehearsed. Keep showing up, and the rest writes itself.",
  "You are one bold decision away from a totally different story.",
  "Big hair, bigger dreams. Never let anyone talk you into playing it small.",
  "The tape doesn't stop just because the song gets hard. Neither do you.",
  "Somewhere between the static and the signal, you'll find exactly what you were looking for.",
  "Every high score started with a first, clumsy attempt. Put the quarter in and try again.",
  "You don't have to be the loudest voice in the room to be the one people remember.",
  "Nostalgia is proof that you've already survived every hard day you were once afraid of.",
  "Fast forward through the excuses. The good part is coming.",
  "A little neon never hurt anybody. Shine louder than the doubt.",
  "The world doesn't remember who almost showed up. Be unforgettable.",
  "Every legend has a training montage. This puzzle is yours.",
  "Keep your chin up and your collar popped — confidence was always in style.",
  "You get one shot at today. Make it the kind of memory you'd want to replay.",
  "The mixtape of your life is still being recorded. Choose a good next track.",
  "Somebody, somewhere, is about to give up one puzzle short of their breakthrough. Don't let it be you."
];

const TRIVIA = [
  { q: "What toy craze, invented by a Hungarian architecture professor, swept the world in the early 1980s?",
    options: ["Rubik's Cube", "Lite-Brite", "Simon", "Etch A Sketch"], answer: 0 },
  { q: "What home video format eventually won out over Betamax during the 1980s format war?",
    options: ["Laserdisc", "VHS", "MiniDV", "DVD"], answer: 1 },
  { q: "What music channel launched in 1981, changing how people discovered new songs?",
    options: ["VH1", "MTV", "BET", "CMT"], answer: 1 },
  { q: "What portable cassette player, first released by Sony, defined personal listening throughout the decade?",
    options: ["The Discman", "The Boombox", "The Walkman", "The iPod"], answer: 2 },
  { q: "What U.S. space shuttle was tragically lost shortly after launch in January 1986?",
    options: ["Columbia", "Discovery", "Atlantis", "Challenger"], answer: 3 },
  { q: "What 1985 film trilogy follows a teenager who travels through time in a modified DeLorean?",
    options: ["Back to the Future", "The Terminator", "Ghostbusters", "Explorers"], answer: 0 },
  { q: "What company released the first commercially available handheld mobile phone in 1983?",
    options: ["Nokia", "Sony", "Motorola", "Panasonic"], answer: 2 },
  { q: "What dance move became famous for making the dancer appear to glide backward while stepping forward?",
    options: ["The Robot", "The Moonwalk", "The Worm", "The Running Man"], answer: 1 },
  { q: "What historic wall, dividing a European city since 1961, fell in 1989?",
    options: ["The Berlin Wall", "Hadrian's Wall", "The Great Wall", "The Atlantic Wall"], answer: 0 },
  { q: "What boxy portable stereo, often carried on a shoulder, was designed to play music loudly outdoors?",
    options: ["The Jambox", "The Boombox", "The Hi-Fi", "The Ghetto Blaster 3000"], answer: 1 },
  { q: "What home video game console did Nintendo release in North America in 1985, reviving the industry?",
    options: ["Game Boy", "Sega Genesis", "Atari 2600", "Nintendo Entertainment System"], answer: 3 },
  { q: "What knit legwear, worn over leggings, became a signature look thanks to the aerobics craze?",
    options: ["Legwarmers", "Gaiters", "Overalls", "Spats"], answer: 0 },
  { q: "What term describes the synthesizer-driven music genre that rose to prominence in the decade?",
    options: ["Grunge", "New Wave", "Bebop", "Britpop"], answer: 1 },
  { q: "What arcade game, featuring a yellow character eating dots while avoiding ghosts, became a global phenomenon?",
    options: ["Donkey Kong", "Galaga", "Pac-Man", "Frogger"], answer: 2 },
  { q: "What accessory, worn around the waist, was a practical (if divisive) fashion staple of the decade?",
    options: ["The Fanny Pack", "The Utility Belt", "The Sash", "The Hip Flask"], answer: 0 }
];

/* 80s flashback facts — browsable, no quiz, just fun */
const FLASHBACK_FACTS = [
  "The Rubik's Cube, invented by Hungarian professor Ernő Rubik, became one of the best-selling toys of the decade.",
  "MTV launched in 1981, changing the way people discovered new music forever.",
  "The Sony Walkman made portable, private listening possible for the first time.",
  "\"E.T. the Extra-Terrestrial\" became one of the highest-grossing films of the decade.",
  "Most homes were still connecting to computers through slow, screeching dial-up modems by the end of the decade.",
  "Big hair wasn't just a look — hairspray sales soared throughout the decade.",
  "The Berlin Wall, standing since 1961, finally came down in 1989.",
  "Nintendo's home console revived the video game industry in North America after a major crash earlier in the decade.",
  "Cabbage Patch Kids caused actual store stampedes during their holiday season peak.",
  "The first CD players reached consumer shelves, though cassette tapes remained king for most of the decade.",
  "Aerobics classes, fueled by home workout videos, became a nationwide fitness craze.",
  "Saturday morning cartoons were appointment viewing for an entire generation of kids.",
  "The mullet haircut — short in front, long in back — became a genuinely mainstream style.",
  "Cordless phones freed households from being tethered to the wall for the first time.",
  "Breakdancing crews turned city sidewalks and flattened cardboard boxes into stages.",
  "The first true camcorders let ordinary families record their own home movies.",
  "Fluorescent, neon-colored clothing was everywhere, from windbreakers to legwarmers.",
  "Arcades were the place to be, one quarter and one high score at a time.",
  "The fanny pack, love it or hate it, was a genuinely practical accessory of the decade.",
  "Synth-driven New Wave music brought drum machines and keyboards to the top of the charts.",
  "The first mobile phones were the size of a brick and cost as much as a used car.",
  "Saturday morning commercials sold an entire generation on sugary cereal mascots.",
  "Roller skating rinks were a Friday-night ritual for teenagers across the country.",
  "VHS tapes turned video rental stores into a Friday-night tradition for families everywhere."
];
