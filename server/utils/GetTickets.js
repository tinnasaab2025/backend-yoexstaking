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

export const getTicket = async (id) => {
  const [results] = await sequelize.query(
    `
      SELECT t.*, tp.name AS topic_name
      FROM tbl_tickets t
      JOIN tbl_ticket_topics tp ON tp.id = t.topic_id
      WHERE t.id = :id
      LIMIT 1
    `,
    {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results || null;
}

export const getReplies = async (ticket_id) => {
  const results = await sequelize.query(
    `
      SELECT *
      FROM tbl_ticket_replies
      WHERE ticket_id = :ticket_id
      ORDER BY created_at ASC
    `,
    {
      replacements: { ticket_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results; // returns [] if no rows, which is standard
};


export const addReply = async ( data ) =>{
  const fields = Object.keys(data);
  const placeholders = fields.map(field => `:${field}`).join(', ');
  const columns = fields.join(', ');

  const [result] = await sequelize.query(
    `
      INSERT INTO tbl_ticket_replies (${columns})
      VALUES (${placeholders})
    `,
    {
      replacements: data,
      type: sequelize.QueryTypes.INSERT,
    }
  );

  // Depending on the dialect, INSERT returns [result, metadata]
  // In MySQL: result = insertId
  return result; // cast to number if needed
}


