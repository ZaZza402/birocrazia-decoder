// ATECO 2025 — Curated data for Italian Partita IVA holders
// Coefficients from L.190/2014 Allegato 4 (forfettario redditività)
// Only leaf-level codes (8-char format) included.

export interface AtecoEntry {
  code: string;
  description: string; // Official ATECO 2025 label
  sector: string; // Human-readable sector
  coefficient: number; // Forfettario redditività (taxable % of revenue)
  tags: string[]; // Search keywords (Italian + English)
}

// Coefficients by group
// 0.40 → commerce, food, hospitality
// 0.67 → IT services, arts/media
// 0.78 → professional services, education, health, admin services
// 0.86 → construction + impiantisti

export const ATECO_DATA: AtecoEntry[] = [
  // ─────────────────────────────────────────────
  // J – IT & SOFTWARE (67%)
  // ─────────────────────────────────────────────
  {
    code: "62.10.00",
    description: "Attività di programmazione informatica",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "sviluppatore",
      "programmatore",
      "developer",
      "software",
      "app",
      "mobile",
      "backend",
      "frontend",
      "fullstack",
      "react",
      "python",
      "java",
      "coding",
      "web development",
      "informatica",
    ],
  },
  {
    code: "62.20.10",
    description: "Attività di consulenza informatica",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "consulente IT",
      "IT consultant",
      "consulenza informatica",
      "sistemista",
      "CTO",
      "architetto software",
      "technical consultant",
    ],
  },
  {
    code: "62.20.20",
    description: "Attività di gestione di strutture informatiche",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "sysadmin",
      "devops",
      "cloud",
      "AWS",
      "Azure",
      "kubernetes",
      "infrastruttura IT",
      "server",
      "network",
    ],
  },
  {
    code: "62.90.01",
    description: "Configurazione di personal computer",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "supporto tecnico",
      "tech support",
      "PC",
      "hardware",
      "installazione",
      "assistenza informatica",
    ],
  },
  {
    code: "62.90.09",
    description:
      "Altre attività dei servizi connessi alle tecnologie dell'informazione n.c.a.",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "cybersecurity",
      "sicurezza informatica",
      "data analyst",
      "data scientist",
      "QA",
      "testing",
      "machine learning",
      "AI",
      "intelligenza artificiale",
      "big data",
    ],
  },
  {
    code: "63.10.10",
    description:
      "Fornitura di infrastrutture informatiche, hosting e attività connesse",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "hosting",
      "cloud provider",
      "server hosting",
      "SaaS",
      "PaaS",
      "IaaS",
      "datacenter",
    ],
  },
  {
    code: "63.10.21",
    description: "Elaborazione dati contabili",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "elaborazione dati",
      "data entry",
      "contabilità",
      "buste paga",
      "payroll software",
    ],
  },
  {
    code: "63.10.29",
    description: "Elaborazione altri dati",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "elaborazione dati",
      "data processing",
      "reportistica",
      "dashboard",
      "analytics",
    ],
  },
  {
    code: "63.91.00",
    description: "Attività dei portali di ricerca sul web",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: ["SEO", "portale", "ricerca web", "motore di ricerca", "web portal"],
  },
  {
    code: "63.92.00",
    description: "Altre attività dei servizi di informazione",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "content curation",
      "data service",
      "informazione digitale",
      "newsletter",
      "aggregatore",
    ],
  },
  {
    code: "58.21.00",
    description: "Edizione di videogiochi",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "game developer",
      "videogiochi",
      "gaming",
      "Unity",
      "Unreal",
      "indie game",
      "giochi",
    ],
  },
  {
    code: "58.29.00",
    description: "Edizione di altri software",
    sector: "IT & Software",
    coefficient: 0.67,
    tags: [
      "software house",
      "applicazioni",
      "SaaS",
      "prodotto software",
      "editore software",
    ],
  },

  // ─────────────────────────────────────────────
  // J – MEDIA, VIDEO & PUBLISHING (67%)
  // ─────────────────────────────────────────────
  {
    code: "58.11.00",
    description: "Edizione di libri",
    sector: "Editoria & Media",
    coefficient: 0.67,
    tags: [
      "editore",
      "autore",
      "scrittore",
      "libri",
      "publishing",
      "saggistica",
      "romanzi",
    ],
  },
  {
    code: "58.13.00",
    description: "Edizione di riviste e periodici",
    sector: "Editoria & Media",
    coefficient: 0.67,
    tags: ["rivista", "periodico", "magazine", "editore", "giornalismo"],
  },
  {
    code: "58.19.00",
    description: "Altre attività editoriali, esclusa l'edizione di software",
    sector: "Editoria & Media",
    coefficient: 0.67,
    tags: [
      "editoria",
      "catalogo",
      "guide turistiche",
      "mappe",
      "directory",
      "contenuti editoriali",
    ],
  },
  {
    code: "59.11.00",
    description:
      "Attività di produzione cinematografica, di video e programmi televisivi",
    sector: "Video & Cinema",
    coefficient: 0.67,
    tags: [
      "filmmaker",
      "video production",
      "YouTube creator",
      "videomaker",
      "produzione video",
      "reels",
      "videografo",
      "documentario",
      "spot pubblicitario",
    ],
  },
  {
    code: "59.12.00",
    description:
      "Attività di post-produzione cinematografica, di video e programmi televisivi",
    sector: "Video & Cinema",
    coefficient: 0.67,
    tags: [
      "editor video",
      "montaggio video",
      "post-produzione",
      "color grading",
      "motion graphics",
      "After Effects",
      "Premiere Pro",
    ],
  },
  {
    code: "59.20.10",
    description: "Attività di registrazione sonora",
    sector: "Audio & Musica",
    coefficient: 0.67,
    tags: [
      "studio recording",
      "registrazione musicale",
      "audio engineer",
      "sound designer",
      "foley",
      "podcaster",
      "producer musicale",
    ],
  },

  // ─────────────────────────────────────────────
  // M – ATTIVITÀ LEGALI & CONTABILI (78%)
  // ─────────────────────────────────────────────
  {
    code: "69.10.10",
    description: "Attività legali e giuridiche",
    sector: "Professioni Legali",
    coefficient: 0.78,
    tags: [
      "avvocato",
      "legale",
      "consulenza legale",
      "diritto",
      "giuridico",
      "contratti",
      "contenzioso",
      "lawyer",
      "legal counsel",
    ],
  },
  {
    code: "69.10.20",
    description: "Attività notarili",
    sector: "Professioni Legali",
    coefficient: 0.78,
    tags: ["notaio", "atti notarili", "rogiti", "successioni", "compravendite"],
  },
  {
    code: "69.10.30",
    description:
      "Attività di supporto alle attività legali, giuridiche e notarili",
    sector: "Professioni Legali",
    coefficient: 0.78,
    tags: [
      "praticante avvocato",
      "supporto legale",
      "ricerca giuridica",
      "paralegal",
    ],
  },
  {
    code: "69.20.01",
    description: "Attività di commercialisti",
    sector: "Commercialisti & Revisori",
    coefficient: 0.78,
    tags: [
      "commercialista",
      "dottore commercialista",
      "ragioniere",
      "studio contabile",
      "bilancio",
      "fiscalità",
    ],
  },
  {
    code: "69.20.02",
    description: "Attività di revisori legali in ambito contabile",
    sector: "Commercialisti & Revisori",
    coefficient: 0.78,
    tags: [
      "revisore dei conti",
      "revisore legale",
      "auditor",
      "controllo contabile",
    ],
  },
  {
    code: "69.20.03",
    description: "Attività di esperti contabili",
    sector: "Commercialisti & Revisori",
    coefficient: 0.78,
    tags: ["esperto contabile", "contabilità", "prima nota", "contabile"],
  },
  {
    code: "69.20.04",
    description: "Attività di consulenti del lavoro",
    sector: "Commercialisti & Revisori",
    coefficient: 0.78,
    tags: [
      "consulente del lavoro",
      "CDL",
      "buste paga",
      "HR",
      "contratti di lavoro",
      "gestione del personale",
      "payroll",
    ],
  },
  {
    code: "69.20.06",
    description:
      "Attività di altri consulenti, periti e altri soggetti simili in ambito tributario e contabile",
    sector: "Commercialisti & Revisori",
    coefficient: 0.78,
    tags: [
      "consulente fiscale",
      "fiscalista",
      "consulenza tributaria",
      "dichiarazioni dei redditi",
      "IVA",
      "CAF",
    ],
  },

  // ─────────────────────────────────────────────
  // M – CONSULENZA GESTIONALE (78%)
  // ─────────────────────────────────────────────
  {
    code: "70.20.01",
    description: "Attività di consulenza in materia di logistica",
    sector: "Consulenza Aziendale",
    coefficient: 0.78,
    tags: [
      "consulente logistica",
      "supply chain",
      "magazzino",
      "distribuzione",
      "operations",
    ],
  },
  {
    code: "70.20.09",
    description:
      "Consulenza imprenditoriale e altre attività di consulenza gestionale n.c.a.",
    sector: "Consulenza Aziendale",
    coefficient: 0.78,
    tags: [
      "business consultant",
      "management consultant",
      "consulente aziendale",
      "stratega",
      "advisor",
      "startup",
      "business plan",
      "PMI",
    ],
  },

  // ─────────────────────────────────────────────
  // M – ARCHITETTURA & INGEGNERIA (78%)
  // ─────────────────────────────────────────────
  {
    code: "71.11.09",
    description: "Attività di architettura n.c.a.",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "architetto",
      "architettura",
      "progettazione edilizia",
      "rendering",
      "BIM",
      "CAD",
      "urbanistica",
    ],
  },
  {
    code: "71.12.10",
    description: "Attività di ingegneria",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "ingegnere",
      "ingegneria",
      "progettazione",
      "strutturale",
      "elettrico",
      "meccanico",
      "civile",
      "industriale",
    ],
  },
  {
    code: "71.12.20",
    description:
      "Gestione di progetti relativi a opere di ingegneria integrata",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "project manager",
      "project management",
      "direzione lavori",
      "PM",
      "coordinatore",
    ],
  },
  {
    code: "71.12.30",
    description: "Elaborazione e supervisione di progetti da parte di geometri",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "geometra",
      "perizia",
      "stima immobiliare",
      "rilievo topografico",
      "catasto",
      "ristrutturazione",
    ],
  },
  {
    code: "71.20.19",
    description: "Altri collaudi e analisi tecniche di prodotti",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "collaudo",
      "ispezione",
      "analisi tecnica",
      "certificazione prodotti",
      "sicurezza prodotto",
    ],
  },

  // ─────────────────────────────────────────────
  // M – MARKETING, PUBBLICITÀ & COMUNICAZIONE (78%)
  // ─────────────────────────────────────────────
  {
    code: "73.11.01",
    description: "Ideazione di campagne pubblicitarie",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "copywriter",
      "copy",
      "creatività",
      "campagne advertising",
      "adv",
      "comunicazione creativa",
      "art director",
    ],
  },
  {
    code: "73.11.02",
    description:
      "Conduzione di campagne di marketing e altri servizi pubblicitari",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "digital marketing",
      "marketing manager",
      "Google Ads",
      "Meta Ads",
      "Facebook Ads",
      "performance marketing",
      "SEM",
      "social media marketing",
      "email marketing",
    ],
  },
  {
    code: "73.11.03",
    description: "Attività di influencer marketing",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "influencer",
      "creator",
      "Instagram",
      "TikTok",
      "YouTube",
      "content creator",
      "brand ambassador",
      "UGC",
      "social media influencer",
    ],
  },
  {
    code: "73.12.00",
    description: "Attività di concessionarie pubblicitarie",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "media buyer",
      "spazi pubblicitari",
      "concessionaria",
      "pubblicità esterna",
      "OOH",
    ],
  },
  {
    code: "73.20.00",
    description: "Ricerche di mercato e sondaggi di opinione",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "market research",
      "ricerca di mercato",
      "sondaggi",
      "focus group",
      "analisi dati",
      "UX research",
      "interviste utenti",
    ],
  },
  {
    code: "73.30.01",
    description: "Attività di rappresentanza di interessi",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "PR",
      "pubbliche relazioni",
      "lobbying",
      "istituzionale",
      "relazioni esterne",
    ],
  },
  {
    code: "73.30.09",
    description: "Pubbliche relazioni e comunicazione n.c.a.",
    sector: "Marketing & Pubblicità",
    coefficient: 0.78,
    tags: [
      "PR manager",
      "comunicazione",
      "ufficio stampa",
      "media relations",
      "brand communication",
    ],
  },

  // ─────────────────────────────────────────────
  // M – DESIGN & ATTIVITÀ CREATIVE (78%)
  // ─────────────────────────────────────────────
  {
    code: "74.12.01",
    description: "Grafica di pagine web",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: [
      "web designer",
      "UI designer",
      "UX designer",
      "web design",
      "interfaccia utente",
      "Figma",
      "Webflow",
      "grafica web",
    ],
  },
  {
    code: "74.12.09",
    description:
      "Altre attività di progettazione grafica e di comunicazione visiva",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: [
      "graphic designer",
      "grafico",
      "logo",
      "brand identity",
      "identità visiva",
      "branding",
      "packaging design",
      "illustratore",
      "Adobe",
      "Illustrator",
    ],
  },
  {
    code: "74.11.10",
    description: "Attività di progettazione di prodotti industriali",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: [
      "product designer",
      "industrial design",
      "design industriale",
      "prototipazione",
      "3D",
      "CAD",
    ],
  },
  {
    code: "74.11.20",
    description: "Attività di progettazione di moda",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: [
      "fashion designer",
      "stilista",
      "moda",
      "abbigliamento",
      "accessori moda",
      "pattern maker",
    ],
  },
  {
    code: "74.13.00",
    description: "Attività di progettazione di interni",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: [
      "interior designer",
      "arredamento",
      "interior design",
      "allestimento",
      "staging immobiliare",
      "home staging",
    ],
  },
  {
    code: "74.14.09",
    description: "Altre attività di progettazione specializzata n.c.a.",
    sector: "Design & Grafica",
    coefficient: 0.78,
    tags: ["designer", "scenografo", "exhibition design", "allestimento fiere"],
  },

  // ─────────────────────────────────────────────
  // M – FOTOGRAFIA (78%)
  // ─────────────────────────────────────────────
  {
    code: "74.20.11",
    description: "Attività fotografiche fornite da fotoreporter",
    sector: "Fotografia",
    coefficient: 0.78,
    tags: [
      "fotoreporter",
      "fotogiornalismo",
      "giornalismo fotografico",
      "agenzia fotografica",
    ],
  },
  {
    code: "74.20.12",
    description: "Attività fotografiche aeree e subacquee",
    sector: "Fotografia",
    coefficient: 0.78,
    tags: [
      "drone",
      "fotografia aerea",
      "fotografia subacquea",
      "pilota drone",
      "riprese aeree",
    ],
  },
  {
    code: "74.20.19",
    description: "Altre attività fotografiche specializzate",
    sector: "Fotografia",
    coefficient: 0.78,
    tags: [
      "fotografo",
      "wedding photographer",
      "matrimoni",
      "fotografia commerciale",
      "ritratto",
      "fotografia prodotto",
      "fashion photography",
      "fotostudio",
    ],
  },

  // ─────────────────────────────────────────────
  // M – TRADUZIONE (78%)
  // ─────────────────────────────────────────────
  {
    code: "74.30.00",
    description: "Attività di traduzione e interpretariato",
    sector: "Lingue & Traduzione",
    coefficient: 0.78,
    tags: [
      "traduttore",
      "interprete",
      "traduzione",
      "lingue",
      "traduzione tecnica",
      "traduzione legale",
      "localizzazione",
      "subtitling",
      "simultanea",
      "consecutiva",
    ],
  },

  // ─────────────────────────────────────────────
  // M – ALTRE ATTIVITÀ PROFESSIONALI (78%)
  // ─────────────────────────────────────────────
  {
    code: "74.99.11",
    description: "Attività di consulenza agraria fornite da agronomi",
    sector: "Agricoltura & Ambiente",
    coefficient: 0.78,
    tags: [
      "agronomo",
      "consulenza agraria",
      "agricoltura",
      "perito agrario",
      "agrotecnico",
    ],
  },
  {
    code: "74.99.21",
    description:
      "Attività di consulenza in materia di sicurezza e salute dei posti di lavoro",
    sector: "Sicurezza & Compliance",
    coefficient: 0.78,
    tags: [
      "consulente sicurezza",
      "RSPP",
      "sicurezza sul lavoro",
      "D.Lgs. 81",
      "prevenzione infortuni",
      "HSE",
    ],
  },
  {
    code: "74.99.31",
    description:
      "Attività di consulenza in materia di prevenzione e riduzione dell'inquinamento e di gestione dei rifiuti",
    sector: "Sicurezza & Compliance",
    coefficient: 0.78,
    tags: [
      "consulenza ambientale",
      "ambiente",
      "gestione rifiuti",
      "sostenibilità",
      "ISO 14001",
      "energia rinnovabile",
    ],
  },
  {
    code: "74.99.32",
    description:
      "Attività di consulenza in materia di gestione delle risorse energetiche, energie rinnovabili ed efficienza",
    sector: "Sicurezza & Compliance",
    coefficient: 0.78,
    tags: [
      "energy manager",
      "efficienza energetica",
      "fotovoltaico",
      "rinnovabili",
      "diagnosi energetica",
      "certificazione energetica",
      "APE",
    ],
  },
  {
    code: "74.99.91",
    description: "Attività tecniche svolte da periti industriali",
    sector: "Architettura & Ingegneria",
    coefficient: 0.78,
    tags: [
      "perito industriale",
      "perizia tecnica",
      "CTU",
      "consulente tecnico",
    ],
  },
  {
    code: "74.99.93",
    description:
      "Attività di agenzie, agenti e procuratori per lo spettacolo e lo sport",
    sector: "Arti & Spettacolo",
    coefficient: 0.78,
    tags: [
      "agente sportivo",
      "agente spettacolo",
      "procuratore sportivo",
      "manager musicale",
    ],
  },
  {
    code: "74.99.99",
    description:
      "Tutte le altre attività varie professionali, scientifiche e tecniche n.c.a.",
    sector: "Altro",
    coefficient: 0.78,
    tags: [
      "consulente",
      "freelance",
      "professionista",
      "coaching",
      "mentoring",
      "formatore",
    ],
  },
  {
    code: "75.00.00",
    description: "Servizi veterinari",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "veterinario",
      "medico veterinario",
      "clinica veterinaria",
      "animali",
    ],
  },

  // ─────────────────────────────────────────────
  // N – SUPPORTO AMMINISTRATIVO (78%)
  // ─────────────────────────────────────────────
  {
    code: "82.30.00",
    description: "Organizzazione di convegni e fiere",
    sector: "Eventi & Supporto",
    coefficient: 0.78,
    tags: [
      "event planner",
      "organizzatore eventi",
      "eventi aziendali",
      "wedding planner",
      "congressi",
      "fiere",
      "conference manager",
    ],
  },
  {
    code: "82.99.04",
    description: "Intermediari del commercio",
    sector: "Commercio",
    coefficient: 0.78,
    tags: [
      "agente di commercio",
      "agente commerciale",
      "rappresentante",
      "intermediario commerciale",
      "procacciatore d'affari",
    ],
  },

  // ─────────────────────────────────────────────
  // P – ISTRUZIONE & FORMAZIONE (78%)
  // ─────────────────────────────────────────────
  {
    code: "85.51.09",
    description: "Formazione sportiva e ricreativa n.c.a.",
    sector: "Sport & Formazione",
    coefficient: 0.78,
    tags: [
      "personal trainer",
      "istruttore fitness",
      "allenatore",
      "coach sportivo",
      "pilates",
      "yoga",
      "crossfit",
      "palestra",
      "trainer",
    ],
  },
  {
    code: "85.51.01",
    description:
      "Insegnamento di pilates fornito da insegnanti e istruttori indipendenti",
    sector: "Sport & Formazione",
    coefficient: 0.78,
    tags: ["insegnante pilates", "pilates", "istruttore pilates"],
  },
  {
    code: "85.52.01",
    description: "Corsi di danza",
    sector: "Arti & Spettacolo",
    coefficient: 0.78,
    tags: [
      "insegnante di danza",
      "danzatore",
      "coreografo",
      "scuola di danza",
      "ballerino",
    ],
  },
  {
    code: "85.52.09",
    description: "Altra formazione culturale",
    sector: "Arti & Spettacolo",
    coefficient: 0.78,
    tags: [
      "insegnante musica",
      "maestro",
      "lezioni musica",
      "corsi artistici",
      "teatro",
      "canto",
    ],
  },
  {
    code: "85.59.10",
    description: "Corsi di lingua straniera",
    sector: "Istruzione & Formazione",
    coefficient: 0.78,
    tags: [
      "insegnante di lingue",
      "teacher",
      "English teacher",
      "madrelingua",
      "lezioni",
      "ESL",
      "lingua inglese",
      "tutor lingue",
    ],
  },
  {
    code: "85.59.20",
    description: "Corsi di formazione e corsi di aggiornamento professionale",
    sector: "Istruzione & Formazione",
    coefficient: 0.78,
    tags: [
      "formatore",
      "docente",
      "trainer",
      "corso online",
      "e-learning",
      "corporate training",
      "aggiornamento professionale",
      "coach",
    ],
  },
  {
    code: "85.59.99",
    description:
      "Tutti gli altri servizi vari di istruzione e formazione n.c.a.",
    sector: "Istruzione & Formazione",
    coefficient: 0.78,
    tags: [
      "tutor privato",
      "ripetizioni",
      "insegnante privato",
      "doposcuola",
      "preparazione universitaria",
    ],
  },
  {
    code: "85.61.00",
    description: "Attività di servizi di intermediazione per corsi e tutor",
    sector: "Istruzione & Formazione",
    coefficient: 0.78,
    tags: [
      "piattaforma corsi",
      "marketplace formazione",
      "intermediazione didattica",
    ],
  },

  // ─────────────────────────────────────────────
  // Q – SANITÀ & PROFESSIONI SANITARIE (78%)
  // ─────────────────────────────────────────────
  {
    code: "86.21.00",
    description: "Attività di medicina generale",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "medico",
      "medico di base",
      "medico generico",
      "MMG",
      "medicina generale",
    ],
  },
  {
    code: "86.22.02",
    description:
      "Altre attività di medicina specialistica svolte da medici specialisti indipendenti",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "medico specialista",
      "specialista",
      "cardiologo",
      "dermatologo",
      "ortopedico",
      "pediatra",
      "ginecologo",
      "oculista",
      "nutrizionista medico",
    ],
  },
  {
    code: "86.23.00",
    description: "Attività odontoiatriche",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "dentista",
      "odontoiatra",
      "odontoia",
      "studio dentistico",
      "ortodonzista",
    ],
  },
  {
    code: "86.93.00",
    description: "Attività di psicologi e psicoterapeuti, esclusi i medici",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "psicologo",
      "psicoterapeuta",
      "psicanalista",
      "psicoterapia",
      "CBT",
      "terapia",
      "counseling psicologico",
    ],
  },
  {
    code: "86.94.01",
    description: "Attività infermieristiche",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "infermiere",
      "infermiera professionale",
      "infermiere domiciliare",
      "assistenza sanitaria domiciliare",
    ],
  },
  {
    code: "86.94.02",
    description: "Attività ostetriche",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: ["ostetrica", "ostetricia", "parto", "gravidanza"],
  },
  {
    code: "86.95.00",
    description: "Attività di fisioterapia",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "fisioterapista",
      "fisioterapia",
      "riabilitazione",
      "terapia manuale",
      "kinesiterapia",
      "fisio",
    ],
  },
  {
    code: "86.99.09",
    description: "Altre attività varie per la salute umana n.c.a.",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "biologo",
      "nutrizionista",
      "osteopata",
      "logopedista",
      "ortottista",
      "podologa",
      "tecnico radiologia",
      "biochimica clinica",
    ],
  },
  {
    code: "88.99.01",
    description: "Servizi di counselling",
    sector: "Sanità & Benessere",
    coefficient: 0.78,
    tags: [
      "counselor",
      "counselling",
      "life coaching",
      "supporto psicologico",
      "assistente sociale",
    ],
  },

  // ─────────────────────────────────────────────
  // R – ARTI, INTRATTENIMENTO (67%)
  // ─────────────────────────────────────────────
  {
    code: "90.11.01",
    description: "Attività di giornalisti indipendenti",
    sector: "Giornalismo & Scrittura",
    coefficient: 0.67,
    tags: [
      "giornalista freelance",
      "cronista",
      "reporter",
      "giornalismo",
      "articoli",
      "testata giornalistica",
    ],
  },
  {
    code: "90.11.02",
    description: "Attività di blogger indipendenti",
    sector: "Giornalismo & Scrittura",
    coefficient: 0.67,
    tags: [
      "blogger",
      "content creator",
      "digital creator",
      "scrittore web",
      "newsletter",
      "Substack",
    ],
  },
  {
    code: "90.11.09",
    description:
      "Altre attività di creazione letteraria e composizione musicale",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "scrittore",
      "autore",
      "compositore",
      "musicista",
      "paroliere",
      "ghostwriter",
      "libraio",
    ],
  },
  {
    code: "90.12.00",
    description: "Attività di creazione di arti visive",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "artista",
      "pittore",
      "scultore",
      "illustratore",
      "fumettista",
      "street artist",
      "ceramista",
      "arte figurativa",
    ],
  },
  {
    code: "90.20.01",
    description: "Attività nel campo della recitazione",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "attore",
      "attrice",
      "recitazione",
      "teatro",
      "cinema",
      "doppiatore",
      "performer",
    ],
  },
  {
    code: "90.20.09",
    description:
      "Altre attività di arti performative e rappresentazioni artistiche",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "musicista",
      "concertista",
      "cantante",
      "dj",
      "performer",
      "circo",
      "acrobata",
      "artista di strada",
    ],
  },
  {
    code: "90.39.01",
    description: "Attività nel campo della regia",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "regista",
      "regia teatrale",
      "regia cinematografica",
      "direzione artistica",
    ],
  },
  {
    code: "90.39.09",
    description: "Altre attività di supporto alle arti performative n.c.a.",
    sector: "Arti & Spettacolo",
    coefficient: 0.67,
    tags: [
      "tecnico luci",
      "tecnico suono",
      "scenografo",
      "costumista",
      "truccatore",
      "macchinista",
      "supporto artistico",
    ],
  },

  // ─────────────────────────────────────────────
  // G – COMMERCIO AL DETTAGLIO (40%)
  // ─────────────────────────────────────────────
  {
    code: "47.91.10",
    description:
      "Commercio al dettaglio di qualsiasi tipo di prodotto effettuato via internet",
    sector: "E-commerce & Commercio",
    coefficient: 0.4,
    tags: [
      "e-commerce",
      "negozio online",
      "Amazon FBA",
      "dropshipping",
      "Shopify",
      "WooCommerce",
      "vendita online",
      "marketplace",
    ],
  },
  {
    code: "47.91.20",
    description:
      "Commercio al dettaglio di qualsiasi tipo di prodotto effettuato attraverso i media (teleshopping)",
    sector: "E-commerce & Commercio",
    coefficient: 0.4,
    tags: [
      "televendita",
      "teleshopping",
      "vendita per corrispondenza",
      "ordine per catalogo",
    ],
  },
  {
    code: "47.99.10",
    description:
      "Commercio al dettaglio di prodotti vari, in esercizi non specializzati",
    sector: "E-commerce & Commercio",
    coefficient: 0.4,
    tags: ["commercio", "rivendita", "dettagliante", "negozio fisico"],
  },

  // ─────────────────────────────────────────────
  // I – RISTORAZIONE & HOSPITALITY (40%)
  // ─────────────────────────────────────────────
  {
    code: "56.10.11",
    description: "Ristorazione con somministrazione",
    sector: "Ristorazione & Hospitality",
    coefficient: 0.4,
    tags: [
      "ristorante",
      "trattoria",
      "pizzeria",
      "bistrot",
      "osteria",
      "ristorazione",
    ],
  },
  {
    code: "56.10.30",
    description: "Gelaterie e pasticcerie",
    sector: "Ristorazione & Hospitality",
    coefficient: 0.4,
    tags: [
      "gelateria",
      "pasticceria",
      "bar pasticceria",
      "gelatiere",
      "pasticciere",
    ],
  },
  {
    code: "56.30.00",
    description: "Bar e altri esercizi simili senza cucina",
    sector: "Ristorazione & Hospitality",
    coefficient: 0.4,
    tags: ["bar", "caffè", "barista", "pub", "cocktail bar", "aperitivo"],
  },
  {
    code: "55.20.51",
    description:
      "Affittacamere per brevi soggiorni, case ed appartamenti per vacanze, bed and breakfast, residence",
    sector: "Ristorazione & Hospitality",
    coefficient: 0.4,
    tags: [
      "affittacamere",
      "B&B",
      "bed and breakfast",
      "Airbnb",
      "appartamenti vacanza",
      "locazione turistica",
    ],
  },

  // ─────────────────────────────────────────────
  // F – COSTRUZIONI & IMPIANTISTI (86%)
  // ─────────────────────────────────────────────
  {
    code: "43.21.01",
    description:
      "Installazione di impianti elettrici in edifici o in altre opere di costruzione",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "elettricista",
      "impianti elettrici",
      "installatore elettrico",
      "fotovoltaico installazione",
      "automazione",
    ],
  },
  {
    code: "43.22.01",
    description:
      "Installazione di impianti idraulici, di riscaldamento e di condizionamento dell'aria (inclusa manutenzione e riparazione) in edifici o in altre opere di costruzione",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "idraulico",
      "impianti idraulici",
      "riscaldamento",
      "condizionamento",
      "caldaia",
      "termoidraulico",
    ],
  },
  {
    code: "43.31.00",
    description: "Intonacatura",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "imbianchino",
      "pittore edile",
      "intonacatore",
      "pareti",
      "finitura edilizia",
    ],
  },
  {
    code: "43.32.01",
    description: "Posa in opera di casseforti, forzieri, porte blindate",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: ["fabbro", "serraturista", "porte blindate", "casseforti"],
  },
  {
    code: "43.32.02",
    description:
      "Posa in opera di infissi, arredi, controsoffitti, pareti mobili e simili",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "falegname",
      "falegnami",
      "infissi",
      "pavimentista",
      "controsoffitti",
      "parquet",
    ],
  },
  {
    code: "41.20.00",
    description: "Costruzione di edifici residenziali e non residenziali",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "impresa costruzioni",
      "costruttore edile",
      "edilizia",
      "ristrutturazione",
      "cantiere",
    ],
  },
  {
    code: "43.39.09",
    description:
      "Altri lavori di completamento e di finitura degli edifici n.c.a.",
    sector: "Costruzioni & Impianti",
    coefficient: 0.86,
    tags: [
      "decoratore",
      "piastrellista",
      "posatore pavimenti",
      "lattoniere",
      "carpentiere",
    ],
  },

  // ─────────────────────────────────────────────
  // S – ALTRI SERVIZI ALLA PERSONA (78%)
  // ─────────────────────────────────────────────
  {
    code: "96.21.00",
    description: "Servizi di parrucchieri e barbieri",
    sector: "Cura della Persona",
    coefficient: 0.78,
    tags: ["parrucchiere", "barbiere", "capelli", "acconciatore", "hairsylist"],
  },
  {
    code: "96.22.01",
    description: "Servizi di manicure e pedicure",
    sector: "Cura della Persona",
    coefficient: 0.78,
    tags: [
      "estetista unghie",
      "nail artist",
      "nail technician",
      "manicure",
      "pedicure",
      "gel nail",
    ],
  },
  {
    code: "96.22.09",
    description:
      "Altri servizi di cura della bellezza e altri trattamenti di bellezza n.c.a.",
    sector: "Cura della Persona",
    coefficient: 0.78,
    tags: [
      "estetista",
      "make-up artist",
      "trucco",
      "ricostruzione ciglia",
      "massaggi estetici",
      "solarium",
      "beauty",
    ],
  },
];

// Quick lookup by code
export const ATECO_BY_CODE: Record<string, AtecoEntry> = Object.fromEntries(
  ATECO_DATA.map((e) => [e.code, e]),
);

// Search function — matches code, description, sector, tags
export function searchAteco(query: string): AtecoEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return ATECO_DATA.slice(0, 8);
  return ATECO_DATA.filter(
    (e) =>
      e.code.includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.sector.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q)),
  ).slice(0, 12);
}
