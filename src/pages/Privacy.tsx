import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <div className="font-body antialiased min-h-screen">
      <section className="section bg-ocean-950/60 pt-[var(--space-7)]" aria-labelledby="privacy-title">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 id="privacy-title" className="type-display text-salt-50 mb-6">
              Privacy Policy
            </h1>
            <p className="type-body-lg text-salt-300 mb-10">
              Effective {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. LionSpear respects your privacy. This policy explains what data we collect, why, and your rights.
            </p>

            <div className="space-y-8 type-body text-salt-300">
              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Data We Collect</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Application data:</strong> Name, role, contact details, experience notes — submitted voluntarily via the application form.</li>
                  <li><strong>Newsletter data:</strong> Email address — submitted voluntarily via the subscription form.</li>
                  <li><strong>Trip data:</strong> Emergency contacts, medical information, certifications — collected only after acceptance, for safety and logistics.</li>
                  <li><strong>Technical data:</strong> IP address, browser type, pages visited — collected automatically via standard web logs.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">How We Use Your Data</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Evaluate crew applications and contact applicants.</li>
                  <li>Coordinate trip logistics, safety briefings, and emergency procedures.</li>
                  <li>Send trip alerts, schedule updates, and gear announcements (newsletter subscribers only).</li>
                  <li>Comply with legal obligations and safety regulations.</li>
                  <li>Improve our website and communication.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Data Sharing</h2>
                <p>We do not sell your data. We may share information only:</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>With charter partners and vessel operators — strictly for trip manifests and safety compliance.</li>
                  <li>With research partners — anonymized catch/tag data only, with your consent.</li>
                  <li>With emergency services or authorities — when required for safety or by law.</li>
                  <li>With service providers (email, hosting) — under data processing agreements.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Retention</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Application data: retained for 12 months after decision, then deleted unless you join the crew.</li>
                  <li>Active crew data: retained for duration of membership plus 2 years.</li>
                  <li>Newsletter data: retained until you unsubscribe.</li>
                  <li>Trip safety/medical data: retained for 3 years post-trip per maritime regulations.</li>
                  <li>Web logs: retained for 90 days.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Your Rights</h2>
                <p>Under applicable data protection law, you may:</p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Access the personal data we hold about you.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your data (subject to legal retention requirements).</li>
                  <li>Object to or restrict processing.</li>
                  <li>Withdraw consent (e.g., unsubscribe from newsletter).</li>
                  <li>Lodge a complaint with your local data protection authority.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Security</h2>
                <p>We implement appropriate technical and organizational measures: HTTPS encryption, access controls, and regular review. No internet transmission is 100% secure; we cannot guarantee absolute security.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">International Transfers</h2>
                <p>Data may be processed outside your country of residence. We ensure adequate safeguards through standard contractual clauses or equivalent protections.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Children</h2>
                <p>Our services are not directed to individuals under 18. We do not knowingly collect data from minors.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Changes to This Policy</h2>
                <p>We may update this policy. Material changes will be posted here and communicated to active crew and subscribers. Continued use after changes constitutes acceptance.</p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}