import { createClient } from "redis";
import { redisUrl } from "../../constants/services/redis";

export const redisClient = createClient(redisUrl);