import { SelectQueryBuilder } from "typeorm";

export async function applyPaginationToBuilder(
  queryBuilder: SelectQueryBuilder<any>,
  limit: number,
  page: number
) {
  if (limit <= 0) {
    return queryBuilder;
  }

  return queryBuilder.take(limit).skip(limit * (page - 1));
}

export async function addPaginationData(results, limit: number, page: number) {
  return {
    data: results[0],
    currentPage: Number(page),
    lastPage: Math.ceil(results[1] / limit),
    total: results[1],
    perPage: Number(limit),
  };
}
