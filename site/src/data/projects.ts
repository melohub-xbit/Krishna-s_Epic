import type { MarkId } from "./marks";

/**
 * THE WORK — all 22, with real content.
 *
 * `figure` is the loudest thing on a row, so it must be REAL. Three kinds
 * are acceptable:
 *   1. a measured result   — 95.6%, 0.68 NDCG, 1st / 2,000
 *   2. a scale fact        — 10 tasks, 8 channels, 100 connections
 *   3. a characterising fact — Price-time, Files only
 * Never an invented percentage or a rounded-up benchmark.
 *
 * Sources: the repos in ../dev_proj and ../research_proj, and the résumé.
 */

export type Detail = { label: string; value: string };

export type Project = {
  id: string;
  name: string;
  /** one line under the name */
  sub: string;
  mark: MarkId;
  /** the headline metric, as displayed */
  figure: string;
  /** numeric form — drives the counting hero when the row is open */
  figureValue?: number;
  figureSuffix?: string;
  figureDecimals?: number;
  /** <= 18 words explaining the figure */
  caption: string;
  /** what the problem actually was */
  problem: string;
  /** what was done about it */
  approach: string;
  /** the koma grid inside the opened row */
  details: Detail[];
  stack: string[];
  year: string;
  track: "research" | "build";
  repo?: string;
  live?: string;
  /** a hackathon placing or similar, shown as a stamp */
  award?: string;
};

const GH = "https://github.com/melohub-xbit";

