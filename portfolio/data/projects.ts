export type Link = { label: string; href: string };
export type Project = {
  id: string;
  title: string;
  titleSfx?: string; // trailing word rendered in accent
  sub?: string;
  feat: string;
  astras: string[];
  links: Link[];
  badge?: string;
  hero?: boolean;
};

const GH = "https://github.com/melohub-xbit";

/* ===================== RAMAYANAM — research ===================== */
export const ramayanam: Project[] = [
  {
    id: "dalsp",
    title: "DALSP",
    sub: "Domain-Aware Layer-Sensitivity Pruning",
    feat: "Entropy-guided pruning of Phi-3.5-mini's MLP blocks — a ~20% average neuron reduction that carves specialised subnetworks (General, Math, Code, Law) with no retraining. An information-theoretic extension and critique of the Wanda method.",
    astras: ["Python", "PyTorch", "LLMs", "Pruning", "Shannon Entropy"],
    links: [{ label: "REPO", href: `${GH}/Domain-Aware_Layer_Sensitivity_Pruning` }],
    badge: "Efficient LLM inference",
    hero: true,
  },
  {
    id: "racs",
    title: "RACS",
    sub: "Risk-Aware Cold-Start Recommendation",
    feat: "A recommender for extreme cold-start: LLM contrastive scoring (ACS) ranks items, Bayesian semantic-neighbourhood disagreement (SND) drives exploration, and a risk constraint penalises unsafe content. Benchmarked against EASE, SASRec and ItemKNN with Wilcoxon significance testing.",
    astras: ["Python", "PyTorch", "Llama 3.1", "RecSys", "Bayesian"],
    links: [{ label: "REPO", href: `${GH}/RecSys_Project` }],
  },
  {
    id: "eeg-stress",
    title: "EEG · ECG",
    titleSfx: "STRESS",
    sub: "Multimodal stress & recovery",
    feat: "Samsung Lab, IIITB. Designed a multi-stressor protocol and recorded simultaneous 8-channel EEG (500 Hz) and single-lead ECG from 15 subjects across 4,939 windows. Found ECG alone reaches 65% vs EEG's 85.7% — the two arousal pathways are largely independent (r = 0.08).",
    astras: ["Python", "EEG/ECG", "CNN-LSTM", "HRV", "scikit-learn"],
    links: [{ label: "REPO", href: `${GH}/ECT_EEG_Stress` }],
    badge: "Research · Samsung Lab",
  },
  {
    id: "videoanalytics",
    title: "VIDEO",
    titleSfx: "ANALYTICS",
    sub: "Video understanding platform",
    feat: "A research platform for human action recognition and violence detection spanning skeleton-, appearance- and hybrid methods — ViViT, VideoMAE, ResNet-CRNN, YOLOv8 and PoseNet over UCF-101, UCF-Crime and Kinetics-400, with real-time deployment tooling.",
    astras: ["PyTorch", "ViViT", "VideoMAE", "YOLOv8", "OpenPose"],
    links: [{ label: "REPO", href: `${GH}/VideoAnalytics` }],
  },
  {
    id: "medireport",
    title: "PRISM",
    titleSfx: "WSI",
    sub: "Whole-slide-image inference",
    feat: "A complete pathology pipeline for whole-slide images: Virchow (a ViT tile encoder) produces tile embeddings that PRISM aggregates into slide-level features. Handles .svs/.ndpi/.tiff, auto tiling, and multi-format output.",
    astras: ["Python", "PyTorch", "ViT", "Digital Pathology"],
    links: [{ label: "REPO", href: `${GH}/MediReport` }],
  },
  {
    id: "moml",
    title: "MoML",
    sub: "Multi-objective optimisation",
    feat: "Pareto-front analysis over three conflicting objectives — accuracy, inference time and model size — pitting evolutionary pymoo NSGA-II against Bayesian BoTorch qNEHVI on the same search space and trial budget for Fashion-MNIST.",
    astras: ["Python", "pymoo", "BoTorch", "NSGA-II"],
    links: [{ label: "REPO", href: `${GH}/MOML_Project` }],
  },
  {
    id: "mutanthunter",
    title: "MUTANT",
    titleSfx: "HUNTER",
    sub: "RL env for test generation",
    feat: "An OpenEnv-compatible RL environment that teaches LLMs to write tests that actually catch bugs, rewarding them by mutation score. Ships as a live Hugging Face Space.",
    astras: ["RL", "LLMs", "Docker", "OpenEnv"],
    links: [
      { label: "REPO", href: `${GH}/MetaOpenEnv_MutantHunter` },
      { label: "LIVE", href: "https://huggingface.co/spaces/jester1177/mutant-hunter-env" },
    ],
  },
  {
    id: "devops-debug",
    title: "DEVOPS",
    titleSfx: "DEBUG",
    sub: "Cloud-native debug env",
    feat: "An OpenEnv environment where AI agents learn to debug broken GitHub Actions, Dockerfiles and Kubernetes manifests — the cryptic pipeline failures that waste developer hours. Built for the OpenEnv Hackathon (Scaler · Meta · HuggingFace · PyTorch).",
    astras: ["Docker", "Kubernetes", "Agents", "CI/CD"],
    links: [{ label: "REPO", href: `${GH}/CloudNative-Devops-Debug-OpenEnv` }],
    badge: "OpenEnv Hackathon",
  },
  {
    id: "ect-nimhans",
    title: "NIVIQURE",
    sub: "ECT-EEG reverse engineering",
    feat: "Reverse-engineered the proprietary NIVIQURE .BIN EEG format (16-byte chunks, 8×16-bit little-endian channels) and built an anomaly-detection suite over the recovered signal — DBSCAN, OCSVM, LOF, GAN, PELT change-points and wavelet LF/HF analysis for ECT monitoring.",
    astras: ["Python", "Signal Processing", "Anomaly Detection", "Wavelets"],
    links: [{ label: "REPO", href: `${GH}/ECT-NIMHANS` }],
    badge: "Clinical · NIMHANS",
  },
  {
    id: "ml-b120",
    title: "ML",
    titleSfx: "B120",
    sub: "Tabular ML benchmarking",
    feat: "A rigorous tabular-ML study: Optuna-tuned XGBoost and CatBoost against KNN, decision trees and linear baselines, with K-fold cross-validation and stacked ensembles, tracked through a reproducible experiment harness.",
    astras: ["XGBoost", "CatBoost", "Optuna", "scikit-learn"],
    links: [{ label: "REPO", href: `${GH}/ML_Project_B120` }],
  },
  {
    id: "os-mini",
    title: "OS",
    titleSfx: "REGISTRAR",
    sub: "Course enrolment system",
    feat: "A role-based course-registration system (admin, student, faculty) built for the Operating Systems course — file-backed accounts, subjects and enrolments with a clean terminal workflow.",
    astras: ["C", "Operating Systems", "File I/O"],
    links: [{ label: "REPO", href: `${GH}/OS_Mini_Project` }],
  },
];

