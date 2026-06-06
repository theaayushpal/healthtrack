const router = require('express').Router();
const { getPartners,createPartner,getPartner,updatePartner,deletePartner,getPartnerStats } = require('../controllers/partnerController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getPartners).post(createPartner);
router.route('/:id').get(getPartner).put(updatePartner).delete(deletePartner);
router.get('/:id/stats', getPartnerStats);
module.exports = router;
