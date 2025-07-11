import { sequelize } from '../db/database.js'; // Adjust path as needed

export async function getUserTickets(userId) {
    const results = await sequelize.query(
        `
        SELECT t.*, tp.name AS topic_name
        FROM tbl_tickets t
        JOIN tbl_ticket_topics tp ON tp.id = t.topic_id
        WHERE t.user_id = :userId
        ORDER BY t.created_at DESC
        `,
        {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        }
    );

    return results; // ✅ this will return an array of ticket records
}
