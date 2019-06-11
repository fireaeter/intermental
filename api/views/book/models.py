import attr
import api.views.dataObjects as dataObjects
from api.app import ipfs_client
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


@attr.s(slots=True)
class Book(dataObjects.Book):
    async def check_exists(self) -> bool:
        import api.views.books.models as books_models
        books = books_models.Books()
        books_list = await books.get_names()
        return True if self.name in books_list else False

    async def get_first_block(self):
        if not await self.check_exists():
            return None
        try:
            chain = Chain(ipfs_client, self.ipfs_path)
            info = chain.get_range(1, 0)
            return info
        except BlockchainException:
            return None

    async def get_info(self):
        if not await self.check_exists():
            return None
        from api.views.notes.models import Notes
        notes = Notes(book=self)
        notes_list = await notes.get()
        notes_length = 0 if notes_list is None else len(notes_list)
        info = {
            'book': await self.get_first_block(),
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
        try:
            chain = Chain(ipfs_client, self.ipfs_path, self.password)
            data = attr.asdict(self, filter=attr.filters.exclude(attr.fields(Book).password))
            chain.add(data=data)
            return True
        except BlockchainException:
            return False
