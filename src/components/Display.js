import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import AppBar from './Appbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import RaisedButton from 'material-ui/RaisedButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Redirect } from 'react-router';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import keys from '../var';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Display(props) {
  const classes = useStyles();
  const [goJobs, setGoJobs] = useState(false);
  const [goHistory, setGoHistory] = useState(false);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true)
  const { id } = useParams();

  const dropJob = function () {
    setGoJobs(true)
    axios.put(
      `/jobs/`,
      {
        params: {
          id: id,
          dropJob: true
        }
      }, { withCredentials: true }
    )
      .then(() => {

      })
      .catch(err => console.log("error", err));
  }

  const acceptJob = function (jobId) {
    console.log(jobId)
    axios.put(
      `/jobs/`,
      {
        params: {
          id: jobId,
          dropJob: false,
        }
      }
    )
      .then(
        (res) => {
          props.updateMyJobs();
          props.updateAllJobs();

        }
      )
      .catch(err => console.log(err))
  }

  const markComplete = function () {
    axios.put(
      `/jobs/`,
      {
        params: {
          id: id,
          markComplete: true
        }
      }, { withCredentials: true }
    )
      .catch(err => console.log("error", err));
  }

  const jobStatus = function (job) {
    if (job.is_deleted) {
      return "Deleted"
    } else if (job.jobber_id === null) {
      return "Open"
    } else if (job.jobber_id !== null && job.jobber_confirm === false && job.user_confirm === false) {
      return "In Progress"
    } else if (job.jobber_confirm === true && job.user_confirm === false) {
      return "Marked Complete. Awaiting User Confirmation"
    } else if (job.jobber_confirm === true && job.user_confirm === true) {
      return "Completed"
    }
  }

  useEffect(() => {
    console.log("props", props)
    axios.get(`/jobs?id=${id}`, { withCredentials: true })
      .then((res) => {
        setResponse(res.data[0])
        if (props.change) {
          props.finished()
        }
      })
      .catch(err => console.log("error", err));

    axios.get('/auth', { withCredentials: true })
      .then((response) => {
        if (response.data.result !== "jobber") {
          props.history.replace("/")
          props.history.go()
        } else {
          setLoading(false)
        }
      });
  }, [props.update, props.change])


  return loading ? null :
    (goJobs ? <Redirect to="/jobs/" /> :
      (goHistory ? <Redirect to="/history/" /> :
        <MuiThemeProvider>
          <AppBar title="Job Info #Lit-Final" user={true} />

          <Paper className={classes.paper}>
            <Grid item>
              <Typography variant="h4">{response.service_type}</Typography>

              <Typography>Description: {response.description}</Typography>
              <Typography>Requested By: {response.name}</Typography>
              <Typography>Address: {response.street_address}</Typography>
              <Typography>Payout: ${response.hourly_rate * response.time_estimate}</Typography>
              <Typography>Status: {jobStatus(response)}</Typography>
            </Grid>
          </Paper>
          <Grid container direction="row" justify="center">
            {
              jobStatus(response) === "Open" ?
                <Button
                  onClick={() => {
                    acceptJob(id)
                    props.updateMyJobs()
                    props.updateAllJobs()
                  }}
                  style={styles.button}
                  variant="contained"
                >
                  Accept
              </Button>
                : null
            }
            {
              jobStatus(response) === "In Progress" ?
                <Button
                  onClick={() => {
                    dropJob()
                    props.updateMyJobs()
                    props.updateAllJobs()
                  }}
                  style={styles.button}
                  variant="contained"
                >
                  Cancel
              </Button>
                : null
            }
            {
              jobStatus(response) === "In Progress" ?
                <Button
                  onClick={() => {
                    markComplete()
                    props.updateMyJobs()
                    props.updateAllJobs()
                  }}
                  style={styles.button}
                  variant="contained"
                >
                  Mark Complete
              </Button>
                : null
            }
            <br />
            <Button
              onClick={() => setGoJobs(true)}
              style={styles.button}
              variant="contained"
            >
              Jobs
          </Button>
            <Button
              onClick={() => setGoHistory(true)}
              style={styles.button}
              variant="contained"
            >
              History
          </Button>
          </Grid>
        </MuiThemeProvider >
      )
    )
}

const styles = {
  button: {
    margin: 15
  }
}