export const PROJECTS: Project[] = [
  /* ── research ──────────────────────────────────────────── */
  {
    id: "eeg-stress",
    name: "EEG · ECG Stress",
    sub: "Multimodal stress and recovery — Samsung Lab, IIITB",
    mark: "wave",
    figure: "95.6%",
    figureValue: 95.6,
    figureSuffix: "%",
    figureDecimals: 1,
    caption: "stress detection with CNN-LSTM, validated leave-one-subject-out.",
    problem:
      "Wearables infer stress from heart rate alone. Whether that actually tracks what the brain is doing had not been measured on the same subjects at the same time.",
    approach:
      "Designed a multi-stressor protocol and recorded simultaneous 8-channel EEG at 500 Hz and single-lead ECG from 15 subjects. Extracted band power, spectral entropy, frontal asymmetry and HRV features, then trained SVM and CNN-LSTM models.",
    details: [
      { label: "Subjects", value: "15" },
      { label: "Windows", value: "4,939" },
      { label: "EEG", value: "8-channel, 500 Hz" },
      { label: "ECG", value: "Single-lead" },
      { label: "Validation", value: "Leave-one-subject-out" },
      { label: "Supervisor", value: "Dr. Sakshi Arora" },
    ],
    stack: ["Python", "CNN-LSTM", "HRV", "scikit-learn"],
    year: "2026",
    track: "research",
    repo: `${GH}/ECT_EEG_Stress`,
  },
  {
    id: "vehicle-detection",
    name: "Vehicle Detection",
    sub: "ICDEC'24 detection in adverse weather",
    mark: "scope",
    figure: "1st / 2,000",
    caption: "teams, in the ICDEC'24 Vehicle Detection in Various Weather Conditions challenge.",
    problem:
      "Detectors trained on clear daylight footage fall apart in rain, fog and low light — exactly the conditions where the detection matters.",
    approach:
      "Trained and compared YOLOv8n, v8s, v10s and v10m on the challenge data; v10 won. Tuned it with Optuna over ten trials, and found Adam clearly beat SGD on this dataset.",
    details: [
      { label: "Placing", value: "1st of 2,000 teams" },
      { label: "mAP@0.5", value: "0.543" },
      { label: "mAP@0.5:0.95", value: "0.273" },
      { label: "Backbone", value: "YOLOv10" },
      { label: "Tuning", value: "Optuna, 10 trials" },
    ],
    stack: ["PyTorch", "YOLOv10", "Optuna"],
    year: "2024",
    track: "research",
    repo: `${GH}/YOLOGANg_VehicleDetection`,
    award: "1st prize",
  },
  {
    id: "dalsp",
    name: "DALSP",
    sub: "Domain-aware layer-sensitivity pruning for LLMs",
    mark: "tree",
    figure: "20%",
    figureValue: 20,
    figureSuffix: "%",
    caption: "of Phi-3.5-mini's neurons removed, with no retraining afterwards.",
    problem:
      "A general model pays for every neuron on every task. Law, maths and code queries each carry the full weight of the other two.",
    approach:
      "Entropy scores which MLP blocks stay quiet for a given domain. Cut those and four specialists — general, maths, code, law — fall out of one base model. An information-theoretic extension of, and argument with, the Wanda method.",
    details: [
      { label: "Base model", value: "Phi-3.5-mini" },
      { label: "Reduction", value: "~20% of neurons" },
      { label: "Subnetworks", value: "General · Math · Code · Law" },
      { label: "Retraining", value: "None" },
      { label: "Criterion", value: "Shannon entropy" },
    ],
    stack: ["Python", "PyTorch", "LLMs", "Pruning"],
    year: "2026",
    track: "research",
    repo: `${GH}/Domain-Aware_Layer_Sensitivity_Pruning`,
  },
  {
    id: "racs",
    name: "RACS",
    sub: "Risk-aware cold-start recommendation",
    mark: "compass",
    figure: "0.68 NDCG",
    figureValue: 0.68,
    figureDecimals: 2,
    caption: "on MovieLens-1M at k=5, with a hit rate of 1.0.",
    problem:
      "Cold start means ranking items you have no interaction history for at all. Most recommenders degrade to popularity, which is safe and useless.",
    approach:
      "Llama 3.1 does contrastive ranking; Bayesian semantic-neighbourhood disagreement drives exploration; a risk constraint penalises unsafe content. Benchmarked against EASE, SASRec and ItemKNN over multiple seeds.",
    details: [
      { label: "NDCG@5", value: "0.68" },
      { label: "Hit rate@5", value: "1.0" },
      { label: "Dataset", value: "MovieLens-1M" },
      { label: "Baselines", value: "EASE · SASRec · ItemKNN" },
      { label: "Significance", value: "Wilcoxon, multi-seed" },
    ],
    stack: ["Python", "PyTorch", "Llama 3.1", "RecSys"],
    year: "2026",
    track: "research",
    repo: `${GH}/RecSys_Project`,
  },
  {
    id: "mutanthunter",
    name: "Mutant Hunter",
    sub: "RL environment for test generation",
    mark: "blade",
    figure: "Mutation score",
    caption: "is the reward. A test only pays if it actually kills a mutant.",
    problem:
      "Models write tests that pass. Passing is not the same as catching anything — a test suite can have full coverage and detect no real bug.",
    approach:
      "An OpenEnv-compatible RL environment that mutates the code under test and rewards the model by how many mutants its tests kill. Trained a LoRA on Qwen-Coder-7B and shipped the environment as a live Space.",
    details: [
      { label: "Reward", value: "Mutation score" },
      { label: "Model", value: "Qwen-Coder-7B, LoRA" },
      { label: "Runtime", value: "Docker, OpenEnv" },
      { label: "Artifacts", value: "LoRA, eval dataset, W&B run" },
    ],
    stack: ["RL", "LLMs", "Docker", "OpenEnv"],
    year: "2026",
    track: "research",
    repo: `${GH}/MetaOpenEnv_MutantHunter`,
    live: "https://huggingface.co/spaces/jester1177/mutant-hunter-env",
  },
  {
    id: "devops-debug",
    name: "DevOps Debug Env",
    sub: "Open environment for CI/CD failure repair",
    mark: "pipe",
    figure: "10 tasks",
    caption: "graded, deterministic failures across Docker, Kubernetes and GitHub Actions.",
    problem:
      "Cryptic pipeline failures eat developer hours, and there was no benchmark for whether an agent can actually fix one.",
    approach:
      "An OpenEnv environment with deterministic simulators for Docker, Kubernetes and workflow runners, and ten graded tasks — build errors, runtime faults, workflow syntax, secrets and permissions, multi-stage matrices.",
    details: [
      { label: "Tasks", value: "10, graded" },
      { label: "Simulators", value: "Docker · K8s · Workflow" },
      { label: "Determinism", value: "Tested" },
      { label: "Built for", value: "OpenEnv Hackathon" },
    ],
    stack: ["Docker", "Kubernetes", "Agents", "CI/CD"],
    year: "2026",
    track: "research",
    repo: `${GH}/CloudNative-Devops-Debug-OpenEnv`,
  },
  {
    id: "ect-nimhans",
    name: "NIVIQURE",
    sub: "ECT-EEG format reverse engineering — NIMHANS",
    mark: "crack",
    figure: "8 channels",
    caption: "recovered from an undocumented binary format, then screened for anomalies.",
    problem:
      "Clinical ECT recordings were locked in a proprietary .BIN format with no specification, so none of the data could be analysed.",
    approach:
      "Reverse-engineered the layout — 16-byte chunks, eight 16-bit little-endian channels — then built an anomaly suite over the recovered signal: DBSCAN, one-class SVM, LOF, a GAN, PELT change-points and wavelet LF/HF analysis.",
    details: [
      { label: "Format", value: "16-byte chunks" },
      { label: "Channels", value: "8 × 16-bit LE" },
      { label: "Detectors", value: "DBSCAN · OCSVM · LOF · GAN" },
      { label: "Segmentation", value: "PELT change-points" },
      { label: "Setting", value: "Clinical, NIMHANS" },
    ],
    stack: ["Python", "Signal processing", "Anomaly detection"],
    year: "2025",
    track: "research",
    repo: `${GH}/ECT-NIMHANS`,
  },
  {
    id: "prism",
    name: "PRISM WSI",
    sub: "Whole-slide image inference pipeline",
    mark: "lens",
    figure: "3 formats",
    caption: "of gigapixel pathology slide read, tiled and aggregated automatically.",
    problem:
      "A whole-slide image is gigapixel-scale and comes in vendor formats. Getting from a slide on disk to a usable feature vector is most of the work.",
    approach:
      "Virchow, a ViT tile encoder, produces tile embeddings; PRISM aggregates them into slide-level features. Automatic tiling, and multi-format output at the end.",
    details: [
      { label: "Formats", value: ".svs · .ndpi · .tiff" },
      { label: "Tile encoder", value: "Virchow (ViT)" },
      { label: "Aggregator", value: "PRISM" },
      { label: "Scale", value: "Gigapixel slides" },
    ],
    stack: ["Python", "PyTorch", "ViT", "Digital pathology"],
    year: "2025",
    track: "research",
    repo: `${GH}/MediReport`,
  },
  {
    id: "videoanalytics",
    name: "Video Analytics",
    sub: "Action recognition and violence detection",
    mark: "frame",
    figure: "5 architectures",
    caption: "compared across skeleton, appearance and hybrid approaches on three datasets.",
    problem:
      "Action recognition splits into skeleton-based and appearance-based camps, and papers rarely compare them on the same footing.",
    approach:
      "Built one platform to run ViViT, VideoMAE, ResNet-CRNN, YOLOv8 and PoseNet over UCF-101, UCF-Crime and Kinetics-400, with tooling for real-time deployment.",
    details: [
      { label: "Models", value: "ViViT · VideoMAE · ResNet-CRNN" },
      { label: "Detection", value: "YOLOv8 · PoseNet" },
      { label: "Datasets", value: "UCF-101 · UCF-Crime · Kinetics-400" },
    ],
    stack: ["PyTorch", "ViViT", "VideoMAE", "YOLOv8"],
    year: "2025",
    track: "research",
    repo: `${GH}/VideoAnalytics`,
  },
  {
    id: "moml",
    name: "MoML",
    sub: "Multi-objective model optimisation",
    mark: "pareto",
    figure: "3 objectives",
    caption: "in conflict — accuracy, inference time, model size. Nothing wins all three.",
    problem:
      "Picking a model is a trade-off nobody writes down. The usual answer is to tune for accuracy and discover the latency cost later.",
    approach:
      "Mapped the Pareto front over all three objectives at once, running evolutionary NSGA-II against Bayesian qNEHVI on an identical search space and trial budget for Fashion-MNIST.",
    details: [
      { label: "Objectives", value: "Accuracy · latency · size" },
      { label: "Evolutionary", value: "pymoo NSGA-II" },
      { label: "Bayesian", value: "BoTorch qNEHVI" },
      { label: "Control", value: "Same space, same budget" },
    ],
    stack: ["Python", "pymoo", "BoTorch"],
    year: "2025",
    track: "research",
    repo: `${GH}/MOML_Project`,
  },
  {
    id: "ml-b120",
    name: "ML B120",
    sub: "Tabular benchmarking with stacked ensembles",
    mark: "stack",
    figure: "6 families",
    caption: "tuned and cross-validated, then stacked into one ensemble.",
    problem:
      "Tabular results are easy to overstate — one lucky split and a gradient-boosted model looks unbeatable.",
    approach:
      "Ran six model families — CatBoost, random forest, decision trees, KNN, ridge and linear — under Optuna tuning and K-fold cross-validation, tracked through a reproducible harness, then stacked them.",
    details: [
      { label: "Families", value: "6, plus a stacked ensemble" },
      { label: "Tuning", value: "Optuna" },
      { label: "Validation", value: "K-fold" },
      { label: "Tracking", value: "Reproducible harness" },
    ],
    stack: ["CatBoost", "Optuna", "scikit-learn"],
    year: "2024",
    track: "research",
    repo: `${GH}/ML_Project_B120`,
  },

  /* ── build ─────────────────────────────────────────────── */
  {
    id: "matrix-of-truth",
    name: "Matrix of Truth",
    sub: "Multimodal misinformation detection",
    mark: "glass",
    figure: "2nd / 5,600+",
    caption: "global submissions at the TruthTell Hackathon, WAVES Summit 2025.",
    problem:
      "Misinformation is not only text any more. Checking a claim means checking the video and audio it arrived in.",
    approach:
      "A detection platform spanning text and media, built on FastAPI and the Gemini SDK, with deepfake models trained for video, image and audio. Containerised and deployed on Google Cloud — Krishna was the team's DevOps lead.",
    details: [
      { label: "Placing", value: "2nd of 5,600+" },
      { label: "Deepfake accuracy", value: "90%+" },
      { label: "Modalities", value: "Text · video · image · audio" },
      { label: "Role", value: "DevOps lead" },
      { label: "Team", value: "Coders@IIITB" },
    ],
    stack: ["FastAPI", "Gemini", "PyTorch", "GCP", "Docker"],
    year: "2025",
    track: "build",
    repo: `${GH}/TruthTell-Bk`,
    award: "2nd prize",
  },
  {
    id: "voltiq",
    name: "Voltiq",
    sub: "Asset intelligence for electric fleets",
    mark: "cell",
    figure: "Computed, not read",
    caption: "battery health derived from electrochemistry rather than reported by the BMS.",
    problem:
      "India's EV transition stalls on intelligence, not price. Fleet operators cannot see battery health and financiers cannot value the asset.",
    approach:
      "Coulomb counting for true state of health, the Arrhenius law for thermal decay, and a rate^1.3 power law for fast-charge abuse — with negotiating agents on top. Built for the ET AI Hackathon 2026.",
    details: [
      { label: "State of health", value: "Coulomb counting" },
      { label: "Thermal decay", value: "Arrhenius law" },
      { label: "Fast-charge abuse", value: "rate^1.3 power law" },
      { label: "Agents", value: "CrewAI" },
      { label: "Built for", value: "ET AI Hackathon 2026" },
    ],
    stack: ["Next.js", "FastAPI", "TimescaleDB", "PyTorch", "CrewAI"],
    year: "2026",
    track: "build",
  },
  {
    id: "desaigner",
    name: "DesAIgner",
    sub: "Real-time collaborative design canvas",
    mark: "brushes",
    figure: "2nd / 3,500+",
    caption: "participants at MERNify, IIITB's Synergy '24 tech fest.",
    problem:
      "Design tools that support real collaboration are heavy. A hackathon version has to be live, multi-user and not fall over.",
    approach:
      "An infinite PixiJS canvas with multi-user live editing over WebSockets — shape, text and asset tools, plus AI content suggestions, on a MERN stack.",
    details: [
      { label: "Placing", value: "2nd of 3,500+" },
      { label: "Canvas", value: "PixiJS, infinite" },
      { label: "Collaboration", value: "WebSockets, live cursors" },
      { label: "Event", value: "MERNify · Synergy '24" },
    ],
    stack: ["MERN", "PixiJS", "WebSockets"],
    year: "2024",
    track: "build",
    repo: `${GH}/DesAIgner`,
    award: "2nd prize",
  },
  {
    id: "os-registrar",
    name: "CLI Academia",
    sub: "Multi-user educational management system",
    mark: "keys",
    figure: "100 clients",
    caption: "concurrent connections, on a multi-threaded C server over TCP.",
    problem:
      "An Operating Systems project that actually exercises the subject: concurrency, synchronisation and sockets, not a toy CRUD app.",
    approach:
      "A multi-threaded C server with pthread orchestration, TCP socket communication and semaphore synchronisation, behind a three-tier role system with live enrolment tracking.",
    details: [
      { label: "Concurrency", value: "100 connections" },
      { label: "Threading", value: "pthreads" },
      { label: "Sync", value: "Semaphores" },
      { label: "Transport", value: "TCP sockets" },
      { label: "Roles", value: "Admin · student · faculty" },
    ],
    stack: ["C", "Operating systems", "Sockets"],
    year: "2025",
    track: "build",
    repo: `${GH}/OS_Mini_Project`,
  },
  {
    id: "hft-sim",
    name: "HFT Simulator",
    sub: "Exchange and order-matching engine",
    mark: "book",
    figure: "Price-time",
    caption: "priority, strictly enforced. No order jumps the queue.",
    problem:
      "Trading strategies are usually tested against a fake fill model. Without a real matching engine the results mean very little.",
    approach:
      "A low-latency C++ matching engine with a price-time priority book supporting limit and market orders, wired into a Java virtual trading environment, then used to test market-making and statistical arbitrage.",
    details: [
      { label: "Engine", value: "C++, low latency" },
      { label: "Book", value: "Price-time priority" },
      { label: "Orders", value: "Limit and market" },
      { label: "Strategies", value: "Market making · stat arb" },
      { label: "Bridge", value: "Java environment" },
    ],
    stack: ["C++", "Java", "JNI"],
    year: "2024",
    track: "build",
    repo: `${GH}/HFT_and_OrderBook_Simulator`,
  },
  {
    id: "dapi",
    name: "Dapi",
    sub: "Scenario-based language learning",
    mark: "bridge",
    figure: "5 games",
    caption: "generated per scenario, with speech validation and cached audio.",
    problem:
      "Language apps teach the same fixed sentences to everyone. What people actually want is the language for the situation they are about to be in.",
    approach:
      "Generates a scenario, then lessons, then five game types from it — audio catch, mahjong, puzzle builder, target translation and word sprint — with generated speech, phonetics and speech validation.",
    details: [
      { label: "Games", value: "5 types, generated" },
      { label: "Audio", value: "ElevenLabs, cached" },
      { label: "Generation", value: "Gemini" },
      { label: "Storage", value: "MongoDB · Cloudinary" },
    ],
    stack: ["Next.js", "TypeScript", "MongoDB", "Gemini"],
    year: "2025",
    track: "build",
    repo: `${GH}/Dapi`,
  },
  {
    id: "mediassist",
    name: "MediAssist",
    sub: "Clinical decision support suite",
    mark: "steth",
    figure: "4 pipelines",
    caption: "heart-attack risk, pneumonia, skin disease and tuberculosis, behind one API.",
    problem:
      "Individual diagnostic models are easy to demo and hard to use. The gap is a single workflow a clinician could actually move through.",
    approach:
      "Four ML pipelines behind one FastAPI service, with a React workflow over the top.",
    details: [
      { label: "Pipelines", value: "4" },
      { label: "Conditions", value: "Cardiac · pneumonia · skin · TB" },
      { label: "API", value: "FastAPI" },
    ],
    stack: ["FastAPI", "React", "ML"],
    year: "2024",
    track: "build",
    repo: `${GH}/MediAssist`,
  },
  {
    id: "relaybrain",
    name: "relayBrain",
    sub: "One project brain, any coding agent",
    mark: "baton",
    figure: "Files only",
    caption: "no database, no login. Switch agents without re-explaining the repo.",
    problem:
      "Every coding agent starts from nothing. Tasks, decisions, dead ends and what the last session actually did all get re-explained by hand.",
    approach:
      "Tracks project intelligence in plain files beside the code, so Cursor, Claude Code and anything else read the same state.",
    details: [
      { label: "Storage", value: "Files, no database" },
      { label: "Auth", value: "None" },
      { label: "Tracks", value: "Tasks · decisions · failures" },
    ],
    stack: ["Node.js", "CLI"],
    year: "2026",
    track: "build",
    repo: `${GH}/relayBrain`,
  },
  {
    id: "sellorita",
    name: "Sellorita",
    sub: "AI marketing and creative assistant",
    mark: "horn",
    figure: "3 tools",
    caption: "ad generation, marketing strategy and campaign planning, in one place.",
    problem:
      "Small sellers need creative, copy and a plan. Those are three different tools and three different subscriptions.",
    approach:
      "A product brief becomes ad imagery and video through Stability AI, alongside a LangChain and Gemini assistant for strategy and social campaign planning.",
    details: [
      { label: "Tools", value: "Ads · strategy · campaigns" },
      { label: "Imagery", value: "Stability AI" },
      { label: "Assistant", value: "LangChain + Gemini" },
      { label: "Interface", value: "Streamlit" },
    ],
    stack: ["LangChain", "Gemini", "Stability AI"],
    year: "2024",
    track: "build",
    repo: `${GH}/Sellorita`,
  },
  {
    id: "pluginlive",
    name: "PluginLive",
    sub: "Communication assessment platform",
    mark: "mic",
    figure: "Video → report",
    caption: "interactive sessions assessed automatically and returned as detailed feedback.",
    problem:
      "Communication feedback is subjective and slow, which is why most people never get any.",
    approach:
      "Interactive video sessions assessed automatically and returned as structured feedback, behind token-based auth and a full session workflow.",
    details: [
      { label: "Input", value: "Interactive video session" },
      { label: "Output", value: "Structured feedback" },
      { label: "Auth", value: "Token-based" },
      { label: "Deploy", value: "Vercel · GCP" },
    ],
    stack: ["React", "TypeScript", "Python", "OpenAI"],
    year: "2025",
    track: "build",
    repo: `${GH}/PluginLive-BrightGradients-main`,
  },
  {
    id: "dialecto",
    name: "Dialecto",
    sub: "Pixel-art language learning",
    mark: "speech",
    figure: "4 modes",
    caption: "story exercises, pronunciation checks, a memory game and progress tracking.",
    problem:
      "Learning apps are either drill software or games. Very few are both, and fewer still handle Indian languages properly.",
    approach:
      "A pixel-art app in React and Tailwind with Sarvam API text-to-speech, and a FastAPI service over MongoDB behind it for progress, leaderboards and content.",
    details: [
      { label: "Modes", value: "4" },
      { label: "Speech", value: "Sarvam API" },
      { label: "Backend", value: "FastAPI · MongoDB" },
      { label: "Team", value: "NetCrawlers" },
    ],
    stack: ["React", "FastAPI", "MongoDB", "Sarvam"],
    year: "2024",
    track: "build",
    repo: `${GH}/Dialecto`,
  },
];

