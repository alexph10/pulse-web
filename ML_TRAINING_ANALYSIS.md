# ML Training Analysis: What Pulse Actually Needs

## Key Finding: Pulse Doesn't Need Model Training (Yet)

Unlike ElevenLabs (which trains custom voice models), Pulse uses **pre-trained APIs** for everything. No custom model training is required for MVP.

---

## Current Features: All Use Pre-Trained APIs

### 1. Speech-to-Text (STT)
- **Current**: OpenAI Whisper API
- **Training Required**: NO
- **Why**: Whisper is pre-trained, works out of the box
- **Future**: Could fine-tune for mental health terminology, but not necessary

### 2. Text-to-Speech (TTS)
- **Current**: ElevenLabs API
- **Training Required**: NO
- **Why**: Using ElevenLabs' pre-trained models
- **Future**: Could clone user's voice for personalized responses, but not core feature

### 3. Mood Analysis
- **Current**: GPT-4 with prompts
- **Training Required**: NO (for MVP)
- **Why**: GPT-4 understands emotions, just needs good prompts
- **Future**: Could fine-tune for more accurate mental health mood classification

### 4. Pattern Detection
- **Current**: Claude 3.5 with prompts
- **Training Required**: NO (for MVP)
- **Why**: Claude can identify patterns in text, prompts guide it
- **Future**: Could train custom model on mental health patterns, but RAG is sufficient

### 5. Therapeutic Chat
- **Current**: Claude 3.5 with system prompts
- **Training Required**: NO (for MVP)
- **Why**: Claude understands therapy, prompts structure responses
- **Future**: Could fine-tune for consistent therapeutic tone/style

---

## Comparison: ElevenLabs vs Pulse

### ElevenLabs (Voice AI Company)
**What They Train:**
- Custom TTS models (their core product)
- Voice cloning models
- Voice conversion models
- Audio generation models

**Why They Need Training:**
- Voice synthesis is their core product
- They need unique, high-quality voices
- Competitive advantage requires custom models
- Large team, dedicated ML infrastructure

### Pulse (Mental Wellness App)
**What We Use:**
- Pre-trained APIs (Whisper, GPT-4, Claude, ElevenLabs)
- Prompt engineering
- RAG (Retrieval Augmented Generation)

**Why We Don't Need Training (Yet):**
- Not building voice models (using ElevenLabs)
- Not building language models (using OpenAI/Anthropic)
- Focus is on application, not model development
- Solo developer, limited resources
- Pre-trained models are sufficient for MVP

---

## Features That WOULD Need Custom Training (Future/Optional)

### 1. Crisis Detection Classifier (HIGH PRIORITY)
- **What**: Custom model to detect suicide/self-harm risk
- **Training Required**: YES
- **Why**: More accurate than keyword matching, reduces false positives
- **Data Needed**: 
  - 10,000+ labeled examples (crisis vs non-crisis)
  - Validated by mental health professionals
  - Anonymized crisis text samples
- **Approach**: 
  - Fine-tune BERT/RoBERTa for binary classification
  - Or use OpenAI fine-tuning on GPT-4
  - Deploy as separate service endpoint
- **When**: After MVP, when you have enough data (6-12 months)

### 2. Personalized Therapeutic Response Model (Optional)
- **What**: Custom model trained on validated therapy responses
- **Training Required**: YES (optional)
- **Why**: More consistent tone, brand-specific responses
- **Data Needed**: 
  - 1,000+ validated therapist responses
  - Reviewed by clinical advisors
  - Conversation pairs (user input → therapeutic response)
- **Approach**: Fine-tune GPT-4 or Claude
- **When**: Only if prompts + RAG aren't sufficient (12+ months)

### 3. Mental Health Mood Classifier (Optional)
- **What**: Custom model for mood classification in journal entries
- **Training Required**: YES (optional)
- **Why**: More accurate than GPT-4 for mental health contexts
- **Data Needed**:
  - 50,000+ labeled journal entries
  - Mood labels validated by therapists
  - Mental health-specific mood categories
- **Approach**: Fine-tune BERT or use OpenAI fine-tuning
- **When**: Only if current mood analysis is inaccurate (12+ months)

### 4. Long-Term Pattern Recognition (Optional)
- **What**: Custom model to detect mental health trends over months
- **Training Required**: YES (optional)
- **Why**: Better at identifying subtle patterns across time
- **Data Needed**:
  - Longitudinal data from users (6+ months)
  - Pattern labels (improving, declining, cyclical)
  - Validated by mental health professionals
- **Approach**: Time-series ML model or fine-tuned LLM
- **When**: Only if current pattern detection misses important trends (12+ months)

---

## Repository Split Implications

### What Actually Needs Separation

**Separate NOW (No Training Needed):**
- AI Service - Just API orchestration
  - OpenAI API calls (Whisper, GPT-4)
  - Anthropic API calls (Claude)
  - ElevenLabs API calls (TTS)
  - Prompt management
  - RAG knowledge base
  - Secrets management

**Separate LATER (If Training Models):**
- ML Training Service - Only if you decide to train crisis detection model
  - Training scripts
  - Data preparation
  - Model evaluation
  - Model registry

### Recommended Architecture

**Phase 1: MVP (Current)**
```
pulse-ai-service/
├── src/
│   ├── services/          # API calls only (no training)
│   ├── routes/           # API endpoints
│   ├── lib/
│   │   ├── prompts/      # Prompt engineering
│   │   └── knowledge-base/  # RAG (vector DB)
│   └── server.ts
└── NO training/ directory
```

**Phase 2: Crisis Detection (6-12 months)**
```
pulse-ai-service/
├── src/
│   ├── services/
│   ├── routes/
│   ├── lib/
│   ├── training/         # ADD ONLY IF TRAINING
│   │   └── crisis-detection/
│   └── server.ts
```

---

## Conclusion

**For Repository Split:**
- Extract AI service NOW (just API orchestration)
- NO model training infrastructure needed yet
- Keep it simple for solo dev
- Add training infrastructure later if/when needed

**When to Add Training:**
- After MVP launch
- When you have 10,000+ users
- When you have validated training data
- When prompts/RAG aren't sufficient
- When crisis detection needs custom model

**Bottom Line:**
Pulse is more like a "smart API orchestrator" than a "ML training company" (like ElevenLabs). The split is for **security and maintainability**, not for model training infrastructure.

