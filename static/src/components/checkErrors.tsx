const checkErrors = (fields: Array<string>, fieldsDict: Object) => {
    let errors = {}
    let errors_num = 0
    let error_message = ""
    fields.forEach(item => {
      if(fieldsDict[item].length == 0) {
        errors[item] = true
        error_message += item+','
        errors_num++;
      }else {
        errors[item] = false
        if(item == 'content') {
          if(fieldsDict[item] == '<p><br></p>') {
            errors[item] = true
            error_message += item+','
            errors_num++;
          }
        }
      }
    })
    error_message = error_message.substring(0, error_message.length-1)
    error_message += " field(s) should not be empty"
    var result = {
      'errors': false,
      'errors_list': errors,
      'error_message': error_message
    }
    if(errors_num > 0) {
      result['errors'] = true
    }
    return result
}
export default checkErrors;