import 'dotenv/config';
import { Nuclia } from '@nuclia/core';

export const nuclia = new Nuclia({
  backend: process.env.BACKEND,
  zone: process.env.ZONE,
  knowledgeBox: process.env.KNOWLEDGE_BOX_ID,
  kbToken: process.env.KB_TOKEN,
});