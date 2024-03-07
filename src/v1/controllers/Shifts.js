const httpStatus = require('http-status/lib')
const {
    insert,
    getAll,
    update,
    del,
    insertForProcess,
    getAllForProcess,
    updateForProcess,
    delForProcess,
  } = require("../services/Shifts");
  
  const create = async (req, res) => {
    insert(req.body)
        .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e.message }))
}



const get = (req, res) => {
    getAll()
        .then(({ rows }) => res.status(httpStatus.OK).send(rows))
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}


const put = (req, res) => {
    update({ shiftid: req.params.id, ...req.body })
        .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}


const remove = (req, res) => {
    del(req.params.id)
        .then(({ rowCount }) => {
            if (!rowCount) return res.status(httpStatus.NOT_FOUND).send({ message: 'There is no such record.' })
            res.status(httpStatus.OK).send({ message: 'Shift deleted successfully.' })
        })
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}

const createForProcess = async (req, res) => {
    console.log("In the server side Received payload for createForProcess:", req.body); // Add this line to log the payload
    insertForProcess(req.body)
        .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e.message }))
}



const getForProcess = (req, res) => {
    getAllForProcess()
        .then(({ rows }) => res.status(httpStatus.OK).send(rows))
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}


const putForProcess = (req, res) => {
    updateForProcess({ shiftid: req.params.id, ...req.body })
        .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}


const removeForProcess = (req, res) => {
    delForProcess(req.params.id)
        .then(({ rowCount }) => {
            if (!rowCount) return res.status(httpStatus.NOT_FOUND).send({ message: 'There is no such record.' })
            res.status(httpStatus.OK).send({ message: 'Shift deleted successfully.' })
        })
        .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'An error occurred.' }))
}


module.exports = {
  create,
  get,
  put,
  remove,
  createForProcess,
  getForProcess,
  putForProcess,
  removeForProcess
};