/* ===================== MAHABHARATAM — dev / hackathons ===================== */
export const mahabharatam: Project[] = [
  {
    id: "matrix-of-truth",
    title: "MATRIX OF",
    titleSfx: "TRUTH",
    sub: "AI misinformation detection",
    feat: "A real-time misinformation-detection system combining BERT-based NLP with a Kafka streaming pipeline, containerised and deployed on Google Cloud Run. Built with Team Coders@IIITB — 2nd of 5,600+ global submissions at the TruthTell Hackathon, WAVES Summit 2025.",
    astras: ["BERT", "NLP", "Kafka", "Docker", "GCP"],
    links: [{ label: "REPO", href: `${GH}/TruthTell-Bk` }],
    badge: "2nd / 5,600+ · TruthTell",
    hero: true,
  },
  {
    id: "desaigner",
    title: "DesAIgner",
    sub: "Collaborative design canvas",
    feat: "A real-time collaborative design platform on an infinite PixiJS canvas — multi-user live editing, shape/text/asset tools and AI-powered content suggestions, on a secure MERN stack. Built for the MERNIFY Hackathon at Synergy'24 (2nd prize, 3,500+ participants).",
    astras: ["MERN", "PixiJS", "WebSockets", "AI"],
    links: [{ label: "REPO", href: `${GH}/DesAIgner` }],
    badge: "2nd · MERNIFY Synergy'24",
  },
  {
    id: "sellorita",
    title: "SELLORITA",
    sub: "AI marketing assistant",
    feat: "An AI marketing suite that turns a product brief into ad creative — images and video via Stability AI — plus a LangChain + Gemini marketing chatbot for strategy and campaign planning.",
    astras: ["LangChain", "Gemini", "Stability AI", "Streamlit"],
    links: [{ label: "REPO", href: `${GH}/Sellorita` }],
  },
  {
    id: "hft-sim",
    title: "HFT",
    titleSfx: "SIM",
    sub: "Exchange & HFT engine",
    feat: "A stock-exchange and high-frequency-trading simulator with an AVL-tree order book at its core — a native C++ matching engine bridged to a Java Swing UI over JNI. Built with Team DigitalDynamos.",
    astras: ["C++", "Java", "JNI", "AVL Tree", "OOP"],
    links: [{ label: "REPO", href: `${GH}/HFT-Simulator-DigitalDynamos` }],
  },
  {
    id: "dialecto",
    title: "DIALECTO",
    sub: "Language-learning backend",
    feat: "The backend for a pixel-art language-learning app — a FastAPI service over MongoDB handling user progress, leaderboards and language content. Built with Team NetCrawlers.",
    astras: ["FastAPI", "MongoDB", "PyMongo"],
    links: [{ label: "REPO", href: `${GH}/Dialecto` }],
  },
  {
    id: "mediassist",
    title: "MediAssist",
    sub: "Clinical AI suite",
    feat: "A full-stack clinical demo layering a FastAPI backend over four ML pipelines — heart-attack risk, pneumonia, skin disease and tuberculosis — behind a modern React workflow.",
    astras: ["FastAPI", "React", "ML", "Full-stack"],
    links: [{ label: "REPO", href: `${GH}/MediAssist` }],
  },
  {
    id: "pluginlive",
    title: "PLUGIN",
    titleSfx: "LIVE",
    sub: "Communication assessment",
    feat: "An AI platform that assesses communication skills through interactive video sessions, returning comprehensive, detailed feedback — with secure token-based authentication and a full session workflow.",
    astras: ["AI", "Video", "Auth", "Full-stack"],
    links: [{ label: "REPO", href: `${GH}/PluginLive-BrightGradients-main` }],
  },
  {
    id: "relaybrain",
    title: "relayBrain",
    sub: "One project brain, any agent",
    feat: "A tool that tracks project intelligence — tasks, decisions, failures and what every coding agent did last session — so you can switch between Cursor, Claude Code and others without re-explaining the repo. Files only, no database, no login.",
    astras: ["Node.js", "CLI", "Dev tools"],
    links: [{ label: "REPO", href: `${GH}/relayBrain` }],
  },
  {
    id: "dapi",
    title: "DAPI",
    sub: "AI language-learning platform",
    feat: "A personalised, scenario-based language-learning web app powered by AI — built on Next.js with an app-router architecture and a modern component system.",
    astras: ["Next.js", "TypeScript", "AI"],
    links: [{ label: "REPO", href: `${GH}/Dapi` }],
  },
];

export const epics = {
  ramayanam: {
    key: "ramayanam" as const,
    te: "రామాయణం",
    name: "Ramayanam",
    role: "The research path",
    blurb:
      "The disciplined journey — dharma, rigor, one focused pursuit at a time. Deep work in machine learning, systems and signal.",
    projects: ramayanam,
  },
  mahabharatam: {
    key: "mahabharatam" as const,
    te: "మహాభారతం",
    name: "Mahabharatam",
    role: "The builder path",
    blurb:
      "The battlefield — alliances, all-nighters, decisive feats. Hackathons and products shipped under fire.",
    projects: mahabharatam,
  },
};
