# CV-JD Analyzer API (Node.js + tRPC + Gemini)

This project sets up a Node.js server using tRPC that accepts two PDF files — a CV and a Job Description — and analyzes them using Google's Gemini AI. It returns a structured analysis including strengths, weaknesses, alignment score, and a summary.

---

## 🛠 Features

- Upload CV and JD as PDFs
- AI-powered structured analysis
- Simple REST + tRPC endpoint
- Token-based authentication with `.env`
- Built for Developer Experience (DX)

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/cosmosdsilva93/woolf-assignment.git
cd woolf-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in your root directory:

```env
WOOLF_GEMINI_TOKEN=your_gemini_api_token_sent_in_the_mail
AUTH_TOKEN=secret123
```

### 4. Start the Server

```bash
npm run start:dev

```

Server runs on `http://localhost:4000`

---

## 📤 API Usage

### POST /analyze

Accepts two PDF files: `cv` and `jobDescription`

**Authorization Header:**

```http
Authorization: Bearer secret123
```

**Curl Example:**

```bash
curl -X POST http://localhost:4000/analyze \
  -H "Authorization: Bearer secret123" \
  -F "cv=@./cv.pdf" \
  -F "jobDescription=@./jd.pdf"
```

**Response Format:**

```json
{
  "alignmentScore": 87,
  "strengths": ["JavaScript expertise", "Team collaboration"],
  "weaknesses": ["Lacks AWS certification"],
  "summary": "The candidate is a strong match for the job, with skills in frontend and backend."
}
```

---

## 📦 Stack

- **Node.js** + **Express**
- **tRPC**
- **Google Generative AI (Gemini)**
- **Multer** for file upload
- **pdf-parse** for PDF extraction
- **dotenv** for environment variables

---

## 📄 License

MIT
