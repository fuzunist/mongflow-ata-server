const getAll = () => {
  return process.pool.query("SELECT * FROM recipematerials");
};

const updateEach = async (data) => {
  try {
    const transformedData = Object.entries(data).map(([id, cost]) => ({
      id: parseInt(id),
      cost: parseInt(cost) ?? 0,
    }));

    const placeholders = transformedData
      .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2}::int)`)
      .join(",");
    const values = transformedData.flatMap((item) => [item.id, item.cost]);

    const sqlQuery = `
      UPDATE recipematerials AS r
      SET cost = v.cost::int
      FROM (VALUES ${placeholders}) AS v(id, cost)
      WHERE r.id = v.id::int; -- Explicitly cast the ID field in WHERE clause
    `;

    return process.pool.query(sqlQuery, values);
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports = { getAll, updateEach };
