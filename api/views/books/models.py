import attr
from api.app import ipfs_client
import api.config as config


@attr.s(slots=True)
class Books(object):

    async def get_names(self) -> list:
        books = ipfs_client.files_ls(config.IPFS_ROOT_PATH)['Entries']
        if books is None:
            return []
        books_list = [book['Name'] for book in books]
        return books_list
