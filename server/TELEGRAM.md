# Telegram delivery setup
1. Create a bot with @BotFather using /newbot
2. Store TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID as Worker secrets, never in dist or Git
3. Set ALLOWED_ORIGINS to exact website origins, comma-separated
4. Configure BRIEF_RATE_LIMITER binding (for example 5 requests per 60 seconds per IP)
5. Deploy telegram-worker.mjs over HTTPS and set briefForm data-endpoint to that URL
6. Test with an explicitly authorized test submission and verify actual Telegram receipt before launch

The current website keeps data-endpoint empty until configuration is supplied. It never reports success without a successful Telegram API response.
