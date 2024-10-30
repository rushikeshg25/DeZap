import { Helius } from "helius-sdk";
import dotenv from "dotenv";

dotenv.config();

const heliusClient = new Helius(process.env.API_KEY as string);

export default heliusClient;
