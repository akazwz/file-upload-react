import React, {useRef, useState} from 'react';

const ComBox = () => {
    const [hidden, setHidden] = useState(true);
    const [options, setOptions] = useState(true);
    const optionsDiv = useRef();
    const handleInputChange = () => {
        setHidden(false);
        addOptions();
    };
    const handleSelectClick = () => {
        setHidden(false);
    };
    const addOptions = () => {
        const optionsAdd = <div>
            <option onClick={handleOptionsClick}>1</option>
            <option onClick={handleOptionsClick}>2</option>
            <option onClick={handleOptionsClick}>3</option>
            <option onClick={handleOptionsClick}>4</option>
        </div>;
        setOptions(optionsAdd);
    };
    const handleOptionsClick = (e) => {
        alert(e.target.value);
    };
    return (
        <div>
            <input placeholder="请输入" style={{width: 200}} onInput={handleInputChange}/>
            <button style={{width: 10, marginLeft: -20, border: "none"}} onClick={handleSelectClick}>
                {">"}
            </button>
            <div ref={optionsDiv} style={{width: 200, backgroundColor: "red", zIndex: 1000}} hidden={hidden}>
                {options}
            </div>
        </div>
    );
};


export default ComBox;
