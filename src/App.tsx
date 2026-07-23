import { useState, type FormEvent, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Routes, Route } from 'react-router-dom'
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.esm.jsx'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Waiver from './pages/Waiver'

type Role = 'diver' | 'spearfisher' | 'captain' | 'charter' | 'other'

const ROLES: { value: Role; label: string }[] = [
  { value: 'diver', label: 'Freediver' },
  { value: 'spearfisher', label: 'Spearfisher' },
  { value: 'captain', label: 'Dive Captain' },
  { value: 'charter', label: 'Charter / Boat Owner' },
  { value: 'other', label: 'Other' },
]

const PRINCIPLES = [
  {
    number: '01',
    title: 'Depth over depth-charge',
    body: 'We hunt bluewater. Open ocean. No reefs, no hand-holding. You hold your breath, you hold your line, you earn the shot. Dogtooth tuna don\'t live in the shallows.',
  },
  {
    number: '02',
    title: 'Crew loyalty, not club membership',
    body: 'A tight roster. Two captains. Zero tourists. You show up for the prep, the early launch, the long drift, the cleanup. Miss three trips without notice — your spot opens. The ocean doesn\'t carry passengers.',
  },
  {
    number: '03',
    title: 'Respect the take, use the whole fish',
    body: 'Every fish landed gets processed on the dock. Meat to crew families, offal to local markets, bills to research partners. Nothing wasted. We tag and release billfish — data goes to conservation foundations. The ocean gives; we give back.',
  },
]

const STEPS = [
  'Application reviewed by the captains within 72 hours.',
  'Phone call — we discuss your experience, depth comfort, and why you want in.',
  'Trial day on the water. No spectators. You dive, we observe.',
  'Crew vote. Unanimous yes — you\'re in. Roster spot opens next trip.',
]

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || ''

