function Validation(values) {
    let error = {}

    if(values.username === "") {
        error.username = <span style={{ color: 'white' }}>Username should not be empty</span>
    }
    else {
        error.username = ""
    }

    if(values.password === "") {
        error.password = <span style={{ color: 'white' }}>Password should not be empty</span>
    } else {
        error.password = ""
    }
    return error;
}

export default Validation;