import React, {Fragment, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/styles'
import {
    Container,
    CssBaseline,
    Box,
    Button,
    CircularProgress,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';

const useStyles = makeStyles(() => ({
    cont: {
        textAlign: 'center',
    },
    fileBox: {
        width: '100%',
        height: '100px',
        backgroundColor: 'grey',
    },
}));

const FileUpload = () => {
    const classes = useStyles();
    const [icon, setIcon] = useState(<PlayCircleFilledWhiteIcon/>);
    const [disabled, setDisabled] = useState(true);
    const [btnText, setBtnText] = useState('开始上传');
    const [showProgress, setShowProgress] = useState(false);
    const [filename, setFilename] = useState('请选择文件');
    const fileInput = useRef();
    const handleFileInputChange = () => {
        let file = fileInput.current['files'][0];
        let filename = file.name;
        setFilename(filename);
        setDisabled(false)
    }
    const handleBtnClick = () => {
        setShowProgress(true);
        if (btnText === '开始上传') {
            setBtnText('暂停上传');
            setIcon(<PauseCircleOutlineIcon/>);
        } else {
            setBtnText('开始上传');
            setIcon(<PlayCircleFilledWhiteIcon/>);
        }
    }
    return (
        <Fragment>
            <Container className={classes.cont}>
                <CssBaseline/>
                <input id="file" type="file" hidden ref={fileInput} onChange={handleFileInputChange}/>
                <label htmlFor="file">
                    <Box className={classes.fileBox}>
                        <CloudUploadIcon fontSize="large"/>
                        <p>{filename}</p>
                    </Box>
                </label>
                <Box>
                    {showProgress ? (<CircularProgress/>) : null}
                </Box>
                <Button
                    onClick={handleBtnClick}
                    variant="contained"
                    color="default"
                    className={classes.cont}
                    startIcon={icon}
                    disabled={disabled}
                >
                    {btnText}
                </Button>
            </Container>
        </Fragment>

    );
};

export default FileUpload;
