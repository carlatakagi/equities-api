import express from 'express';
import EquityController from '../controller/EquityController.js';

const router = express.Router();

router.get('/client/ativos/:codCliente', EquityController.getEquitiesByClientId);

router.get('/assets/ativos/:codAtivo', EquityController.getEquityById);

router.post('/assets/investimentos/comprar', EquityController.buyEquity)

router.post('/assets/investimentos/vender', EquityController.sellEquity)

router.post('/conta/deposito', EquityController.makeDeposit)

router.post('/conta/saque', EquityController.makeWithdrawal)

router.get('/conta/:codCliente', EquityController.getClientAccount)

export default router;
