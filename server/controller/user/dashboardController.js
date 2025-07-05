"use strict";
import { Sequelize } from 'sequelize';
import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { getOne } from "../../service/tokenValueService.js";
import { getOne as userGetOne } from "../../service/userService.js";
import { getSum } from "../../service/stakeGHistoryService.js";
import { getOne as getOneBusiness } from "../../service/businessRankAchiversService.js";
import { handleErrorMessage, handleSuccess } from "../../utils/UniversalFunctions.js";
import { getData, getSum as getSumBond } from "../../service/bondHistoryService.js";
import { getSum as getSumAssets } from "../../service/assetsService.js";

import { getData as getDataUserBusiness } from "../../service/userBusinessService.js";
import { getOne as getOneRewardBusiness } from "../../service/rewardBusinessService.js";


export const verify = async (req, res) => {
    try {
        const { user_id } = req.user;
        // console.log('user_id', req.user);
        let criteria = {
            user_id: user_id,
        };
        const attribute = ['user_id', 'sponser_id', 'sponser_eth_address', 'eth_address', 'directs', 'team_business', 'direct_business', 'disabled', 'package_amount', 'created_at'];
        const user = await userGetOne(criteria, attribute);
        if (user['disabled'] === true) {
            let finalResponse = { ...ERROR.error };
            finalResponse.message = 'User blocked, please contact our support';
            return res.status(ERROR.error.statusCode).json(finalResponse);
        }

        const price = await getOne({ id: 1 }, {}, ['amount']);
        user.token_price = price.amount ? price.amount : 0;
        const blockBontyReward = await getOneBusiness({ user_id: user_id }, {});

        const totalStake = await getSum('usdt_amount', {});
        const attributeBond = [
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_bond'],
            [Sequelize.fn('SUM', Sequelize.col('bond_tokens')), 'bond_tokens']
        ]
        const totalBond = await getData({}, attributeBond);
        let rank_level;
        let rank_achived;
        if (blockBontyReward && blockBontyReward['rank']) {
            rank_level = blockBontyReward['rank'];
            rank_achived = true;
        } else {
            rank_level = 'Normal';
            rank_achived = false;
        }
        let finalMessage = { ...SUCCESS.created };
        finalMessage.message = 'Token is valid. User is authenticated.';
        finalMessage.data = {
            user_info: user,
            total_all_over_stake_usdt: totalStake.toFixed(4),

            total_all_over_bond_usdt: totalBond[0].bond_tokens ? totalBond[0].bond_tokens.toFixed(4) : 0,

            total_all_over_stake_tokens: totalStake.toFixed(4) / price.amount,
            total_all_over_bond_tokens: totalBond[0].bond_tokens / price.amount,
            total_value_deposited: (totalStake + totalBond[0].bond_tokens).toFixed(4),
            rank_level: rank_level,
            rank_achived: rank_achived,
        }



        return res.status(SUCCESS.created.statusCode).json(finalMessage);
    } catch (error) {
        handleErrorMessage(res, error);
    }
};


export const dashboard = async (req, res) => {
    try {

        const token_info = await getOne({}, {}, []);
        const infinity_yield_rewards = await getSumAssets('tokens', { type: 'infinity_yield_rewards' });
        const yield_loop_rewards = await getSumAssets('tokens', { type: 'yield_loop_rewards' });

               let response = {}; // Fixed from array to object

        response['price'] = token_info.amount ? token_info.amount : 0;
        response['market_cap'] = token_info.market_cap ? token_info.market_cap : 0;
        response['supply'] = token_info.supply ? token_info.supply : 0;
        response['symbol'] = token_info.symbol;

        const attributeMinting = [
            [Sequelize.fn('SUM', Sequelize.col('available_asset')), 'available_asset'],
            [Sequelize.fn('SUM', Sequelize.col('total_bond_tokens')), 'total_bond_tokens'],
            [Sequelize.fn('SUM', Sequelize.col('total_stake_amount')), 'total_stake_amount'],
            [Sequelize.fn('SUM', Sequelize.col('stake_tokens')), 'stake_tokens'],
            [Sequelize.fn('SUM', Sequelize.col('bond_tokens')), 'bond_tokens'],
            [Sequelize.fn('SUM', Sequelize.col('bond_discount_tokens')), 'bond_discount_tokens'],
            [Sequelize.fn('SUM', Sequelize.col('total_stake_tokens')), 'total_stake_tokens']
        ]

        const total_minting_amount = await getDataUserBusiness({}, attributeMinting);
        const attribute = ['available_rewards', 'total_rewards', 'created_at', 'updated_at', 'id'];
        const assets_rewards = await getOneRewardBusiness({ id: 1 }, attribute);

        response['available_rewards'] = assets_rewards.available_rewards ? assets_rewards.available_rewards : 0;
        response['total_rewards'] = assets_rewards.total_rewards ? assets_rewards.total_rewards : 0;
        response['total_yoex_staked'] = (total_minting_amount[0].total_stake_tokens + total_minting_amount[0].stake_tokens + total_minting_amount[0].total_bond_tokens + total_minting_amount[0].bond_tokens).toFixed(2);

        response['stake_tokens'] = total_minting_amount[0].stake_tokens ? total_minting_amount[0].stake_tokens : 0;
        response['total_stake_tokens'] = total_minting_amount[0].available_asset ? total_minting_amount[0].available_asset : 0;
        response['total_bond_usdt'] = total_minting_amount[0].total_stake_amount ? (total_minting_amount[0].total_stake_amount).toFixed(2) : 0;
        response['total_bond_tokens'] = total_minting_amount[0].total_bond_tokens ? total_minting_amount[0].total_bond_tokens : 0;
        response['bond_tokens'] = total_minting_amount[0].bond_tokens ? total_minting_amount[0].bond_tokens : 0;

        const totalYield = yield_loop_rewards + infinity_yield_rewards;

        if (parseFloat(String(response.total_stake_tokens).replace(/,/g, '')) !== 0) {
            const tokens = parseFloat(String(response.total_stake_tokens).replace(/,/g, ''));
            response['total_stake_apy'] = ((totalYield / tokens) * 100).toFixed(2);
        } else {
            response['total_stake_apy'] = 0;
        }

        let finalMessage = { ...SUCCESS.found };
        finalMessage.data = response;
        finalMessage.message = 'Dashboard data fetched successfully.';
        return res.status(SUCCESS.found.statusCode).json(finalMessage);
    } catch (error) {
        handleErrorMessage(res, error);
    }
};