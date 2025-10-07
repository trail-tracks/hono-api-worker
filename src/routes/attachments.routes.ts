import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AttachmentsController } from '../controllers/attachments.controller';
import { AppBindings, AppVariables } from '../types/env';
import { uplaodAttachmentSchema } from '../dtos/upload-attachment.dto';

const attachmentsRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const attachmentsController = new AttachmentsController();

attachmentsRoutes.post(
  '/',
  zValidator('query', uplaodAttachmentSchema),
  authMiddleware,
  attachmentsController.upload.bind(attachmentsController),
);

export default attachmentsRoutes;
