import { Hono } from "hono";
import { signup } from "../controller/institution.controller";

const dashboard = new Hono();

dashboard.post("/signup", signup);

export default dashboard;