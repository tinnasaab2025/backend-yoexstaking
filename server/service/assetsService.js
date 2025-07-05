import { Asset as TableName } from "../models/Assets.js";

export const InsertData = (object) => {
    return TableName.create(object);
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

export const getData = (criteria, attribute) => {
    return TableName.findAll({
        where: criteria,
        attributes: attribute,
        raw: true,
    });
}

export const findById = (id) => {
    return TableName.findByPk(id);
}

export const getOne = (criteria, attribute) => {
    return TableName.findOne({
        where: criteria,
        attributes: attribute,
    });
}

export const updateData = (criteria, object) => {
    return TableName.update(
        object,
        {
            where: criteria,
        },
    );
}

export const bulkInsert = (data) => {
    return TableName.bulkCreate(data);
}

export const count = (criteria) => {
    return TableName.count({
        where: criteria,
    });
}

export const incrementData = (fields, criteria) => {
    return TableName.increment(fields, criteria);
}

export const getSum = (fieldname, criteria) => {
    return TableName.sum(fieldname, criteria);
}
