import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AttachmentsController } from '../controllers/attachments.controller';
import { AppBindings, AppVariables } from '../types/env';

const attachmentsRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const attachmentsController = new AttachmentsController();

attachmentsRoutes.post(
  '/',
  authMiddleware,
  attachmentsController.upload.bind(attachmentsController),
);

export default attachmentsRoutes;
