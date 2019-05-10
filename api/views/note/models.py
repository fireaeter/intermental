import ujson
import api.views.dataObjects as dataObjects
from dataclasses import dataclass
from api.app import ipfs_client
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


@dataclass
class Note:
    import api.views.book.models as book_models
    blockchain_hash: str
    book: book_models.Book = book_models.Book()

    async def get(self):
        if not await self.book.check_exists():
            return None
        chain = Chain(ipfs_client, self.book.ipfs_path)
        note = chain.get(self.blockchain_hash)
        try:
            ipfs_hash = ipfs_client.files_stat("%s/%s.json" % (self.book.ipfs_path, self.blockchain_hash))
            response = {
                'ipfs_info': ipfs_hash,
                'note': note
            }
            return response
        except:
            return None

    async def add(self, note: dataObjects.Note) -> bool:
        chain = Chain(ipfs_client, self.book.ipfs_path, self.book.password)
        if not await self.book.check_exists():
            return False
        data = ujson.dumps(note)
        try:
            chain.add(data)
            return True
        except BlockchainException:
            return False
