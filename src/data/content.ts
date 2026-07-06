/**
 * Content for the Hendrick Hamel journal site.
 *
 * All text is an original, plain-language retelling written for this site,
 * based on the historical record of Hamel's 1668 report and the standard
 * scholarship around it. It intentionally does NOT present invented lines as
 * verbatim quotations from the manuscript — passages are described, not quoted,
 * except where clearly marked.
 */

export interface TimelineEntry {
  year: string;
  date?: string;
  title: string;
  place: string;
  body: string;
}

export interface KingdomTopic {
  id: string;
  icon: string; // key into the Icon component
  title: string;
  body: string;
}

export interface Chapter {
  id: string;
  kicker: string;
  title: string;
  lede: string;
  paragraphs: string[];
}

export const SITE = {
  title: "The Journal of Hendrick Hamel",
  subtitle: "Shipwrecked in the Hermit Kingdom, 1653–1666",
  tagline:
    "The first eyewitness account of Korea written by a European — a Dutch bookkeeper's record of thirteen years held in the kingdom of Joseon.",
  sourceUrl: "https://www.hendrick-hamel.henny-savenije.pe.kr/",
  sourceName: "Henny Savenije's Hendrick Hamel archive",
};

export const HERO_FACTS: { value: string; label: string }[] = [
  { value: "1653", label: "wrecked off Jeju" },
  { value: "13 yrs", label: "held in Joseon" },
  { value: "36 / 64", label: "survived the wreck" },
  { value: "1668", label: "journal published" },
];

/** Short editorial chapters that carry the narrative. */
export const CHAPTERS: Chapter[] = [
  {
    id: "who",
    kicker: "The bookkeeper",
    title: "A clerk of the Dutch East India Company",
    lede:
      "Hendrick Hamel was not an explorer. He was an accountant who kept the ledgers of the world's first great corporation — and who, by shipwreck, became the West's first witness to Korea.",
    paragraphs: [
      "Born in Gorinchem in the Dutch Republic around 1630, Hamel sailed east with the Verenigde Oostindische Compagnie (VOC), the Dutch East India Company, reaching its Asian capital of Batavia — today's Jakarta — in 1651. He served as a boekhouder, a bookkeeper: the man who counted the cargo and kept the accounts.",
      "In the summer of 1653 he was assigned to the yacht De Sperwer — 'the Sparrowhawk' — bound from Taiwan for the company's trading post at Nagasaki in Japan. He would not see a Dutch settlement again for thirteen years.",
    ],
  },
  {
    id: "wreck",
    kicker: "16 August 1653",
    title: "The wreck on Quelpaert",
    lede:
      "A late-summer storm drove the Sparrowhawk onto the rocks of the island Europeans called Quelpaert — the island now known as Jeju.",
    paragraphs: [
      "For days the ship ran before a typhoon in darkness and rain. In the small hours the hull struck, broke apart, and threw men into the surf among the wreckage. Of the sixty-four aboard, thirty-six reached the shore alive.",
      "They had no idea where they were. The land was Joseon — a kingdom so closed to outsiders that Europeans would later call it the Hermit Kingdom. The survivors were quickly found, questioned, and taken into custody by the island's officials. They were not prisoners of war, but they were not free to leave: Joseon's law did not permit foreigners who had entered the realm to depart it.",
    ],
  },
  {
    id: "weltevree",
    kicker: "The interpreter",
    title: "The Dutchman who was already there",
    lede:
      "On Jeju the castaways met a man who spoke to them, haltingly, in their own tongue — another Dutchman, shipwrecked a generation before them.",
    paragraphs: [
      "Jan Janse Weltevree had come ashore in Korea in 1627. By the time Hamel met him he had lived in the country for twenty-six years, taken the Korean name Park Yeon, married, and risen in the royal military. He had all but forgotten his Dutch and had to relearn it to speak with the newcomers.",
      "Weltevree became their interpreter and their warning. He had once told the king that he would sooner die than leave — because he knew he never could. Through him the survivors learned the shape of the life ahead of them.",
    ],
  },
  {
    id: "escape",
    kicker: "September 1666",
    title: "Eight men and a small boat",
    lede:
      "After thirteen years, Hamel and seven companions bought a fishing boat, waited for the wind, and slipped away from the southern coast toward Japan.",
    paragraphs: [
      "By 1666 the survivors were scattered among garrison towns in the southern province of Jeolla. From the port of Yeosu, eight of them put out to sea in a boat they had quietly acquired, steering for the Japanese islands they knew lay to the east.",
      "They reached Goto, and then the Dutch factory at Nagasaki, within days. Held for questioning by the Japanese, then released to the company, Hamel used the months that followed to write the report that would make him famous — in part to account for thirteen years of unpaid wages. The eight left behind in Korea were freed two years later, after the Dutch pressed for their release.",
    ],
  },
];

