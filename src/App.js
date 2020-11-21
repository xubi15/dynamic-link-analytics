import React, {useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import axios from "axios"
import {AppBar} from "@material-ui/core"
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
        paddingLeft: 30,
        paddingRight: 30
    },
    textFieldStyle: {
        '& > *': {
            margin: theme.spacing(1),
            width: '45ch',
        },
    },
    textFieldStyleDays: {
        '& > *': {
            margin: theme.spacing(1),
            width: '10ch',
        },
    },
    buttonStyle: {
        '& > *': {
            margin: theme.spacing(1),
            /*background: "#000"*/
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}))

export default function StickyHeadTable() {
    const classes = useStyles()
    const [page, setPage] = React.useState(0)
    // hook
    const [data, setData] = React.useState([])
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [isData, setIsData] = React.useState(false)
    const [backUpData, setBackUpData] = React.useState([])
    const [countSum, setCountSum] = React.useState(0)
    const [platform, setPlatform] = React.useState('')
    // to hold events
    const [events, setEvents] = React.useState('')
    // to hold all the events
    const [allEvents, setAllEvents] = React.useState([])
    const [allPlatforms, setAllPlatforms] = React.useState([])

    // triggered when Platform dropdown changed
    const handleChangePlatform = (event) => {
        setPlatform(event.target.value)
        var platformData = backUpData.filter(function (el) {
            //console.log("platform: " + el.platform + " state: " + event.target.value)
            if (event.target.value === "ALL") {
                return backUpData
            } else {
                return el.platform === event.target.value
            }
        })
        var countTemp = 0
        platformData.map(val => {
            countTemp += Number(val.count)
        })
        setCountSum(countTemp)
        setData(platformData)
    }

    // triggered when event dropdown changed
    const handleChangeEvent = (event) => {
        setEvents(event.target.value)
        var eventData = data.filter(function (el) {
            //console.log("event: " + el.event + " ~~~state: " + event.target.value)
            if (event.target.value === "ALL") {
                return backUpData
            } else {
                return el.event === event.target.value
            }
        })

        var countTemp = 0
        eventData.map(val => {
            countTemp += Number(val.count)
        })
        setCountSum(countTemp)
        setData(eventData)

    }

    useEffect(() => {
        const func = () => {
            var eventData = backUpData.filter(function (el) {
                //console.log("event: " + el.event + " ~~~state: " + event.target.value)
                if (platform === "ALL" && events === "ALL") {
                    return backUpData
                } else if (el.event === events && platform === "ALL") {
                    return el.event === events
                } else if (el.platform === platform && events === "ALL") {
                    return el.platform === platform
                } else {
                    return el.event === events && el.platform === platform
                }
            })
            var countTemp = 0
            eventData.map(val => {
                countTemp += Number(val.count)
            })
            setCountSum(countTemp)
            setData(eventData)
        }
        func()
    }, [platform, events])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const onSubmitButton = () => {
        var url = document.getElementById("url").value
        var days = document.getElementById("days").value
        var eventsArr = []
        var platformsArr = []

        axios.post("http://localhost:3001", {
            "url": encodeURIComponent(url),
            "days": days
        })
            .then(res => {
                setIsData(true)
                setData(res.data.linkEventStats)
                setCountSum(res.data.countSum)
                setBackUpData(res.data.linkEventStats)
                res.data.linkEventStats.map(elem => {
                    if (eventsArr.indexOf(elem.event) === -1) {
                        eventsArr.push(elem.event)
                    }
                    if (platformsArr.indexOf(elem.platform) === -1) {
                        platformsArr.push(elem.platform)
                    }
                })
                setAllEvents(eventsArr)
                setAllPlatforms(platformsArr)
            })
    }

    return (
        <div>
            <AppBar position="static" /*style={{ background: '#000' }}*/>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Dynamic Link Analytics
                    </Typography>
                </Toolbar>
            </AppBar>

            <Paper className={classes.root} elevation={isData ? 3 : 0}>
                <div style={{display: "flex", alignItems: "center", marginBottom: 30, paddingTop: 30}}>
                    <form noValidate autoComplete="off">
                        <TextField className={classes.textFieldStyle} id="url" label="URL" variant="outlined"/>
                        <TextField className={classes.textFieldStyleDays} id="days" label="Days" variant="outlined"/>
                    </form>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Platforms</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            label="Platforms"
                        >
                            <MenuItem value="ALL">
                                ALL
                            </MenuItem>
                            {
                                allPlatforms.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Events</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={events}
                            onChange={(e) => setEvents(e.target.value)}
                            label="Events"
                        >
                            <MenuItem value="ALL">
                                ALL
                            </MenuItem>
                            {
                                allEvents.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <div className={classes.buttonStyle}>
                        <Button variant="contained" color="primary" onClick={onSubmitButton}>
                            Submit
                        </Button>
                    </div>
                </div>
                {isData ?
                    <div>
                        <div>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Platform
                                        </TableCell>
                                        <TableCell>
                                            Count
                                        </TableCell>
                                        <TableCell>
                                            Event
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) =>
                                            (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {row.platform}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.count}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.event}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    }
                                    <TableRow>
                                        <TableCell><strong>Total</strong></TableCell>
                                        <TableCell><strong>{countSum}</strong></TableCell>
                                        <TableCell/>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'previous page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'next page',
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div> : ""
                }
            </Paper>
        </div>
    )
}
