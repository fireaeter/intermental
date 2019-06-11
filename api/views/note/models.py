import attr
import ujson
import api.views.dataObjects as dataObjects
from api.app import ipfs_client, ipfs_exceptions
from lib.blockchain import Chain
from lib.exceptions import BlockchainException


@attr.s(slots=True)
class Note:
    import api.views.book.models as book_models
    blockchain_hash: str = attr.ib(default='')
    ipfs_hash: str = attr.ib(default='')
    book: book_models.Book = attr.ib(default=book_models.Book())

    async def get(self):
        if not await self.book.check_exists():
            return None
        book_info = await self.book.get_first_block()
        self.book.ipfs_path = book_info[0]['content']['ipfs_path']
        try:
            chain = Chain(ipfs_client, self.book.ipfs_path)
            note = chain.get(self.blockchain_hash)
        except BlockchainException:
            return None
        try:
            ipfs_hash = ipfs_client.files_stat("%s/%s.json" % (self.book.ipfs_path, self.blockchain_hash))
            data = {
                'ipfs_info': ipfs_hash,
                'note': ujson.loads(note)
            }
            return data
        except ipfs_exceptions.ErrorResponse:
            return None

    # TODO check exists file. may be check dht for it
    async def get_ipfs(self):
        ipfs_client.get(self.ipfs_hash)
        return ipfs_client.cat(self.ipfs_hash)

    async def add(self, body: dataObjects.Note) -> bool:
        chain = Chain(ipfs_client, self.book.ipfs_path, self.book.password)
        if not await self.book.check_exists():
            return False
        data = ujson.dumps(body)
        try:
            chain.add(data)
            return True
        except BlockchainException:
            return False