export const TIMELINE: TimelineEntry[] = [
  {
    year: "1630",
    title: "Born in Gorinchem",
    place: "Dutch Republic",
    body: "Hendrick Hamel is born in the fortress town of Gorinchem, in the province of Holland.",
  },
  {
    year: "1651",
    title: "Sails for the Indies",
    place: "Batavia (Jakarta)",
    body: "Hamel arrives in Batavia and enters the service of the Dutch East India Company as a bookkeeper.",
  },
  {
    year: "1653",
    date: "July",
    title: "Aboard the Sparrowhawk",
    place: "Taiwan → Japan",
    body: "The Sperwer leaves Taiwan for Nagasaki with a crew of sixty-four and a cargo of trade goods.",
  },
  {
    year: "1653",
    date: "16 August",
    title: "Wrecked on Jeju",
    place: "Quelpaert Island",
    body: "A typhoon destroys the ship on the coast of Jeju. Thirty-six of the sixty-four aboard survive and are taken into custody.",
  },
  {
    year: "1653",
    date: "October",
    title: "Meeting Weltevree",
    place: "Jeju",
    body: "The survivors meet Jan Janse Weltevree — Park Yeon — a Dutchman shipwrecked in 1627, who becomes their interpreter.",
  },
  {
    year: "1655",
    date: "June",
    title: "Brought to the capital",
    place: "Hanseong (Seoul)",
    body: "The men are taken to the capital and presented to King Hyojong, then enrolled in the royal guard.",
  },
  {
    year: "1655",
    title: "The failed petition",
    place: "Hanseong (Seoul)",
    body: "Two of the crew break through to a visiting Qing envoy to beg for release. The attempt fails and hardens the court against them.",
  },
  {
    year: "1656",
    title: "Banished south",
    place: "Jeolla Province",
    body: "The survivors are exiled to the provincial military garrison at Byeongyeong, near Gangjin, to serve and support themselves.",
  },
  {
    year: "1663",
    title: "Scattered by famine",
    place: "Yeosu · Suncheon · Namwon",
    body: "After years of drought and famine, the surviving men are divided among three garrison towns to ease the burden of feeding them.",
  },
  {
    year: "1666",
    date: "4 September",
    title: "The escape",
    place: "Yeosu → Japan",
    body: "Hamel and seven others sail a small boat out of Yeosu, reaching the Dutch post at Nagasaki within two weeks.",
  },
  {
    year: "1668",
    title: "The journal is published",
    place: "Amsterdam · Rotterdam",
    body: "Back in the Netherlands, Hamel's report is printed and becomes a European bestseller — the first detailed account of Korea by a Westerner.",
  },
  {
    year: "1692",
    title: "Death in Gorinchem",
    place: "Dutch Republic",
    body: "Hamel dies in his home town, unmarried. His name endures as Korea's first chronicler from the West.",
  },
];

/**
 * The second half of Hamel's report was a systematic "Description of the
 * Kingdom of Korea." These cards summarize the subjects he covered.
 */
export const KINGDOM_TOPICS: KingdomTopic[] = [
  {
    id: "land",
    icon: "map",
    title: "The Land",
    body: "Hamel described a mountainous peninsula of many provinces, cold winters and hot summers, rich in rice, cotton and ginseng, ringed by countless islands and dangerous, ship-swallowing seas.",
  },
  {
    id: "king",
    icon: "crown",
    title: "The King & Court",
    body: "He recorded a strict hierarchy beneath the king, a powerful class of scholar-officials, and a court whose word was absolute — the same court that decided the castaways could never go home.",
  },
  {
    id: "law",
    icon: "scale",
    title: "Law & Punishment",
    body: "Justice, Hamel wrote, was swift and severe: heavy beatings on the shins, exile, and death for grave crimes. Yet the men were also fed, housed and given a place, even as they were denied their freedom.",
  },
  {
    id: "faith",
    icon: "lotus",
    title: "Belief & the Dead",
    body: "He noted mountain monasteries and monks, deep reverence for ancestors, elaborate mourning, and a people more bound by duty to family and the dead than by any single church.",
  },
  {
    id: "life",
    icon: "house",
    title: "Daily Life",
    body: "Hamel described houses warmed by heated floors, white clothing, horsehair hats, marriage customs, schooling, and the everyday courtesies and hardships of ordinary Korean life.",
  },
  {
    id: "trade",
    icon: "ship",
    title: "Trade & Farming",
    body: "He observed farming of rice and grain, weaving, markets, and a kingdom that traded chiefly with China and Japan while keeping the wider world firmly at arm's length.",
  },
  {
    id: "war",
    icon: "shield",
    title: "War & Arms",
    body: "Having served in the guard himself, Hamel described the army, its weapons and training, and a country wary of its powerful neighbours after generations of invasion.",
  },
  {
    id: "language",
    icon: "quill",
    title: "Language & Learning",
    body: "He remarked on the writing, the reverence for scholarship and books, and the schooling of children — the machinery of a deeply literate Confucian state.",
  },
];

export const LEGACY_POINTS: { title: string; body: string }[] = [
  {
    title: "Europe's first window on Korea",
    body: "Until 1668, Korea was little more than a rumour on European maps. Hamel's report, translated into French, German and English, gave readers their first grounded description of the kingdom and its people.",
  },
  {
    title: "A ledger, not a legend",
    body: "Because Hamel wrote as a bookkeeper — to explain his years and claim his wages — his account is plain, observant and unusually free of the tall tales that filled other travellers' books.",
  },
  {
    title: "Remembered on two shores",
    body: "Today a Hamel memorial and a replica of the Sparrowhawk stand on Jeju, and a Hamel house museum honours him in Gorinchem — a shared thread between the Netherlands and Korea.",
  },
];
