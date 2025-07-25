"use strict";
import { Op, Sequelize } from "sequelize";

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { count, getOne } from "../../service/userService.js";
import {
  getOne as getOneUserBusiness,
  getData as getDataUserBusiness,
} from "../../service/userBusinessService.js";
import { getOne as getOneTokenValue } from "../../service/tokenValueService.js";
import { count as sponsorCount } from "../../service/sponsorCountService.js";
import {
  getOne as getOneEvent,
  InsertData,
} from "../../service/eventService.js";
import { getOne as getOneRankAchiver } from "../../service/rewardService.js";
import { handleErrorMessage } from "../../utils/UniversalFunctions.js";
import {
  getSum,
  getData as getDataAssets,
} from "../../service/assetsService.js";

import { getOne as getOneProfile } from "../../service/userProfileService.js";
import {
  getData,
  getSum as getSumBondHistory,
} from "../../service/bondHistoryService.js";
import { getData as getDataUnBond } from "../../service/unBondHistoryService.js";
import {
  getTotalBondSumByUserId,
  getTotalStakeSumByUserId,
  legTeamDownline,
} from "../../utils/GetTeam.js";

export const assets = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const assets = await getOneUserBusiness({ user_id: user_id }, [
      "available_asset",
      "total_asset",
      "stake_tokens",
      "total_stake_tokens",
      "total_unstake_tokens",
      "bond_tokens",
      "total_bond_tokens",
      "bond_discount_tokens",
      "yoex_bond_yield",
      "bond_infinity_yield_rewards",
      "yield_loop_rewards",
      "infinity_yield_rewards",
    ]);
    const attributeBond = [
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("stake_tokens")),
          0
        ),
        "total_stake_tokens",
      ],
    ];
    const total_stake_tokens = await getDataUserBusiness({}, attributeBond);

    let response = {};
    response["available_asset"] = assets.available_asset;
    response["total_asset"] = assets.total_asset;
    response["stake_tokens"] = assets.stake_tokens;
    response["total_stake_tokens"] = assets.total_stake_tokens;
    response["total_unstake_tokens"] = assets.total_unstake_tokens;
    response["bond_tokens"] = assets.bond_tokens;
    response["total_bond_tokens"] = assets.total_bond_tokens;
    response["bond_discount_tokens"] = assets.bond_discount_tokens;
    response["yoex_bond_yield"] = assets.yoex_bond_yield;
    response["bond_infinity_yield_rewards"] =
      assets.bond_infinity_yield_rewards;
    response["yield_loop_rewards"] = assets.yield_loop_rewards;
    response["infinity_yield_rewards"] = assets.infinity_yield_rewards;
    response["company_current_stake_amount"] =
      total_stake_tokens[0].total_stake_tokens;
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Assets getting successfully";
    finalMessage.data = response;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const getUserStakeStatus = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const attribute2 = ["unstake_allowance"];

    const userInfo = await getOneUserBusiness(criteria, attribute2)
    const response = {};
    response["stakeStatus"] = userInfo["unstake_allowance"];;
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "User Stake status getting successfully";
    finalMessage.data = response;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
}


