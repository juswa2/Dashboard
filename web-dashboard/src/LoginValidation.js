function Validation(values) {
    let error = {}

    if(values.username === "") {
        error.username = <span style={{ color: 'white' }}>Username is Missing</span>
    }
    else {
        error.username = ""
    }

    if(values.password === "") {
        error.password = <span style={{ color: 'white' }}>Field should not be empty</span>
    } else {
        error.password = ""
    }
    return error;
}

export default Validation;