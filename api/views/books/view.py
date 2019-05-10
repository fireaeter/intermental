import ujson
import api.views.books.models as books_models
from aiohttp import web
from api.route_table import routes


@routes.view('/books')
class Book(web.View):
    async def get(self):
        books = books_models.Books()
        books_names = await books.get_names()
        return web.json_response(text=ujson.dumps(books_names), status=200)
