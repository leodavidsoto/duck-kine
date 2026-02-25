const prisma = require('../config/database');

class AcademyService {
    async getCourses({ page = 1, limit = 12, category }) {
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (category) where.category = category;

        const [courses, total] = await Promise.all([
            prisma.course.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.course.count({ where }),
        ]);
        return { courses, total, page, totalPages: Math.ceil(total / limit) };
    }

    async getCourseDetail(courseId) {
        return prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: { orderBy: { orderIndex: 'asc' } },
                _count: { select: { enrollments: true } },
            },
        });
    }

    async enroll(patientId, courseId) {
        const existing = await prisma.courseEnrollment.findUnique({
            where: { patientId_courseId: { patientId, courseId } },
        });
        if (existing) throw Object.assign(new Error('Ya inscrito en este curso'), { statusCode: 409 });

        return prisma.courseEnrollment.create({
            data: { patientId, courseId },
            include: { course: true },
        });
    }

    async markLessonComplete(patientId, courseId) {
        const enrollment = await prisma.courseEnrollment.findUnique({
            where: { patientId_courseId: { patientId, courseId } },
        });
        if (!enrollment) throw Object.assign(new Error('No inscrito'), { statusCode: 404 });

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        const newCompleted = Math.min(enrollment.completedLessons + 1, course.totalLessons);
        const progress = course.totalLessons > 0 ? (newCompleted / course.totalLessons) * 100 : 0;

        return prisma.courseEnrollment.update({
            where: { id: enrollment.id },
            data: {
                completedLessons: newCompleted,
                progress,
                certificateIssued: progress >= 100,
            },
        });
    }
}

module.exports = new AcademyService();
