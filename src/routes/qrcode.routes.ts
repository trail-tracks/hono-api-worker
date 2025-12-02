import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth-middleware';
import { CreateQRCodeController } from '../controllers/create-qrcode.controller';
import { AppBindings, AppVariables } from '../types/env';

const qrCodeRoutes =  new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();
const createQRCodeController = new CreateQRCodeController();


// Gerar QR codes de uma trilha (trilha + pontos de interesse)
qrCodeRoutes.get(
  '/:trailId',
  authMiddleware,
  createQRCodeController.execute.bind(createQRCodeController)
)

export default qrCodeRoutes;
