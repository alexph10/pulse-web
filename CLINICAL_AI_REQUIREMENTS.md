# Clinical-Grade AI Requirements for Pulse

**Document Purpose**: Comprehensive analysis of tools, frameworks, models, libraries, and APIs needed to build industry-standard mental health AI capabilities.

**Last Updated**: November 12, 2025

---

## Table of Contents
1. [Core Requirements](#core-requirements)
2. [AI Models & APIs](#ai-models--apis)
3. [Clinical Frameworks & Validation](#clinical-frameworks--validation)
4. [Infrastructure & Tools](#infrastructure--tools)
5. [Cost Analysis](#cost-analysis)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Compliance & Ethics](#compliance--ethics)

---

## Core Requirements

### What Clinical-Grade AI Needs

**1. Evidence-Based Therapeutic Frameworks**
- CBT (Cognitive Behavioral Therapy) protocol integration
- DBT (Dialectical Behavior Therapy) skills modules
- ACT (Acceptance and Commitment Therapy) principles
- Motivational Interviewing techniques

**2. Validated Assessment Tools**
- PHQ-9 (Depression screening)
- GAD-7 (Anxiety screening)
- PSS (Perceived Stress Scale)
- WEMWBS (Mental Wellbeing Scale)

**3. Safety & Crisis Management**
- Suicide risk detection
- Self-harm language identification
- Crisis resource escalation
- Immediate intervention protocols

**4. Privacy & Compliance**
- HIPAA compliance (if storing health data)
- GDPR compliance (EU users)
- End-to-end encryption
- Zero-knowledge architecture where possible

---

## AI Models & APIs

### Option 1: OpenAI GPT-4 (Current Choice)

**What You're Using Now:**
- Model: GPT-4 Turbo
- Current Implementation: Basic mood analysis in journal entries

**Upgrade Path for Clinical Use:**

**A. GPT-4 with Fine-Tuning**
- **Purpose**: Custom-trained on therapeutic conversation patterns
- **Cost**: $8.00 per 1M training tokens + $0.012 per 1K prompt tokens + $0.036 per 1K completion tokens
- **Training Data Needed**: 
  - 10,000+ validated therapy transcripts
  - Clinical psychology textbooks
  - Evidence-based treatment manuals
- **Pros**: Maintains conversational quality, can be therapy-specific
- **Cons**: Expensive to train, requires clinical validation

**B. GPT-4 with Structured Prompts (Recommended to Start)**
- **Purpose**: Use carefully crafted system prompts with clinical frameworks
- **Cost**: $0.01 per 1K prompt tokens + $0.03 per 1K completion tokens
- **Implementation**: 
  ```
  System Prompt includes:
  - CBT framework guidelines
  - Safety protocols
  - Therapeutic boundaries
  - Evidence-based response templates
  ```
- **Pros**: No training cost, faster iteration, easier validation
- **Cons**: Less specialized than fine-tuned model

**Monthly Cost Estimate (GPT-4 Structured Prompts):**
- 1,000 users, 5 journal entries per month average
- Each analysis: ~500 prompt tokens + ~200 completion tokens
- Cost: (5,000 requests × 0.5K × $0.01) + (5,000 × 0.2K × $0.03) = $25 + $30 = $55/month
- At 10,000 users: ~$550/month

---

### Option 2: Claude 3.5 (Anthropic)

**Why Consider:**
- Longer context window (200K tokens)
- Better safety guardrails built-in
- Constitutional AI training (aligns with therapeutic ethics)

**Pricing:**
- Claude 3.5 Sonnet: $3.00 per 1M input tokens + $15.00 per 1M output tokens
- Claude 3 Opus (most capable): $15.00 per 1M input + $75.00 per 1M output

**Monthly Cost Estimate (Claude 3.5 Sonnet):**
- Same usage as above: 5,000 requests/month
- Cost: (5,000 × 0.5K × $3/1M) + (5,000 × 0.2K × $15/1M) = $7.50 + $15 = $22.50/month
- At 10,000 users: ~$225/month

**Recommendation**: Claude 3.5 for therapeutic conversations (better safety), GPT-4 for structured analysis

---

### Option 3: Open-Source Models (Self-Hosted)

**A. Llama 3.1 (Meta) - 70B Parameters**
- **Purpose**: Self-hosted for privacy, fine-tune for therapy
- **Infrastructure**: 
  - AWS EC2 p4d.24xlarge (8x A100 GPUs): ~$32/hour
  - Or AWS SageMaker: ~$40/hour
  - Or Lambda Labs: ~$1.10/hour per A100
- **Pros**: Complete data control, no per-request costs after setup
- **Cons**: High infrastructure costs, requires ML expertise

**Monthly Cost (Self-Hosted Llama 3.1):**
- Lambda Labs: 8x A100 GPU instance
- 24/7 availability: 8 × $1.10/hour × 730 hours = $6,424/month
- Part-time (8 hours/day): 8 × $1.10 × 240 hours = $2,112/month
- **Only viable at high scale (50,000+ users)**

**B. Mistral 7B (Mistral AI)**
- **Purpose**: Smaller model, faster inference, cheaper hosting
- **Infrastructure**: Single A100 GPU sufficient
- **Cost**: ~$1.10/hour × 730 = $803/month for 24/7
- **Pros**: More affordable self-hosting, good performance
- **Cons**: Less capable than larger models

**C. BioMistral (Specialized Medical Model)**
- **Purpose**: Pre-trained on medical literature
- **Note**: Not specifically mental health, but closer to domain
- **Cost**: Same as Mistral 7B hosting

---

### Option 4: Specialized Mental Health APIs

**A. Woebot Health API (Enterprise)**
- **What**: FDA-cleared conversational AI for mental health
- **Pricing**: Enterprise only, estimated $10K-50K+ per year
- **Pros**: Clinically validated, regulatory approved
- **Cons**: Expensive, less customizable

**B. Wysa API**
- **What**: AI-powered mental health support platform
- **Pricing**: White-label licensing, estimated $5K-20K per year
- **Pros**: Proven in clinical settings, evidence-based
- **Cons**: Limited customization

**C. X2AI (Tess)**
- **What**: Mental health chatbot platform
- **Pricing**: Contact for enterprise (likely $10K+ annually)

**Recommendation**: These are too expensive for early stage. Build custom with GPT-4/Claude.

---

## Clinical Frameworks & Validation

### Required Libraries & Frameworks

**1. Natural Language Processing**

**A. Hugging Face Transformers**
- **Purpose**: Sentiment analysis, emotion detection, clinical language processing
- **Cost**: Free (open-source)
- **Models to Use**:
  - `mental/mental-bert-base-uncased` - Mental health specific BERT
  - `cardiffnlp/twitter-roberta-base-sentiment-latest` - Sentiment analysis
  - `j-hartmann/emotion-english-distilroberta-base` - Emotion classification
- **Installation**: `npm install @xenova/transformers` (runs in Node.js)
- **Infrastructure**: Can run on server CPU, ~2GB RAM per model

**B. spaCy with scispaCy**
- **Purpose**: Medical and clinical text processing
- **Cost**: Free (open-source)
- **Models**: `en_core_sci_md` (scientific/medical NLP)
- **Use Case**: Extract medical entities, clinical terminology

**2. Sentiment & Emotion Analysis**

**TextBlob / VADER**
- **Purpose**: Quick sentiment scoring for mood tracking
- **Cost**: Free
- **Accuracy**: Good for basic use, not clinical-grade alone
- **Use**: Supplement to more sophisticated analysis

**IBM Watson Tone Analyzer**
- **Purpose**: Emotion and tone detection in text
- **Cost**: 
  - Lite: 2,500 API calls/month free
  - Standard: $0.75 per 1,000 API calls
- **Monthly Cost**: 5,000 users × 5 entries = 25,000 calls = $18.75/month

**3. Clinical Assessment Tools**

**Custom Implementation Required**:
- PHQ-9 scoring algorithm (implement yourself, free)
- GAD-7 scoring algorithm (implement yourself, free)
- Columbia Suicide Severity Rating Scale (C-SSRS) - License required

**Alternative: M3 Checklist**
- Free, validated mental health screening
- Covers mood, anxiety disorders

---

### Crisis Detection & Safety

**1. Crisis Text Line API**
- **Purpose**: Real-time crisis counselor connection
- **Cost**: Free for nonprofits, contact for commercial
- **Integration**: Referral system when crisis detected

**2. Custom Crisis Keywords Database**
- **Build Yourself**: Curated list of crisis indicators
- **Sources**:
  - National Suicide Prevention Lifeline guidelines
  - Crisis Text Line patterns (public research)
  - Clinical psychology literature
- **Cost**: Free, requires clinical advisor review

**3. Regex + ML Hybrid Approach**
- **Regex**: Immediate detection of explicit crisis language
- **ML Model**: Context-aware risk assessment
- **OpenAI Moderation API**: Free content filtering
- **Total Cost**: Covered by your existing OpenAI plan

---

## Infrastructure & Tools

### Database & Storage

**1. Supabase (Current)**
- **Current Plan**: Likely Free or Pro
- **Needed for Clinical Scale**:
  - Pro Plan: $25/month (8GB database, 50GB bandwidth)
  - Team Plan: $599/month (unlimited seats, 50GB database)
- **Additional**:
  - Point-in-Time Recovery: $100/month (required for compliance)
  - Encrypted at rest: Included
- **Estimated**: $125/month (Pro + PITR) for up to 10,000 users

**2. Vector Database for Semantic Search**

**Pinecone**
- **Purpose**: Store and search therapy session embeddings, find similar patterns
- **Pricing**:
  - Starter: Free (100K vectors, 1 index)
  - Standard: $70/month (5M vectors)
  - Enterprise: Custom
- **Use Case**: "Find similar journal entries", "Pattern matching"
- **Estimated**: $70/month

**Alternatives**:
- **Weaviate** (open-source, self-hosted): Free + hosting costs (~$50/month)
- **Supabase pgvector** (built-in): Free with current plan, scales with DB

**Recommendation**: Start with Supabase pgvector (free), migrate to Pinecone if needed.

---

### Analytics & Monitoring

**1. Longitudinal Data Analysis**

**Python Libraries (Run in Backend)**:
- **pandas**: Time series analysis
- **scipy**: Statistical analysis
- **scikit-learn**: Pattern detection, clustering
- **statsmodels**: Regression, trend analysis
- **Cost**: Free (open-source)

**2. User Progress Tracking**

**PostHog** (Product Analytics)
- **Purpose**: Track user engagement, feature usage
- **Pricing**:
  - Free: 1M events/month
  - Paid: $0.00045 per event after free tier
- **Estimated**: Free tier sufficient for early stage

**3. Error Tracking & Logging**

**Sentry**
- **Current**: Likely already using or should be
- **Pricing**:
  - Developer: $0 (5K events/month)
  - Team: $29/month (50K events)
- **Estimated**: $29/month

---

### Security & Compliance

**1. Encryption**

**At Rest**: Supabase native (included)

**In Transit**: TLS 1.3 (Vercel/Next.js default)

**End-to-End Encryption** (for journal entries):
- **crypto-js**: Client-side encryption
- **libsodium.js**: Advanced cryptography
- **Cost**: Free (libraries)
- **Compute Overhead**: Minimal

**2. HIPAA Compliance** (if needed)

**Requirements**:
- Business Associate Agreement (BAA) with all vendors
- Supabase: $599/month Team Plan minimum for BAA
- Vercel: Enterprise plan (contact sales, ~$1K+/month)
- OpenAI: Enterprise plan (contact sales)

**Total HIPAA Compliance Add**: ~$2,000+/month minimum

**Alternative**: Don't store PHI (Protected Health Information)
- Position app as "wellness tool", not medical device
- Avoid diagnostic language
- Clear disclaimers
- No HIPAA required, saves $24K+/year

**Recommendation**: Start without HIPAA, transition later if needed.

---

### Development Tools

**1. Testing AI Responses**

**Promptfoo**
- **Purpose**: LLM testing and evaluation framework
- **Cost**: Free (open-source)
- **Use**: Test therapeutic response quality, safety

**LangSmith** (LangChain)
- **Purpose**: LLM observability, prompt engineering
- **Pricing**:
  - Developer: Free (5K traces/month)
  - Plus: $39/month (100K traces)
- **Estimated**: $39/month

**2. Prompt Management**

**Humanloop**
- **Purpose**: Prompt versioning, A/B testing
- **Pricing**:
  - Free: 1K logs/month
  - Growth: $150/month (50K logs)
- **Alternative**: Build custom (use Git for prompt versioning)
- **Estimated**: $0 (DIY initially)

**3. Fine-Tuning Platform**

**Weights & Biases**
- **Purpose**: ML experiment tracking
- **Cost**: Free for personal use, $50/month/user for teams
- **Use**: If fine-tuning models later

---

## Cost Analysis

### Scenario 1: Early Stage (1,000 Users)

**Monthly Costs**:

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI GPT-4 | AI analysis (5 entries/user/month) | $55 |
| Claude 3.5 | Therapeutic conversations (2/user/month) | $22.50 |
| Supabase Pro | Database + auth | $25 |
| Vercel Pro | Hosting | $20 |
| Sentry | Error tracking | $29 |
| PostHog | Analytics | $0 (free tier) |
| Pinecone | Vector search | $0 (use pgvector) |
| LangSmith | LLM monitoring | $39 |
| **TOTAL** | | **$190.50/month** |

**Per-User Cost**: $0.19/month

---

### Scenario 2: Growth Stage (10,000 Users)

**Monthly Costs**:

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI GPT-4 | AI analysis | $550 |
| Claude 3.5 | Therapeutic conversations | $225 |
| Supabase Pro + PITR | Database + backup | $125 |
| Vercel Pro | Hosting | $20 |
| Sentry Team | Error tracking | $29 |
| PostHog | Analytics | $45 (est.) |
| Pinecone Standard | Vector search | $70 |
| LangSmith Plus | LLM monitoring | $39 |
| **TOTAL** | | **$1,103/month** |

**Per-User Cost**: $0.11/month

---

### Scenario 3: Scale (100,000 Users)

**Monthly Costs**:

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI GPT-4 | AI analysis (negotiate volume discount) | $4,500 |
| Claude 3.5 | Therapeutic conversations | $2,250 |
| Supabase Team | Database + backup | $599 |
| Vercel Enterprise | Hosting | $1,000 (est.) |
| Sentry Business | Error tracking | $99 |
| PostHog | Analytics | $450 (est.) |
| Pinecone Enterprise | Vector search | $500 (est.) |
| LangSmith | LLM monitoring | $150 |
| Self-hosted Llama 3.1 | Reduce API costs | $2,112 (part-time) |
| **TOTAL** | | **$11,660/month** |

**Per-User Cost**: $0.12/month

**Note**: At this scale, self-hosting becomes cost-effective. Can reduce to ~$8K/month with optimization.

---

### Scenario 4: HIPAA Compliant (10,000 Users)

**Additional Costs**:

| Service | Add-On | Cost |
|---------|---------|------|
| Supabase Team (BAA) | HIPAA compliance | +$474/month |
| Vercel Enterprise (BAA) | HIPAA hosting | +$980/month |
| OpenAI Enterprise | HIPAA compliance | +$500+/month (est.) |
| Legal Review | HIPAA policies | $5,000 one-time |
| Compliance Audit | Annual requirement | $10,000/year |
| **TOTAL INCREASE** | | **+$1,954/month + legal** |

**Total Monthly**: $3,057/month (vs $1,103 non-HIPAA)

**Recommendation**: Avoid HIPAA initially. Reduces costs by 64%.

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1-2)

**Goal**: Clinical-grade sentiment analysis and mood tracking

**Tasks**:
1. Implement structured GPT-4 prompts with CBT framework
2. Add Hugging Face mental-bert for emotion detection
3. Create crisis keyword detection system
4. Build PHQ-9 and GAD-7 assessment tools
5. Add disclaimers and safety guardrails

**Tools Needed**:
- OpenAI GPT-4 API
- Hugging Face Transformers
- Supabase (current plan)

**Cost**: $55/month + existing costs

**Deliverable**: Journal entries analyzed with clinical framework, basic crisis detection

---

### Phase 2: Validation (Month 3-4)

**Goal**: Clinical validation and safety testing

**Tasks**:
1. Hire mental health professional consultant ($2K-5K one-time)
2. Test AI responses against therapeutic standards
3. Create response evaluation rubric
4. Implement feedback loops
5. User testing with mental health practitioners

**Tools Needed**:
- Promptfoo for testing
- LangSmith for monitoring
- PostHog for user analytics

**Cost**: $2K-5K one-time + $39/month ongoing

**Deliverable**: Clinically validated AI responses, safety protocols confirmed

---

### Phase 3: Advanced Features (Month 5-6)

**Goal**: Pattern recognition and longitudinal insights

**Tasks**:
1. Implement vector database (Supabase pgvector)
2. Build pattern matching algorithms
3. Create progress tracking visualizations
4. Add personalized insights based on history
5. Implement goal-setting recommendations

**Tools Needed**:
- Supabase pgvector
- Python backend for analytics
- Custom ML models

**Cost**: No additional costs

**Deliverable**: "You seem anxious when X happens", progress trends, personalized recommendations

---

### Phase 4: Therapeutic Conversations (Month 7-9)

**Goal**: Interactive AI-guided support

**Tasks**:
1. Integrate Claude 3.5 for conversations
2. Build CBT-guided conversation flows
3. Create DBT skills modules
4. Implement guided journaling prompts
5. Add reflection exercises

**Tools Needed**:
- Claude 3.5 API
- Conversation state management
- LangChain for flows

**Cost**: +$225/month (10K users)

**Deliverable**: Users can have therapeutic conversations, receive CBT/DBT guidance

---

### Phase 5: Scale & Optimize (Month 10-12)

**Goal**: Reduce costs, improve performance

**Tasks**:
1. Evaluate self-hosting for high usage
2. Fine-tune smaller models for specific tasks
3. Implement caching strategies
4. Optimize prompt engineering
5. A/B test response quality vs cost

**Tools Needed**:
- Potentially self-hosted Llama
- Fine-tuning infrastructure
- Advanced monitoring

**Cost**: Variable, goal is to reduce per-user cost

**Deliverable**: Optimized system, ready for scale

---

## Compliance & Ethics

### Legal Requirements

**1. Terms of Service**
- Must clearly state app is not medical advice
- Not a replacement for professional therapy
- Crisis disclaimer with hotline numbers

**2. Informed Consent**
- Users acknowledge AI limitations
- Understand data usage
- Opt-in for AI features

**3. Privacy Policy**
- GDPR compliant (EU users)
- Clear data retention policies
- User data deletion process

**Cost**: Legal template customization: $500-2,000 one-time

---

### Ethical Guidelines

**1. Therapeutic Boundaries**
- AI never diagnoses
- AI never prescribes
- AI never replaces human therapist

**2. Bias Mitigation**
- Test responses across demographics
- Avoid cultural assumptions
- Inclusive language

**3. Transparency**
- Users always know they're talking to AI
- Clear about AI capabilities and limitations
- Option to disable AI features

---

### Clinical Advisory Board

**UPDATED RECOMMENDATION**: Bootstrap approach for tight budgets

**Option 1: Pay-Per-Review Model ($100-300/month)**
- Find 1-2 licensed therapists on Upwork/Fiverr
- Pay $50-100 per review session
- Schedule 2-3 reviews per month
- Review AI prompts, sample responses, safety protocols

**Option 2: Psychology Grad Students ($50-200/month)**
- Master's/PhD students supervised by licensed professionals
- $25-50 per hour
- 2-4 hours per month
- Portfolio piece for them, expertise for you

**Option 3: Advisory Equity ($0/month upfront)**
- Offer 0.25-0.5% equity
- Vesting over 2-4 years
- 5-10 hours/month consultation
- No cash outlay now

**Option 4: Self-Training + Validation ($100-300 one-time)**
- Buy key textbooks ($70)
- One-time consultation with therapist ($100-200)
- Recruit therapist users for free accounts (feedback)
- Quarterly check-ins as budget allows

**When to Upgrade**: Hire full clinical advisors ($1,500/month) when you hit $5K-10K MRR

---

## Recommended Stack (Final)

### For Bootstrap Stage (Best ROI)

**AI Layer:**
- Primary: OpenAI GPT-4 with enhanced therapeutic prompts ($55/month)
- Sentiment: Hugging Face mental-bert (free, self-hosted) OR continue GPT-4
- Safety: Custom crisis detection + OpenAI moderation (free)
- Knowledge: RAG with Supabase pgvector ($0, included)

**Infrastructure:**
- Database: Supabase Pro ($25/month)
- Hosting: Vercel Pro ($20/month)
- Monitoring: Sentry ($29/month) + LangSmith ($39/month)

**Validation:**
- Self-education: Clinical textbooks ($70 one-time)
- Optional: Grad student monthly review ($50-100/month)

**Total:** $168-268/month operating + $70-220 one-time setup

**No clinical advisors required initially.**

---

### When to Upgrade

**Add Claude 3.5**: When you have interactive chat feature (Phase 4)
- Cost increase: +$225/month

**Add Pinecone**: When pattern matching is critical (5,000+ users)
- Cost increase: +$70/month

**Add Self-Hosting**: At 50,000+ users for cost reduction
- Cost increase: +$2,112/month initially, saves money at scale

**HIPAA Compliance**: Only if pivoting to medical device
- Cost increase: +$1,954/month + legal fees
- Requires business justification (insurance reimbursement, B2B sales)

---

## Risk Mitigation

### Technical Risks

**1. AI Hallucinations**
- **Risk**: Model generates harmful advice
- **Mitigation**: 
  - Structured prompts with strict guidelines
  - Post-processing validation
  - Human review of flagged responses

**2. Crisis Misdetection**
- **Risk**: Miss genuine crisis or false positives
- **Mitigation**:
  - Multi-layer detection (regex + ML + human escalation)
  - Always show crisis resources prominently
  - User feedback on crisis detection accuracy

**3. Data Breach**
- **Risk**: Sensitive mental health data exposed
- **Mitigation**:
  - End-to-end encryption for journal entries
  - Minimal PII storage
  - Regular security audits
  - Incident response plan

---

### Business Risks

**1. Regulatory Changes**
- **Risk**: New laws classify app as medical device
- **Mitigation**:
  - Monitor FDA guidance on digital health
  - Design for wellness, not diagnosis
  - Legal review every 6 months

**2. Liability**
- **Risk**: User harm attributed to app advice
- **Mitigation**:
  - Strong disclaimers
  - Crisis escalation protocols
  - Professional liability insurance ($1K-3K/year)
  - Clinical advisor oversight

**3. Reputational**
- **Risk**: Bad press from AI failure
- **Mitigation**:
  - Transparency about limitations
  - User education
  - Gradual feature rollout with testing
  - Crisis communication plan

---

## Success Metrics

### Clinical Quality Metrics

**1. Response Appropriateness**
- Target: 95%+ therapist approval rating
- Method: Random sample review by clinical advisors

**2. Crisis Detection Accuracy**
- Target: 99%+ sensitivity (catch all true crises)
- Acceptable: 10-20% false positive rate (err on safe side)

**3. User Safety**
- Target: Zero adverse events attributed to AI advice
- Method: Incident tracking, user feedback

**4. Therapeutic Alliance**
- Target: Users feel "heard" and "understood" (>4/5 rating)
- Method: Post-interaction surveys

---

### Technical Performance Metrics

**1. Response Time**
- Target: <2 seconds for AI analysis
- Target: <5 seconds for therapeutic conversation

**2. Uptime**
- Target: 99.9% availability
- Critical: Crisis resources always accessible

**3. Cost Efficiency**
- Target: <$0.15 per user per month at scale
- Method: Optimize prompts, cache, self-host strategically

---

## Conclusion

### Key Takeaways

**1. Start Simple, Validate Early**
- Don't over-engineer initially
- Get clinical validation before scale
- User safety is paramount

**2. Cost-Effective Path**
- $168/month technical costs (early stage)
- $1,500/month clinical advisors (essential)
- $1,668/month total operating costs
- Scales efficiently to $0.11/user at 10K users

**3. Quality Over Features**
- One clinically-validated feature > ten mediocre features
- Focus on sentiment analysis and crisis detection first
- Add complexity only after validation

**4. Avoid HIPAA Initially**
- Saves $24K+/year
- Position as wellness tool
- Transition later if business model requires

**5. Clinical Partnership Is Essential**
- Not optional for credibility
- $1.5K-3K/month is best money spent
- Protects users and business

---

### Next Steps

**Immediate (This Week)**:
1. Review this document with team
2. Decide on Phase 1 scope
3. Budget approval for clinical advisors

**Short-Term (Month 1)**:
1. Set up experimental/ directory structure
2. Hire first clinical advisor
3. Implement structured GPT-4 prompts with CBT framework
4. Build crisis detection system

**Medium-Term (Month 2-3)**:
1. Validate AI responses with advisor
2. User testing with mental health practitioners
3. Iterate based on feedback
4. Launch Phase 1 features to beta users

**Long-Term (Month 4-12)**:
1. Follow phased roadmap
2. Add features incrementally
3. Scale infrastructure as needed
4. Optimize costs continuously

---

### Questions to Answer Before Starting

**1. Target User Profile**
- Who are we serving? (Age, severity of symptoms, etc.)
- Are we wellness-focused or clinical-focused?
- What outcomes do we promise?

**2. Business Model**
- Subscription? Freemium? B2B?
- Does business model require HIPAA?
- What's lifetime value per user?

**3. Risk Tolerance**
- Comfortable with wellness positioning vs medical device?
- Budget for clinical advisors?
- Timeline for clinical validation?

**4. Technical Capacity**
- In-house ML expertise?
- Need to hire specialists?
- Comfort with Python backend for analytics?

---

## Appendix: Clinical Advisor Interview Questions

When hiring mental health advisors, ask:

**1. Clinical Experience**
- Years in practice?
- Specialization (CBT, DBT, trauma, etc.)?
- Experience with digital health?

**2. Understanding of AI**
- Familiar with AI limitations?
- Comfortable with AI-augmented care?
- Views on AI in mental health?

**3. Availability**
- Hours per month available?
- Response time for urgent reviews?
- Long-term commitment?

**4. Ethical Stance**
- Red flags for AI mental health tools?
- Non-negotiables for user safety?
- Thoughts on AI replacing therapists?

**Ideal Advisor**: 5+ years clinical experience, familiar with digital health, pragmatic about AI (sees benefits AND risks), available 10-15 hours/month, passionate about accessible mental health care.

---

## AI Implementation: No Model Training Required

### THE REALITY: GPT-4 and Claude Already Know Therapy

Modern LLMs (GPT-4, Claude 3.5) were trained on:
- Millions of psychology textbooks
- Therapy research papers
- Clinical treatment manuals
- Public therapy transcripts
- Medical literature

**The problem is NOT knowledge - it's APPLICATION.**

You don't need to train a model. You need to teach existing models:
- WHEN to use CBT vs DBT
- HOW to structure therapeutic responses
- WHAT boundaries to maintain
- HOW to detect crisis situations

---

### Three Approaches (No Custom Model Training)

### Approach 1: Enhanced Prompt Engineering (START HERE)

**What it is:**
Give GPT-4/Claude detailed instructions on how to respond therapeutically through system prompts.

**Implementation:**
```typescript
const THERAPEUTIC_SYSTEM_PROMPT = `
You are a mental health wellness AI trained in evidence-based practices.

CORE FRAMEWORKS:
- CBT: Identify thoughts → feelings → behaviors patterns
- DBT: Distress tolerance, emotion regulation, mindfulness
- ACT: Values-based living, psychological flexibility
- Motivational Interviewing: Collaborative exploration

RESPONSE STRUCTURE:
1. VALIDATE emotion first ("That sounds really difficult")
2. EXPLORE gently ("Tell me more about that")
3. IDENTIFY patterns (CBT technique)
4. OFFER coping skills (DBT) when appropriate
5. ENCOURAGE professional help for serious concerns

SAFETY RULES:
- NEVER diagnose
- NEVER prescribe
- NEVER replace therapy
- ALWAYS provide crisis resources when needed

CRISIS KEYWORDS: suicide, self-harm, ending it all, want to die
→ Immediately provide: 988 Lifeline, Crisis Text Line (741741)

Now respond to the user's journal entry therapeutically.
`;
```

**Time Investment**: 20-40 hours reading clinical books + writing prompts
**Cost**: $50-70 (textbooks)
**Effectiveness**: 70-80% of what fine-tuning would achieve
**Ongoing Cost**: $0 additional (same API pricing)

**Recommended Books:**
- "Cognitive Behavior Therapy: Basics and Beyond" - Judith Beck ($50)
- "DBT Skills Training Manual" - Marsha Linehan ($40)

---

### Approach 2: RAG (Retrieval Augmented Generation) - RECOMMENDED

**What it is:**
Store clinical knowledge in a database, retrieve relevant techniques, provide to GPT-4/Claude as context.

**Why it's better than prompting alone:**
- More specific responses
- Can cite sources ("According to DBT Skills Training...")
- Easy to update and improve
- Transparent (you control what AI knows)
- No model training required

**How it works:**

**Step 1: Build Knowledge Base**
```typescript
// lib/clinical-knowledge.ts
export const clinicalKnowledge = [
  {
    category: "anxiety_coping",
    framework: "DBT",
    technique: "TIPP Skills",
    description: "Temperature: Ice/cold water. Intense exercise: Quick burst. Paced breathing: Slow, deep. Paired muscle relaxation: Tense and release.",
    whenToUse: "Acute anxiety, panic, overwhelming emotions",
    source: "DBT Skills Training Manual, Linehan 2015"
  },
  {
    category: "negative_thoughts",
    framework: "CBT",
    technique: "Cognitive Restructuring",
    description: "Identify thought → Examine evidence → Generate alternatives",
    whenToUse: "Cognitive distortions (all-or-nothing, catastrophizing)",
    source: "Beck Institute CBT Manual"
  }
  // ... 100-500 more entries
];
```

**Step 2: Store in Supabase with Vector Search**
```sql
create extension if not exists vector;

create table clinical_knowledge (
  id serial primary key,
  category text,
  framework text,
  technique text,
  description text,
  when_to_use text,
  source text,
  embedding vector(1536)
);

create index on clinical_knowledge 
  using ivfflat (embedding vector_cosine_ops);
```

**Step 3: Retrieve + Generate**
```typescript
async function analyzeWithRAG(journalEntry: string) {
  // 1. Get embedding
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: journalEntry
  });

  // 2. Find relevant techniques
  const { data: techniques } = await supabase.rpc(
    'match_clinical_knowledge',
    { query_embedding: embedding.data[0].embedding }
  );

  // 3. Build context
  const context = techniques
    .map(t => `${t.framework} - ${t.technique}: ${t.description}`)
    .join('\n\n');

  // 4. Generate response with context
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: THERAPEUTIC_SYSTEM_PROMPT },
      { role: "user", content: `
        Relevant techniques:
        ${context}
        
        Journal entry: "${journalEntry}"
      `}
    ]
  });
}
```

**Time Investment**: 30-40 hours building knowledge base
**Cost**: 
- Embeddings: $0.02 per 1M tokens (essentially free)
- Storage: Included in Supabase
- Total: $0 additional
**Effectiveness**: 85-90% of custom trained model
**Maintenance**: Easy to add/update techniques

---

### Approach 3: Fine-Tuning (ONLY IF NEEDED LATER)

**What it is:**
Actually train GPT-4 on custom therapy conversation data to learn therapeutic style.

**When to do it:**
- ONLY after exhausting prompting + RAG
- You have $200-500 budget
- You have 1,000+ validated examples
- You need very consistent tone/style

**How it works:**

**Step 1: Create Training Data (1,000+ examples)**
```jsonl
{"messages": [
  {"role": "system", "content": "Therapeutic AI prompt..."},
  {"role": "user", "content": "I feel worthless"},
  {"role": "assistant", "content": "I hear that you're feeling really down on yourself. Those feelings are valid. Can you tell me what's been happening that contributes to these feelings? Sometimes exploring the thoughts behind worthlessness helps us find patterns."}
]}
```

**Step 2: Fine-Tune**
```bash
openai api fine_tuning.jobs.create \
  -t training_data.jsonl \
  -m gpt-4-0613
```

**Step 3: Use Custom Model**
```typescript
const response = await openai.chat.completions.create({
  model: "ft:gpt-4-0613:your-org::8HGlUdNo",
  messages: [{ role: "user", content: journalEntry }]
});
```

**Time Investment**: 60-80 hours creating training data
**Cost**: 
- Training: $8 per 1M tokens (approx $80-200 one-time)
- Inference: Same as regular GPT-4
- Total: $80-200 one-time
**Effectiveness**: 95% (diminishing returns)
**When**: Only after validating prompting doesn't work

**Note**: Most mental health apps never need this.

---

### Recommended Approach: Hybrid

**Phase 1: Enhanced Prompting (Week 1)**
- Buy 1-2 clinical textbooks ($50-70)
- Read and take notes (20 hours)
- Write comprehensive system prompt
- Test with 50 sample journal entries
- Refine based on results

**Phase 2: Build Knowledge Base (Week 2-3)**
- Extract 100-200 techniques from books
- Structure as JSON with sources
- Implement Supabase vector storage
- Add retrieval to API routes
- Test improvement over prompt-only

**Phase 3: Validate (Month 2)**
- Beta test with 50 users
- Add "Was this helpful?" feedback
- Manually review flagged responses
- Expand knowledge base based on gaps
- Consider paid grad student review ($50-100)

**Phase 4: Fine-Tune (Month 3+ if needed)**
- Only if consistency isn't good enough
- Collect 1,000+ validated examples
- Budget $200 for training
- A/B test against RAG approach

---

### Which AI to Use?

**GPT-4 (OpenAI) - RECOMMENDED FOR STRUCTURED TASKS**

**Pros:**
- You're already using it
- Excellent at following complex instructions
- Good at therapeutic language
- Great for analysis and pattern recognition

**Cons:**
- Can be verbose
- Sometimes over-suggests

**Best for:**
- Journal mood analysis
- Pattern detection
- Structured assessments (PHQ-9, GAD-7)

**Pricing:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

---

**Claude 3.5 (Anthropic) - RECOMMENDED FOR CONVERSATIONS**

**Pros:**
- More naturally empathetic tone
- Better at nuanced emotional situations
- Stronger built-in safety guardrails (Constitutional AI)
- Longer context window (200K tokens)

**Cons:**
- Slightly more expensive for short responses
- Sometimes overly cautious with disclaimers

**Best for:**
- Therapeutic conversations
- Complex emotional situations
- User-facing chat features

**Pricing:**
- Input: $3 per 1M tokens (actually cheaper!)
- Output: $15 per 1M tokens

**Recommendation: Use BOTH strategically**
- GPT-4: Backend analysis, mood tracking, pattern recognition
- Claude 3.5: Frontend conversations, therapeutic responses

---

### Free Learning Resources

**Online Courses:**
- "The Science of Well-Being" (Yale) - Coursera (FREE)
- "Introduction to Psychology" - Coursera/edX (FREE)
- "Positive Psychology" - Coursera (FREE)

**YouTube Channels:**
- Dr. Todd Grande - Clinical psychology insights
- Therapy in a Nutshell - CBT techniques explained
- The School of Life - Emotional intelligence

**Clinical Resources:**
- Beck Institute (beckinstitute.org) - Free CBT resources
- Behavioral Tech - DBT skills and guidelines
- SAMHSA - Evidence-based practice guidelines
- Google Scholar / PubMed - Research papers

**Time Investment:** 40-60 hours over 2 months for solid foundation

---

### Implementation Roadmap

**This Weekend (4 hours):**
1. Create `lib/clinical-prompts.ts` with therapeutic system prompt
2. Update `app/api/analyze-patterns/route.ts` to use new prompt
3. Test with 10-20 sample journal entries
4. Refine prompt based on results

**Week 1 (20 hours):**
1. Read CBT textbook chapters (10 hours)
2. Expand system prompt with learned frameworks (3 hours)
3. Create crisis detection keywords list (2 hours)
4. Test with 50 diverse journal entries (3 hours)
5. Document response patterns (2 hours)

**Week 2-3 (30 hours):**
1. Extract 100 clinical techniques from books (15 hours)
2. Structure as JSON knowledge base (5 hours)
3. Set up Supabase vector storage (3 hours)
4. Implement RAG in API routes (5 hours)
5. Test and compare to prompt-only approach (2 hours)

**Month 2 (ongoing):**
1. Beta test with 50 users
2. Collect feedback
3. Add "Was this helpful?" ratings
4. Manually review concerning responses
5. Expand knowledge base
6. Consider grad student consultation ($50-100)

---

## Updated Cost Analysis - Bootstrap Approach

### Early Stage (1,000 Users)

**One-Time Costs:**

| Item | Cost |
|------|------|
| Clinical textbooks (2 books) | $70 |
| Optional: Grad student consultation (1 hour) | $50 |
| Optional: Licensed therapist review (1 session) | $100 |
| **TOTAL ONE-TIME** | **$120-220** |

**Monthly Operating Costs:**

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI GPT-4 | AI analysis (enhanced prompts) | $55 |
| Supabase Pro | Database + pgvector | $25 |
| Vercel Pro | Hosting | $20 |
| Sentry | Error tracking | $29 |
| LangSmith | LLM monitoring | $39 |
| **TOTAL MONTHLY** | | **$168** |

**Optional Ongoing Validation:**
- Grad student monthly review (1 hour): +$50/month
- Quarterly therapist review: +$67/month (amortized)

**Total with validation: $168-285/month**

**Per-User Cost: $0.17-0.29/month**

**This is 84% cheaper than original $1,668/month estimate.**

---

### Growth Stage (10,000 Users)

**Monthly Costs:**

| Service | Purpose | Cost |
|---------|---------|------|
| OpenAI GPT-4 | Analysis | $550 |
| Claude 3.5 | Conversations (optional) | $225 |
| Supabase Pro + PITR | Database + backup | $125 |
| Vercel Pro | Hosting | $20 |
| Sentry Team | Error tracking | $29 |
| PostHog | Analytics | $45 |
| Pinecone | Vector search (if needed) | $70 |
| LangSmith Plus | LLM monitoring | $39 |
| Grad student advisor | Monthly validation | $100 |
| **TOTAL** | | **$1,203** |

**Per-User Cost: $0.12/month**

**When to upgrade to full clinical advisor ($1,500/month):**
- You're making $5K+ MRR
- User base is 20K+
- You're adding diagnostic features
- Legal/compliance requires it

---

## Document Maintenance

**Review Frequency**: Quarterly or when major changes occur

**Owner**: Technical Lead + Clinical Advisor

**Version History**:
- v1.0 - November 12, 2025 - Initial comprehensive requirements analysis

**Feedback**: Add notes in `experimental/research/feedback.md`

---

**END OF DOCUMENT**

This document provides a foundation for building clinical-grade AI capabilities. Update as you learn, grow, and validate. Quality and safety first, always.
