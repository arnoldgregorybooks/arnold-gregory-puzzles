/* ============================================================
   NEON DECADE — Word Search: content data
   10 themes x 5 puzzles = 50 main puzzles
   + 8 bonus puzzles + 1 secret puzzle
   + motivational quotes + trivia quiz
   ============================================================ */

const THEMES = [
  {
    id: "pop",
    name: "Pop Culture & Icons",
    tagline: "The stuff everyone had, wore, or said",
    puzzles: [
      { difficulty: "easy",   words: ["NEON","MULLET","PERM","DENIM","TRENDY","RADICAL","PARTY"] },
      { difficulty: "medium", words: ["LEGWARMERS","SCRUNCHIE","BANDANA","WRISTBAND","CHOKER","SHOULDERPAD","BREAKDANCE","MOONWALK","GRAFFITI"] },
      { difficulty: "easy",   words: ["BOOMBOX","MIXTAPE","WALKMAN","ARCADE","ICON","STYLE","COOL"] },
      { difficulty: "medium", words: ["SYNTHPOP","NEWWAVE","SPANDEX","AEROBICS","JAZZERCISE","ROLLERSKATE","SKATEBOARD","JELLYSHOES","HIGHTOPS"] },
      { difficulty: "easy",   words: ["ACIDWASH","FANNYPACK","SUNGLASSES","MALLRAT","GNARLY","TUBULAR","AWESOME"] }
    ]
  },
  {
    id: "music",
    name: "Music & Bands",
    tagline: "Turn it up",
    puzzles: [
      { difficulty: "easy",   words: ["RADIO","GUITAR","DRUMS","LYRICS","CHORUS","ALBUM","TOUR"] },
      { difficulty: "medium", words: ["TURNTABLE","CASSETTE","CONCERT","STADIUM","ROCKBAND","BASSLINE","ROCKSTAR","HEADBANGER","BACKSTAGE"] },
      { difficulty: "easy",   words: ["ENCORE","REMIX","ECHO","REVERB","TEMPO","BALLAD","ANTHEM"] },
      { difficulty: "medium", words: ["KEYBOARD","SAXOPHONE","TRUMPET","PERCUSSION","HARMONY","MELODY","RHYTHM","SOUNDCHECK","MICROPHONE"] },
      { difficulty: "easy",   words: ["SPEAKER","AMPLIFIER","HEADPHONES","KEYTAR","VINYL","SINGLE","FANCLUB"] }
    ]
  },
  {
    id: "movies",
    name: "Movies & TV",
    tagline: "Lights, camera, cassette tape",
    puzzles: [
      { difficulty: "easy",   words: ["SCREEN","CINEMA","SEQUEL","TICKET","USHER","MATINEE","CLASSIC"] },
      { difficulty: "medium", words: ["BLOCKBUSTER","BOXOFFICE","POPCORN","DRIVEIN","PRIMETIME","SITCOM","MINISERIES","CLIFFHANGER","SPINOFF"] },
      { difficulty: "easy",   words: ["RERUN","CHANNEL","REMOTE","ANTENNA","SCRIPT","COSTUME","PREMIERE"] },
      { difficulty: "medium", words: ["LAUGHTRACK","COMMERCIAL","STUNTMAN","DIRECTOR","PRODUCER","ACTIONHERO","CATCHPHRASE","THEMESONG","SCREENPLAY"] },
      { difficulty: "easy",   words: ["VILLAIN","SIDEKICK","CAMEO","FRANCHISE","SAGA","BALCONY","ICONIC"] }
    ]
  },
  {
    id: "cartoons",
    name: "Cartoons & Saturday Mornings",
    tagline: "Bowl of cereal, feet on the couch",
    puzzles: [
      { difficulty: "easy",   words: ["CARTOON","SATURDAY","MORNING","SUPERHERO","CAPE","MASK","ROBOT"] },
      { difficulty: "medium", words: ["ANIMATION","TRANSFORM","SPACESHIP","ALIEN","MUTANT","NINJA","WARRIOR","ADVENTURE","TREASURE"] },
      { difficulty: "easy",   words: ["MAGIC","WIZARD","DRAGON","CASTLE","KINGDOM","RESCUE","MISSION"] },
      { difficulty: "medium", words: ["GADGET","INVENTOR","SCIENTIST","EXPERIMENT","PORTAL","DIMENSION","GALAXY","PLANET","ROCKET"] },
      { difficulty: "easy",   words: ["ASTRONAUT","COMET","METEOR","ORBIT","STARSHIP","CREW","CAPTAIN"] }
    ]
  },
  {
    id: "tech",
    name: "Tech & Gadgets",
    tagline: "State of the art (back then)",
    puzzles: [
      { difficulty: "easy",   words: ["COMPUTER","MODEM","MONITOR","PRINTER","CALCULATOR","PAGER","JOYSTICK"] },
      { difficulty: "medium", words: ["FLOPPYDISK","DIALUP","CAMCORDER","POLAROID","CARTRIDGE","CONSOLE","PROCESSOR","DISKETTE","SOFTWARE"] },
      { difficulty: "easy",   words: ["VCR","REMOTE","ANTENNA","SATELLITE","STEREO","CORDLESS","DIGITAL"] },
      { difficulty: "medium", words: ["HARDWARE","CIRCUIT","BATTERY","CHARGER","TELEVISION","ELECTRONIC","GADGET","INVENTION","PROTOTYPE"] },
      { difficulty: "easy",   words: ["PIXEL","GRAPHICS","MEMORY","HANDHELD","CONTROLLER","SCANNER","STATIC"] }
    ]
  },
  {
    id: "toys",
    name: "Toys & Arcade Games",
    tagline: "One more quarter, one more round",
    puzzles: [
      { difficulty: "medium", words: ["ARCADE","PINBALL","HIGHSCORE","CABINET","JOYSTICK","LEVEL","POWERUP","CHEATCODE","PLAYER"] },
      { difficulty: "easy",   words: ["PUZZLE","DOLL","YOYO","KITE","MARBLES","JACKS","FRISBEE"] },
      { difficulty: "medium", words: ["BOARDGAME","ACTIONFIGURE","PLAYSET","BLOCKS","RUBIKSCUBE","HOPSCOTCH","JUMPROPE","WATERGUN","SLINGSHOT"] },
      { difficulty: "easy",   words: ["SKATEBOARD","BIKE","TRICYCLE","SANDBOX","SWINGSET","TREEHOUSE","RECESS"] },
      { difficulty: "medium", words: ["CLUBHOUSE","BACKYARD","PLAYGROUND","HIDESEEK","SLINKY","CATCH","KICKBALL","DODGEBALL","TAG"] }
    ]
  },
  {
    id: "fashion",
    name: "Fashion & Style",
    tagline: "Bigger, brighter, bolder",
    puzzles: [
      { difficulty: "medium", words: ["TRACKSUIT","WINDBREAKER","OVERALLS","SUSPENDERS","MOHAWK","CROPTOP","TANKTOP","TUBETOP","PLATFORM"] },
      { difficulty: "easy",   words: ["STILETTO","LOAFERS","BLAZER","PASTEL","PATTERN","PLAID","CHAIN"] },
      { difficulty: "medium", words: ["PUFFSLEEVE","RIPPEDJEAN","STONEWASH","POLKADOT","STRIPES","CHECKERED","CAMOUFLAGE","STUDDED","EARRING"] },
      { difficulty: "easy",   words: ["BRACELET","ANKLET","HEADBAND","VISOR","BERET","FEDORA","CARDIGAN"] },
      { difficulty: "medium", words: ["TRENCH","TURTLENECK","JUMPSUIT","ROMPER","CULOTTES","LEATHER","SATIN","VELVET","SEQUIN"] }
    ]
  },
  {
    id: "slang",
    name: "Slang & Sayings",
    tagline: "Like, totally speak the language",
    puzzles: [
      { difficulty: "medium", words: ["TOTALLY","WHATEVER","CHILL","MELLOW","GROOVY","RIGHTEOUS","STOKED","PUMPED","PSYCHED"] },
      { difficulty: "easy",   words: ["BUMMER","LAME","WEIRDO","DWEEB","NERD","GEEK","PREPPY"] },
      { difficulty: "medium", words: ["VALLEY","HOMEBOY","POSSE","SQUAD","WICKED","KILLER","SLAMMIN","JAMMIN","CHILLIN"] },
      { difficulty: "easy",   words: ["HANGOUT","HANGTEN","SURFER","WIPEOUT","GRODY","SPAZ","BOGUS"] },
      { difficulty: "medium", words: ["GRIND","TOAST","BUSTED","SNAP","DUDE","BUDDY","FAROUT","TUBULAR","SICK"] }
    ]
  },
  {
    id: "history",
    name: "Historical Moments",
    tagline: "The decade that shaped the news",
    puzzles: [
      { difficulty: "medium", words: ["COLDWAR","SUMMIT","ELECTION","TREATY","SUPERPOWER","EMBASSY","INAUGURATION","OLYMPICS","BOYCOTT"] },
      { difficulty: "easy",   words: ["TORCH","MEDAL","ATHLETE","CEREMONY","FLAG","NATION","ECONOMY"] },
      { difficulty: "medium", words: ["INFLATION","RECESSION","INDUSTRY","FACTORY","UNION","STRIKE","CANDIDATE","CAMPAIGN","DEBATE"] },
      { difficulty: "easy",   words: ["VOTE","BALLOT","PRESIDENT","SENATOR","CONGRESS","POLICY","REFORM"] },
      { difficulty: "medium", words: ["PROTEST","MARCH","RALLY","HEADLINE","NEWSPAPER","BROADCAST","JOURNAL","ANCHOR","BULLETIN"] }
    ]
  },
  {
    id: "food",
    name: "Food, Fads & Fun",
    tagline: "Sweet, salty, and a little bit sticky",
    puzzles: [
      { difficulty: "medium", words: ["MICROWAVE","CEREAL","POPROCK","BUBBLEGUM","MILKSHAKE","DINER","FASTFOOD","DRIVETHRU","NACHOS"] },
      { difficulty: "easy",   words: ["PIZZA","HOTDOG","BURGER","FRIES","SHAKE","SUNDAE","SNACK"] },
      { difficulty: "medium", words: ["CHIPS","PRETZEL","COOKIE","BROWNIE","CUPCAKE","JUICEBOX","KOOLAID","LUNCHBOX","THERMOS"] },
      { difficulty: "easy",   words: ["SLEEPOVER","BIRTHDAY","BALLOON","CONFETTI","STREAMER","PINATA","CAKE"] },
      { difficulty: "medium", words: ["CANDLE","GIFT","PRESENT","WRAPPING","RIBBON","SURPRISE","CELEBRATION","CANDY","LOLLIPOP"] }
    ]
  }
];

