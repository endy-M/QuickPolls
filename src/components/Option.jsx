import React from "react";

const Option = ({ id, displayNumber,content, deleteOptionFunction, deleteOptionDisabled, updateOptionFunction }) => {
    
    const invalidOptions = [];

    const handleInputChange = (e) => {
        updateOptionFunction(id, e.target.value);
    };

    return (
        <div style={{ display: "flex" }} id='content'>
            {/* Option input */}
            <input
                className={`form-control bg-secondary text-black ${invalidOptions[displayNumber - 1]?.includes(id) ? 'error' : ''}`}
                type="text"
                placeholder={`Option ${id + 1}`}
                style={{ width: '50%', marginLeft: '3rem', marginBottom: '0.5rem', fontWeight: '500', ...(invalidOptions[displayNumber - 1]?.includes(id) ? errorStyle : {}) }}
                value={content || ''}
                onChange={handleInputChange}
            />

            {/* Button to remove current option */}
            {deleteOptionDisabled ?
                <button
                    disabled
                    onClick={() => deleteOptionFunction(id)}
                    type='button'
                    className='btn btn-danger text-white'
                    style={{
                        marginLeft: '0.5rem',
                        marginTop: '0.3rem',
                        height: "1.75rem",
                        width: '1.3rem',
                        paddingTop: '0rem',
                        paddingLeft: '0.4rem',
                    }}
                >
                    x
                </button>
                :
                <button
                    onClick={() => deleteOptionFunction(id)}
                    type='button'
                    className='btn btn-danger text-white'
                    style={{
                        marginLeft: '0.5rem',
                        marginTop: '0.3rem',
                        height: "1.75rem",
                        width: '1.3rem',
                        paddingTop: '0rem',
                        paddingLeft: '0.4rem',
                    }}
                >
                    x
                </button>
            }
        </div>
    );
};

export default Option;
