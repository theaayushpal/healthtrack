const router = require('express').Router();
const { getSessions,createSession,getSession,updateSession,deleteSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getSessions).post(createSession);
router.route('/:id').get(getSession).put(updateSession).delete(deleteSession);
module.exports = router;
