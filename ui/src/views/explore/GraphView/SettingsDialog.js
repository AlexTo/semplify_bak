import React, {useState} from "react";
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {
  Grid, CardHeader,
  CardContent,
  Dialog, Divider,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Radio,
  Box, Tabs, Tab,
  Card, FormControlLabel
} from "@material-ui/core";
import {visualGraphActions} from "../../../actions";
import PropertySearch from "./PropertySearch";
import {useQuery} from "@apollo/react-hooks";
import {settingsQueries} from "../../../graphql/settingsQueries";
import {useKeycloak} from "@react-keycloak/web";

function TabPanel(props) {
  const {className, children, value, index, ...other} = props;

  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box px={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    minHeight: 480,
  },
  tabPanel: {
    width: "100%"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    width: 240,
    textTransform: "none",
  },
  card: {
    display: "flex"
  },
  tabWapper: {
    alignItems: "start"
  }
}));


function SettingsDialog() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const {register, handleSubmit, errors} = useForm();
  const dispatch = useDispatch();
  const {enqueueSnackbar} = useSnackbar();
  const {projectId} = useSelector(state => state.projectReducer);
  const {keycloak} = useKeycloak();
  const {idTokenParsed: token} = keycloak;
  const {preferred_username: username} = token;
  const {userSettingsDialogOpen} = useSelector(state => state.visualGraphReducer)

  const {data} = useQuery(settingsQueries.visualGraph, {
    variables: {
      projectId,
      username
    }
  })



  const handleClose = () => {
    dispatch(visualGraphActions.closeUserSettingsDialog());
  }

  return (
    <Dialog open={userSettingsDialogOpen} onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="lg" fullWidth>
      <DialogTitle>Visual Graph Settings</DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tab}
            onChange={handleTabChange}
            className={classes.tabs}
          >
            <Tab classes={{wrapper: classes.tabWapper}} className={classes.tab} label="Nodes" {...a11yProps(0)} />
            <Tab classes={{wrapper: classes.tabWapper}} className={classes.tab} label="Properties" {...a11yProps(1)} />
          </Tabs>
          <TabPanel className={classes.tabPanel} value={tab} index={0}>
            <Card>
              <CardHeader title="Nodes Visibility"/>
              <Divider/>
              <CardContent>
                <Grid container>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tab} index={1}>
            <Card>
              <CardHeader title="Properties Visibility"/>
              <Divider/>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Box>
                      <FormControlLabel value="end" control={<Radio color="primary"/>}
                                        label="Do not show the following properties"/>
                    </Box>
                    <Box>
                      <PropertySearch/>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <Box>
                      <FormControlLabel value="end" control={<Radio color="primary"/>}
                                        label="Show only the following properties"/>
                    </Box>
                    <Box>
                      <PropertySearch/>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary"
                size="small"
                onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary"
                variant="contained"
                size="small">Save
        </Button>
      </DialogActions>
    </Dialog>)
}

export default SettingsDialog;
