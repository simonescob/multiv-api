import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

const router = Router();

router.post('/', customerController.createCustomer);

router.get('/', customerController.findAllCustomers);

router.get('/active', customerController.findAllActiveCustomers);

router.get('/:id', customerController.findOneCustomer);

router.delete('/:id', customerController.deleteCustomer);

router.put('/:id', customerController.updateCustomer);

export default router;
