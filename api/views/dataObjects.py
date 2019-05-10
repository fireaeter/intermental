import ujson
import api.config as config
from dataclasses import dataclass, field
from typing import List


@dataclass
class Book:
    name: str = None
    password: str = None
    created: int = None
    author: str = None
    birthday: str = None
    keywords: List = field(default_factory=list)

    def __post_init__(self):
        self.ipfs_path: str = config.IPFS_ROOT_PATH + "/%s" % self.name

    def get_dict(self):
        resp = ujson.loads(ujson.dumps(self))
        del resp['password']
        return resp


@dataclass
class IpfsBlock:
    Blocks: int = None
    CumulativeSize: int = None
    Name: str = None
    Type: int = None
    Size: int = None
    Hash: str = None


@dataclass
class Note:
    header: str = None
    content: str = None
    date: int = None