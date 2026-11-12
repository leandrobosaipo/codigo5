import { login } from "../../../../_shared/admin-google";
import type { Env } from "../../../../_shared/bot/types";

export const onRequestGet: PagesFunction<Env> = ({ env }) => login(env);
