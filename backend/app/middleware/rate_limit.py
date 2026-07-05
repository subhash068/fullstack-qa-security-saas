import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from collections import defaultdict

# Simple In-Memory Rate Limiter (For local testing environments)
class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_limit: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.client_records = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Filter timestamps outside window
        self.client_records[client_ip] = [
            t for t in self.client_records[client_ip]
            if current_time - t < self.window_seconds
        ]
        
        if len(self.client_records[client_ip]) >= self.requests_limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Rate limit exceeded."}
            )
            
        self.client_records[client_ip].append(current_time)
        return await call_next(request)
