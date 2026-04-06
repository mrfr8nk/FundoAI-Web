import { FileText, Mail } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";

export default function Terms() {
  const [, nav] = useLocation();

  const sections = [
    {
      title: "Acceptance of terms",
      content: [
        "By creating an account or using FUNDO AI (the \"Service\"), you agree to these Terms of Use. If you do not agree, please do not use the Service.",
        "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the updated terms.",
      ],
    },
    {
      title: "Eligibility",
      content: [
        "You must be at least 13 years old to use FUNDO AI. Users under 18 should have parental or guardian consent.",
        "FUNDO AI is designed for students, educators, and curious minds. Use for academic and educational purposes is encouraged.",
      ],
    },
    {
      title: "Account responsibilities",
      content: [
        "You are responsible for maintaining the security of your account credentials. Do not share your password with others.",
        "You must provide accurate and truthful information when creating your account.",
        "You are responsible for all activity that occurs under your account.",
        "Notify us immediately if you suspect unauthorized access to your account.",
      ],
    },
    {
      title: "Acceptable use",
      content: [
        "You may use FUNDO AI for lawful educational, personal, and professional purposes.",
        "You must not use the Service to generate harmful, hateful, or illegal content.",
        "You must not attempt to bypass, hack, or abuse the AI system or platform infrastructure.",
        "You must not use automated systems (bots) to make excessive requests to the Service.",
        "Academic integrity: while FUNDO AI can help you learn and understand, submitting AI-generated work as your own without disclosure may violate your school's policies.",
      ],
    },
    {
      title: "AI limitations & disclaimers",
      content: [
        "FUNDO AI is an AI assistant and may produce inaccurate, incomplete, or outdated information. Always verify critical information with authoritative sources.",
        "FUNDO AI is not a substitute for qualified teachers, doctors, lawyers, or other professionals.",
        "Answers related to ZIMSEC examinations should be verified against official ZIMSEC materials.",
        "We do not guarantee specific educational outcomes from using the Service.",
      ],
    },
    {
      title: "Intellectual property",
      content: [
        "FUNDO AI, its branding, design, and code are the intellectual property of Darrell Mucheri and FUNDO AI.",
        "Content you create using FUNDO AI remains yours. We claim no ownership over your inputs or outputs.",
        "You grant us a limited license to process your messages to provide the Service.",
      ],
    },
    {
      title: "Termination",
      content: [
        "We reserve the right to suspend or terminate accounts that violate these terms, without prior notice.",
        "You may delete your account at any time by contacting us.",
        "Upon termination, your chat history and personal data will be deleted within 30 days.",
      ],
    },
    {
      title: "Limitation of liability",
      content: [
        "FUNDO AI is provided \"as is\" without warranties of any kind.",
        "We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
        "Our total liability to you shall not exceed the amount you have paid us in the past 12 months (which may be zero for free users).",
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            <FileText size={13} />Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Terms of Use</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Last updated: January 2025 · Effective immediately</p>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Please read these terms carefully before using FUNDO AI. They govern your use of our platform and services.
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
                {content.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#a855f7" }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-6 glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            See also:{" "}
            <button onClick={() => nav("/privacy")} className="font-semibold" style={{ color: "#a855f7" }}>Privacy Policy</button>
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            <Mail size={14} />
            <a href="mailto:legal@fundoai.gleeze.com" style={{ color: "#a855f7" }}>legal@fundoai.gleeze.com</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
