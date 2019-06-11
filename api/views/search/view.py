import ujson
import api.views.search.models as search_models
from api.helpers.check_json_data import check_json_data
from api.validator import SearchSchema
from aiohttp import web
from api.route_table import routes


@routes.view('/search')
class Search(web.View):
    @check_json_data
    async def post(self, data):
        schema = SearchSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        query = data.get('query')
        search = search_models.Search(query=query)
        results = await search.search()
        return web.json_response(status=200, text=ujson.dumps(results))

