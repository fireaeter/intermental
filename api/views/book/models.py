import ujson
import api.views.dataObjects as dataObjects
from api.app import ipfs_client
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


class Book(dataObjects.Book):
    async def check_exists(self) -> bool:
        import api.views.books.models as books_models
        books = books_models.Books()
        books_list = await books.get()
        for key in books_list:
            book = books_list[key]
            if book.Name == self.name:
                return True
        return False

    async def get_info(self):
        exists = await self.check_exists()
        if not exists:
            return None
        from api.views.notes.models import Notes
        notes = Notes(self)
        notes_list = await notes.get()
        notes_length = 0 if notes_list is None else len(notes_list)
        chain = Chain(ipfs_client, self.ipfs_path)
        info = {
            'book': chain.get_range(1, 0),
            'notes': {
                'total': notes_length
            },
            'ipfs': ipfs_client.files_stat(self.ipfs_path)
        }
        return info

    async def create(self) -> bool:
        if await self.check_exists():
            return False
        ipfs_client.files_mkdir(self.ipfs_path)
        chain = Chain(ipfs_client, self.ipfs_path, self.password)
        data = self.get_dict()
        chain.add(data=data)
        return True
