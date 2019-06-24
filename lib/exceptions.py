# -*- coding: utf-8 -*-

"""

:author: Victor Zemtsov <victor.zemtsov@gmail.com>
"""


class IntermentalException(Exception):
    pass


class RuntimeException(IntermentalException):
    pass


class BlockchainException(IntermentalException):
    pass
