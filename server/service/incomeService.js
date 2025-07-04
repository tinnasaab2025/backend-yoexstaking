import { Income as TableName } from "../models/Incomes.js";

export const InsertData = async (object) => {
    return await TableName.create(object);
}


export const getFindAllWithCount = async (criteria, offset, limit) => {
    const { count, rows } = await TableName.findAndCountAll({
        where: criteria,
        offset: offset,
        limit: limit,
    });
    return {
        count,
        rows,
    };
}
export const getData = async (criteria, attribute) => {
    return await TableName.findAll({
        where: criteria,
        attributes: attribute,
    });
}

export const findById = async (id) => {
    return await TableName.findByPk(id);
}

export const getOne = async (criteria, attribute) => {
    return await TableName.findOne({
        where: criteria,
        attributes: attribute,
    });
}

export const updateData = async (criteria, object) => {
    return await TableName.update(
        object,
        {
            where: criteria,
        },
    );
}

export const bulkInsert = async (data) => {
    return await TableName.bulkCreate(data);
}

export const count = async (criteria) => {
    return await TableName.count({
        where: criteria,
    });
}

export const incrementData = async (fields, criteria) => {
    return await TableName.increment(fields, criteria);
}