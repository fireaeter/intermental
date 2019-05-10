import api.views.search.models as search_models
import api.errors as api_errors
import json
import ujson
from api.validator import SearchSchema
from aiohttp import web
from api.route_table import routes


def check_json_data(fn):
    async def wrapper(self):
        request = self.request
        request_ = request
        if isinstance(request, web.View):
            request_ = request.request
        assert isinstance(request_, web.Request)
        try:
            data = await request.json()
        except json.decoder.JSONDecodeError:
            return web.json_response(api_errors.JSON_PARSE_ERROR, status=400)
        return await fn(self=self, data=data)

    return wrapper


@routes.view('/search')
class Search(web.View):
    @check_json_data
    async def get(self, data):
        schema = SearchSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        query = data.get('query')
        search = search_models.Search(query=query)
        results = await search.search()
        return web.json_response(status=200, text=ujson.dumps(results))

