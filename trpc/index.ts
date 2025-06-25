import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import pdfParse from 'pdf-parse';
import { callGeminiAPI } from '../utils/gemini';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
  analyze: procedure
    .input(z.unknown())
    .mutation(async ({ ctx }) => {
      const req: any = ctx.req;
      const files = req.files;

      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Authorization token is required'});

      if (token !== process.env.AUTH_TOKEN) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
      }

      if (!files.cv || !files.jobDescription) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Both CV and Job Description PDFs are required'});

      const cvText = await pdfParse(files.cv[0].buffer).then(res => res.text);
      const jdText = await pdfParse(files.jobDescription[0].buffer).then(res => res.text);

      const prompt = `Analyze the following job description and candidate CV. 
      Job Description:\n${jdText}
      ---
      Candidate CV:\n${cvText}
      ---
      Return a JSON object with the following structure:
      {
        "alignmentScore": number (0-100),
        "strengths": string[],
        "weaknesses": string[],
        "summary": string
      }`;

      const result = await callGeminiAPI(prompt, token);
      return result;
    }),
});

export type AppRouter = typeof appRouter;
