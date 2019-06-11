import ujson
import api.views.notes.models as notes_models
from api.validator import GetNotesSchema
from aiohttp import web
from api.route_table import routes


@routes.view('/notes')
class Book(web.View):

    @routes.get('/notes/{book_name}')
    async def get(self):
        import api.views.book.models as book_models
        schema = GetNotesSchema()
        data = {
            'book_name': self.match_info['book_name']
        }
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book_name = data.get('book_name')
        book = book_models.Book(name=book_name)
        notes = notes_models.Notes(book=book)
        notes_list = await notes.get()
        return web.json_response(text=ujson.dumps(notes_list), status=200)

