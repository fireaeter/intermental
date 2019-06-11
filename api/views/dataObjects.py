import attr
import calendar
import time
import api.config as config
from typing import List


@attr.s(slots=True)
class Book:
    name: str = attr.ib(default=None)
    password: str = attr.ib(default=None)
    description: str = attr.ib(default=None)
    created: int = attr.ib(default=calendar.timegm(time.gmtime()))
    author: str = attr.ib(default=None)
    ipfs_path = attr.ib(init=False)
    keywords: List = attr.ib(factory=list)

    # or set it to default
    def __attrs_post_init__(self):
        self.ipfs_path: str = config.IPFS_ROOT_PATH + "/%s" % self.name


@attr.s(slots=True)
class IpfsBlock:
    Name: str = attr.ib()
    Type: int = attr.ib()
    Size: int = attr.ib()
    Hash: str = attr.ib()
    Blocks: int = attr.ib(default=None)
    CumulativeSize: int = attr.ib(default=None)


@attr.s
class IpfsBlockList:
    blocks = attr.ib()


@attr.s(slots=True)
class Note:
    header: str = attr.ib()
    content: str = attr.ib()
    created: int = attr.ib(default=calendar.timegm(time.gmtime()))
