import ujson
from api.app import ipfs_client
import api.config as config
import api.views.dataObjects as dataObjects
from lib.blockchain import Chain
from lib.exceptions import BlockchainException
from dataclasses import dataclass


@dataclass
class Books(object):
    import api.views.book.models as book_models
    book: book_models.Book = book_models.Book()

    async def get(self):
        books_dict = {}
        books = ipfs_client.files_ls(config.IPFS_ROOT_PATH)['Entries']
        if books is None:
            return {}
        for item in books:
            book = dataObjects.IpfsBlock(**item)
            books_dict[book.Name] = book
        return books_dict

    async def get_names(self):
        books = ipfs_client.files_ls(config.IPFS_ROOT_PATH)['Entries']
        if books is None:
            return {}
        books_list = [book['Name'] for book in books]
        return books_list
