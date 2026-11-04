import { ArrowUpRight } from "lucide-react";
import ContactForm from "./ContactForm";
import CopyEmailButton from "./CopyEmailButton";
import EmailLink from "./EmailLink";
import Section from "./Section";
import LocalTime from "./LocalTime";
import ShinyText from "./effects/ShinyText";
import { site } from "../site";
import { hobbies } from "../data";

// The form appears once RESEND_API_KEY is set (see app/actions/contact.ts); until then it's email only
const contactFormEnabled = Boolean(process.env.RESEND_API_KEY);

export default function Footer() {
  const links = [
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: "résumé", href: site.resume, external: false },
    { label: "notes", href: "/notes", external: false },
  ].filter((l) => l.href);

  return (
    <Section id="contact" index="06" title="Contact" as="footer" className="space-y-6 pt-4 lg:pt-0">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-fg">
          <ShinyText>Let&apos;s build something great together.</ShinyText>
        </h3>
        <p className="text-sm text-muted leading-relaxed">
          {contactFormEnabled
            ? "Tell me what you're working on and I'll get back to you soon."
            : "For freelance inquiries, full-stack collabs, or general questions, feel free to reach out directly via email."}
        </p>
      </div>

      {contactFormEnabled ? (
        <>
          <ContactForm />

          {/* Email stays available, but as the secondary option under the form */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 text-xs font-mono text-muted">
              <span className="h-px flex-1 bg-line" />
              or email me directly
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="flex items-center gap-3">
              <EmailLink email={site.email} compact />
              <CopyEmailButton email={site.email} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <EmailLink email={site.email} />
          <CopyEmailButton email={site.email} />
        </div>
      )}

      <div className="flex flex-wrap gap-6 text-xs font-mono text-muted">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="flex items-center gap-1 py-1 hover:text-fg transition group"
          >
            <span>{l.label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed">
        <span className="text-fg-soft">Off the clock:</span> {hobbies}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-line text-xs text-muted font-mono">
        <span>© 2026 Louie Jae Maravillosa</span>
        <LocalTime />
      </div>
    </Section>
  );
}
