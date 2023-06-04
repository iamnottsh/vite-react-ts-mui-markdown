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
    useScrollTrigger,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Markdown from "./Markdown";
import useSWR from "swr";

export default function Site() {
    const trigger = useScrollTrigger({threshold: 0})
    const handleTop = () => {
        document.getElementById('back-to-top-anchor')?.scrollIntoView()
    }
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const dark = useTheme().palette.mode === 'dark'
    const [thCSSLight, setThCSSLight] = useState('https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css')
    const [thCSSDark, setThCSSDark] = useState('https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css')
    const [hlCSSLight, setHlCSSLight] = useState('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css')
    const [hlCSSDark, setHlCSSDark] = useState('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css')
    const {data} = useSWR('/index.md', url => fetch(url).then(value => value.text()))
    return (
        <>
            <Container component="main" sx={{py: 3}} id="back-to-top-anchor">
                <link rel="stylesheet" href={dark ? hlCSSDark : hlCSSLight}/>
                <link rel="stylesheet" href={dark ? thCSSDark : thCSSLight}/>
                <Paper sx={{padding: 2}} className="markdown-body">
                    {data === undefined ? <LinearProgress/> : <Markdown source={data}/>}
                </Paper>
            </Container>
            <Toolbar/>
            <AppBar position="fixed" sx={{top: 'auto', bottom: 0}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Markdown
                    </Typography>
                    {trigger && <IconButton size="large" color="inherit" aria-label="返回顶部" onClick={handleTop}>
                        <KeyboardArrowUpIcon/>
                    </IconButton>}
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
                        label="浅色主题CSS"
                        value={thCSSLight}
                        onChange={event => {
                            setThCSSLight(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="深色主题CSS"
                        value={thCSSDark}
                        onChange={event => {
                            setThCSSDark(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="浅色高亮CSS"
                        value={hlCSSLight}
                        onChange={event => {
                            setHlCSSLight(event.target.value)
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="深色高亮CSS"
                        value={hlCSSDark}
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
