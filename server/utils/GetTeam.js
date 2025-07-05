import { sequelize } from '../db/database.js'; // your Sequelize instance
import { QueryTypes } from 'sequelize';


export const legTeamDownline = async (user_id, level = null, limit = 10, offset = 0, show = false) => {
  try {
    let levelCondition = '';
    if (level !== null) {
      levelCondition = 'AND sc.level = :level';
    }

    const query = `
      SELECT
        sc.downline_id,
        sc.level,
        u.sponser_id,
        u.sponser_wallet_address,
        u.wallet_address,
        IFNULL(u.total_bond_amount, 0) AS total_bond_amount_usdt,
        IFNULL(u.total_bond_tokens, 0) AS total_bond_tokens,
        IFNULL(u.total_stake_tokens, 0) AS total_stake_tokens,
        IFNULL(uts.available_team_business, 0) AS available_team_business,
        IFNULL(uts.available_team_bond_tokens, 0) AS available_team_bond_tokens
      FROM tbl_sponser_count AS sc
      LEFT JOIN tbl_users_business AS u ON u.user_id = sc.downline_id
      LEFT JOIN (
        SELECT 
          user_id,
          SUM(available_team_business) AS available_team_business,
          SUM(available_team_bond_tokens) AS available_team_bond_tokens
        FROM tbl_user_team_summary
        GROUP BY user_id
      ) AS uts ON uts.user_id = sc.downline_id
      WHERE sc.user_id = :user_id
      ${levelCondition}
      ORDER BY sc.id DESC
      LIMIT :limit OFFSET :offset
    `;

    const replacements = {
      user_id,
      level,
      limit,
      offset
    };

    const result = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    if (show) {
      console.log('Executed SQL:', query);
      console.log('Results:', result);
    }

    return result;
  } catch (err) {
    console.error('❌ Error in legTeamDownline:', err);
    return [];
  }
};


export const getTotalBondSumByUserId = async (user_id) => {
  try {
    // Step 1: Get downline_ids
    const downlines = await sequelize.query(
      'SELECT downline_id FROM tbl_sponser_count WHERE user_id = ?',
      { replacements: [user_id], type: sequelize.QueryTypes.SELECT }
    );

    const downline_ids = downlines.map(d => d.downline_id);

    if (downline_ids.length === 0) return 0;

    // Step 2: Sum total_bond from tbl_bond_history
    const [sumResult] = await sequelize.query(
      `SELECT SUM(total_bond) AS total_bond 
       FROM tbl_bond_history 
       WHERE user_id IN (:downline_ids)`,
      {
        replacements: { downline_ids },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return sumResult.total_bond || 0;

  } catch (error) {
    console.error('Error in getTotalBondSumByUserId:', error);
    return 0;
  }
};



export const getTotalStakeSumByUserId = async (user_id) => {
  try {
    // Step 1: Get downline_ids
    const downlines = await sequelize.query(
      'SELECT downline_id FROM tbl_sponser_count WHERE user_id = ?',
      { replacements: [user_id], type: sequelize.QueryTypes.SELECT }
    );

    const downline_ids = downlines.map(d => d.downline_id);

    if (downline_ids.length === 0) return 0;

    // Step 2: Sum tokens from tbl_stake_history
    const [sumResult] = await sequelize.query(
      `SELECT SUM(tokens) AS total_tokens 
       FROM tbl_stake_history 
       WHERE user_id IN (:downline_ids)`,
      {
        replacements: { downline_ids },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return sumResult.total_tokens || 0;

  } catch (error) {
    console.error('Error in getTotalStakeSumByUserId:', error);
    return 0;
  }
};

