/**
 * Pagination helper
 */
function paginate({ page = 1, limit = 20 }) {
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    return { skip, take: safeLimit, page: safePage, limit: safeLimit };
}

function paginateResponse(data, total, { page, limit }) {
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    };
}

module.exports = { paginate, paginateResponse };
