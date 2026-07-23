import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Waiver() {
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
              Liability Waiver
            </h1>
            <p className="type-body-lg text-salt-300 mb-[var(--space-6)]">
              This waiver must be signed by all participants prior to boarding.
            </p>

            <div className="space-y-[var(--space-6)] type-body text-salt-300">
              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Acknowledgment and Assumption of Risk</h2>
                <p>
                  I acknowledge that freediving, spearfishing, and associated open-ocean activities
                  involve inherent risks, including but not limited to: drowning, barotrauma,
                  shallow-water blackout, marine life encounters, vessel accidents, equipment
                  failure, dehydration, hypothermia, and injury from same.
                </p>
                <p className="mt-3">
                  I freely and voluntarily assume all such risks, both known and unknown, and
                  accept full responsibility for my participation.
                </p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Release of Liability</h2>
                <p>
                  To the fullest extent permitted by law, I release, waive, and discharge
                  LionSpear, its captains, crew members, charter partners, vessel operators,
                  and affiliates from any and all liability, claims, demands, or causes of
                  action arising out of or related to my participation in any trip, training,
                  or crew activity.
                </p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Indemnification</h2>
                <p>
                  I agree to indemnify and hold harmless the released parties from any loss,
                  damage, or cost incurred as a result of my participation, including claims
                  made by my family, estate, or heirs.
                </p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Medical Fitness</h2>
                <p>
                  I confirm that I am physically fit and have no medical condition that would
                  make participation unsafe. I agree to disclose any relevant medical
                  information to the captain prior to departure.
                </p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Media Consent</h2>
                <p>
                  I grant LionSpear permission to capture and use photographs, video, and
                  other media of me during trips for documentation, research, and promotional
                  purposes, without compensation.
                </p>
              </div>

              <div>
                <h2 className="type-h3 text-salt-50 mb-3">Governing Law</h2>
                <p>
                  This waiver shall be construed in accordance with applicable maritime law.
                  If any portion is found unenforceable, the remainder remains in full force
                  and effect.
                </p>
              </div>

              <div className="glass-strong p-[var(--space-5)] md:p-[var(--space-6)] mt-[var(--space-6)]">
                <p className="type-caption text-slate-400 mb-3">
                  By submitting a crew application and participating in any LionSpear trip,
                  you acknowledge that you have read, understood, and agreed to this waiver.
                  A physical or electronic signature will be collected prior to your first trip.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
