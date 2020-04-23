import React, {useEffect, useState} from "react";
import {Tabs, Tab, Divider, Card, Box} from "@material-ui/core";
import {
  Plus as PlusIcon
} from "react-feather";
import YasqeEditor from "./YasqeEditor";

function YasqeManager() {

  const [tabs, setTabs] = useState([])
  const [currentTab, setCurrentTab] = useState(9999)

  useEffect(() => {
    if (tabs.length === 0) {
      newTab();
    }
  }, []);

  useEffect(() => {
    if (tabs.length === 0)
      return;
    setCurrentTab(tabs.length)
  }, [tabs])

  const handleTabsChange = (event, value) => {
    if (value === 9999) {
      return;
    }
    setCurrentTab(value);
  };

  const newTab = () => {
    const key = tabs.length + 1
    const tab = {
      key: key,
      value: key,
      label: "Unnamed",
      editor: () => <YasqeEditor id={key}/>
    }
    setTabs([...tabs, tab])
  }

  return (<>
    <Card>
      <Tabs
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="secondary"
        variant="scrollable"
        value={currentTab}
      >
        {tabs.map(t =>
          <Tab key={t.key}
               value={t.value} label={t.label}/>)}
        <Tab key={9999} value={9999} label={<PlusIcon/>} onClick={newTab}/>
      </Tabs>
      <Box
        py={1}
        px={0.2}
        minHeight={56}
        alignItems="center">
        {tabs.map(t => {
          const Editor = t.editor;
          return currentTab === t.key && <Editor key={t.key}/>;
        })}
      </Box>
    </Card>
  </>)
}

export default YasqeManager;
