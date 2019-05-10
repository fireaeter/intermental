from marshmallow import fields, validates, Schema, ValidationError


class NewBookSchema(Schema):
    name = fields.String(
        required=True,
        error_messages={'required': 'book name is required'}
    )
    password = fields.String(
        required=True,
        error_messages={'required': 'book password is required'}
    )
    author = fields.String(
        required=True,
        error_messages={'required': 'book author is required'}
    )
    keywords = fields.String(
        required=True,
        error_messages={'required': 'book keywords is required'}
    )


class GetBookSchema(Schema):
    name = fields.String(
        required=True,
        error_messages={'required': 'book name is required'}
    )


class GetNotesSchema(Schema):
    book_name = fields.String(
        required=True,
        error_messages={'required': 'book name is required'}
)


class GetNoteSchema(Schema):
    book_name = fields.String(
        required=True,
        error_messages={'required': 'book name is required'}
    )
    hash = fields.String(
        required=True,
        error_messages={'required': 'note hash is required'}
    )


class NewNoteSchema(Schema):
    book_name = fields.String(
        required=True,
        error_messages={'required': 'book name is required'}
    )
    book_password = fields.String(
        required=True,
        error_messages={'required': 'book password is required'}
    )
    header = fields.String(
        required=True,
        error_messages={'required': 'note header is required'}
    )
    content = fields.String(
        required=True,
        error_messages={'required': 'note content is required'}
    )


class SearchSchema(Schema):
    query = fields.String(
        required=True,
        error_messages={'required': 'search query is required'}
    )
from sys import getsizeof
from marshmallow import (
    Schema, pre_load, pre_dump, post_load, validates_schema,
    validates, fields, ValidationError
)


class UserSchema(Schema):
    login = fields.String(required=True)
    password = fields.String(required=True)

    @validates_schema
    def validate_user_data(self, data):
        if len(data['login']) < 3:
            raise ValidationError('login must be longer than 3.')
        if len(data['password']) < 8:
            raise ValidationError('password must be longer than 8.')


class EntrySchema(Schema):
    header = fields.String(required=True)
    content = fields.String(required=True)
    @validates_schema
    def validate_entry_data(self, data):
        header_size = getsizeof(data['header'])
        if header_size > 255:
            raise ValidationError('header must be smaller than 255')
        content_size = getsizeof(data['content'].encode())
        if content_size > 64000:
            raise ValidationError('content must be smaller than 64kb')            
