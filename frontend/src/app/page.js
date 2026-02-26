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
                      <a href="#inicio">
                        <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" />
                      </a>
                    </div>
                    <div className="navbar__menu-wrapper">
                      <div className="navbar__menu d-none d-xl-block">
                        <ul className="navbar__list">
                          <li className="navbar__item nav-fade"><a href="#inicio">Inicio</a></li>
                          <li className="navbar__item nav-fade"><a href="#sobre-mi">Sobre Mí</a></li>
                          <li className="navbar__item nav-fade"><a href="#servicios">Servicios</a></li>
                          <li className="navbar__item nav-fade"><a href="#academia">Academia</a></li>
                          <li className="navbar__item nav-fade"><a href="#empresas">Empresas</a></li>
                          <li className="navbar__item nav-fade"><a href="#precios">Precios</a></li>
                          <li className="navbar__item nav-fade"><a href="#contacto">Contacto</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="navbar__options">
                      <div className="navbar__mobile-options d-none d-sm-block" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <a href="/login" style={{ color: 'var(--white-color)', fontSize: '14px', fontWeight: '500', opacity: '0.8', transition: 'opacity 0.3s' }}>Iniciar sesión</a>
                        <a href="/register" className="btn-primary">
                          <span className="btn-animated-text" data-text="Crear cuenta">Crear cuenta</span>
                          <span className="btn-icon">
                            <i className="ph ph-arrow-up-right"></i>
                            <i className="ph ph-arrow-up-right"></i>
                          </span>
                        </a>
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
                <a href="#inicio" aria-label="home page" title="logo">
                  <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" />
                </a>
              </div>
              <button aria-label="close mobile menu" className="close-mobile-menu">
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="mobile-menu__list"></div>
            <div className="mobile-menu__cta d-block d-md-none nav-fade">
              <a href="/reservar" className="btn-primary">
                <span className="btn-animated-text" data-text="Agendar Cita">Agendar Cita</span>
                <span className="btn-icon">
                  <i className="ph ph-arrow-up-right"></i>
                  <i className="ph ph-arrow-up-right"></i>
                </span>
              </a>
            </div>
            <div className="mobile-menu__social social nav-fade">
              <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram" title="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://wa.me/56912345678" target="_blank" aria-label="WhatsApp" title="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn" title="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
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
                          <a href="/reservar" className="btn-anim">
                            <i className="ph ph-arrow-up-right"></i>
                            Agenda tu Cita
                            <span></span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <div className="hero-two__right fade-up" data-delay="200">
                        <div className="hero-two__group-thumb">
                          <div className="users">
                            <div className="single-user">
                              <img src="/assets/images/avatar/seven.png" alt="Paciente" />
                            </div>
                            <div className="single-user">
                              <img src="/assets/images/avatar/nine.png" alt="Paciente" />
                            </div>
                            <div className="single-user">
                              <img src="/assets/images/avatar/ten.png" alt="Paciente" />
                            </div>
                            <div className="single-user user-count">
                              <h3 className="fw-7">
                                <span className="odometer" data-odometer-final="500">0</span>
                                <span className="prefix">+</span>
                              </h3>
                            </div>
                          </div>
                          <p className="primary-text text-md mt-20">Más de 500 pacientes rehabilitados.</p>
                        </div>
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
              <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://wa.me/56912345678" target="_blank" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </section>
        {/* ==== / hero section end ==== */}

        {/* ==== marquee section start ==== */}
        <section className="marquee">
          <div className="marquee__inner">
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">REHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">NEUROREHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">DEPORTOLOGÍA <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">KINESIOLOGÍA <span>-</span></a></h4>
              </div>
            </div>
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">REHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">NEUROREHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">DEPORTOLOGÍA <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">KINESIOLOGÍA <span>-</span></a></h4>
              </div>
            </div>
            <div className="marquee__slider">
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">REHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">NEUROREHABILITACIÓN <span>-</span></a></h4>
              </div>
              <div className="marquee__single stroke-text">
                <h4 className="title-lg"><a href="#servicios">DEPORTOLOGÍA <span>-</span></a></h4>
              </div>
              <div className="marquee__single">
                <h4 className="title-lg"><a href="#servicios">KINESIOLOGÍA <span>-</span></a></h4>
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
                      <a href="/reservar" className="btn-primary">
                        <span className="btn-animated-text" data-text="Agenda una Cita">Agenda una Cita</span>
                        <span className="btn-icon">
                          <i className="ph ph-arrow-up-right"></i>
                          <i className="ph ph-arrow-up-right"></i>
                        </span>
                      </a>
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
                      <a href="/reservar">Reservar Cita Ahora</a>
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
                          <a href="/reservar" className="btn-primary">
                            <span className="btn-animated-text" data-text="Ver Más">Ver Más</span>
                            <span className="btn-icon">
                              <i className="ph ph-arrow-up-right"></i>
                              <i className="ph ph-arrow-up-right"></i>
                            </span>
                          </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Rehabilitación Deportiva</a></h5>
                      <p className="primary-text text-md mt-12">Recuperación de lesiones musculares, tendinosas y articulares en deportistas de todas las disciplinas.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Neurorehabilitación</a></h5>
                      <p className="primary-text text-md mt-12">Tratamiento de secuelas neurológicas: ACV, Parkinson, esclerosis múltiple y lesiones medulares.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Kinesiología Respiratoria</a></h5>
                      <p className="primary-text text-md mt-12">Técnicas especializadas para patologías respiratorias y mejora de la función pulmonar.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Terapia Manual</a></h5>
                      <p className="primary-text text-md mt-12">Liberación miofascial, movilización articular y técnicas especializadas de tejido blando.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Kinesiología Preventiva</a></h5>
                      <p className="primary-text text-md mt-12">Evaluaciones posturales, ergonomía laboral y programas de ejercicio terapéutico.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/reservar" className="fw-6 neutral-top title-animation">Atención Domiciliaria</a></h5>
                      <p className="primary-text text-md mt-12">Sesiones de kinesiología en la comodidad de tu hogar para pacientes con movilidad reducida.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/reservar" aria-label="ver detalles" title="ver detalles">
                        <span className="text-md">Consultar</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section__header text-center mb-60 fade-up">
                  <span className="sub-title secondary-text text-uppercase neutral-top fw-6">PLANES</span>
                  <h2 className="title-animation fw-6 mt-16">Tarifas Transparentes</h2>
                  <p className="primary-text mt-16">Planes diseñados para tu rehabilitación y bienestar, con la mejor relación calidad-precio.</p>
                </div>
              </div>
            </div>
            <div className="row gutter-40 justify-content-center">
              <div className="col-12 col-xl-7">
                <div className="pricing__inner">
                  <div className="pricing__single scale-up">
                    <div className="content">
                      <h5 className="fw-6">Sesión Individual</h5>
                      <p className="primary-text text-md mt-10">Evaluación inicial incluida, 45-60 minutos de sesión con informe de evolución.</p>
                    </div>
                    <div className="pricing__single-cta">
                      <div className="price">
                        <h3 className="fw-7">$XX.000 <span className="text-md fw-4">/ sesión</span></h3>
                      </div>
                      <a href="/reservar" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                      </a>
                    </div>
                  </div>
                  <div className="pricing__single scale-up active">
                    <div className="content">
                      <h5 className="fw-6">Pack 10 Sesiones <span className="badge secondary-bg text-white ms-2" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}>Más Popular</span></h5>
                      <p className="primary-text text-md mt-10">Evaluación + Reevaluación, ahorro del 15%, informe de evolución y seguimiento por WhatsApp.</p>
                    </div>
                    <div className="pricing__single-cta">
                      <div className="price">
                        <h3 className="fw-7">$XXX.000 <span className="text-md fw-4">/ pack</span></h3>
                      </div>
                      <a href="/reservar" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Agendar">Agendar</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-5">
                <div className="pricing__content fade-up">
                  <div className="section__header">
                    <h4 className="title-animation fw-6 neutral-top">¿Qué incluye cada sesión?</h4>
                  </div>
                  <ul className="pricing__list mt-30">
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Evaluación kinésica completa</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Plan de tratamiento personalizado</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Técnicas manuales especializadas</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Ejercicios terapéuticos para casa</span>
                    </li>
                    <li>
                      <span className="text-md primary-text"><i className="ph ph-check-circle"></i> Informe de evolución</span>
                    </li>
                  </ul>
                  <div className="mt-40">
                    <a href="/reservar" className="btn-primary">
                      <span className="btn-animated-text" data-text="Consultar">Consultar</span>
                      <span className="btn-icon">
                        <i className="ph ph-arrow-up-right"></i>
                        <i className="ph ph-arrow-up-right"></i>
                      </span>
                    </a>
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
                          <a href="/academia" className="btn-primary">
                            <span className="btn-animated-text" data-text="Ver Cursos">Ver Cursos</span>
                            <span className="btn-icon">
                              <i className="ph ph-arrow-up-right"></i>
                              <i className="ph ph-arrow-up-right"></i>
                            </span>
                          </a>
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
                      <h5><a href="/academia" className="fw-6 neutral-top title-animation">Ejercicio Terapéutico en Casa</a></h5>
                      <p className="primary-text text-md mt-12">Rutinas guiadas para mantener tu rehabilitación desde la comodidad de tu hogar.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/academia" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/academia" className="fw-6 neutral-top title-animation">Prevención de Lesiones Deportivas</a></h5>
                      <p className="primary-text text-md mt-12">Aprende a calentar, elongar y proteger tu cuerpo antes y después del deporte.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/academia" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
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
                      <h5><a href="/academia" className="fw-6 neutral-top title-animation">Ergonomía y Salud Laboral</a></h5>
                      <p className="primary-text text-md mt-12">Guía completa para cuidar tu postura y evitar dolores en el trabajo de oficina.</p>
                    </div>
                    <div className="service-three__single-cta mt-40">
                      <a href="/academia" aria-label="ver curso" title="ver curso">
                        <span className="text-md">Ver Curso</span>
                        <i className="ph ph-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ==== / academia section end ==== */}

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
                      <a href="/corporativo" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Solicitar">Solicitar</span>
                      </a>
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
                      <a href="/corporativo" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Solicitar">Solicitar</span>
                      </a>
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
                      <a href="/corporativo" className="btn--secondary">
                        <span className="btn-animated-text" data-text="Contactar">Contactar</span>
                      </a>
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
                    <a href="/corporativo" className="btn-primary">
                      <span className="btn-animated-text" data-text="Más Info">Más Info</span>
                      <span className="btn-icon">
                        <i className="ph ph-arrow-up-right"></i>
                        <i className="ph ph-arrow-up-right"></i>
                      </span>
                    </a>
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
                    <a href="#inicio">
                      <img src="/assets/images/logo.png" alt="Duck Kinesiología" className="logo-ch" />
                    </a>
                  </div>
                  <div className="mt-20">
                    <p className="neutral-text text-md">Clínica de kinesiología integral en Santiago de Chile. Rehabilitación, deporte y prevención con seguimiento personalizado.</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-2 col-xl-3">
                <div className="footer-two__nav fade-right" data-delay="200">
                  <ul>
                    <li><a href="#sobre-mi">Sobre Mí</a></li>
                    <li><a href="#servicios" className="footer-nav-active">Servicios</a></li>
                    <li><a href="#academia">Academia</a></li>
                    <li><a href="#empresas">Empresas</a></li>
                    <li><a href="/reservar">Reservar Hora</a></li>
                    <li><a href="/login">Iniciar sesión</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-xl-5">
                <div className="footer-two__text fade-right" data-delay="400">
                  <h3 className="pulse-text title-xxl">CONTÁCTANOS</h3>
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
                      <i className="ph ph-copyright"></i> <span id="copyrightYear"></span> <a href="#inicio">Duck Kinesiología</a>. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="social justify-content-center">
                    <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram" title="Instagram">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/56912345678" target="_blank" aria-label="WhatsApp" title="WhatsApp">
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn" title="LinkedIn">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
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
