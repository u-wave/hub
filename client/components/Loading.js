import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const enhance = withStyles({
  root: {
    width: '100%',
    textAlign: 'center'
  }
}, { name: 'Loading' })

const Loading = ({ classes, message }) => (
  <div className={classes.root}>
    <CircularProgress size={300} mode='indeterminate' />
    <Typography>{message}</Typography>
  </div>
)

export default enhance(Loading)
