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

