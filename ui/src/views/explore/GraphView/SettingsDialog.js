import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
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
  Radio, List, ListItem,
  ListItemText, ListItemSecondaryAction,
  IconButton,
  Box, Tabs, Tab,
  Card, FormControlLabel
} from "@material-ui/core";
import {visualGraphActions} from "../../../actions";
import PropertySearch from "./PropertySearch";
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {settingsQueries} from "../../../graphql";
import {useKeycloak} from "@react-keycloak/web";
import {Delete as DeleteIcon} from '@material-ui/icons';

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
  const [settingsId, setSettingsId] = useState(null);
  const [filterMode, setFilterMode] = useState(null);
  const [excludePreds, setExcludePreds] = useState([]);
  const [includePreds, setIncludePreds] = useState([]);
  const [groupPreds, setGroupPreds] = useState(null);
  const [groupPredsIfCountExceed, setGroupPredsIfCountExceed] = useState(null);

  const [colorMaps,] = useState([]);
  const dispatch = useDispatch();
  const {enqueueSnackbar} = useSnackbar();
  const {projectId} = useSelector(state => state.projectReducer);
  const {keycloak} = useKeycloak();
  const {idTokenParsed: token} = keycloak;
  const {preferred_username: username} = token;
  const {userSettingsDialogOpen, settings} = useSelector(state => state.visualGraphReducer)

  const [updateVisualGraphSettings] = useMutation(settingsQueries.updateVisualGraph);
  const [loadSettings] = useLazyQuery(settingsQueries.visualGraph,
    {
      onCompleted: data => dispatch(visualGraphActions.updateSettings(data.settings)),
      fetchPolicy: "no-cache"
    });

  useEffect(() => {
    loadSettings({
      variables: {
        projectId, username
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettingsDialogOpen])

  useEffect(() => {
    if (!settings)
      return;
    const {id, visualGraph} = settings;
    const {edgeRenderer} = visualGraph;
    const {includePreds, excludePreds, filterMode, groupPreds, groupPredsIfCountExceed} = edgeRenderer;

    setSettingsId(id);
    setFilterMode(filterMode);
    setExcludePreds(excludePreds);
    setIncludePreds(includePreds);
    setGroupPreds(groupPreds);
    setGroupPredsIfCountExceed(groupPredsIfCountExceed);
  }, [settings])

  const handleClose = () => {
    dispatch(visualGraphActions.closeUserSettingsDialog());
  }

  const handleFilterModeChange = (e) => {
    setFilterMode(e.target.value);
  }

  const handleExcludePred = (p) => {
    if (!excludePreds.find(d => d.value === p.value)) {
      setExcludePreds([...excludePreds, p]);
    }
  }

  const handleIncludePred = (p) => {
    if (!includePreds.find(d => d.value === p.value)) {
      setIncludePreds([...includePreds, p]);
    }
  }

  const handleSave = () => {
    updateVisualGraphSettings({
      variables: {
        settingsId: settingsId,
        visualGraph: {
          edgeRenderer: {
            filterMode,
            excludePreds: excludePreds.map(p => {
              return {projectId: p.projectId, value: p.value}
            }),
            includePreds: includePreds.map(p => {
              return {projectId: p.projectId, value: p.value}
            }),
            groupPreds,
            groupPredsIfCountExceed
          },
          nodeRenderer: {
            colorMaps
          }
        }
      }
    }).then(() => {
      enqueueSnackbar("Visual graph settings updated", {
        variant: 'success'
      });
      dispatch(visualGraphActions.closeUserSettingsDialog());
    })
  }

  if (!settings) return null;

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
            <Tab classes={{wrapper: classes.tabWapper}} className={classes.tab} label="Properties" {...a11yProps(0)} />
            <Tab classes={{wrapper: classes.tabWapper}} className={classes.tab} label="Nodes" {...a11yProps(1)} />
          </Tabs>
          <TabPanel className={classes.tabPanel} value={tab} index={0}>
            <Card>
              <CardHeader title="Properties Visibility"/>
              <Divider/>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Box>
                      <FormControlLabel value="end"
                                        control={<Radio checked={filterMode === "Exclusive"}
                                                        value="Exclusive"
                                                        onChange={handleFilterModeChange}
                                                        color="primary"/>}
                                        label="Do not show the following predicates"/>
                    </Box>
                    <Box>
                      <PropertySearch onSelected={handleExcludePred}/>
                    </Box>
                    <Box>
                      <List dense>
                        {excludePreds.map(p => (<ListItem key={p.value}>
                          <ListItemText
                            primary={p.prefLabel.value}
                            secondary={p.value}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => setExcludePreds(excludePreds.filter(d => d.value !== p.value))}>
                              <DeleteIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>))}
                      </List>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <Box>
                      <FormControlLabel value="end"
                                        control={<Radio checked={filterMode === "Inclusive"}
                                                        value="Inclusive"
                                                        onChange={handleFilterModeChange}
                                                        color="primary"/>}
                                        label="Show only the following properties"/>
                    </Box>
                    <Box>
                      <PropertySearch onSelected={handleIncludePred}/>
                    </Box>
                    <Box>
                      <List dense>
                        {includePreds.map(p => (<ListItem key={p.value}>
                          <ListItemText
                            primary={p.prefLabel.value}
                            secondary={p.value}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => setIncludePreds(includePreds.filter(d => d.value !== p.value))}>
                              <DeleteIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tab} index={1}>
            <Card>
              <CardHeader title="Nodes Visibility"/>
              <Divider/>
              <CardContent>
                <Grid container>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary"
                size="small"
                onClick={handleClose}>Cancel</Button>
        <Button color="primary"
                variant="contained"
                size="small" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>)
}

export default SettingsDialog;
