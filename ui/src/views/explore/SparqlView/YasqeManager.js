import React, {useEffect} from "react";
import {
  Tabs, Tab, Card, Box, IconButton, makeStyles, Grid, Tooltip
} from "@material-ui/core";
import {
  Plus as PlusIcon
} from "react-feather";
import CloseIcon from '@material-ui/icons/Close';
import {useSnackbar} from "notistack";
import Toolbar from "./Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {sparqlActions} from "../../../actions/sparqlActions";
import SaveQueryDialog from "./SaveQueryDialog";
import {yasqeService} from "../../../services";
import OpenQueryDialog from "./OpenQueryDialog";

const useStyles = makeStyles(() => ({
  tab: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textTransform: "none"
  }
}));


function YasqeManager() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {tabs, currentTab} = useSelector(state => state.sparqlReducer)
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    if (tabs.length === 0) {
      yasqeService.cleanup();
      dispatch(sparqlActions.newTab())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleTabsChange = (event, value) => {
    if (value === 0) {
      return;
    }
    dispatch(sparqlActions.setCurrentTabByKey(value))
  };

  const handleCloseTab = (e, tab) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      enqueueSnackbar("Unable to close the last tab", {
        variant: "error"
      })
      return;
    }
    dispatch(sparqlActions.removeTab(tab))
  }

  return (<>
    <Card>
      <Grid alignItems="center" container justify="space-between">
        <Grid item>
          <Tabs
            onChange={handleTabsChange}
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab ? currentTab.key : 0}>
            {tabs.map(t =>
              <Tab component="div" key={t.key}
                   value={t.key} label={
                <Tooltip title={t.description} placement="bottom-start">
                  <div className={classes.tab}>
                    {t.title ? t.title : 'New *'}
                    <Box flexGrow={1}/>
                    <IconButton onClick={(e) => handleCloseTab(e, t)}>
                      <CloseIcon fontSize="small"/>
                    </IconButton>
                  </div>
                </Tooltip>
              }/>)}
            <Tab key={0} value={0} label={<PlusIcon/>} onClick={() => dispatch(sparqlActions.newTab())}/>
          </Tabs>
        </Grid>
        <Grid item>
          <Toolbar/>
        </Grid>
      </Grid>
      <Box
        py={1}
        px={0.2}
        minHeight={56}
        alignItems="center">
        {currentTab && tabs.map(t => {
          const Editor = t.editor;
          return currentTab.key === t.key && <Editor key={t.key} query={t.query}/>;
        })}
      </Box>
      <SaveQueryDialog/>
      <OpenQueryDialog/>
    </Card>
  </>)
}

export default YasqeManager;
