# Environment Variables Setup

Copy `.env.example` to `.env` and fill in the following:

## Required Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (must match main app JWT_SECRET)
JWT_SECRET=your_jwt_secret_here_change_in_production

# Supabase Configuration (for fetching journal entries)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

## Security Notes

- Never commit `.env` file to git
- Use different JWT_SECRET in production
- Rotate API keys regularly
- Use environment-specific values (dev/staging/prod)

