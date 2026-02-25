import Navbar from '@/components/layout/Navbar';
import styles from './corporativo.module.css';

export const metadata = {
    title: 'Empresas | Duck Kinesiología',
    description: 'Soluciones de kinesiología para empresas. Pausas activas, ergonomía laboral y bienestar corporativo en Santiago.',
};

export default function CorporativoPage() {
    return (
        <div>
            <Navbar />
            <div className={styles.page}>
                <div className="container">
                    <div className="section-header">
                        <p className="section-label">Para empresas</p>
                        <h2 className="section-title">
                            Bienestar para tu <span className="text-gradient">equipo</span>
                        </h2>
                        <p className="section-desc">
                            Programas de salud laboral que reducen el ausentismo y mejoran la productividad de tus colaboradores.
                        </p>
                    </div>

                    <div className={styles.plansGrid}>
                        {plans.map((plan, i) => (
                            <div key={i} className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}>
                                {plan.featured && <span className={styles.planBadge}>Más popular</span>}
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.planPrice}>
                                    <span className={styles.priceAmount}>{plan.price}</span>
                                    {plan.period && <span className={styles.pricePeriod}>{plan.period}</span>}
                                </div>
                                <p className={styles.planDesc}>{plan.description}</p>
                                <ul className={styles.planFeatures}>
                                    {plan.features.map((f, j) => (
                                        <li key={j} className={styles.planFeature}>
                                            <span className={styles.checkIcon}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/corporativo/contacto"
                                    className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} ${styles.planBtn}`}>
                                    Solicitar información
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const plans = [
    {
        name: 'Básico', price: '$350.000', period: '/mes',
        description: 'Ideal para equipos pequeños que quieren iniciar su programa de bienestar.',
        features: ['10 sesiones/mes', 'Evaluación grupal', 'Pausas activas 2x/semana', 'Reportes mensuales'],
        featured: false,
    },
    {
        name: 'Profesional', price: '$900.000', period: '/mes',
        description: 'La solución completa para empresas que priorizan la prevención.',
        features: ['30 sesiones/mes', 'Evaluaciones individuales', 'Pausas activas diarias', 'Ergonomía de puestos', 'Kinesiólogo dedicado'],
        featured: true,
    },
    {
        name: 'Enterprise', price: 'A medida', period: '',
        description: 'Programas personalizados para grandes organizaciones.',
        features: ['Sesiones ilimitadas', 'Equipo multidisciplinario', 'Atención on-site', 'Dashboard corporativo', 'SLA garantizado'],
        featured: false,
    },
];