export const userInfo = async (req, res) => {
  try {
    const { user_id, wallet_address } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const [total_directs, total_team, token_price, totalBond, totalStake, blockBontyReward] = await Promise.all([
      count({ sponser_id: user_id }),
      sponsorCount({ user_id: user_id }),
      getOneTokenValue({ id: 1 }, ["amount"]),
      getTotalBondSumByUserId(user_id),
      getTotalStakeSumByUserId(user_id),
      getOneRankAchiver(
        { user_id: wallet_address },
        ["rank_name"]
      )
    ]);
    let response = {};
    if (blockBontyReward) {
      response["rank_level"] = true;
      response["rank_achived"] = blockBontyReward["rank_name"];
    } else {
      response["rank_level"] = "Normal";
      response["rank_achived"] = false;
    }

    response["user_id"] = user_id;
    response["wallet_address"] = user.eth_address;
    response["sponsor_wallet_address"] = user.sponser_eth_address
      ? user.sponser_eth_address
      : "-";
    response["sponsor_id"] = user.sponser_id ? user.sponser_id : "-";
    response["total_directs"] = total_directs ?? 0;
    response["total_team"] = total_team ?? 0;
    response["total_team_bond_tokens"] = totalBond;
    response["total_team_stake_tokens"] = totalStake;
    response["total_bond_usdt"] = user.bond_amount ?? 0;
    response["total_bond_tokens"] = user.bond_tokens ?? 0;
    response["total_stake_usdt"] = user.total_stake_tokens / token_price.amount;
    response["total_stake_tokens"] = user.total_stake_tokens;
    response["total_unstake_tokens"] = user.total_unstake_tokens;
    response["token_price"] = token_price.amount;

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "User Profile getting successfully";
    finalMessage.data = response;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

const callThirdPartyAPI = async (userId, level, skip, limit) => {
  const apiUrl = `http://44.206.93.162/game4you.online/index.php/User/invite_history_team/${userId}/${level}/${limit}/${skip}`;
  // console.log("API URL:", apiUrl);
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const inviteHistoryTeam = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { skip, limit, level } = req.query;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }
    const finalLevel = level ? level : 1;
    const finalResult = await callThirdPartyAPI(user_id, finalLevel, skip, limit);
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Invite User history getting successfully";
    finalMessage.data = finalResult?.data ? finalResult.data : [];
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const bondTerms = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = [
      "user_id",
      "sponser_id",
      "sponser_eth_address",
      "eth_address",
      "directs",
      "team_business",
      "direct_business",
      "disabled",
      "package_amount",
      "created_at",
    ];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let response = {};

    const attributeBond = [
      [
        Sequelize.fn("IFNULL", Sequelize.fn("SUM", Sequelize.col("amount")), 0),
        "total_bond",
      ],
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("bond_tokens")),
          0
        ),
        "bond_tokens",
      ],
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("bond_principles")),
          0
        ),
        "bond_principles",
      ],
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("total_release_bond")),
          0
        ),
        "total_release_bond",
      ],
    ];
    const totalBond = await getData({ user_id: user_id }, attributeBond);

    const allTotalBond = await getData({}, attributeBond);

    const attributeUnBond = [
      [
        Sequelize.fn("IFNULL", Sequelize.fn("SUM", Sequelize.col("amount")), 0),
        "total_bond",
      ],
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("total_unbond_tokens")),
          0
        ),
        "user_total_release_bond",
      ],
    ];

    const user_total_release_bond = await getDataUnBond(
      { user_id: user_id },
      attributeUnBond
    );
    const attributeBondStatus = [
      [
        Sequelize.fn("IFNULL", Sequelize.fn("SUM", Sequelize.col("amount")), 0),
        "total_bond",
      ],
      [
        Sequelize.fn(
          "IFNULL",
          Sequelize.fn("SUM", Sequelize.col("total_release_bond")),
          0
        ),
        "user_pending_bond",
      ],
    ];

    const user_pending_bond = await getData(
      { user_id: user_id, status: 0 },
      attributeBondStatus
    );

    response["total_bond_usdt"] = allTotalBond[0].total_bond.toFixed(4);
    response["total_bond_tokens"] = allTotalBond[0].bond_tokens.toFixed(4);
    response["total_bond_tokens_principles"] =
      allTotalBond[0].bond_principles.toFixed(4);
    response["total_release_bond"] =
      allTotalBond[0].total_release_bond.toFixed(4);

    response["user_total_bond_usdt"] = totalBond[0].total_bond.toFixed(4);
    response["user_total_bond_tokens"] = totalBond[0].bond_tokens.toFixed(4);
    response["user_total_bond_tokens_principles"] =
      totalBond[0].bond_principles.toFixed(4);

    response["user_total_release_bond"] =
      user_total_release_bond[0].user_total_release_bond.toFixed(4);
    response["total_balance_of_usdt"] = 0;
    response["user_pending_bond"] = user_pending_bond[0].user_pending_bond;

    const plans = [
      { days: 7, roi: 1 },
      { days: 15, roi: 2 },
      { days: 30, roi: 3 },
      { days: 90, roi: 5 },
      { days: 180, roi: 6 },
      { days: 360, roi: 7 },
    ];

    // Loop with await support
    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];

      // Make sure user_id is passed separately if applicable (or remove it)
      console.log(" plan.days", plan.days);
      const getTotalBond = await getSumBondHistory("amount", {});
      const criteriaCheck = { user_id: user_id, lock_days: plan.days };
      const attributeBondStatus = [
        [
          Sequelize.fn(
            "IFNULL",
            Sequelize.fn("SUM", Sequelize.col("amount")),
            0
          ),
          "total_bond",
        ],
      ];
      const user_pending_bondssss = await getData(
        criteriaCheck,
        attributeBondStatus
      );
      plan.total_bond = user_pending_bondssss[0].total_bond || 0; // default to 0 if null
    }
    response["terms"] = plans;
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Bond termns getting successfully.";
    finalMessage.data = response;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const overview = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["user_id", "disabled"];
    const user = await getOne(criteria, attribute);
    // const total_directs = await count({ sponser_id: user_id });
    // const total_team = await sponsorCount({ user_id: user_id });
    // const token_price = await getOneTokenValue({ id: 1 }, ['amount']);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let response = {};
    console.log("ergger", { type: "yield_loop_rewards", user_id: user_id });
    const attri = [
      [
        Sequelize.fn("IFNULL", Sequelize.fn("SUM", Sequelize.col("tokens")), 0),
        "tokens",
      ],
    ];
    const [
      yield_loop_reward,
      infinity_yield_ewards,
      yoex_bond_yield,
      bond_infinity_yield_rewards,
      blockbounty_rewards,
      chaingain_pool_prize,
    ] = await Promise.all([
      getDataAssets({ type: "yield_loop_rewards", user_id: user_id }, attri),
      getDataAssets(
        { type: "infinity_yield_rewards", user_id: user_id },
        attri
      ),
      getDataAssets({ type: "yoex_bond_yield", user_id: user_id }, attri),
      getDataAssets(
        { type: "bond_infinity_yield_rewards", user_id: user_id },
        attri
      ),
      getDataAssets({ type: "blockbounty_rewards", user_id: user_id }, attri),
      getDataAssets({ type: "chaingain_pool_prize", user_id: user_id }, attri),
    ]);
    response["yield_loop_reward"] = yield_loop_reward[0].tokens;
    response["infinity_yield_ewards"] = infinity_yield_ewards[0].tokens;
    response["yoex_bond_yield"] = yoex_bond_yield[0].tokens;
    response["bond_infinity_yield_rewards"] =
      bond_infinity_yield_rewards[0].tokens;
    response["blockbounty_rewards"] = blockbounty_rewards[0].tokens;
    response["chaingain_pool_prize"] = chaingain_pool_prize[0].tokens;

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Overview getting successfully.";
    finalMessage.data = response;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const eventAchiver = async (req, res) => {
  try {
    const { user_id } = req.user;
    // console.log('user_id', req.user);
    let criteria = {
      user_id: user_id,
    };
    const attribute = [
      "user_id",
      "sponser_id",
      "sponser_eth_address",
      "eth_address",
      "directs",
      "team_business",
      "direct_business",
      "disabled",
      "package_amount",
      "created_at",
    ];
    const user = await getOne(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const bondData = await getSumBondHistory("amount", {
      where: {
        user_id: user_id,
        lock_days: { [Op.gte]: 180 },
      },
    });

    const totalBond = bondData ? bondData : 0;

    const currentDate = new Date();
    let ams = 1500;
    if (currentDate.getDate() >= 1 && currentDate.getMonth() + 1 >= 8) {
      ams = 3000;
    }
    if (totalBond >= ams && currentDate.getDate() >= 1 && currentDate.getMonth() + 1 >= 8) {
      let finalMessage = { ...SUCCESS.found };
      finalMessage.message = "Token is valid. User is authenticated.";
      finalMessage.data = {
        achived_status: true,
        total_bond: totalBond,
      };
      return res.status(SUCCESS.found.statusCode).json(finalMessage);
    } else {
      let finalMessage = { ...ERROR.error };
      finalMessage.message = "Wallet is not eligible!";

      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const luckyUsers = async (req, res) => {
  try {
    const { wallet_address } = req.user;

    const event = await getOneEvent({ wallet_address }, ["status"]);

    if (!event) {
      return getResponse(res, 3, "Join Now", "Pending");
    }

    const status = event.status;

    const statusMap = {
      0: { text: "Pending", message: "Pending" },
      1: { text: "Approve", message: "Pending" },
      2: { text: "Reject", message: "Complete" },
    };

    const { text, message } = statusMap[status] || {
      text: "New User",
      message: "Complete",
    };

    return getResponse(res, status ?? 3, text, message);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const luckyUsersDubai = async (req, res) => {
  try {
    const { user_id } = req.user;

    const event = await getOneProfile({ user_id: user_id }, ["status"]);

    if (!event) {
      return getResponse(res, 3, "Join Now", "Pending");
    }

    const status = event.status;

    const statusMap = {
      0: { text: "Pending", message: "Pending" },
      1: { text: "Approve", message: "Pending" },
      2: { text: "Reject", message: "Complete" },
    };

    const { text, message } = statusMap[status] || {
      text: "New User",
      message: "Complete",
    };

    return getResponse(res, status ?? 3, text, message);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

const getResponse = (res, status, text, message) => {
  const finalMessage = {
    ...SUCCESS.found,
    message,
    data: {
      admin_status: status,
      joining: text,
    },
  };
  return res.status(SUCCESS.found.statusCode).json(finalMessage);
};

export const joinMalasiyaEvent = async (req, res) => {
  try {
    const { first_name, last_name, email, wallet_address } = req.body;
    const eventData = {
      first_name: first_name,
      name: first_name + " " + last_name,
      last_name: last_name,
      email: email,
      wallet_address: wallet_address,
    };

    console.log("eventData", eventData);
    await InsertData(eventData);
    let finalMessage = { ...SUCCESS.created };
    finalMessage.message =
      "Your Request has been received. Kindly send your passport details front,back and scanned passport size photo at support@yoex.io . We will get back to your shortly.!";
    return res.status(SUCCESS.created.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};
