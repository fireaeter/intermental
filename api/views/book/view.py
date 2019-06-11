import ujson
import api.views.book.models as book_models
from aiohttp import web
from api.helpers.check_json_data import check_json_data
from api.validator import NewBookSchema, GetBookSchema
from api.route_table import routes


@routes.view('/book')
class Book(web.View):

    @routes.get('/book/{name}')
    async def get(self):
        schema = GetBookSchema()
        data = {
            'name': self.match_info['name']
        }
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        name = data.get('name')
        book = book_models.Book(name=name)
        book_info = await book.get_info()
        book_info = ujson.dumps(book_info)
        if book_info == "null":
            return web.json_response(status=404)
        return web.json_response(text=book_info, status=200)

    @check_json_data
    async def post(self, data):
        name = data.get('name')
        password = data.get('password')
        author = data.get('author')
        description = data.get('description')
        keywords = data.get('keywords')
        schema = NewBookSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book = book_models.Book(name=name, password=password, author=author, description=description, keywords=keywords)
        if await book.create():
            return web.json_response(status=200)
        else:
            return web.json_response(status=400)
