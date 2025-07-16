import express from 'express';
import {
  getSeparacoesByDate,
  createSeparacao,
  updateSeparacaoStatus,
  getSeparacaoById,
  deleteSeparacao,
  getAllSeparacoes
} from '../controllers/separacaoMacs';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Todas as rotas são protegidas
router.use(protect);

// Rotas
router.route('/')
  .get(getSeparacoesByDate)
  .post(createSeparacao);

router.route('/all')
  .get(getAllSeparacoes);

router.route('/:id')
  .get(getSeparacaoById)
  .patch(updateSeparacaoStatus)
  .delete(deleteSeparacao);

export default router; 