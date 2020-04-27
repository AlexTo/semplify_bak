import React, {useEffect, useState} from "react";
import {
  Tabs, Tab, Card, Box, IconButton, Typography, makeStyles, Grid
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
import {queryService, yasqeService} from "../../../services";

const useStyles = makeStyles((theme) => ({
  tab: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textTransform: "none"
  }
}));


function YasqeManager() {
  const classes = useStyles();
  const [tabs, setTabs] = useState([])
  const [saveQueryDialogOpen, setSaveQueryDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const {projectId} = useSelector(state => state.projectReducer);
  const [currentTabId, setCurrentTabId] = useState(0);
  const [currentTab, setCurrentTab] = useState(null);

  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    if (tabs.length === 0) {
      yasqeService.cleanup();
      handleNewTab();
    }
  }, []);

  useEffect(() => {
    if (tabs.length === 0)
      return;
    if (tabs.length === 1) {
      setCurrentTabId(tabs[0].key)
    }
    if (!tabs.find(t => t.key === currentTabId)) {
      setCurrentTabId(tabs[tabs.length - 1].key);
    }
  }, [tabs])

  const handleTabsChange = (event, value) => {
    if (value === 0) {
      return;
    }
    setCurrentTabId(value);
  };

  const handleNewTab = (label, description, serverId, query) => {
    const key = uuidv4()
    const tab = {
      key: key,
      value: key,
      label: label,
      description: description,
      serverId: null,
      editor: () => <YasqeEditor id={key} query={query}/>
    }
    setTabs([...tabs, tab])
  }

  const handleExecute = () => {
    dispatch(sparqlActions.executeTab(currentTabId));
  }

  const handleSave = () => {
    const tab = tabs.find(t => t.key === currentTabId)
    if (!tab.serverId) {
      setSaveQueryDialogOpen(true)
    } else {
      const query = yasqeService.getQuery(currentTabId);
      queryService.update(tab.serverId, projectId, tab.label, tab.description, query)
        .then(_ => enqueueSnackbar("Query saved successfully", {
          variant: "success"
        }));
    }
  }

  const handleSaveConfirm = (label, description) => {
    const query = yasqeService.getQuery(currentTabId);
    queryService.create(projectId, label, description, query)
      .then(result => {
        setSaveQueryDialogOpen(false);
        enqueueSnackbar("Query saved successfully", {
          variant: "success"
        });
        setTabs(tabs.map(t => {
          if (t.key !== currentTabId)
            return t;
          else return Object.assign({}, t, {
            label: result.label,
            description: result.description,
            serverId: result.id
          })
        }))
      });
  }

  const handleCloseTab = (e, key) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      enqueueSnackbar("Unable to close the last tab", {
        variant: "error"
      })
      return;
    }
    const newTabs = tabs.filter(t => t.key !== key);
    setTabs(newTabs)
  }

  return (<>
    <Card>
      <Grid alignItems="center" container justify="space-between">
        <Grid item>
          <Tabs
            onChange={handleTabsChange}
            variant="scrollable"
            scrollButtons="auto"
            value={tabs.map(t => t.key).includes(currentTabId) ? currentTabId : 0}>
            {tabs.map(t =>
              <Tab component="div" key={t.key}
                   value={t.value} label={
                <div className={classes.tab}>
                  {t.label ? t.label : 'New *'}
                  <Box flexGrow={1}/>
                  <IconButton onClick={(e) => handleCloseTab(e, t.key)}>
                    <CloseIcon fontSize="small"/>
                  </IconButton>
                </div>
              }/>)}
            <Tab key={0} value={0} label={<PlusIcon/>} onClick={() => handleNewTab()}/>
          </Tabs>
        </Grid>
        <Grid item>
          <Toolbar onExecute={handleExecute} onSave={handleSave}/>
        </Grid>
      </Grid>
      <Box
        py={1}
        px={0.2}
        minHeight={56}
        alignItems="center">
        {tabs.map(t => {
          const Editor = t.editor;
          return currentTabId === t.key && <Editor key={t.key}/>;
        })}
      </Box>
      <SaveQueryDialog
        open={saveQueryDialogOpen}
        label={currentTab && currentTab.label}
        description={currentTab && currentTab.description}
        onClose={() => setSaveQueryDialogOpen(false)} onSave={handleSaveConfirm}/>
    </Card>
  </>)
}

export default YasqeManager;