export const RESEARCH = PROJECTS.filter((p) => p.track === "research");
export const BUILD = PROJECTS.filter((p) => p.track === "build");

/* ── the rest of the content ─────────────────────────────── */

export const PROFILE = {
  name: "Velidanda Krishna Sai",
  te: "వెలిదండ కృష్ణ సాయి",
  location: "Bangalore, India",
  email: "kvelidanda.1177@gmail.com",
  github: "https://github.com/melohub-xbit",
  linkedin: "https://linkedin.com/in/krishna-sai-velidanda",
  statement:
    "Machine learning research, and the systems that carry it.",
  quiet: "Mostly the unglamorous half.",
};

export const EDUCATION = {
  school: "International Institute of Information Technology, Bangalore",
  degree: "Dual Degree (B.Tech + M.Tech), Computer Science and Engineering",
  span: "Jul 2023 — Jul 2028",
  cgpa: "3.51 / 4.0",
};

export const EXPERIENCE = [
  {
    role: "Research — stress and recovery dynamics",
    org: "Samsung Lab, IIIT Bangalore",
    span: "Jan — May 2026",
    note: "Multi-stressor protocol, simultaneous EEG and ECG from 15 subjects. 95.6% detection accuracy with CNN-LSTM under leave-one-subject-out validation. Supervised by Dr. Sakshi Arora.",
  },
  {
    role: "Signal analysis — ECT monitoring",
    org: "NIMHANS",
    span: "2025",
    note: "Reverse-engineered an undocumented clinical EEG format and built an anomaly-detection suite over the recovered signal.",
  },
];

