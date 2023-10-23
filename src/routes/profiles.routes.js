import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';


const router = Router();

router.post('/', profileController.createProfile);

router.get('/', profileController.findAllProfiles);

router.get('/active', profileController.findAllActiveProfiles);

router.get('/:id', profileController.findOneProfile);

router.delete('/:id', profileController.deleteProfile);

router.put('/:id', profileController.updateProfile);

export default router;
