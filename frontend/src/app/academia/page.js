import Navbar from '@/components/layout/Navbar';
import styles from './academia.module.css';

export const metadata = {
    title: 'Academia Digital | Duck Kinesiología',
    description: 'Cursos de kinesiología, rehabilitación, ejercicio terapéutico y vida saludable por profesionales expertos.',
};

export default function AcademiaPage() {
    return (
        <div>
            <Navbar />
            <div className={styles.page}>
                <div className="container">
                    <div className="section-header">
                        <p className="section-label">Academia digital</p>
                        <h2 className="section-title">
                            Aprende a cuidar tu <span className="text-gradient">cuerpo</span>
                        </h2>
                        <p className="section-desc">
                            Cursos diseñados por kinesiólogos expertos con ejercicios prácticos y seguimiento de progreso.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        {courses.map((c, i) => (
                            <div key={i} className={styles.courseCard}>
                                <div className={styles.courseImage}>
                                    <span className={styles.courseEmoji}>{c.emoji}</span>
                                </div>
                                <div className={styles.courseBody}>
                                    <span className={styles.courseCategory}>{c.category}</span>
                                    <h3 className={styles.courseTitle}>{c.title}</h3>
                                    <p className={styles.courseDesc}>{c.description}</p>
                                    <div className={styles.courseMeta}>
                                        <span className={styles.courseLessons}>{c.lessons} lecciones</span>
                                        <span className={styles.coursePrice}>{c.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const courses = [
    { emoji: '🦴', category: 'Rehabilitación', title: 'Recuperación Lesiones de Rodilla', description: 'Programa completo para LCA, meniscos y cartílago con ejercicios progresivos.', lessons: 12, price: '$29.990' },
    { emoji: '🏃', category: 'Deportivo', title: 'Running sin Lesiones', description: 'Técnica de carrera, fortalecimiento y prevención para corredores.', lessons: 8, price: '$19.990' },
    { emoji: '🧘', category: 'Bienestar', title: 'Postura y Ergonomía', description: 'Mejora tu postura y previene dolor en casa y en la oficina.', lessons: 6, price: 'Gratis' },
    { emoji: '💪', category: 'Deportivo', title: 'Core y Estabilidad', description: 'Rutinas progresivas para fortalecer tu zona media.', lessons: 10, price: '$24.990' },
    { emoji: '🤕', category: 'Rehabilitación', title: 'Manejo del Dolor Lumbar', description: 'Estrategias basadas en evidencia para dolor de espalda baja.', lessons: 8, price: '$19.990' },
    { emoji: '🏊', category: 'Deportivo', title: 'Natación Terapéutica', description: 'Ejercicios acuáticos para rehabilitación y movilidad articular.', lessons: 6, price: '$14.990' },
];
