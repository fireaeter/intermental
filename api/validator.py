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