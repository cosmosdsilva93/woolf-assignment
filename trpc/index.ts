import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import pdfParse from 'pdf-parse';
import { callGeminiAPI } from '../utils/gemini';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;

const analyzeRouter = router({
  upload: procedure
    .input(z.unknown())
    .mutation(async ({ ctx }) => {
      const req: any = ctx.req;
      const files = req.files;
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) throw new Error('Missing Authorization token');
      if (!files.cv || !files.jobDescription) throw new Error('Both PDFs are required');

      const cvText = await pdfParse(files.cv[0].buffer).then(res => res.text);
      const jdText = await pdfParse(files.jobDescription[0].buffer).then(res => res.text);

      const prompt = `Job Description:\n${jdText}\n\nCandidate CV:\n${cvText}\n\nAnalyze the CV based on the job description. Provide:\n1. Strengths\n2. Weaknesses\n3. Match Percentage\n4. Suggestions to improve alignment.`;

      const result = await callGeminiAPI(prompt, token);
      return { result };
    }),
});

export const appRouter = router({
  analyze: analyzeRouter,
});

export type AppRouter = typeof appRouter;

export type { inferAsyncReturnType } from '@trpc/server';