/* ---- Bonus puzzle pack (extra 8 puzzles, unlocked with the Bonus Zone) ---- */
const BONUS_PUZZLES = [
  { title: "Arcade Legends",       words: ["PACMAN","TETRIS","GALAGA","FROGGER","ASTEROIDS","DEFENDER","CENTIPEDE"] },
  { title: "Mixtape Magic",        words: ["CASSETTE","REWIND","MIXTAPE","BOOMBOX","STEREO","RADIO","SINGALONG"] },
  { title: "Neon Nights",          words: ["NEON","GLOWSTICK","LASER","DISCOBALL","NIGHTCLUB","STROBE","SPOTLIGHT"] },
  { title: "Totally Rad Toys",     words: ["SLINKY","YOYO","FRISBEE","RUBIKSCUBE","POGOSTICK","KITE","MARBLES"] },
  { title: "Prime Time TV",        words: ["SITCOM","RERUN","CHANNEL","ANTENNA","REMOTE","PRIMETIME","CLIFFHANGER"] },
  { title: "Decade Icons",         words: ["MULLET","BOOMBOX","ARCADE","WALKMAN","NEON","LEGWARMERS","SCRUNCHIE"] },
  { title: "Back to the Eighties", words: ["TIMEWARP","FLASHBACK","NOSTALGIA","VINTAGE","CLASSIC","THROWBACK","RETRO"] },
  { title: "Final Countdown",      words: ["COUNTDOWN","FINALE","CHAMPION","VICTORY","TRIUMPH","CELEBRATE","ENCORE"] }
];

