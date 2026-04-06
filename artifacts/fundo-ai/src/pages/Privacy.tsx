import { Shield, Mail } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function Privacy() {
  const sections = [
    {
      title: "Information we collect",
      content: [
        "**Account information:** When you register, we collect your name, email address, and a hashed (encrypted) password. We never store your plain-text password.",
        "**Chat history:** Your conversations with FUNDO AI are stored to provide memory across sessions. You can delete this at any time from the chat interface.",
        "**Usage data:** We may collect anonymized usage patterns (e.g., feature popularity) to improve the service. This data is never linked to your identity.",
      ],
    },
    {
      title: "How we use your information",
      content: [
        "To create and manage your account.",
        "To power the AI chat with personalized context and memory.",
        "To send transactional emails (verification codes, password resets). We will never send marketing emails without your explicit consent.",
        "To improve FUNDO AI's accuracy and educational content.",
      ],
    },
    {
      title: "Data storage & security",
      content: [
        "Your data is stored in a secured MongoDB Atlas cloud database.",
        "Passwords are hashed with bcrypt (12 rounds) and are never stored in plain text.",
        "Authentication tokens (JWT) are stored locally on your device and expire after 30 days.",
        "All data transmission uses HTTPS/TLS encryption.",
      ],
    },
    {
      title: "Data sharing",
      content: [
        "We do not sell, rent, or trade your personal information to third parties.",
        "Your chat messages are sent to the BK9 AI API to generate responses. These are not stored by BK9 beyond the request.",
        "Web search queries may be sent to Tavily or DuckDuckGo to fetch real-time information. These services have their own privacy policies.",
      ],
    },
    {
      title: "Your rights",
      content: [
        "**Access:** You can request a copy of your personal data.",
        "**Deletion:** You can delete your chat history at any time. To fully delete your account, contact us at the email below.",
        "**Correction:** You can update your name and profile at any time from the app.",
        "**Portability:** You have the right to receive your data in a machine-readable format.",
      ],
    },
    {
      title: "Children's privacy",
      content: [
        "FUNDO AI is designed to be safe for students of all ages, including minors. We do not knowingly collect personal information from children under 13 without parental consent.",
        "If you are under 13, please ensure a parent or guardian has reviewed this policy before using the service.",
      ],
    },
    {
      title: "Changes to this policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform.",
        "Your continued use of FUNDO AI after changes are posted constitutes acceptance of the updated policy.",
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            <Shield size={13} />Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Last updated: January 2025</p>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            FUNDO AI is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(({ title, content }, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>{i + 1}</span>
                {title}
              </h2>
              <ul className="space-y-3">
                {content.map((item, j) => {
                  const html = item.replace(/\*\*(.+?)\*\*/g, '<strong style="color:rgba(255,255,255,0.85)">$1</strong>');
                  return (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: "#a855f7" }}>•</span>
                      <span dangerouslySetInnerHTML={{ __html: html }} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 glass-card rounded-2xl p-6 text-center">
          <Mail size={24} className="mx-auto mb-3" style={{ color: "#a855f7" }} />
          <h3 className="text-base font-bold text-white mb-2">Questions about privacy?</h3>
          <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Contact our team and we'll respond within 48 hours.</p>
          <a href="mailto:privacy@fundoai.gleeze.com" className="text-sm font-semibold" style={{ color: "#a855f7" }}>privacy@fundoai.gleeze.com</a>
        </div>
      </div>
    </PageLayout>
  );
}
