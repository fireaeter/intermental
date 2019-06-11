from sys import getsizeof
from marshmallow import (
    Schema,   validates_schema,
    fields, ValidationError
)


@validates_schema
def validate_book_name(name):
    if len(name) < 3:
        raise ValidationError('book name must be longer than 3.')


@validates_schema
def validate_book_password(password):
    if len(password) < 8:
        raise ValidationError('book password must be longer than 8.')


class NewBookSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate_book_name,
        error_messages={'required': 'book name is required.'}
    )
    password = fields.String(
        required=True,
        validate=validate_book_password,
        error_messages={'required': 'book password is required.'}
    )
    author = fields.String(
        required=True,
        error_messages={'required': 'book author is required.'}
    )
    description = fields.String()
    keywords = fields.String(
        required=True,
        error_messages={'required': 'book keywords is required.'}
    )
    @validates_schema
    def validate_book(self, data):
        if len(data['author']) < 3:
            raise ValidationError('book author name must be longer than 3.')
        try:
            if len(data['description']) < 10:
                raise ValidationError('book description must be longer than 10.')
            description_size = getsizeof(data['description'].encode())
            if description_size > 64000:
                raise ValidationError('description must be smaller than 64kb.')
        except KeyError:
            pass
        if data['keywords'].find(';') == -1:
            raise ValidationError('book keywords should be presented as: one;two;three.')


class GetBookSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate_book_name,
        error_messages={'required': 'book name is required.'}
)


class GetNotesSchema(Schema):
    book_name = fields.String(
        required=True,
        validate=validate_book_name,
        error_messages={'required': 'book name is required.'}
    )


class GetNoteSchema(Schema):
    book = fields.String(
        required=True,
        validate=validate_book_name,
        error_messages={'required': 'book name is required.'}
    )
    hash = fields.String(
        required=True,
        error_messages={'required': 'note hash is required.'}
    )

    @validates_schema
    def validate_note(self, data):
        if len(data['hash']) < 16:
            raise ValidationError('note hash is invalid.')


class GetIpfsNoteSchema(Schema):
    ipfs_hash = fields.String(
        required=True,
        error_messages={'required': 'ipfs hash is required.'}
    )
    @validates_schema
    def validate_ipfs_hash(self, data):
        ipfs_hash = data['ipfs_hash']
        if len(ipfs_hash) != 46 or ipfs_hash[0] != 'Q' or ipfs_hash[1] != 'm':
            raise ValidationError('ipfs hash is invalid.')


class NewNoteSchema(Schema):
    book_name = fields.String(
        required=True,
        validate=validate_book_name,
        error_messages={'required': 'book name is required.'}
    )
    book_password = fields.String(
        required=True,
        validate=validate_book_password,
        error_messages={'required': 'book password is required.'}
    )
    header = fields.String(
        required=True,
        error_messages={'required': 'note header is required.'}
    )
    content = fields.String(
        required=True,
        error_messages={'required': 'note content is required.'}
    )
    @validates_schema
    def validate_note(self, data):
        header_size = getsizeof(data['header'])
        if header_size > 255:
            raise ValidationError('header must be smaller than 255.')
        content_size = getsizeof(data['content'].encode())
        if content_size > 64000:
            raise ValidationError('content must be smaller than 64kb.')


class SearchSchema(Schema):
    query = fields.String(
        required=True,
        error_messages={'required': 'search query is required.'}
    )
