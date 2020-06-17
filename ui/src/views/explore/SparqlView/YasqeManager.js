import React, {useEffect} from "react";
import {
  Tabs, Tab, Card, Box, IconButton, makeStyles, Grid
} from "@material-ui/core";
import {
  Plus as PlusIcon
} from "react-feather";
import YasqeEditor from "./YasqeEditor";
import {v4 as uuidv4} from 'uuid';
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
      handleNewTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleTabsChange = (event, value) => {
    if (value === 0) {
      return;
    }
    dispatch(sparqlActions.setCurrentTabByKey(value))
  };

  const handleNewTab = (title, description, serverId, query) => {
    const key = uuidv4()
    const tab = {
      key: key,
      value: key,
      title: title,
      description: description,
      serverId: null,
      editor: () => <YasqeEditor id={key} query={query}/>
    }
    dispatch(sparqlActions.newTab(tab))
  }

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
                <div className={classes.tab}>
                  {t.title ? t.title : 'New *'}
                  <Box flexGrow={1}/>
                  <IconButton onClick={(e) => handleCloseTab(e, t)}>
                    <CloseIcon fontSize="small"/>
                  </IconButton>
                </div>
              }/>)}
            <Tab key={0} value={0} label={<PlusIcon/>} onClick={() => handleNewTab()}/>
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
          return currentTab.key === t.key && <Editor key={t.key}/>;
        })}
      </Box>
      <SaveQueryDialog/>
      <OpenQueryDialog/>
    </Card>
  </>)
}

export default YasqeManager;
