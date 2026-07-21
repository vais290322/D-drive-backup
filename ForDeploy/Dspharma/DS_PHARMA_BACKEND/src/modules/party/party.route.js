import { Router } from 'express';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';
import {
  fetchParties,
  getPartyByUserId,
  getPartyDetails,
  partyLoginController,
  partyRegisterController,
  updatePartyController,
} from './party.controller.js';

const partyRouter = Router();

partyRouter.get('/', fetchParties);
partyRouter.get('/:rid', getPartyDetails);

export default partyRouter;

export const partyAuthRouter = Router();

partyAuthRouter.post('/register', partyRegisterController);
partyAuthRouter.post('/login', partyLoginController);
partyAuthRouter.post(
  '/logout',
  authMiddleware,
  authorize('party'),
  partyLoginController,
);
partyAuthRouter.patch(
  '/me',
  authMiddleware,
  authorize('party'),
  updatePartyController,
);
partyAuthRouter.get(
  '/user',
  authMiddleware,
  authorize('party'),
  getPartyByUserId,
);
