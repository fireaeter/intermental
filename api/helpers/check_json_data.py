import api.errors as api_errors
import json
from aiohttp import web


def check_json_data(fn):
    async def wrapper(self):
        errors = api_errors.Errors()
        request = self.request
        request_ = request
        if isinstance(request, web.View):
            request_ = request.request
        assert isinstance(request_, web.Request)
        try:
            data = await request.json()
        except json.decoder.JSONDecodeError:
            await errors.push(api_errors.PARSING_JSON)
            return web.json_response(await errors.get(), status=400)
        return await fn(self=self, data=data)

    return wrapper
