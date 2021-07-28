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
import MD5 from 'crypto-js/md5';
import EncLatin1 from 'crypto-js/enc-latin1';
import {UploadChunk, MergeChunks} from "../apis/file";

const useStyles = makeStyles(() => ({
    cont: {
        textAlign: 'center',
    },
    fileBox: {
        width: '100%',
        height: '100px',
        backgroundColor: 'lightgray',
    },
}));

const PrefixInteger = (num, n) => (
    (Array(n).join('0') + num).slice(-n)
);

const FileUpload = () => {
    const classes = useStyles();
    const [icon, setIcon] = useState(<PlayCircleFilledWhiteIcon/>);
    const [disabled, setDisabled] = useState(true);
    const [btnText, setBtnText] = useState('开始上传');
    const [showProgress, setShowProgress] = useState(false);
    const [filename, setFilename] = useState('请选择文件');
    const fileInput = useRef();
    // 文件上传
    const handleFileUpload = () => {
        let file = fileInput.current['files'][0];
        let filesize = file.size;

        const formData = new FormData();

        if (filesize < 10000) {
            return;
        }
        // 获取文件MD5
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
            const text = reader.result;
            const fileMD5 = MD5(EncLatin1.parse(text)).toString();
            formData.append('file-md5', fileMD5);

            // 分块上传
            const chunkSize = 1024 * 1024;
            const totalChunks = Math.ceil(filesize / chunkSize);
            formData.append('chunks-count', totalChunks.toString());
            let start;
            let end;
            for (let i = 0; i < totalChunks; i++) {
                start = i * chunkSize;
                end = start + chunkSize;
                let chunkFile = file.slice(start, end);
                let index = PrefixInteger(i, 5);
                const chunkReader = new FileReader();
                chunkReader.readAsBinaryString(chunkFile);
                chunkReader.onload = () => {
                    const chunkText = chunkReader.result;
                    const chunkMD5 = MD5(EncLatin1.parse(chunkText)).toString();
                    formData.set('chunk-file', chunkFile);
                    formData.set('chunk-md5', chunkMD5);
                    formData.set('chunk-index', index);
                    UploadChunk(formData).then((res) => {
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    });
                };
            }
        }
    };
    const handleFileInputChange = () => {
        let file = fileInput.current['files'][0];
        let filename = file.name;
        setFilename(filename);
        setDisabled(false);
    }
    const handleBtnClick = () => {
        setShowProgress(true);
        if (btnText === '开始上传') {
            handleFileUpload();
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
