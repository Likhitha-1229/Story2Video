import { StoryProject } from '../types/story';

export const DEMO_PROJECT: StoryProject = {
  id: 'demo-exam-panic-001',
  title: 'The Midnight syllabus Shock',
  summary: 'Four comfortable college friends lounge at the back of a drowsy afternoon lecture until one friend happens to check the academic portal—triggering a hilarious, synchronized panic when they realize the semester finals start at 9:00 AM tomorrow.',
  genre: 'Comedy',
  style: 'Pixar-like 3D animation',
  orientation: '16:9 Landscape',
  targetDuration: '1 minute',
  language: 'English',
  characterCount: 4,
  userStoryIdea: 'Four college friends are sitting in class. One friend suddenly remembers that they have an exam tomorrow, and everyone becomes shocked.',
  additionalInstructions: 'Keep exact same outfits and comedic exaggerations across all four scenes. Maintain high-energy comic timing.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  characters: [
    {
      id: 'char-1',
      name: 'Rahul',
      ageRange: '20-21',
      gender: 'Male',
      appearance: 'Slender build, expressive brown eyes, warm olive skin tone, slight stubble',
      hairstyle: 'Messy wavy dark brown hair flopping over forehead',
      clothing: 'Oversized mustard-yellow collegiate hoodie with white drawstring, dark denim jeans',
      personality: 'Carefree, procrastinator, easily startled, overly theatrical',
      role: 'The Forgetful Slacker',
      avatarColor: 'from-amber-500 to-yellow-600',
      consistencyProfile: 'Rahul: 20-year-old Indian male, slender build, messy wavy dark brown hair flopping over forehead, wearing oversized mustard-yellow collegiate hoodie with white drawstring, relaxed dark denim jeans, highly animated comic facial expressions with wide brown eyes.'
    },
    {
      id: 'char-2',
      name: 'Priya',
      ageRange: '20-21',
      gender: 'Female',
      appearance: 'Athletic lean posture, sharp inquisitive eyes, warm golden skin tone',
      hairstyle: 'High sleek ponytail tied with black velvet scrunchie',
      clothing: 'Emerald-green ribbed turtleneck knit sweater, small round tortoiseshell glasses, silver stud earrings',
      personality: 'Perfectionist, usually organized, prone to catastrophic spiraling under surprise',
      role: 'The Anxious Note-Taker',
      avatarColor: 'from-emerald-500 to-teal-600',
      consistencyProfile: 'Priya: 20-year-old Indian female, sleek high dark ponytail, round tortoiseshell spectacles, wearing emerald-green ribbed turtleneck knit sweater, neat silver stud earrings, expressive arched eyebrows and panic-stricken stare.'
    },
    {
      id: 'char-3',
      name: 'Karthik',
      ageRange: '21-22',
      gender: 'Male',
      appearance: 'Broad-shouldered, sharp jawline, athletic demeanor',
      hairstyle: 'Clean high fade haircut with textured dark top',
      clothing: 'Sporty navy-blue tech zip-up fleece jacket over white graphic t-shirt, matte black smartwatch',
      personality: 'Chill gamer dude who tries to act unbothered until reality breaks him',
      role: 'The Cool Skeptic',
      avatarColor: 'from-blue-500 to-indigo-600',
      consistencyProfile: 'Karthik: 21-year-old Indian male, athletic build, high fade textured dark haircut, wearing navy-blue tech zip fleece jacket over crisp white tee, matte black smartwatch on left wrist, transitions from relaxed smug grin to jaw-dropped disbelief.'
    },
    {
      id: 'char-4',
      name: 'Sneha',
      ageRange: '20-21',
      gender: 'Female',
      appearance: 'Petite, lively gestures, warm caramel skin tone',
      hairstyle: 'Shoulder-length bouncy raven curls with subtle plum-violet streak on the left fringe',
      clothing: 'Pastel lilac oversized denim trucker jacket over white tank top, stacked silver bohemian rings',
      personality: 'Social butterfly, gossip curator, loves drama, instantly gasps at any shock',
      role: 'The Melodramatic Reactor',
      avatarColor: 'from-purple-500 to-pink-600',
      consistencyProfile: 'Sneha: 20-year-old Indian female, bouncy shoulder-length raven curls with delicate plum streak, wearing pastel lilac oversized denim trucker jacket, chunky silver finger rings, dramatic wide-mouthed gasping face with clutching hands.'
    }
  ],
  scenes: [
    {
      sceneNumber: 1,
      title: 'Back-Row Bliss',
      duration: '12 seconds',
      location: 'University lecture amphitheater, tier 4 back row wooden desks',
      timeOfDay: 'Late afternoon, warm slanted sunlight dust motes',
      charactersPresent: ['Rahul', 'Priya', 'Karthik', 'Sneha'],
      characterActions: [
        { character: 'Rahul', action: 'Spinning a ballpoint pen lazily between his knuckles, daydreaming out the window' },
        { character: 'Priya', action: 'Color-coding lecture notes with a pastel highlighter while checking notifications on her iPad' },
        { character: 'Karthik', action: 'Leaning back with arms behind head, stifling a sleepy yawn' },
        { character: 'Sneha', action: 'Whispering gossip while secretly filing her fingernails beneath the wooden desk' }
      ],
      facialExpressions: [
        { character: 'Rahul', expression: 'Drowsy, peaceful grin, half-lidded eyes' },
        { character: 'Priya', expression: 'Mild focus gradually shifting into slight curiosity' },
        { character: 'Karthik', expression: 'Exhausted boredom, eyes fluttering' },
        { character: 'Sneha', expression: 'Smirking, playful, gossipy side-eye' }
      ],
      cameraDirection: {
        angle: 'Eye-level two-shot moving into wide group shot',
        movement: 'Slow gentle slider pan across the four friends seated in a row',
        shotType: 'Medium group establishing shot',
        distance: '6 feet away across desk',
        summary: 'Warm, lazy cinematic slider movement framing all four students in their natural sleepy college habitat.'
      },
      environment: 'Warm sunlit wooden amphitheater lecture hall with chalkboard blurred in far background, scattered notebooks, laptop with coffee cup, dust motes floating in sunbeam.',
      dialogues: [
        {
          speaker: 'Rahul',
          line: 'Bro, this professor has been talking about thermodynamics for three centuries.'
        },
        {
          speaker: 'Karthik',
          line: 'Wake me up when graduation happens. Or when food arrives.'
        }
      ],
      soundEffects: [
        'Distant monotonous professor droning',
        'Pen tapping rhythmically on wooden bench',
        'Paper rustling gently',
        'Faint classroom ventilation hum'
      ],
      backgroundMusic: {
        mood: 'Playful, lazy acoustic pizzicato with light marimba',
        tempo: 'Slow relaxed 84 BPM',
        instrumentation: 'Plucked upright bass, acoustic guitar, soft shaker'
      },
      imagePrompt: 'Pixar 3D animation style, cinematic lighting. Four college friends sitting in the back row of a sunlit wooden university amphitheater. Rahul (yellow hoodie, messy hair) spins a pen. Priya (emerald sweater, ponytail, round glasses) highlights an iPad. Karthik (navy tech jacket, fade haircut) leans back yawning. Sneha (lilac denim jacket, plum hair streak) whispers. Warm afternoon sunbeams, rich stylized 3D render, highly consistent character designs, 16:9 aspect ratio.',
      videoPrompt: 'Pixar 3D animated film scene, 16:9 landscape. Slow smooth slider camera movement across four college friends in the back row of a sunny college classroom. Character 1: Rahul in mustard yellow hoodie carelessly spins a pen. Character 2: Priya in emerald green turtleneck and round glasses tapping her iPad. Character 3: Karthik in navy tech jacket yawning. Character 4: Sneha in lilac denim jacket whispering. Warm amber lecture hall lighting, shallow depth of field, high visual consistency, 4k 3D stylized animation.'
    },
    {
      sceneNumber: 2,
      title: 'The Academic Calendar Epiphany',
      duration: '14 seconds',
      location: 'University lecture amphitheater back row desk',
      timeOfDay: 'Late afternoon',
      charactersPresent: ['Rahul', 'Priya', 'Karthik', 'Sneha'],
      characterActions: [
        { character: 'Priya', action: 'Freezes instantly while tapping the university LMS calendar app, eyes locking onto tomorrow’s bold red date' },
        { character: 'Rahul', action: 'Pen slips from his fingers and clatters loudly on the desk' },
        { character: 'Karthik', action: 'Glances lazily over Priya’s shoulder' },
        { character: 'Sneha', action: 'Stops mid-sentence with nail file suspended in mid-air' }
      ],
      facialExpressions: [
        { character: 'Priya', expression: 'Petrified horror, pupils contracting behind round glasses, jaw hanging open' },
        { character: 'Rahul', expression: 'Confused innocence turning into creeping dread' },
        { character: 'Karthik', expression: 'Smug amusement slowly faltering' },
        { character: 'Sneha', expression: 'Perplexed eyebrow raise, sensing catastrophe' }
      ],
      cameraDirection: {
        angle: 'Low Dutch angle pushing into extreme close-up',
        movement: 'Rapid snap-zoom into Priya’s glowing iPad screen showing "ADVANCED MECHANICS FINAL - OCT 12, 09:00 AM", then whip back to her face',
        shotType: 'Tight Close-up to Dutch angle',
        distance: '18 inches from face',
        summary: 'Dramatic comic vertigo dolly-zoom emphasizing the sudden crash of reality.'
      },
      environment: 'Glowing tablet screen displaying bright red calendar warning icon, blurred classmates in foreground.',
      dialogues: [
        {
          speaker: 'Priya',
          line: 'Wait. Guys... what date is today?'
        },
        {
          speaker: 'Rahul',
          line: 'Tuesday the eleventh? Why, did someone cancel cafeteria pizza?'
        },
        {
          speaker: 'Priya',
          line: 'Our semester final is tomorrow morning at nine. Tomorrow. In fourteen hours.'
        }
      ],
      soundEffects: [
        'Loud plastic pen clattering onto polished wood desk',
        'Sudden high-pitched vinyl record scratch',
        'Subtle low-frequency heartbeat thud',
        'Digital notification chime chime'
      ],
      backgroundMusic: {
        mood: 'Sudden comical stop into ominous cello tremolo and ticking clock',
        tempo: 'Abrupt deceleration to dead silence followed by rapid 140 BPM comic tension',
        instrumentation: 'Ticking clock, dissonant cartoon strings, squeaking woodwinds'
      },
      imagePrompt: 'Pixar 3D animation style, dramatic comic moment. Close-up on Priya (emerald sweater, sleek ponytail, round tortoiseshell glasses) staring with utter petrified shock at her glowing iPad showing a bold red calendar date. Rahul (mustard yellow hoodie) in background staring with mouth open as pen falls. Karthik and Sneha frozen in horror. Dynamic Dutch camera angle, comic lighting flare, high character consistency, 16:9.',
      videoPrompt: 'Pixar 3D animated film scene, 16:9 landscape. Dramatic comic dolly zoom on Priya in emerald green turtleneck, round glasses reflecting red tablet screen as she freezes in horror. Rahul in mustard yellow hoodie drops pen in slow motion. Sneha in lilac denim jacket gasps with wide eyes. Karthik in navy fleece leans in as expression turns from relaxed to dread. Cinematic depth of field, sharp comedic timing, stylized 3D render.'
    },
    {
      sceneNumber: 3,
      title: 'Synchronized Meltdown',
      duration: '16 seconds',
      location: 'University lecture amphitheater, tier 4 desks',
      timeOfDay: 'Late afternoon',
      charactersPresent: ['Rahul', 'Priya', 'Karthik', 'Sneha'],
      characterActions: [
        { character: 'Rahul', action: 'Grabs his messy hair with both hands, sliding down until only his eyes peek over the wooden desk edge' },
        { character: 'Karthik', action: 'Frantically swipes his own phone, drops it onto his lap, and frantically checks the course syllabus' },
        { character: 'Sneha', action: 'Clutches her cheeks with silver-ringed hands in full Macaulay Culkin Home Alone pose' },
        { character: 'Priya', action: 'Rapidly flipping five-hundred-page textbook, generating paper whirlwind' }
      ],
      facialExpressions: [
        { character: 'Rahul', expression: 'Hyperventilating cartoon panic, bulging eyes, trembling lower lip' },
        { character: 'Priya', expression: 'Manic determination, teeth gritted, sweat drop bead forming' },
        { character: 'Karthik', expression: 'Existential crisis, thousand-yard stare into the void' },
        { character: 'Sneha', expression: 'Dramatic operatic despair, mouth wide open in silent scream' }
      ],
      cameraDirection: {
        angle: 'Frontal symmetrical low angle moving left to right',
        movement: 'Rapid fast whip-pans between each character’s extreme facial reaction, ending on wide four-character split frame',
        shotType: 'Rapid montage of Extreme Close-ups into 4-person wide shot',
        distance: 'Dynamic 1 to 4 feet',
        summary: 'High-octane comic whip-pans highlighting four distinct flavors of student panic.'
      },
      environment: 'Books flinging open, loose papers fluttering in air, highlighters rolling off desk, backlit afternoon sun creating comic silhouette halos.',
      dialogues: [
        {
          speaker: 'Karthik',
          line: 'Fourteen hours?! I haven’t even bought the textbook! I don’t even know what room the exam is in!'
        },
        {
          speaker: 'Sneha',
          line: 'I didn’t highlight anything! I don’t even have clean socks for tomorrow!'
        },
        {
          speaker: 'Rahul',
          line: 'Can a person legally fake their own temporary disappearance for forty-eight hours?!'
        }
      ],
      soundEffects: [
        'Comic cartoon brass "wah-wah-wah" slide',
        'Frantic paper rustling tornado',
        'Phone clattering onto plastic seat',
        'Chair squeaking violently backwards',
        'Loud synchronized comic gasp'
      ],
      backgroundMusic: {
        mood: 'Fast-paced frenetic cartoon gypsy jazz with runaway brass',
        tempo: 'Frantic 160 BPM',
        instrumentation: 'Fast saxophone, muted trumpet, slapstick xylophone, frantic hi-hats'
      },
      imagePrompt: 'Pixar 3D animation style. Wide angle shot of four college friends having an exaggerated synchronized comic meltdown at their lecture desk. Rahul in mustard yellow hoodie cowering under desk clutching head. Karthik in navy fleece staring in disbelief holding phone. Priya in emerald turtleneck hyper-focusing over papers. Sneha in lilac denim hands on cheeks screaming. Hilarious exaggerated expressions, warm auditorium background, 16:9.',
      videoPrompt: 'Pixar 3D animated film scene, 16:9 landscape. Fast paced comedy sequence. Rapid whip-pans showing: 1) Rahul in mustard yellow hoodie ducking under desk in complete denial; 2) Karthik in navy tech jacket dropping his phone in shock; 3) Sneha in lilac jacket with hands on face gasping; 4) Priya frantically flipping through an enormous book. Dynamic camera motion, high comic energy, consistent characters, premium 3D render.'
    },
    {
      sceneNumber: 4,
      title: 'The All-Nighter War Room Protocol',
      duration: '18 seconds',
      location: 'University lecture hall back door exit corridor',
      timeOfDay: 'Sunset transitioning to twilight, amber and indigo shadows',
      charactersPresent: ['Rahul', 'Priya', 'Karthik', 'Sneha'],
      characterActions: [
        { character: 'Rahul', action: 'Zip up his backpack with military urgency and sling both straps over shoulders' },
        { character: 'Priya', action: 'Pointing her mechanical pencil forward like a battle general commanding troops' },
        { character: 'Karthik', action: 'Cracking knuckles while already ordering four energy drinks on his phone' },
        { character: 'Sneha', action: 'Tying her hair back with determination, throwing notebook into tote bag' }
      ],
      facialExpressions: [
        { character: 'Rahul', expression: 'Heroic desperate resolve, narrowed eyes' },
        { character: 'Priya', expression: 'Fierce battle-commander gaze, triumphant smirk' },
        { character: 'Karthik', expression: 'Locked-in gamer mode, intense focus' },
        { character: 'Sneha', expression: 'Fiery solidarity, nodding aggressively' }
      ],
      cameraDirection: {
        angle: 'Ultra low heroic angle looking up at all four friends standing side-by-side',
        movement: 'Slow-motion tracking forward shot as they march out of the lecture hall door like an elite heist squad',
        shotType: 'Hero wide tracking shot',
        distance: '8 feet away',
        summary: 'Heroic parody slow-motion march, framing the study group like Avengers assembling for an impossible mission.'
      },
      environment: 'Auditorium exit double doors swinging open into golden hallway, silhouettes outlined with heroic rim lighting.',
      dialogues: [
        {
          speaker: 'Priya',
          line: 'My apartment. Four laptops. Six liters of cold brew. We conquer six months of syllabus by sunrise.'
        },
        {
          speaker: 'Rahul',
          line: 'If we die of caffeine overdose, tell my mother I at least bought the notebook.'
        },
        {
          speaker: 'Karthik',
          line: 'Lock and load, team. Operation All-Nighter is green.'
        }
      ],
      soundEffects: [
        'Dramatic cinematic orchestral boom',
        'Backpack heavy zipper sliding shut',
        'Knuckles cracking in sync',
        'Heavy auditorium exit doors swinging open with whoosh'
      ],
      backgroundMusic: {
        mood: 'Epic cinematic action-hero orchestral parody building to triumphant brass crescendo',
        tempo: '128 BPM heroic driving march',
        instrumentation: 'Heroic brass horns, pounding cinematic taiko drums, driving string ostinato'
      },
      imagePrompt: 'Pixar 3D animation style. Heroic low-angle shot of four college friends marching out of lecture hall double doors in dramatic parody slow motion. Rahul in mustard yellow hoodie with backpack, Priya in emerald sweater pointing pencil forward like commander, Karthik in navy fleece cracking knuckles, Sneha in lilac denim jacket marching with fierce resolve. Golden rim backlight, dust motes, cinematic triumph, 16:9.',
      videoPrompt: 'Pixar 3D animated film scene, 16:9 landscape. Epic slow-motion low-angle tracking shot. Four college friends exit university auditorium like a SWAT team preparing for an all-nighter. Backlit by golden sunset rim light through open double doors. Rahul in mustard hoodie, Priya in emerald turtleneck pointing ahead, Karthik in navy tech jacket, Sneha in lilac denim jacket. Dramatic heroic cinematic camera glide, 4k 3D stylized film look.'
    }
  ]
};
