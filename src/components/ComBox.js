import React, {useEffect, useRef, useState} from 'react';
import {findDOMNode} from "react-dom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

const ComBox = (props) => {
    const [hidden, setHidden] = useState(true);
    const [value, setValue] = useState('');
    const [options, setOptions] = useState(true);
    const inputRef = useRef();
    const btnRef = useRef();
    const optionsDiv = useRef();
    const handleInputChange = (e) => {
        setHidden(false);
        setValue(e.target.value);
        const arr = props.data
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            let str = arr[i].toString()
            if (str.includes(e.target.value)) {
                newArr.push(arr[i]);
            }
        }
        addOptions(newArr);
    };
    const handleSelectClick = () => {
        setHidden(false);
    };
    // 添加提示选项
    const addOptions = (arr) => {
        let opt = [];
        for (let i = 0; i < arr.length; i++) {
            opt.push(<option key={i} onClick={handleOptionsClick}>{arr[i]}</option>);
        }
        setOptions(opt);
    };
    // 选择点击
    const handleOptionsClick = (e) => {
        setValue(e.target.value);
        setHidden(true);
    };
    // 外部点击
    const handleClickOutsideInput = (e) => {
        // node 实例
        const input = findDOMNode(inputRef.current);
        const btn = findDOMNode(btnRef.current);
        const div = findDOMNode(optionsDiv.current);

        // 判断点击是否在 input btn div 的外部
        if (e.target !== input && e.target !== btn && !div.contains(e.target)) {
            setHidden(true);
        }
    }
    // 添加点击事件
    useEffect(() => {
        const arr = props.data;
        addOptions(arr);
        document.addEventListener('mousedown', (e) => {
            handleClickOutsideInput(e);
        })
        // eslint-disable-next-line
    },[]);
    return (
        <div style={{width: 200,height: 60}}>
            <input
                placeholder="请输入"
                style={{
                    width: 165,
                    height: 40,
                    background: '#FFFFFF',
                    borderRadius: 2,
                    border: '1px solid #CCCCCC',
                    fontSize: 12,
                    fontWeight: 400,
                    color: '#AAAAAA',
                    display: 'inline',
                    padding: 5,
                }}
                value={value}
                onInput={handleInputChange}
                ref={inputRef}
            />
            <IconButton style={{marginLeft: -40}} ref={btnRef} onClick={handleSelectClick}>
                <ExpandMoreIcon/>
            </IconButton>
            {/*提示输入,下拉选择 options*/}
            <div
                ref={optionsDiv}
                style={{
                    width: 165,
                    height: 300,
                    background: '#FFFFFF',
                    borderRadius: 2,
                    border: '1px solid #CCCCCC',
                    fontSize: 12,
                    fontWeight: 400,
                    color: '#AAAAAA',
                    zIndex: 1000,
                    overflow: 'scroll'
                }}
                hidden={hidden}>
                {options}
            </div>
        </div>
    );
};


export default ComBox;
