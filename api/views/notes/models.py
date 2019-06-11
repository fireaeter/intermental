import attr
from api.app import ipfs_client
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


@attr.s
class Notes:
    import api.views.book.models as book_models
    book: book_models.Book = attr.ib(default=book_models.Book())

    async def get(self):
        if not await self.book.check_exists():
            return None
        try:
            chain = Chain(ipfs_client, self.book.ipfs_path)
            notes_list = chain.get_range(10, 0)
            return notes_list
        except BlockchainException:
            return None

