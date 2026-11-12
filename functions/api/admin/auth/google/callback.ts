import { finishLogin } from "../../../../_shared/admin-google";
import type { Env } from "../../../../_shared/bot/types";

export const onRequestGet: PagesFunction<Env> = ({ request, env }) => finishLogin(request, env);