export const ACHIEVEMENTS = [
  {
    place: "1st",
    what: "ICDEC'24 International Vehicle Detection Challenge",
    scale: "out of 2,000 teams",
  },
  {
    place: "2nd",
    what: "TruthTell Hackathon, WAVES Summit 2025",
    scale: "top 2 of 5,600+ global submissions",
  },
  {
    place: "4th",
    what: "Google Gen AI Exchange Hackathon 2025",
    scale: "among 270,000+ developers nationwide",
  },
  {
    place: "2nd",
    what: "MERNify, Synergy '24",
    scale: "IIITB tech fest, 3,500+ participants",
  },
  {
    place: "—",
    what: "Dean's Merit List",
    scale: "academic year 2023–24",
  },
];

export const SKILLS = [
  {
    group: "Languages",
    items: ["Python", "C++", "C", "Java", "JavaScript", "SQL"],
  },
  {
    group: "ML & signal",
    items: ["PyTorch", "scikit-learn", "CNN-LSTM", "HRV", "YOLO", "Optuna"],
  },
  {
    group: "Backend & data",
    items: ["FastAPI", "MERN", "MongoDB", "MySQL", "TimescaleDB"],
  },
  {
    group: "Platform",
    items: ["Docker", "Kubernetes", "Google Cloud", "Kafka"],
  },
  {
    group: "Coursework",
    items: [
      "Data structures & algorithms",
      "Recommendation systems",
      "Machine learning",
      "Operating systems",
      "Computer networks",
      "Database systems",
      "Linear algebra",
      "Software engineering",
    ],
  },
];

/**
 * How many of the 22 projects touched each skills group.
 *
 * Derived, never typed by hand: a project counts for a group if anything
 * in its `stack` names a tool in that group. Matching is loose in one
 * direction only — "YOLO" catches "YOLOv10" — because the résumé writes
 * families and the projects write versions. Coursework has no stack
 * entries and honestly reports zero rather than being given a number.
 */
export const SKILL_USES: Record<string, number> = Object.fromEntries(
  SKILLS.map((g) => {
    const want = g.items.map((i) => i.toLowerCase());
    const n = PROJECTS.filter((p) =>
      p.stack.some((s) => {
        const t = s.toLowerCase();
        return want.some((w) => t === w || t.startsWith(w) || w.startsWith(t));
      })
    ).length;
    return [g.group, n];
  })
);


/** The six stops the nav dots track. */
export const SECTIONS = [
  { id: "entry", en: "Entry", te: "ద్వారం" },
  { id: "about", en: "About", te: "పరిచయం" },
  { id: "work", en: "Work", te: "పనులు" },
  { id: "skills", en: "Skills", te: "అస్త్రాలు" },
  { id: "interests", en: "Off the clock", te: "అభిరుచులు" },
  { id: "contact", en: "Contact", te: "ముద్ర" },
] as const;
