import Link from 'next/link';
import XfolioScripts from '@/components/XfolioScripts';

export default function HomePage() {
  return (
    <>
      <div className="page-wrapper page-three">
        {/* ==== preloader section start ==== */}
        <div id="preloader">
          <div className="preloader-bg preloader-bg-one"></div>
          <div className="preloader-bg preloader-bg-two"></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src="/assets/images/logo.png"
              alt="Duck Kinesiología"
              style={{
                width: '280px',
                height: '280px',
                objectFit: 'contain',
                borderRadius: '50%',
                animation: 'preloaderPulse 1.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
        {/* ==== / preloader section end ==== */}

        {/* ==== header start ==== */}
        <header className="header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="main-header__menu-box">
                  <nav className="navbar p-0">
                    <div className="navbar-logo">
                      <Link href="#inicio">
                        <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" style={{ width: '90px', height: 'auto' }} />
                      </Link>
                    </div>
                    <div className="navbar__menu-wrapper">
                      <div className="navbar__menu d-none d-xl-block">
                        <ul className="navbar__list" style={{ gap: '0' }}>
                          <li className="navbar__item nav-fade"><Link href="#inicio" style={{ padding: '20px 10px', fontSize: '13px' }}>Inicio</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#sobre-mi" style={{ padding: '20px 10px', fontSize: '13px' }}>Sobre Mí</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#servicios" style={{ padding: '20px 10px', fontSize: '13px' }}>Servicios</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#entrenamientos" style={{ padding: '20px 10px', fontSize: '13px' }}>Entrenamientos</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#academia" style={{ padding: '20px 10px', fontSize: '13px' }}>Academia</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#empresas" style={{ padding: '20px 10px', fontSize: '13px' }}>Empresas</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#precios" style={{ padding: '20px 10px', fontSize: '13px' }}>Precios</Link></li>
                          <li className="navbar__item nav-fade"><Link href="#contacto" style={{ padding: '20px 10px', fontSize: '13px' }}>Contacto</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="navbar__options">
                      <div className="navbar__mobile-options d-none d-sm-block" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link href="/login/" style={{ color: 'var(--white-color)', fontSize: '14px', fontWeight: '500', opacity: '0.8', transition: 'opacity 0.3s' }}>Iniciar sesión</Link>
                        <Link href="/register/" className="btn-primary">
                          <span className="btn-animated-text" data-text="Crear cuenta">Crear cuenta</span>
                          <span className="btn-icon">
                            <i className="ph ph-arrow-up-right"></i>
                            <i className="ph ph-arrow-up-right"></i>
                          </span>
                        </Link>
                      </div>
                      <button className="open-offcanvas-nav d-flex d-xl-none" aria-label="toggle mobile menu" title="open offcanvas menu">
                        <span className="icon-bar top-bar"></span>
                        <span className="icon-bar middle-bar"></span>
                        <span className="icon-bar bottom-bar"></span>
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* ==== / header end ==== */}

        {/* ==== mobile menu start ==== */}
        <div className="mobile-menu d-block d-xxl-none">
          <nav className="mobile-menu__wrapper">
            <div className="mobile-menu__header nav-fade">
              <div className="logo">
                <Link href="#inicio" aria-label="home page" title="logo">
                  <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" />
                </Link>
              </div>
              <button aria-label="close mobile menu" className="close-mobile-menu">
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="mobile-menu__list"></div>
            <div className="mobile-menu__cta d-block d-md-none nav-fade">
              <Link href="/reservar/" className="btn-primary">
                <span className="btn-animated-text" data-text="Agendar Cita">Agendar Cita</span>
                <span className="btn-icon">
                  <i className="ph ph-arrow-up-right"></i>
                  <i className="ph ph-arrow-up-right"></i>
                </span>
              </Link>
            </div>
            <div className="mobile-menu__social social nav-fade">
              <Link href="https://www.instagram.com/duckkinesiologia?igsh=MXF6YXh3cHFlenc1aQ==" target="_blank" aria-label="Instagram" title="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </Link>
              <Link href="https://wa.me/56986625344" target="_blank" aria-label="WhatsApp" title="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </Link>
            </div>
          </nav>
        </div>
        <div className="mobile-menu__backdrop"></div>
        {/* ==== / mobile menu end ==== */}

        {/* ==== hero section start ==== */}
        <section className="hero-three" id="inicio">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="hero-three__intro text-center neutral-top" style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    zIndex: 0,
                    opacity: 0.15,
                    pointerEvents: 'none'
                  }}>
                    <img src="/assets/images/banner/hero-three-thumb.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <h1 className="title-animation fw-8 title-xxl" style={{ position: 'relative', zIndex: 1 }}>Rehabilitación <span>Profesional</span></h1>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="hero-three__inner mt-160">
                  <div className="row align-items-center justify-content-between gutter-40">
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <div className="hero-three__cta fade-up">
                        <div className="btn-wrapper">
                          <Link href="/reservar/" className="btn-anim">
                            <i className="ph ph-arrow-up-right"></i>
                            Agenda tu Cita
                            <span></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-center justify-content-center">
                      <div className="fade-up" data-delay="200">
                        <Link href="/login/" className="btn-login-hero">
                          Iniciar Sesion
                        </Link>
                        <style>{`
                          .btn-login-hero {
                            display: inline-block;
                            padding: 18px 48px;
                            background-color: #28a745;
                            color: #fff !important;
                            font-size: 18px;
                            font-weight: 700;
                            text-decoration: none !important;
                            border-radius: 8px;
                            text-align: center;
                            transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
                            cursor: pointer;
                          }
                          .btn-login-hero:hover {
                            background-color: #f5c518 !important;
                            color: #1a1a1a !important;
                            transform: scale(1.05);
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-img"></div>
          {/* Hero background image - now behind text */}
          {/* Social sidebar */}
          <div className="hero-three__social fade-left d-none d-xxl-block">
            <div className="social justify-content-center">
              <Link href="https://www.instagram.com/duckkinesiologia?igsh=MXF6YXh3cHFlenc1aQ==" target="_blank" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </Link>
              <Link href="https://wa.me/56986625344" target="_blank" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </Link>
            </div>
          </div>
        </section>
        {/* ==== / hero section end ==== */}

        {/* ==== marquee section start ==== */}
        <section className="marquee">
          <div className="marquee__inner">
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">REHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">NEUROREHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">DEPORTOLOGÍA <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">KINESIOLOGÍA <span>-</span></Link></h4>
              </div>
            </div>
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">REHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">NEUROREHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">DEPORTOLOGÍA <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">KINESIOLOGÍA <span>-</span></Link></h4>
              </div>
            </div>
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">REHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">NEUROREHABILITACIÓN <span>-</span></Link></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><Link href="#servicios">DEPORTOLOGÍA <span>-</span></Link></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><Link href="#servicios">KINESIOLOGÍA <span>-</span></Link></h4>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / marquee section end ==== */}

        {/* ==== overview section start ==== */}
        <section className="overview pt-160">
          <div className="container">
            <div className="row gutter-40">
              <div className="col-12 col-sm-6 col-xl-4">
                <div className="overview__single-wrapper fade-up">
                  <div className="overview__single text-center van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/time.png" alt="Evaluación Kinésica" />
                    </div>
                    <div className="content text-center mt-30">
                      <h5 className="fw-5 neutral-top">Evaluación Kinésica</h5>
                      <p className="text-md primary-text mt-16">Diagnóstico preciso y plan de tratamiento personalizado para cada paciente.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xl-4">
                <div className="overview__single-wrapper fade-up" data-delay="300">
                  <div className="overview__single text-center van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/car.png" alt="Rehabilitación" />
                    </div>
                    <div className="content text-center mt-30">
                      <h5 className="fw-5 neutral-top">Rehabilitación</h5>
                      <p className="text-md primary-text mt-16">Tratamientos de última generación para recuperación muscular y articular.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-xl-4">
                <div className="overview__single-wrapper fade-up" data-delay="600">
                  <div className="overview__single text-center van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/user.png" alt="Profesional Certificado" />
                    </div>
                    <div className="content text-center mt-30">
                      <h5 className="fw-5 neutral-top">Profesional Certificado</h5>
                      <p className="text-md primary-text mt-16">Kinesiólogo titulado con especialización en deportología y neurorehabilitación.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / overview section end ==== */}

        {/* ==== about section start ==== */}
        <section className="about-two pt-160" id="sobre-mi">
          <div className="container">
            <div className="row gutter-40">
              {/* Text left */}
              <div className="col-12 col-md-6 col-xl-4">
                <div className="about-two__single about-two__single-first fade-up">
                  <div className="section__header neutral-top">
                    <span className="sub-title secondary-text text-uppercase fw-6">SOBRE MÍ</span>
                    <h2 className="title-animation fw-6 mt-16">Donde la Experiencia Clínica se Une con el Compromiso</h2>
                    <p className="primary-text text-md mt-16">Kinesiólogo con más de 10 años de experiencia en rehabilitación integral, deportología y neurorehabilitación.</p>
                    <div className="mt-40">
                      <Link href="/reservar/" className="btn-primary">
                        <span className="btn-animated-text" data-text="Agenda una Cita">Agenda una Cita</span>
                        <span className="btn-icon">
                          <i className="ph ph-arrow-up-right"></i>
                          <i className="ph ph-arrow-up-right"></i>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Photo center (desktop only) */}
              <div className="col-12 col-xl-4 d-none d-xl-block">
                <div className="about-two__single about-two__single-thumb fade-up" data-delay="200">
                  <div className="thumb">
                    <img src="/assets/images/blog/six.png" alt="Kinesiólogo" />
                  </div>
                </div>
              </div>
              {/* Stats right */}
              <div className="col-12 col-md-6 col-xl-4">
                <div className="about-two__single about-two__single-alt fade-up" data-delay="400">
                  <div className="about-two__single-inner">
                    <p className="primary-text neutral-top">Comprometido con el bienestar y la recuperación de cada paciente, aplicando técnicas basadas en evidencia científica.</p>
                    <div className="about-two__cta mt-40">
                      <Link href="/reservar/">Reservar Cita Ahora</Link>
                    </div>
                  </div>
                  <div className="about-two__counter mt-160">
                    <div className="counter__content">
                      <h5 className="title-lg fw-6 neutral-top">
                        <span className="odometer" data-odometer-final="10">0</span>
                        <span className="prefix">+</span>
                      </h5>
                      <p className="primary-text">Años de <br /> Experiencia</p>
                    </div>
                    <div className="counter__content">
                      <h5 className="title-lg fw-6 neutral-top">
                        <span className="odometer" data-odometer-final="500">0</span>
                        <span className="prefix">+</span>
                      </h5>
                      <p className="primary-text">Pacientes <br /> Atendidos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / about section end ==== */}

        {/* ==== service section start ==== */}
        <div className="service-three pt-160 pb-160" id="servicios">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header-wrapper mb-60 fade-up">
                  <div className="row gutter-20 align-items-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-8">
                      <div className="section__header">
                        <span className="sub-title secondary-text text-uppercase neutral-top fw-6">SERVICIOS</span>
                        <h2 className="title-animation fw-6 mt-16">Tratamientos Especializados</h2>
                      </div>
                    </div>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-4">
                      <div>
                        <p className="primary-text">Atención kinesiológica personalizada, diseñada para tus necesidades de salud.</p>
                        <div className="mt-30">
                          <Link href="/reservar/" className="btn-primary">
                            <span className="btn-animated-text" data-text="Ver Más">Ver Más</span>
                            <span className="btn-icon">
                              <i className="ph ph-arrow-up-right"></i>
                              <i className="ph ph-arrow-up-right"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row gutter-24">
              {/* Service 1 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/two.png" alt="Rehabilitación Deportiva" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Rehabilitación Deportiva</Link></h5>
                      <p className="primary-text text-md mt-12">Recuperación de lesiones musculares, tendinosas y articulares en deportistas de todas las disciplinas.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service 2 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="300">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/three.png" alt="Neurorehabilitación" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Neurorehabilitación</Link></h5>
                      <p className="primary-text text-md mt-12">Tratamiento de secuelas neurológicas: ACV, Parkinson, esclerosis múltiple y lesiones medulares.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service 3 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="600">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/four.png" alt="Kinesiología Respiratoria" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Kinesiología Respiratoria</Link></h5>
                      <p className="primary-text text-md mt-12">Técnicas especializadas para patologías respiratorias y mejora de la función pulmonar.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service 4 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/five.png" alt="Terapia Manual" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Terapia Manual</Link></h5>
                      <p className="primary-text text-md mt-12">Liberación miofascial, movilización articular y técnicas especializadas de tejido blando.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service 5 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="300">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/six.png" alt="Kinesiología Preventiva" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Kinesiología Preventiva</Link></h5>
                      <p className="primary-text text-md mt-12">Evaluaciones posturales, ergonomía laboral y programas de ejercicio terapéutico.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Service 6 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="600">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/service/seven.png" alt="Atención Domiciliaria" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/reservar/" className="fw-6 neutral-top title-animation">Atención Domiciliaria</Link></h5>
                      <p className="primary-text text-md mt-12">Sesiones de kinesiología en la comodidad de tu hogar para pacientes con movilidad reducida.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/reservar/" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ==== / service section end ==== */}

        {/* ==== appointment section start ==== */}
        <section className="appointment" id="contacto">
          <div className="container">
            <div className="row align-items-end justify-content-end">
              <div className="col-12 col-md-9 col-xl-5">
                <div className="appointment-inner fade-up">
                  <h5 className="title-animation fw-6 neutral-top">Agenda tu Sesión</h5>
                  <p className="primary-text text-md mt-16">Completa el formulario y me pondré en contacto contigo a la brevedad.</p>
                  <div className="contact__form mt-30">
                    <form action="#" method="post">
                      <div className="input-group">
                        <div className="input-single">
                          <label htmlFor="contactFirstName">Tu Nombre <sup>*</sup></label>
                          <input type="text" name="contact-firstname" id="contactFirstName" placeholder="Nombre completo" required />
                        </div>
                        <div className="input-single">
                          <label htmlFor="contactEmail">Tu Email <sup>*</sup></label>
                          <input type="email" name="contact-email" id="contactEmail" placeholder="Correo electrónico" required />
                        </div>
                      </div>
                      <div className="input-group">
                        <div className="input-single">
                          <label htmlFor="contactNumber">Teléfono / WhatsApp <sup>*</sup></label>
                          <input type="number" name="contact-number" id="contactNumber" placeholder="Tu teléfono" required />
                        </div>
                        <div className="input-single">
                          <label htmlFor="chooseService">Servicio <sup>*</sup></label>
                          <select name="service" id="chooseService" className="service-select select">
                            <option data-display="Elige un servicio">Elige un servicio</option>
                            <option value="deportiva">Rehabilitación Deportiva</option>
                            <option value="neuro">Neurorehabilitación</option>
                            <option value="respiratoria">Kinesiología Respiratoria</option>
                            <option value="manual">Terapia Manual</option>
                            <option value="preventiva">Kinesiología Preventiva</option>
                            <option value="domiciliaria">Atención Domiciliaria</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-single">
                        <label htmlFor="contactMessage">Motivo de Consulta <sup>*</sup></label>
                        <textarea name="contact-message" id="contactMessage" placeholder="Describe brevemente tu motivo de consulta" required></textarea>
                      </div>
                      <div className="mt-40">
                        <button type="submit" className="btn--secondary" title="enviar mensaje" aria-label="enviar mensaje">
                          <span className="btn-animated-text" data-text="Enviar Solicitud">Enviar Solicitud</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-img">
            <img src="/assets/images/appointment-bg.png" alt="Fondo cita" className="parallax-image" />
          </div>
        </section>
        {/* ==== / appointment section end ==== */}

        {/* ==== pricing section start ==== */}
        <section className="pricing pricing-three pt-160 scale-wrapper" id="precios">
          <style>{`
            .price-old { text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 0.9rem; font-weight: 400; }
            .price-new { color: var(--secondary-color); }
            .price-anticipo { color: #28a745; font-size: 0.85rem; margin-top: 4px; }
            .therapy-tag { display: inline-block; position: relative; cursor: pointer; padding: 4px 12px; margin: 4px; border-radius: 20px; font-size: 0.8rem; background: rgba(56,189,248,0.1); color: var(--secondary-color); border: 1px solid rgba(56,189,248,0.2); transition: all 0.3s ease; }
            .therapy-tag:hover { background: var(--secondary-color); color: #fff; }
            .therapy-tag .therapy-tooltip { visibility: hidden; opacity: 0; position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: #1a1a2e; color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.75rem; line-height: 1.4; width: 220px; text-align: center; z-index: 10; transition: opacity 0.3s; pointer-events: none; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
            .therapy-tag:hover .therapy-tooltip { visibility: visible; opacity: 1; }
            .discount-badge { display: inline-block; background: #28a745; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
          `}</style>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header text-center mb-60 fade-up">
                  <span className="sub-title secondary-text text-uppercase neutral-top fw-6">PLANES</span>
                  <h2 className="title-animation fw-6 mt-16">Tarifas Transparentes</h2>
                  <p className="primary-text mt-16">Todos nuestros servicios tienen <strong>20% de descuento</strong>. Con pago anticipado, <strong>10% adicional</strong>.</p>
                </div>
              </div>
            </div>
            <div className="row gutter-24 justify-content-center">

              {/* 1. Sesion de Kinesiologia */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="pricing__single scale-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6">Sesion de Kinesiologia</h5>
                    <p className="primary-text text-md mt-10">Rehabilitacion deportiva, terapia manual, educacion postural y fisioterapia.</p>
                    <div className="mt-12">
                      <span className="therapy-tag">Rehabilitacion Deportiva<span className="therapy-tooltip">Recuperacion de lesiones deportivas con tecnicas especializadas y ejercicio terapeutico.</span></span>
                      <span className="therapy-tag">Terapia Manual<span className="therapy-tooltip">Tecnicas de movilizacion articular, masaje terapeutico y liberacion miofascial.</span></span>
                      <span className="therapy-tag">Educacion Postural<span className="therapy-tooltip">Correccion de habitos posturales, ergonomia y ejercicios de reeducacion.</span></span>
                      <span className="therapy-tag">Fisioterapia<span className="therapy-tooltip">Ultrasonido, electroterapia, laser y agentes fisicos para acelerar la recuperacion.</span></span>
                    </div>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$25.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$20.000 <span className="text-md fw-4">/ sesion</span></h3>
                      <p className="price-anticipo">Pago anticipado: $18.000</p>
                    </div>
                    <Link href="/reservar/" className="btn--secondary mt-16">
                      <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. Pack 10 sesiones */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="pricing__single scale-up active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6">Pack 10 Sesiones <span className="badge secondary-bg text-white ms-2" style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px' }}>Popular</span></h5>
                    <p className="primary-text text-md mt-10">Al pagar el pack, se agenda automaticamente tu primera sesion. Recomendamos 2 a 3 veces por semana, sin dias consecutivos.</p>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$250.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$200.000 <span className="text-md fw-4">/ pack</span></h3>
                      <p className="price-anticipo">Pago anticipado: $180.000</p>
                    </div>
                    <Link href="/reservar/" className="btn--secondary mt-16">
                      <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Sesion Preventiva */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="pricing__single scale-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6">Sesion Preventiva</h5>
                    <p className="primary-text text-md mt-10">Sesion enfocada en prevencion y bienestar con terapias complementarias.</p>
                    <div className="mt-12">
                      <span className="therapy-tag">Masoterapia<span className="therapy-tooltip">Masaje terapeutico para aliviar tensiones musculares y mejorar la circulacion.</span></span>
                      <span className="therapy-tag">Crioterapia<span className="therapy-tooltip">Aplicacion de frio controlado para reducir inflamacion y dolor.</span></span>
                      <span className="therapy-tag">Presoterapia<span className="therapy-tooltip">Compresion neumatica secuencial para mejorar circulacion y drenaje linfatico.</span></span>
                      <span className="therapy-tag">Electroterapia<span className="therapy-tooltip">Corrientes electricas terapeuticas para alivio del dolor y estimulacion muscular.</span></span>
                    </div>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$30.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$24.000 <span className="text-md fw-4">/ sesion</span></h3>
                      <p className="price-anticipo">Pago anticipado: $21.600</p>
                    </div>
                    <Link href="/reservar/" className="btn--secondary mt-16">
                      <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. Masoterapia */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="pricing__single scale-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6">Masoterapia</h5>
                    <p className="primary-text text-md mt-10">Sesiones especializadas de masaje para relajacion y recuperacion.</p>
                    <div className="mt-12">
                      <span className="therapy-tag">Relajacion<span className="therapy-tooltip">Masaje suave de relajacion para reducir estres y tension acumulada.</span></span>
                      <span className="therapy-tag">Descontracturante<span className="therapy-tooltip">Masaje profundo para liberar contracturas y nudos musculares.</span></span>
                      <span className="therapy-tag">Drenaje Linfatico<span className="therapy-tooltip">Tecnica suave que estimula el sistema linfatico para eliminar toxinas y reducir retencion de liquidos.</span></span>
                    </div>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$30.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$24.000 <span className="text-md fw-4">/ sesion</span></h3>
                      <p className="price-anticipo">Pago anticipado: $21.600</p>
                    </div>
                    <Link href="/reservar/" className="btn--secondary mt-16">
                      <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* ==== / pricing section end ==== */}

        {/* ==== testimonial section start ==== */}
        <section className="testimonial-two pt-160" id="testimonios">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header text-center mb-60 fade-up">
                  <span className="sub-title secondary-text text-uppercase neutral-top fw-6">TESTIMONIOS</span>
                  <h2 className="title-animation fw-6 mt-16">Lo que Dicen mis Pacientes</h2>
                </div>
              </div>
            </div>
            <div className="row gutter-40">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up">
                  <div className="testimonial-two__single">
                    <div className="testimonial-two__single-header">
                      <div className="thumb">
                        <img src="/assets/images/avatar/seven.png" alt="Paciente" />
                      </div>
                      <div className="content">
                        <h6 className="fw-6">Catalina Muñoz</h6>
                        <p className="text-sm primary-text">Rehabilitación Deportiva</p>
                      </div>
                    </div>
                    <div className="testimonial-two__single-content mt-30">
                      <p className="primary-text">&quot;Gracias al tratamiento logré recuperarme completamente de mi lesión de rodilla en tiempo récord. Muy profesional y dedicado.&quot;</p>
                    </div>
                    <div className="testimonial-two__single-rating mt-20">
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="300">
                  <div className="testimonial-two__single">
                    <div className="testimonial-two__single-header">
                      <div className="thumb">
                        <img src="/assets/images/avatar/nine.png" alt="Paciente" />
                      </div>
                      <div className="content">
                        <h6 className="fw-6">Andrés Soto</h6>
                        <p className="text-sm primary-text">Maratonista</p>
                      </div>
                    </div>
                    <div className="testimonial-two__single-content mt-30">
                      <p className="primary-text">&quot;Como runner, necesitaba un profesional que entendiera el deporte. Me armaron un programa de vuelta a la competencia excelente.&quot;</p>
                    </div>
                    <div className="testimonial-two__single-rating mt-20">
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="600">
                  <div className="testimonial-two__single">
                    <div className="testimonial-two__single-header">
                      <div className="thumb">
                        <img src="/assets/images/avatar/ten.png" alt="Paciente" />
                      </div>
                      <div className="content">
                        <h6 className="fw-6">María José Riquelme</h6>
                        <p className="text-sm primary-text">Neurorehabilitación</p>
                      </div>
                    </div>
                    <div className="testimonial-two__single-content mt-30">
                      <p className="primary-text">&quot;Después de mi ACV, el tratamiento de neurorehabilitación me devolvió la movilidad y la confianza. Eternamente agradecida.&quot;</p>
                    </div>
                    <div className="testimonial-two__single-rating mt-20">
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                      <i className="ph-fill ph-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / testimonial section end ==== */}

        {/* ==== academia section start ==== */}
        <section className="service-three pt-160 pb-160" id="academia">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header-wrapper mb-60 fade-up">
                  <div className="row gutter-20 align-items-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-8">
                      <div className="section__header">
                        <span className="sub-title secondary-text text-uppercase neutral-top fw-6">ACADEMIA DIGITAL</span>
                        <h2 className="title-animation fw-6 mt-16">Aprende a Cuidar tu Cuerpo</h2>
                      </div>
                    </div>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-4">
                      <div>
                        <p className="primary-text">Cursos de autocuidado, ejercicio terapéutico y educación en salud para pacientes y profesionales.</p>
                        <div className="mt-30">
                          <Link href="/academia/" className="btn-primary">
                            <span className="btn-animated-text" data-text="Ver Cursos">Ver Cursos</span>
                            <span className="btn-icon">
                              <i className="ph ph-arrow-up-right"></i>
                              <i className="ph ph-arrow-up-right"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row gutter-24">
              {/* Curso 1 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/blog/seven.png" alt="Ejercicio Terapéutico" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/academia/" className="fw-6 neutral-top title-animation">Ejercicio Terapéutico en Casa</Link></h5>
                      <p className="primary-text text-md mt-12">Rutinas guiadas para mantener tu rehabilitación desde la comodidad de tu hogar.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/academia/" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Curso 2 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="300">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/blog/eight.png" alt="Prevención de Lesiones" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/academia/" className="fw-6 neutral-top title-animation">Prevención de Lesiones Deportivas</Link></h5>
                      <p className="primary-text text-md mt-12">Aprende a calentar, elongar y proteger tu cuerpo antes y después del deporte.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/academia/" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Curso 3 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="fade-up" data-delay="600">
                  <div className="service-three__single van-tilt">
                    <div className="thumb">
                      <img src="/assets/images/blog/nine.png" alt="Ergonomía Laboral" />
                    </div>
                    <div className="content mt-40">
                      <h5><Link href="/academia/" className="fw-6 neutral-top title-animation">Ergonomía y Salud Laboral</Link></h5>
                      <p className="primary-text text-md mt-12">Guía completa para cuidar tu postura y evitar dolores en el trabajo de oficina.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <Link href="/academia/" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / academia section end ==== */}

        {/* ==== group training section start ==== */}
        <section className="pricing pt-160 pb-160" id="entrenamientos" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header-wrapper mb-60 fade-up text-center">
                  <span className="sub-title secondary-text text-uppercase neutral-top fw-6">ENTRENAMIENTOS GRUPALES</span>
                  <h2 className="title-animation fw-6 mt-16">Ponte en forma con nosotros</h2>
                  <p className="primary-text mt-16" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Súmate a nuestros entrenamientos presenciales. Tenemos cupos limitados por clase para asegurar atención personalizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="row gutter-24 justify-content-center">
              {/* Entrenamiento Fisico */}
              <div className="col-12 col-md-6 col-lg-5">
                <div className="pricing__single scale-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6" style={{ color: 'var(--secondary-color)' }}>Entrenamiento Fisico</h5>
                    <div className="mt-12">
                      <span className="therapy-tag">Fuerza<span className="therapy-tooltip">Entrenamiento de fuerza con pesos libres y maquinas para desarrollo muscular.</span></span>
                      <span className="therapy-tag">Funcional<span className="therapy-tooltip">Movimientos compuestos que mejoran la coordinacion, equilibrio y rendimiento diario.</span></span>
                      <span className="therapy-tag">HIIT<span className="therapy-tooltip">Intervalos de alta intensidad para quemar grasa y mejorar la capacidad cardiovascular.</span></span>
                      <span className="therapy-tag">GAP<span className="therapy-tooltip">Gluteos, abdominales y piernas: trabajo focalizado en tren inferior y core.</span></span>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(56,189,248,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)' }}>
                        <p className="text-md primary-text m-0"><strong>Lun, Mie, Vie:</strong> 09:00, 19:00 y 21:00 hrs</p>
                      </div>
                    </div>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$42.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$33.600 <span className="text-md fw-4">/ mes</span></h3>
                      <p className="price-anticipo">Pago anticipado: $30.240</p>
                    </div>
                    <Link href="/login/" className="btn--secondary w-100 text-center mt-16">
                      <span className="btn-animated-text" data-text="Reservar Cupo">Reservar Cupo</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Entrenamiento de Futbol */}
              <div className="col-12 col-md-6 col-lg-5">
                <div className="pricing__single scale-up" data-delay="200" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="content">
                    <h5 className="fw-6" style={{ color: 'var(--secondary-color)' }}>Entrenamiento de Futbol</h5>
                    <div className="mt-12">
                      <span className="therapy-tag">Fuerza<span className="therapy-tooltip">Trabajo de fuerza especifico para futbolistas: potencia de piernas y estabilidad.</span></span>
                      <span className="therapy-tag">Agilidad<span className="therapy-tooltip">Ejercicios de cambio de direccion, coordinacion y velocidad lateral.</span></span>
                      <span className="therapy-tag">Reaccion<span className="therapy-tooltip">Entrenamiento de reflejos y tiempo de reaccion para mejora en cancha.</span></span>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(56,189,248,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)' }}>
                        <p className="text-md primary-text m-0"><strong>Lun, Mie, Vie:</strong> 20:00 hrs</p>
                      </div>
                      <div style={{ padding: '12px 16px', marginTop: '8px', background: 'rgba(56,189,248,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)' }}>
                        <p className="text-md primary-text m-0"><strong>Mar, Jue:</strong> 21:00 hrs</p>
                      </div>
                    </div>
                  </div>
                  <div className="pricing__single-cta mt-auto pt-30">
                    <div className="price">
                      <span className="price-old">$42.000</span><span className="discount-badge">-20%</span>
                      <h3 className="fw-7 price-new">$33.600 <span className="text-md fw-4">/ mes</span></h3>
                      <p className="price-anticipo">Pago anticipado: $30.240</p>
                    </div>
                    <Link href="/login/" className="btn--secondary w-100 text-center mt-16">
                      <span className="btn-animated-text" data-text="Reservar Cupo">Reservar Cupo</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-60 text-center fade-up">
              <div className="col-12">
                <p className="text-md primary-text" style={{ fontStyle: 'italic' }}>
                  * Inicia sesión o regístrate en la plataforma para asegurar tu lugar.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / group training section end ==== */}

        {/* ==== empresas section start ==== */}
        <section className="pricing pricing-three pt-160 scale-wrapper" id="empresas">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header text-center mb-60 fade-up">
                  <span className="sub-title secondary-text text-uppercase neutral-top fw-6">EMPRESAS</span>
                  <h2 className="title-animation fw-6 mt-16">Bienestar para tu Equipo</h2>
                  <p className="primary-text mt-16">Programas de salud laboral que reducen el ausentismo y mejoran la productividad de tus colaboradores.</p>
                </div>
              </div>
            </div>
            <div className="row gutter-40 justify-content-center">
              <div className="col-12 col-xl-7">
                <div className="pricing__inner">
                  <div className="pricing__single scale-up">
                    <div className="content">
                      <h5 className="fw-6">Básico</h5>
                      <p className="primary-text text-md mt-10">10 sesiones/mes, evaluación grupal, pausas activas 2x/semana, reportes mensuales.</p>
                    </div>
                    <div className="pricing__single-cta">
                      <div className="price">
                        <h3 className="fw-7">$350.000 <span className="text-md fw-4">/ mes</span></h3>
                      </div>
                      <Link href="/corporativo/" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Solicitar">Solicitar</span>
                      </Link>
                    </div>
                  </div>
                  <div className="pricing__single scale-up active">
                    <div className="content">
                      <h5 className="fw-6">Profesional <span className="badge secondary-bg text-white ms-2" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}>Más Popular</span></h5>
                      <p className="primary-text text-md mt-10">30 sesiones/mes, evaluaciones individuales, pausas activas diarias, ergonomía de puestos, kinesiólogo dedicado.</p>
                    </div>
                    <div className="pricing__single-cta">
                      <div className="price">
                        <h3 className="fw-7">$900.000 <span className="text-md fw-4">/ mes</span></h3>
                      </div>
                      <Link href="/corporativo/" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Solicitar">Solicitar</span>
                      </Link>
                    </div>
                  </div>
                  <div className="pricing__single scale-up">
                    <div className="content">
                      <h5 className="fw-6">Enterprise</h5>
                      <p className="primary-text text-md mt-10">Sesiones ilimitadas, equipo multidisciplinario, atención on-site, dashboard corporativo, SLA garantizado.</p>
                    </div>
                    <div className="pricing__single-cta">
                      <div className="price">
                        <h3 className="fw-7">A medida</h3>
                      </div>
                      <Link href="/corporativo/" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Contactar">Contactar</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-5">
                <div className="pricing__content fade-up">
                  <div className="section__header">
                    <h4 className="title-animation fw-6 neutral-top">¿Por qué elegirnos?</h4>
                  </div>
                  <ul className="pricing__list mt-30">
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Kinesiólogos certificados en salud laboral</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Evaluaciones ergonómicas de puestos</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Pausas activas presenciales y online</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Reducción comprobada del ausentismo</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Dashboard con métricas de bienestar</span>
                    </li>
                  </ul>
                  <div className="mt-40">
                    <Link href="/corporativo/" className="btn-primary">
                      <span className="btn-animated-text" data-text="Más Info">Más Info</span>
                      <span className="btn-icon">
                        <i className="ph ph-arrow-up-right"></i>
                        <i className="ph ph-arrow-up-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / empresas section end ==== */}

        {/* ==== footer start ==== */}
        <footer className="footer-two">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-5 col-xl-4">
                <div className="footer-two__intro fade-right">
                  <div className="logo">
                    <Link href="#inicio">
                      <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" />
                    </Link>
                  </div>
                  <div className="mt-20">
                    <p className="neutral-text text-md">Clínica de kinesiología integral en Santiago de Chile. Rehabilitación, deporte y prevención con seguimiento personalizado.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-2 col-xl-3">
                <div className="footer-two__nav fade-right" data-delay="200">
                  <ul>
                    <li><Link href="#sobre-mi">Sobre Mí</Link></li>
                    <li><Link href="#servicios" className="footer-nav-active">Servicios</Link></li>
                    <li><Link href="#entrenamientos">Entrenamientos</Link></li>
                    <li><Link href="#academia">Academia</Link></li>
                    <li><Link href="#empresas">Empresas</Link></li>
                    <li><Link href="/reservar/">Reservar Hora</Link></li>
                    <li><Link href="/login/">Iniciar sesión</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-xl-5">
                <div className="footer-two__text fade-right" data-delay="400">
                  <h3 className="pulse-text" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>CONTÁCTANOS</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__copyright">
            <div className="container">
              <div className="row align-items-center gutter-24">
                <div className="col-12 col-lg-4">
                  <div className="footer__copyright-left">
                    <p>
                      <i className="ph ph-copyright"></i> <span id="copyrightYear"></span> <Link href="#inicio">Duck Kinesiología</Link>. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="social justify-content-center">
                    <Link href="https://www.instagram.com/duckkinesiologia?igsh=MXF6YXh3cHFlenc1aQ==" target="_blank" aria-label="Instagram" title="Instagram">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                    <Link href="https://wa.me/56986625344" target="_blank" aria-label="WhatsApp" title="WhatsApp">
                      <i className="fa-brands fa-whatsapp"></i>
                    </Link>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="footer__copyright-right">
                    <p>Hecho con 🦆 en Santiago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* ==== / footer end ==== */}

        {/* ==== custom cursor start ==== */}
        <div className="mouseCursor cursor-outer"></div>
        <div className="mouseCursor cursor-inner"></div>
        {/* ==== / custom cursor end ==== */}

        {/* ==== scroll to top start ==== */}
        <button className="progress-wrap" aria-label="scroll indicator" title="back to top">
          <span></span>
          <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
          </svg>
        </button>
        {/* ==== / scroll to top end ==== */}
      </div>

      <XfolioScripts />
    </>
  );
}
