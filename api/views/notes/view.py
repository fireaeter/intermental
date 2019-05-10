import api.views.notes.models as notes_models
import api.views.dataObjects as dataObjects
import api.errors as api_errors
import json
import ujson
from api.validator import GetNotesSchema, NewNoteSchema
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


@routes.view('/notes')
class Book(web.View):

    @check_json_data
    async def get(self, data):
        import api.views.book.models as book_models
        schema = GetNotesSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book_name = data.get('book_name')
        book = book_models.Book(name=book_name)
        notes = notes_models.Notes(book=book)
        notes_list = await notes.get()
        return web.json_response(text=ujson.dumps(notes_list), status=200)

