# -*- coding: utf-8 -*-
import io
import os
from sys import getsizeof
import hashlib
import json
from typing import Dict, List
from datetime import datetime
import ipfsapi
from lib.exceptions import RuntimeException, BlockchainException


class _Body(object):
    LIMIT: int = 1000000  # in bytes
    PASSWORD: bytes = None

    __sign: str = None
    __bytes: bytes = None
    __content: str = None

    def __init__(self, content: dict):
        self.__content = content
        self.__bytes = json.dumps(self.__content).encode()

        if len(content) == 0:
            raise RuntimeException("Block body is empty")
        if self.size > _Body.LIMIT:
            raise RuntimeException("Block body size is too large.")

    def __str__(self):
        return json.dumps(self.__content)

    @property
    def content(self):
        return self.__content

    @property
    def size(self) -> int:
        return getsizeof(self.__bytes)

    @property
    def sign(self) -> str:
        if _Body.PASSWORD is None:
            raise RuntimeException("No password. Init Chain first")
        if self.__sign is None:
            self.__sign = hashlib.sha256(self.__bytes + _Body.PASSWORD).hexdigest()
        return self.__sign


class Block(object):
    __link: str = None  # sign of a previous block
    __body: _Body = None
    __date: int = None

    def __init__(self, body: dict):
        self.__body = _Body(body)

    @property
    def body(self) -> _Body:
        return self.__body

    @body.setter
    def body(self, data: dict):
        self.__body = _Body(data)

    @property
    def link(self) -> str:
        return self.__link

    @link.setter
    def link(self, sign: str):
        if self.__link is None:
            self.__link = sign

    @property
    def date(self):
        if self.__date is None:
            self.__date = int(datetime.utcnow().strftime("%s"))
        return self.__date

    @date.setter
    def date(self, date: int):
        self.__date = date


class _Meta(object):
    sign: str = None
    file: str = None

    def __init__(self, sign: str, file: str):
        self.sign = sign
        self.file = file


class Chain(object):
    ipfs: ipfsapi.Client = None
    ipfs_dir: str = None
    meta: Dict[str, _Meta] = {}
    index = 0
    iname: str = None  # first bock name
    block: Block = None  # last_block

    def __init__(self, ipfs_client: ipfsapi.Client, user_dir: str, password: str = None):
        if password:
            _Body.PASSWORD = password.encode()
        self.ipfs = ipfs_client
        self.ipfs_dir = user_dir
        self.index = 0
        self.iname = os.path.basename(user_dir)
        self._init_meta()

    def _init_meta(self):
        self.meta = {}
        entries = self.ipfs.files_ls(self.ipfs_dir)['Entries']
        if entries is None:
            return
        for entry in entries:
            path = "{}/{}".format(self.ipfs_dir, entry['Name'])
            string = self.ipfs.files_read(path)
            _dict = json.loads(string)
            self.meta[_dict['link']] = _Meta(_dict['sign'], entry['Name'])

    def add(self, data: dict):
        self.index = 0
        blk = Block(data)
        if blk.link is None and not len(self.meta):
            self._write(blk)
        else:
            self._check_duplicates(blk)
            self._init_block()
            self._init_last_block(self.block.body.sign)

            blk.link = self.block.body.sign
            self._write(blk)

    def _check_duplicates(self, b: Block):
        for meta in self.meta.values():
            if meta.sign == b.body.sign:
                raise BlockchainException("Block is already exists")

    def _init_last_block(self, link: str):
        self.index += 1
        if link not in self.meta:
            if self.index == len(self.meta):
                return
            raise BlockchainException("Data structure violation")

        self._init_block(link)
        return self._init_last_block(self.block.body.sign)

    def get_range(self, limit: int=10, offset: int=0) -> List[dict]:
        res = []
        length = len(self.meta)
        if offset > length:
            return res
        self._init_block()
        for i in range(length):
            if i >= offset and i < offset + limit:
                print(self.block.sign)
                res.append({
                    'content': self.block.body.content,
                     'hash': self.block.sign
                })
                res.append(self.block.body.content)
            if i > offset + limit:
                break
            self._init_block(self.meta[self.block.link].sign)
        return res

    def get(self, sign: str) -> dict:
        for meta in self.meta.values():
            if meta.sign == sign:
                blk = self._get_block(meta.file)
                return blk.body.content

    def _init_block(self, meta_index=None):
        if meta_index not in self.meta:
            return
        meta: _Meta = self.meta[meta_index]
        self.block = self._get_block(meta.file)
        if meta_index != self.block.link:
            raise BlockchainException("Data structure violation")

    def _get_block(self, file: str) -> Block:
        string = self.ipfs.files_read("{}/{}".format(self.ipfs_dir, file))
        _dict = json.loads(string)
        blk = Block(_dict['body'])
        blk.link = _dict['link']
        blk.date = _dict['date']
        blk.sign = _dict['sign']
        # print(blk.sign)
        return blk

    def _write(self, blk: Block):
        file_name = self.iname if blk.link is None else blk.body.sign
        path = '{}/{}.json'.format(self.ipfs_dir, file_name)
        bytesio = io.BytesIO(json.dumps({
            "date": blk.date,
            "link": blk.link,
            "body": blk.body.content,
            "sign": blk.body.sign
        }).encode())
        print('path->>>', path)
        print(self.ipfs_dir)
        print(file_name)
        self.ipfs.files_write(path, bytesio, create=True)
        self.meta[blk.link] = _Meta(blk.body.sign, file_name + ".json")