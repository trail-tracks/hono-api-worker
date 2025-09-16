import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { editSchema } from '../dtos/edit.dto';
import { EditEntityController } from '../controllers/edit-entity.controller';

type Env = { DB: D1Database };

const authRoutes = new Hono<{ Bindings: Env }>();
const editEntityController = new EditEntityController();

authRoutes.put(
  '/edit',
  zValidator('json', editSchema),
  editEntityController.edit.bind(editEntityController),
);

export default authRoutes;
