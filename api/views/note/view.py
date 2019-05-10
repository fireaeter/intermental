import api.views.note.models as note_models
import api.views.notes.models as notes_models
import api.views.dataObjects as dataObjects
import api.errors as api_errors
import json
import ujson
from api.validator import GetNoteSchema, NewNoteSchema
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


@routes.view('/note')
class Book(web.View):

    @check_json_data
    async def get(self, data):
        import api.views.book.models as book_models
        schema = GetNoteSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book_name = data.get('book_name')
        blockchain_hash = data.get('hash')
        book = book_models.Book(name=book_name)
        note = note_models.Note(book=book, blockchain_hash=blockchain_hash)
        note = await note.get()
        if note is not None:
            return web.json_response(text=ujson.dumps(note), status=200)
        else:
            return web.json_response(status=404)

    @check_json_data
    async def post(self, data):
        import api.views.book.models as book_models
        schema = NewNoteSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book_name = data.get('book_name')
        book_password = data.get('book_password')
        header = data.get('header')
        content = data.get('content')
        note = note_models.Note(book=book_models.Book(name=book_name, password=book_password), blockchain_hash="")
        _note = dataObjects.Note(header=header, content=content, date=1)
        if await note.add(note=_note):
            return web.json_response(status=200)
        else:
            return web.json_response(status=400)

