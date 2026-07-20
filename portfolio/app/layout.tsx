import "./globals.css";

export const metadata = {
  title: "Velidanda Krishna Sai — Portfolio",
  description:
    "Machine-learning researcher and builder. Dual degree at IIIT Bangalore; multimodal EEG–ECG stress research at Samsung Lab. A portfolio read as a manga volume.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
