import ujson
import api.views.dataObjects as dataObjects
from dataclasses import dataclass
from api.app import ipfs_client
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


@dataclass
class Notes:
    import api.views.book.models as book_models
    book: book_models.Book = book_models.Book()

    async def get(self):
        if not await self.book.check_exists():
            return None
        chain = Chain(ipfs_client, self.book.ipfs_path)
        book_notes = chain.get_range()
        return book_notes