/* ---- Secret puzzle, unlocked only after all 50 main puzzles are solved ---- */
const SECRET_PUZZLE = {
  title: "You Made It Through the 80s!",
  words: ["LEGEND","ALLSTAR","WINNER","SUPERSTAR","CHAMPION","VICTORY","AWESOME","TOTALLY","RADICAL"]
};

/* ---- Motivational monologues, shown between puzzles ---- */
const QUOTES = [
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

/* ---- Bonus trivia quiz ---- */
const TRIVIA = [
  {
    q: "What toy craze, invented by a Hungarian architecture professor, swept the world in the early 1980s?",
    options: ["Rubik's Cube", "Lite-Brite", "Simon", "Etch A Sketch"],
    answer: 0
  },
  {
    q: "What home video format eventually won out over Betamax during the 1980s format war?",
    options: ["Laserdisc", "VHS", "MiniDV", "DVD"],
    answer: 1
  },
  {
    q: "What music channel launched in 1981, changing how people discovered new songs?",
    options: ["VH1", "MTV", "BET", "CMT"],
    answer: 1
  },
  {
    q: "What portable cassette player, first released by Sony, defined personal listening throughout the decade?",
    options: ["The Discman", "The Boombox", "The Walkman", "The iPod"],
    answer: 2
  },
  {
    q: "What U.S. space shuttle was tragically lost shortly after launch in January 1986?",
    options: ["Columbia", "Discovery", "Atlantis", "Challenger"],
    answer: 3
  },
  {
    q: "What 1985 film trilogy follows a teenager who travels through time in a modified DeLorean?",
    options: ["Back to the Future", "The Terminator", "Ghostbusters", "Explorers"],
    answer: 0
  },
  {
    q: "What company released the first commercially available handheld mobile phone in 1983?",
    options: ["Nokia", "Sony", "Motorola", "Panasonic"],
    answer: 2
  },
  {
    q: "What dance move became famous for making the dancer appear to glide backward while stepping forward?",
    options: ["The Robot", "The Moonwalk", "The Worm", "The Running Man"],
    answer: 1
  },
  {
    q: "What historic wall, dividing a European city since 1961, fell in 1989?",
    options: ["The Berlin Wall", "Hadrian's Wall", "The Great Wall", "The Atlantic Wall"],
    answer: 0
  },
  {
    q: "What boxy portable stereo, often carried on a shoulder, was designed to play music loudly outdoors?",
    options: ["The Jambox", "The Boombox", "The Hi-Fi", "The Ghetto Blaster 3000"],
    answer: 1
  },
  {
    q: "What home video game console did Nintendo release in North America in 1985, reviving the industry?",
    options: ["Game Boy", "Sega Genesis", "Atari 2600", "Nintendo Entertainment System"],
    answer: 3
  },
  {
    q: "What knit legwear, worn over leggings, became a signature look thanks to the aerobics craze?",
    options: ["Legwarmers", "Gaiters", "Overalls", "Spats"],
    answer: 0
  },
  {
    q: "What term describes the synthesizer-driven music genre that rose to prominence in the decade?",
    options: ["Grunge", "New Wave", "Bebop", "Britpop"],
    answer: 1
  },
  {
    q: "What arcade game, featuring a yellow character eating dots while avoiding ghosts, became a global phenomenon?",
    options: ["Donkey Kong", "Galaga", "Pac-Man", "Frogger"],
    answer: 2
  },
  {
    q: "What accessory, worn around the waist, was a practical (if divisive) fashion staple of the decade?",
    options: ["The Fanny Pack", "The Utility Belt", "The Sash", "The Hip Flask"],
    answer: 0
  }
];
