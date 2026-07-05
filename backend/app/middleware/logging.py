import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api_logger")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(
            f"Method: {request.method} Path: {request.url.path} "
            f"Status: {response.status_code} Duration: {process_time:.2f}ms"
        )
        return response
