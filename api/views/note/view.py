import ujson
import api.views.note.models as note_models
import api.views.dataObjects as dataObjects
from api.helpers.check_json_data import check_json_data

from api.validator import GetNoteSchema, GetIpfsNoteSchema, NewNoteSchema
from aiohttp import web
from api.route_table import routes


@routes.view('/note')
class Note(web.View):
    @routes.get('/note/{book}/{hash}')
    async def get(self):
        import api.views.book.models as book_models
        book = self.match_info['book']
        hash = self.match_info['hash']
        data = {
            'book': book,
            'hash': hash
        }
        schema = GetNoteSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        book_name = data.get('book')
        blockchain_hash = data.get('hash')
        book = book_models.Book(name=book_name)
        note = note_models.Note(book=book, blockchain_hash=blockchain_hash)
        note = await note.get()
        if note is not None:
            return web.json_response(text=ujson.dumps(note), status=200)
        else:
            return web.json_response(status=404)

    @routes.get('/note/{ipfs_hash}')
    async def get_ipfs(self):
        data = {
            'ipfs_hash': self.match_info['ipfs_hash']
        }
        schema = GetIpfsNoteSchema()
        result = schema.load(data)
        if len(result.errors) > 0:
            return web.json_response({'errors': result.errors}, status=400)
        ipfs_hash = data.get('ipfs_hash')
        note = note_models.Note(ipfs_hash=ipfs_hash)
        ipfs_note = await note.get_ipfs()
        return web.json_response(text=ujson.dumps(ujson.loads(ipfs_note)))

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
        book = book_models.Book(name=book_name, password=book_password)
        note = note_models.Note(book=book)
        note_body = dataObjects.Note(header=header, content=content)
        if await note.add(body=note_body):
            return web.json_response(status=200)
        else:
            return web.json_response(status=400)

