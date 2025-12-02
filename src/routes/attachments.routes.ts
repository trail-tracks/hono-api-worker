import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AttachmentsController } from '../controllers/attachments.controller';
import { DeleteAttachmentsController } from '../controllers/delete-attachments.controller';
import { AppBindings, AppVariables } from '../types/env';
import { uploadAttachmentSchema } from '../dtos/upload-attachment.dto';

const attachmentsRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const attachmentsController = new AttachmentsController();
const deleteAttachmentsController = new DeleteAttachmentsController();

attachmentsRoutes.post(
  '/',
  zValidator('query', uploadAttachmentSchema),
  authMiddleware,
  attachmentsController.upload.bind(attachmentsController),
);

attachmentsRoutes.delete(
  '/:id',
  authMiddleware,
  deleteAttachmentsController.delete.bind(deleteAttachmentsController),
);

export default attachmentsRoutes;
