const _getMonthlyExpenses = (date) => {
  return process.pool.query(
    "SELECT id, monthly_expenses, TO_CHAR(date, 'MM/YYYY') AS date FROM companyexpenses WHERE date = $1",
    [date]
  );
};

const _getClasses = () => {
  return process.pool.query("SELECT * FROM companyexpensesclass");
};

const _getItems = () => {
  return process.pool.query(
    "SELECT * FROM companyexpensesitems ORDER BY id ASC"
  );
};

const _createItem = (data) => {
  return process.pool.query(
    'INSERT INTO "companyexpensesitems" (class, name, frequency) VALUES ($1, $2, $3) RETURNING id',
    [data.class, data.name, data.frequency]
  );
};

// BURASI EXTRA CRON JOB İLE HER AY TETİKLENECEK
const _createExpense = (data) => {
  return process.pool.query(
    'INSERT INTO "companyexpenses" (date, monthly_expenses, daily_expenses, hourly_expenses) VALUES ($1, $2, $3, $4) RETURNING id',
    [
      data.date,
      data.monthly_expenses,
      data.daily_expenses,
      data.hourly_expenses,
    ]
  );
};

const _updateExpense = (data) => {
  return process.pool.query(
    'UPDATE "companyexpenses" SET  monthly_expenses=$1 WHERE id=$2 RETURNING *',
    [
      // data.date,
      data.monthly_expenses,
      // data.daily_expenses,
      // data.hourly_expenses,
      data.id,
    ]
  );
};
module.exports = {
  _getMonthlyExpenses,
  _getClasses,
  _getItems,
  _createItem,
  _createExpense,
  _updateExpense,
};