async function sendToWebhook(endpoint: string, data: Record<string, unknown>) {
  if (!WEBHOOK_URL) return { ok: true }
  try {
    await fetch(`${WEBHOOK_URL}?endpoint=${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch {
    // Silently fail
  }
  return { ok: true }
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = 35
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.02 - Math.random() * 0.06,
      r: 0.5 + Math.random() * 1.5,
      o: 0.03 + Math.random() * 0.06,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(104, 184, 212, ${p.o})`
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState({ name: '', role: 'spearfisher' as Role, email: '', phone: '', note: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [pendingSubmission, setPendingSubmission] = useState<{ endpoint: string; data: Record<string, unknown> } | null>(null)
  const [videoPercentage, setVideoPercentage] = useState(0)
  const { scrollYProgress } = useScroll()
  const bgDepth = useTransform(scrollYProgress, [0, 1], [0, 0.3])

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setLoaded(true)

    let frame = 0
    const updateVideoProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        setVideoPercentage(scrollable > 0 ? window.scrollY / scrollable : 0)
      })
    }

    updateVideoProgress()
    window.addEventListener('scroll', updateVideoProgress, { passive: true })
    window.addEventListener('resize', updateVideoProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateVideoProgress)
      window.removeEventListener('resize', updateVideoProgress)
    }
  }, [])

  const [stepInView, setStepInView] = useState<number[]>([])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = STEPS.map((_, i) => {
      const el = stepRefs.current[i]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStepInView(prev => prev.includes(i) ? prev : [...prev, i])
          }
        },
        { threshold: 0.5 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'lionspear.ae'
    setPendingSubmission({
      endpoint: 'application',
      data: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        note: form.note,
        domain,
        timestamp: new Date().toISOString(),
        accepted: true
      }
    })
    setShowContractModal(true)
  }

  const handleAcceptContract = async () => {
    if (!pendingSubmission) return
    setFormStatus('submitting')
    setShowContractModal(false)
    if (pendingSubmission.endpoint === 'popup') {
      setShowPopup(false)
    }

    const payload = {
      ...pendingSubmission.data,
      domain: pendingSubmission.data.domain || (typeof window !== 'undefined' ? window.location.hostname : 'lionspear.ae'),
      accepted: true,
      timestamp: new Date().toISOString()
    }

    await sendToWebhook(pendingSubmission.endpoint, payload)
    await new Promise(r => setTimeout(r, 800))

    setFormStatus('success')
    setShowSuccess(true)
    if (pendingSubmission.endpoint === 'application') {
      setForm({ name: '', role: 'spearfisher', email: '', phone: '', note: '' })
    }
    setPendingSubmission(null)
    setTimeout(() => {
      setShowSuccess(false)
      setFormStatus('idle')
    }, 4000)
  }

  return (
    <div className="font-body antialiased relative overflow-x-hidden">
      {!loaded && (
        <div className="fixed inset-0 z-50 bg-abyss-950 flex items-center justify-center">
          <div className="type-caption text-slate-500 animate-pulse">Loading</div>
        </div>
      )}

      <div className="video-overlay video-overlay-gradient" />
      <div className="video-overlay video-overlay-vignette" />
      <div className="video-overlay video-overlay-depth" />

      <motion.div
        className="light-ray"
        style={{ left: '20%', opacity: useTransform(bgDepth, [0, 0.3], [0.3, 0.8]) }}
      />
      <motion.div
        className="light-ray"
        style={{ left: '45%', opacity: useTransform(bgDepth, [0, 0.3], [0.2, 0.6]) }}
      />
      <motion.div
        className="light-ray"
        style={{ left: '65%', opacity: useTransform(bgDepth, [0, 0.3], [0.15, 0.5]) }}
      />

      <div className="scrolly-video-layer" aria-hidden="true">
        <ScrollyVideo
          src="/source.mp4"
          transitionSpeed={6}
          frameThreshold={0.2}
          cover
          sticky
          full
          trackScroll={false}
          lockScroll={false}
          useWebCodecs={false}
          videoPercentage={videoPercentage}
        />
      </div>

      <img
        className="fixed inset-0 -z-20 h-full w-full object-cover"
        src="/source.png"
        aria-hidden="true"
      />

      <div className="noise" />

      <Particles />

      <Routes>
        <Route path="/" element={
          <>
            <section className="min-h-[100dvh] flex items-center justify-center text-center relative overflow-hidden" aria-labelledby="hero-title">
              <div className="container-page relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                    className="type-caption text-cyan-400 mb-6"
                  >
                    Offshore UAE — Fujairah &bull; Musandam
                  </motion.p>

                  <h1 id="hero-title" className="type-massive text-salt-50 leading-[0.85] mb-4 mx-auto max-w-[90vw]">
                    <motion.span
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
                      className="block"
                    >
                      <span className="text-gradient-cyan">Lion</span>Spear
                    </motion.span>
                  </h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
                    className="max-w-xl mx-auto mb-12"
                  >
                    <p className="type-body-lg text-slate-300 leading-relaxed">
                      Deep-water spearfishing crew. Fujairah canyons. Musandam drop-offs.
                      Blue marlin tag-and-release. Dogtooth tuna at depth.
                      No reefs. No tourists. Just breath-hold and blue water.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex flex-col sm:flex-row gap-5 items-center justify-center"
                  >
                    <a href="#apply" className="btn-primary">
                      Apply to Crew
                    </a>
                    <a href="#principles" className="btn-secondary">
                      Our Principles
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              <svg
                className="diver"
                viewBox="0 0 100 60"
                width="120"
                height="72"
                aria-hidden="true"
                style={{ top: '45%', left: '5%' }}
              >
                <g transform="scale(1.5) translate(5, 5)">
                  <path
                    d="M20 20 Q25 12 32 12 Q39 12 42 17"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                  <ellipse cx="36" cy="10" rx="4" ry="5" fill="white" opacity="0.4" />
                  <line x1="36" y1="15" x2="34" y2="28" stroke="white" strokeWidth="1" opacity="0.5" />
                  <line x1="34" y1="19" x2="25" y2="22" stroke="white" strokeWidth="0.8" opacity="0.4" />
                  <line x1="34" y1="21" x2="44" y2="18" stroke="white" strokeWidth="0.8" opacity="0.4" />
                  <line x1="34" y1="28" x2="30" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
                  <line x1="34" y1="28" x2="38" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
                  <path
                    d="M30 38 Q28 42 26 44 Q24 46 26 47"
                    stroke="white"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.3"
                  />
                  <path
                    d="M38 38 Q40 42 42 44 Q44 46 42 47"
                    stroke="white"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.3"
                  />
                </g>
              </svg>
            </section>

            <section
              id="principles"
              className="min-h-[100dvh] flex items-center relative"
              aria-labelledby="principles-title"
            >
              <div className="container-page w-full py-[var(--space-8)]">
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className="mb-[var(--space-7)]"
                >
                  <span className="section-number mb-4">Principles</span>
                  <h2 id="principles-title" className="type-display text-salt-50 max-w-3xl mb-4">
                    Three principles.<br />Zero compromise.
                  </h2>
                  <div className="divider-line mb-5" />
                  <p className="type-body-lg text-slate-300 max-w-xl">
                    Most crews dive reefs. We don't. We run the deep canyons off Fujairah
                    and the vertical walls of Musandam. What we do requires a different standard.
                  </p>
                </motion.div>

                <div className="space-y-[var(--space-8)]">
                  {PRINCIPLES.map((principle, i) => (
                    <motion.div
                      key={principle.number}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                      className="grid grid-cols-12 gap-6 items-start"
                    >
                      <div className="col-span-2 hidden md:block">
                        <span className="type-number block leading-none mt-[-0.15em]">{principle.number}</span>
                      </div>
                      <div className="col-span-12 md:col-span-10 lg:col-span-8">
                        <div className="glass p-[var(--space-5)] md:p-[var(--space-6)]">
                          <span className="type-number md:hidden block mb-2 leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>{principle.number}</span>
                          <h3 className="type-h2 text-salt-50 mb-3">{principle.title}</h3>
                          <div className="divider-line mb-4" />
                          <p className="type-body text-slate-300 max-w-2xl">{principle.body}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="apply"
              className="min-h-[100dvh] flex items-center relative"
              aria-labelledby="apply-title"
            >
              <div className="container-page w-full py-[var(--space-8)]">
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className="mb-[var(--space-7)]"
                >
                  <span className="section-number mb-4">Application</span>
                  <h2 id="apply-title" className="type-display text-salt-50 max-w-3xl mb-4">
                    Apply to the Crew
                  </h2>
                  <div className="divider-line mb-5" />
                  <p className="type-body-lg text-slate-300 max-w-xl">
                    We don't take everyone. We take the right people. If you've read this far
                    and something resonates — the depth, the discipline, the respect — fill
                    out the form. We review every application personally.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-[var(--space-6)] lg:gap-[var(--space-8)] items-start max-w-5xl">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
                    className="lg:col-span-3 glass-strong p-[var(--space-5)] md:p-[var(--space-6)]"
                  >
                    <form onSubmit={onSubmit} className="space-y-[var(--space-4)]" noValidate>
                      <div>
                        <label htmlFor="name" className="type-label block mb-2">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                          className="input-field"
                          placeholder="Khalid Al Mansoori"
                          disabled={formStatus === 'submitting'}
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="type-label block mb-2">Role</label>
                        <select
                          id="role"
                          name="role"
                          value={form.role}
                          onChange={e => setForm({ ...form, role: e.target.value as Role })}
                          className="input-field select-field"
                          disabled={formStatus === 'submitting'}
                        >
                          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="email" className="type-label block mb-2">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                          className="input-field"
                          placeholder="you@example.com"
                          disabled={formStatus === 'submitting'}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="type-label block mb-2">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          required
                          className="input-field"
                          placeholder="+971 50 000 0000"
                          disabled={formStatus === 'submitting'}
                        />
                      </div>
                      <div>
                        <label htmlFor="note" className="type-label block mb-2">Why LionSpear?</label>
                        <textarea
                          id="note"
                          name="note"
                          value={form.note}
                          onChange={e => setForm({ ...form, note: e.target.value })}
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Your deepest dive. Your hardest lesson. What you bring to the boat."
                          disabled={formStatus === 'submitting'}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full btn-primary py-[var(--space-2)]"
                        disabled={formStatus === 'submitting'}
                      >
                        {formStatus === 'submitting' ? 'Submitting' : 'Submit Application'}
                      </button>
                    </form>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                    className="lg:col-span-2"
                  >
                    <div className="glass p-[var(--space-5)] md:p-[var(--space-6)]">
                      <h3 className="type-h3 text-salt-50 mb-[var(--space-5)]">What Happens Next</h3>
                      <div className="timeline">
                        {STEPS.map((step, i) => (
                          <div
                            key={i}
                            ref={el => { stepRefs.current[i] = el }}
                            className={`timeline-step ${stepInView.includes(i) ? 'in-view' : ''}`}
                          >
                            <span className="type-caption text-slate-500 mb-1 block">Step {String(i + 1).padStart(2, '0')}</span>
                            <p className="type-body text-slate-300">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <footer className="min-h-[100dvh] flex items-center relative" aria-labelledby="footer-title">
              <div className="absolute inset-0 z-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 30%, rgba(2,4,8,0.6) 60%, rgba(2,4,8,0.95) 100%)',
              }} />
              <div className="container-page w-full relative z-10 py-[var(--space-8)]">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="section-number mb-[var(--space-6)]">Epilogue</span>

                  <h2
                    id="footer-title"
                    className="type-massive text-salt-50 mb-[var(--space-6)] opacity-[0.06] select-none"
                    style={{ fontSize: 'clamp(5rem, 20vw, 18rem)', lineHeight: '0.8' }}
                  >
                    LIONSPEAR
                  </h2>

                  <p className="type-body text-slate-400 max-w-md mb-[var(--space-8)]">
                    The ocean doesn't carry passengers.
                  </p>

                  <span className="type-small text-slate-600">&copy; {new Date().getFullYear()} LionSpear</span>
                </motion.div>
              </div>
            </footer>
          </>
        } />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/waiver" element={<Waiver />} />
      </Routes>

      <AnimatePresence>
        {showPopup && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-[var(--space-3)] bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="glass-strong max-w-md w-full p-[var(--space-6)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-[var(--space-4)]">
                <div>
                  <span className="type-caption text-cyan-400 mb-1 block">Newsletter</span>
                  <h3 id="popup-title" className="type-h2 text-salt-50">First to Know</h3>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <p className="type-body text-slate-400 mb-[var(--space-5)]">
                Trip dates, roster openings, and early-access gear drops. No spam. Unsubscribe anytime.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  const email = formData.get('email') as string
                  const phone = formData.get('phone') as string
                  if (email?.includes('@')) {
                    const domain = typeof window !== 'undefined' ? window.location.hostname : 'lionspear.ae'
                    setPendingSubmission({
                      endpoint: 'popup',
                      data: { name, email, phone, domain, timestamp: new Date().toISOString(), accepted: true }
                    })
                    setShowContractModal(true)
                  }
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="input-field"
                  autoFocus
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="input-field"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+971 50 000 0000"
                  required
                  className="input-field"
                />
                <button type="submit" className="btn-primary self-start">
                  Subscribe
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContractModal && pendingSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => { setShowContractModal(false); setFormStatus('idle') }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contract-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4 }}
              className="glass-strong max-w-xl w-full p-6 md:p-8 flex flex-col justify-between"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="type-caption text-cyan-400 mb-1 block">Provisional Agreement</span>
                  <h3 id="contract-modal-title" className="type-h2 text-salt-50">Crew Membership Contract</h3>
                </div>
                <button
                  onClick={() => { setShowContractModal(false); setFormStatus('idle') }}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-slate-300 type-body text-sm pr-2 mb-6 border-y border-white/10 py-4 max-h-[50vh] overflow-y-auto">
                <p><strong>1. Scope of Agreement:</strong> By accepting this provisional contract, you confirm your registration for charter allocations and dive ops with LionSpear under email address <span className="text-cyan-400 font-mono">{String(pendingSubmission.data.email)}</span>.</p>
                <p><strong>2. Safety & Liability:</strong> Offshore freediving and spearfishing involve open ocean hazards. All crew members agree to strictly adhere to buddy protocols, captain orders, and tag-and-release ocean conservation rules.</p>
                <p><strong>3. Verification Record:</strong> Your explicit one-click acceptance will log your submission record <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono">&#123; email, domain: "{String(pendingSubmission.data.domain || 'lionspear.ae')}", accepted: true &#125;</code> to the official Google Sheet registry.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowContractModal(false); setFormStatus('idle') }}
                  className="btn-secondary w-full sm:w-auto text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAcceptContract}
                  className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-cyan-300" /> Accept Contract & Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed bottom-[var(--space-6)] right-[var(--space-6)] z-50 glass-strong p-[var(--space-4)] md:p-[var(--space-5)] flex items-center gap-[var(--space-3)]"
            role="status"
            aria-live="polite"
          >
            <Check className="w-5 h-5 text-cyan-500 flex-shrink-0" aria-hidden="true" />
            <span className="type-body text-salt-50">Contract accepted & application submitted successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
