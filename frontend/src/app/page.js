import styles from './page.module.css';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroDeco} />
        <div className={styles.heroDeco2} />

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Clínica en Santiago de Chile
            </div>

            <h1 className={styles.heroTitle}>
              Kinesiología{' '}
              <span className="text-gradient">integral</span>{' '}
              para tu bienestar
            </h1>

            <p className={styles.heroSub}>
              Rehabilitación, alto rendimiento deportivo y cuidado preventivo
              con seguimiento digital personalizado en cada etapa.
            </p>

            <div className={styles.heroActions}>
              <a href="/register" className="btn btn-primary btn-lg">
                Agendar primera evaluación
              </a>
              <a href="#como-funciona" className="btn btn-secondary btn-lg">
                Cómo funciona
              </a>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.trustItem}>
                <span className={styles.trustValue}>5.200+</span>
                <span className={styles.trustLabel}>Pacientes</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustValue}>98%</span>
                <span className={styles.trustLabel}>Satisfacción</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustValue}>12</span>
                <span className={styles.trustLabel}>Profesionales</span>
              </div>
            </div>
          </div>

          {/* Hero Visual — Appointment preview card */}
          <div className={styles.heroVisual}>
            <div className={styles.clinicCard}>
              <div className={styles.clinicCardTop}>
                <span className={styles.clinicCardTitle}>Próximas citas</span>
                <span className={styles.clinicCardBadge}>✓ Online</span>
              </div>

              <div className={styles.appointmentPreview}>
                <div className={styles.aptCard}>
                  <div className={styles.aptDate}>
                    <span className={styles.aptDay}>26</span>
                    <span className={styles.aptMonth}>Feb</span>
                  </div>
                  <div className={styles.aptInfo}>
                    <div className={styles.aptService}>Rehabilitación Rodilla</div>
                    <div className={styles.aptMeta}>10:00 — Dra. Martínez</div>
                  </div>
                  <span className={`${styles.aptStatus} ${styles.aptConfirmed}`}>Confirmada</span>
                </div>

                <div className={styles.aptCard}>
                  <div className={styles.aptDate}>
                    <span className={styles.aptDay}>03</span>
                    <span className={styles.aptMonth}>Mar</span>
                  </div>
                  <div className={styles.aptInfo}>
                    <div className={styles.aptService}>Control Deportivo</div>
                    <div className={styles.aptMeta}>15:30 — Dr. Fuentes</div>
                  </div>
                  <span className={`${styles.aptStatus} ${styles.aptPending}`}>Pendiente</span>
                </div>

                <div className={styles.aptCard}>
                  <div className={styles.aptDate}>
                    <span className={styles.aptDay}>10</span>
                    <span className={styles.aptMonth}>Mar</span>
                  </div>
                  <div className={styles.aptInfo}>
                    <div className={styles.aptService}>Evaluación Física</div>
                    <div className={styles.aptMeta}>09:00 — Dra. Martínez</div>
                  </div>
                  <span className={`${styles.aptStatus} ${styles.aptConfirmed}`}>Confirmada</span>
                </div>
              </div>
            </div>

            <div className={`${styles.floatBadge} ${styles.floatBadge1}`}>
              <div className={`${styles.floatIcon} ${styles.floatIconGreen}`}>📊</div>
              Progreso: 78%
            </div>
            <div className={`${styles.floatBadge} ${styles.floatBadge2}`}>
              <div className={`${styles.floatIcon} ${styles.floatIconBlue}`}>🔔</div>
              Recordatorio enviado
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="servicios" className={`${styles.servicesSection} section`}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Servicios clínicos</p>
            <h2 className="section-title">Atención especializada para cada necesidad</h2>
            <p className="section-desc">
              Desde prevención hasta alto rendimiento, con protocolos basados en evidencia y tecnología de última generación.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PATIENT JOURNEY (Cómo funciona) ═══ */}
      <section id="como-funciona" className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Cómo funciona</p>
            <h2 className="section-title">
              De la reserva al seguimiento, <span className="text-gradient">todo automatizado</span>
            </h2>
            <p className="section-desc">
              Tu experiencia como paciente es fluida de principio a fin. Cada paso tiene notificaciones y seguimiento automático.
            </p>
          </div>

          <div className={styles.journeyGrid}>
            {journeySteps.map((step, i) => (
              <div key={i} className={styles.journeyStep}>
                <div className={`${styles.stepNumber} ${i < 3 ? styles.stepNumberActive : styles.stepNumberInactive}`}>
                  {i + 1}
                </div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                {step.auto && (
                  <span className={styles.stepAutoLabel}>⚡ Automático</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Testimonios</p>
            <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>★★★★★</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{t.avatar}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorDetail}>{t.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Agenda tu evaluación inicial</h2>
            <p className={styles.ctaDesc}>
              Primera consulta con evaluación completa, diagnóstico y plan de tratamiento personalizado.
            </p>
            <div className={styles.ctaActions}>
              <a href="/register" className={`btn btn-lg ${styles.btnWhite}`}>
                Crear cuenta gratis
              </a>
              <a href="/corporativo" className={`btn btn-lg ${styles.btnOutlineWhite}`}>
                Soluciones corporativas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoMark}>🦆</div>
                <span className={styles.footerLogoText}>Duck Kinesiología</span>
              </div>
              <p className={styles.footerDesc}>
                Clínica de kinesiología integral en Santiago de Chile.
                Rehabilitación, deporte y prevención con seguimiento digital.
              </p>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Servicios</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#servicios">Rehabilitación</a></li>
                <li><a href="#servicios">Deportiva</a></li>
                <li><a href="#servicios">Terapia Manual</a></li>
                <li><a href="#servicios">Preventiva</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Plataforma</h4>
              <ul className={styles.footerLinks}>
                <li><a href="/login">Iniciar sesión</a></li>
                <li><a href="/register">Crear cuenta</a></li>
                <li><a href="/academia">Academia</a></li>
                <li><a href="/corporativo">Empresas</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Contacto</h4>
              <ul className={styles.footerLinks}>
                <li><a href="tel:+56912345678">+56 9 1234 5678</a></li>
                <li><a href="mailto:contacto@duckkinesiologia.cl">contacto@duckkine.cl</a></li>
                <li><a href="#">Santiago, Providencia</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Duck Kinesiología. Todos los derechos reservados.</span>
            <span>Hecho con 🦆 en Santiago</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────── */
const services = [
  { icon: '🏥', title: 'Rehabilitación', description: 'Recuperación post-quirúrgica, lesiones musculoesqueléticas y neurológicas con seguimiento digital.' },
  { icon: '🏃', title: 'Deportiva', description: 'Programas personalizados para atletas: prevención, rendimiento y return-to-sport.' },
  { icon: '🤲', title: 'Terapia Manual', description: 'Liberación miofascial, movilización articular y técnicas especializadas de tejido blando.' },
  { icon: '🧘', title: 'Preventiva', description: 'Evaluaciones posturales, ergonomía laboral y programas de ejercicio terapéutico.' },
  { icon: '🎓', title: 'Academia Digital', description: 'Cursos de autocuidado, ejercicio terapéutico y educación en salud.' },
  { icon: '🏢', title: 'Corporativo', description: 'Planes de bienestar para empresas: pausas activas, evaluaciones y kinesiólogo on-site.' },
];

const journeySteps = [
  { icon: '📱', title: 'Reserva online', description: 'Elige profesional, horario y servicio 24/7 desde la app.', auto: false },
  { icon: '✉️', title: 'Confirmación', description: 'Recibes email y SMS de confirmación con instrucciones.', auto: true },
  { icon: '🔔', title: 'Recordatorio', description: '24h antes recibes recordatorio automático con opción de reagendar.', auto: true },
  { icon: '🩺', title: 'Sesión', description: 'Tu kinesiólogo registra diagnóstico, ejercicios y progreso en tu ficha.', auto: false },
  { icon: '📊', title: 'Seguimiento', description: 'Post-sesión recibes resumen, ejercicios para casa y encuesta de dolor.', auto: true },
];

const testimonials = [
  { text: 'La plataforma me permite ver mi progreso sesión a sesión. Después de mi operación de LCA, poder seguir mis ejercicios desde el celular fue clave.', name: 'Catalina Muñoz', detail: 'Paciente deportiva', avatar: '👩' },
  { text: 'Como runner, necesitaba un equipo que entendiera el deporte. Me armaron un programa de vuelta a la competencia con seguimiento semanal. Excelente.', name: 'Andrés Soto', detail: 'Maratonista', avatar: '👨' },
  { text: 'Contratamos el plan corporativo para nuestra oficina. Las pausas activas y las evaluaciones ergonómicas redujeron las licencias un 40%.', name: 'María José Riquelme', detail: 'Gerente RRHH', avatar: '👩‍💼' },
];
