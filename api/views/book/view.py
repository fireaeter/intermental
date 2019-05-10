import api.views.book.models as book_models
import json
import ujson
import api.errors as api_errors
from aiohttp import web
from api.validator import NewBookSchema, GetBookSchema
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


@routes.view('/book')
class Book(web.View):

    @check_json_data
    async def get(self, data):
        schema = GetBookSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        name = data.get('name')
        book = book_models.Book(name=name)
        book_info = await book.get_info()
        book_info = ujson.dumps(book_info)
        return web.json_response(text=book_info, status=200)

    @check_json_data
    async def post(self, data):
        print("data is ", data)
        name = data.get('name')
        password = data.get('password')
        author = data.get('author')
        keywords = data.get('keywords')
        schema = NewBookSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book = book_models.Book(name=name, password=password, author=author, keywords=keywords)
        if await book.create():
            return web.json_response(status=200)
        else:
            return web.json_response(status=400)
