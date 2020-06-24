import React, {useState} from "react";
import {
  Divider,
  Container,
  Box,
  makeStyles,
  Tab,
  Tabs,
  Typography,
  DialogContent, Dialog
} from "@material-ui/core";
import Header from "./Header";
import NodeProperties from "./NodeProperties";
import NodeRelations from "./NodeRelations";
import {useDispatch, useSelector} from "react-redux";
import {nodeDetailsActions} from "../../../actions/nodeDetailsActions";

const useStyles = makeStyles(() => ({
  root: {},
  tab: {
    textTransform: "none",
  }
}))

function NodeDetailsViewDialog() {
  const classes = useStyles();
  const [tab, setTab] = useState("properties");
  const dispatch = useDispatch();
  const {
    node, nodeDetailsViewDialogOpen
  } = useSelector(state => state.nodeDetailsReducer);

  const handleTabsChange = (event, value) => {
    setTab(value);
  }

  const handleClose = () => {
    dispatch(nodeDetailsActions.closeNodeDetailsViewDialog());
  }

  if (!node) return null;

  return (
    <Dialog className={classes.root}
            open={nodeDetailsViewDialogOpen} onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="xl" fullWidth>
      <DialogContent>
        <Container maxWidth={false}>
          <Header node={node}/>
          <Box mt={3}>
            <Tabs
              onChange={handleTabsChange}
              variant="scrollable"
              scrollButtons="auto"
              value={tab}>
              <Tab component="div" value="properties" label={
                <Typography className={classes.tab} color="textPrimary">
                  Properties
                </Typography>
              }/>
              <Tab component="div" value="relations" label={
                <Typography className={classes.tab} color="textPrimary">
                  Relations
                </Typography>
              }/>
            </Tabs>
          </Box>
          <Divider/>
          {tab === "properties" && <NodeProperties/>}
          {tab === "relations" && <NodeRelations/>}
        </Container>
      </DialogContent>
    </Dialog>
  )
}

export default NodeDetailsViewDialog;
