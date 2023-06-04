import {
    AppBar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import TOCIcon from '@mui/icons-material/TOC';
import Markdown from "./Markdown";
import useSWR from "swr";
import useForage from "./useForage";

const prefix = ''
const toc = '目录'

export default function Site() {
    const handleTOC = () => {
        location.hash = `${prefix}${toc}`
    }
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const [wrapperPadding, setWrapperPadding] = useForage('wrapper-padding', '15px')
    const [wrapperClass, setWrapperClass] = useForage('wrapper-class', 'markdown-body')
    const dark = useTheme().palette.mode === 'dark'
    const [thCSSLight, setThCSSLight] = useForage('th-CSS-light', 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css')
    const [thCSSDark, setThCSSDark] = useForage('th-CSS-dark', 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css')
    const [hlCSSLight, setHlCSSLight] = useForage('hl-CSS-light', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css')
    const [hlCSSDark, setHlCSSDark] = useForage('hl-CSS-dark', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css')
    const {data} = useSWR('/index.md', url => fetch(url).then(value => value.text()))
    return (
        <>
            <Container component="main" sx={{py: 3}} id="back-to-top-anchor">
                <link rel="stylesheet" href={dark ? hlCSSDark : hlCSSLight}/>
                <link rel="stylesheet" href={dark ? thCSSDark : thCSSLight}/>
                <Paper sx={{padding: wrapperPadding}} className={wrapperClass}>
                    {data === undefined ? <LinearProgress/> : <Markdown source={data} toc={toc} prefix={prefix}/>}
                </Paper>
            </Container>
            <Toolbar/>
            <AppBar position="fixed" sx={{top: 'auto', bottom: 0}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Markdown
                    </Typography>
                    <IconButton size="large" color="inherit" aria-label="翻到目录" onClick={handleTOC}>
                        <TOCIcon/>
                    </IconButton>
                    <IconButton size="large" edge="end" color="inherit" aria-label="打开设置" onClick={handleOpen}>
                        <SettingsIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>设置</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="包装器内边距"
                        defaultValue={wrapperPadding}
                        onChange={event => {
                            setWrapperPadding(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="包装器的类名"
                        defaultValue={wrapperClass}
                        onChange={event => {
                            setWrapperClass(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="浅色主题CSS"
                        defaultValue={thCSSLight}
                        onChange={event => {
                            setThCSSLight(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="深色主题CSS"
                        defaultValue={thCSSDark}
                        onChange={event => {
                            setThCSSDark(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="浅色高亮CSS"
                        defaultValue={hlCSSLight}
                        onChange={event => {
                            setHlCSSLight(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="深色高亮CSS"
                        defaultValue={hlCSSDark}
                        onChange={event => {
                            setHlCSSDark(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
