 const getAll = () => {
  return process.pool.query('SELECT * FROM recipematerials');
};


module.exports={getAll}