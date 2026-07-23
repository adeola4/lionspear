import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="font-body antialiased min-h-screen">
      <section className="relative min-h-[100dvh] flex items-center justify-center">
        <div className="container-page relative z-10 py-[var(--space-8)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 type-caption text-salt-400 hover:text-cyan-400 transition-colors mb-[var(--space-6)]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to LionSpear
            </Link>
            <h1 className="type-display text-salt-50 mb-4">
              Terms of Service
            </h1>
            <p className="type-body-lg text-salt-300 mb-[var(--space-6)]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-[var(--space-6)] type-body text-salt-300">
              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Acceptance of Terms</h2>
                <p>By applying to join LionSpear crew, subscribing to updates, or participating in any trip, you agree to these Terms of Service. If you do not agree, do not submit an application or participate.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Crew Membership</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Membership is by invitation only following application review, interview, and trial day.</li>
                  <li>The crew captains reserve the right to accept or decline any applicant at their sole discretion.</li>
                  <li>Active membership requires participation in a minimum of one trip per calendar year and adherence to all safety protocols.</li>
                  <li>Membership may be suspended or revoked for safety violations, repeated no-shows, or conduct detrimental to the crew.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Trip Participation</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>All trips are weather and conditions dependent. Dates, locations, and targets may change without notice.</li>
                  <li>Participants must hold current freediving certification (AIDA 3* / PADI Master Freediver or equivalent) and valid first aid / O₂ provider certification.</li>
                  <li>Each diver is responsible for their own gear, fitness, and dive decisions. The captain's authority on safety is final.</li>
                  <li>No refunds for cancellations within 30 days of departure unless your spot is filled.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Assumption of Risk</h2>
                <p>Freediving and spearfishing in open ocean environments carry inherent risks including but not limited to: drowning, barotrauma, marine life encounters, vessel accidents, equipment failure, and dehydration. By participating, you acknowledge these risks and voluntarily assume them.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Liability Waiver</h2>
                <p>All participants must sign a separate Liability Waiver prior to boarding. That waiver releases LionSpear, its captains, crew, charter partners, and affiliates from claims arising from participation.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Conduct</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Zero tolerance for alcohol or substance use before or during diving operations.</li>
                  <li>Respect the marine environment. No waste, no unnecessary take, no harassment of wildlife.</li>
                  <li>Follow the captain's instructions without exception. Disruptive behavior results in immediate removal.</li>
                </ul>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Intellectual Property</h2>
                <p>All media captured during trips (photos, video, data) may be used by LionSpear for documentation, research, and promotion. Participants grant a non-exclusive, royalty-free license for such use.</p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Modifications</h2>
                <p>We may update these terms at any time. Continued participation after changes constitutes acceptance. Material changes will be communicated to active crew.</p>
              </div>


            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}