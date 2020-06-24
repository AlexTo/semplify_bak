import React from "react";
import {Avatar, Box, IconButton, makeStyles, Typography} from "@material-ui/core";
import getInitials from "../../../utils/getInitials";
import {ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {nodeDetailsActions} from "../../../actions/nodeDetailsActions";

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: 120,
    width: 120,
    top: -60,
    left: theme.spacing(3),
    position: 'absolute'
  },
  uri: {
    textTransform: "none"
  }
}))

function Header({node}) {
  const classes = useStyles();
  const {histStack, histIndex} = useSelector(state => state.nodeDetailsReducer);
  const dispatch = useDispatch();
  return (
    <Box mt={10}>
      <Box
        position="relative"
        display="flex"
        alignItems="center">
        {node && node.depiction && <Avatar
          className={classes.avatar}
          src={`${node.depiction.value.replace("?type=large", "")}?type=large`}
        />}
        {node && (!node.depiction || !node.depiction.value) && <Avatar
          className={classes.avatar}
        >{getInitials(node.prefLabel.value)}</Avatar>}
        <Box marginLeft="160px">
          {node && <Typography
            variant="h4"
            color="textPrimary">
            {node.prefLabel.value}
          </Typography>}
          <Typography
            className={classes.uri}
            variant="overline"
            color="textSecondary">
            {node.value}
          </Typography>
        </Box>
        <Box flexGrow={1}/>
        {(histStack.length > 0) && <Box>
          <IconButton
            color="primary"
            disabled={histIndex === 0}
            onClick={() => dispatch(nodeDetailsActions.histBack())}>
            <ArrowBackIcon/>
          </IconButton>
          <IconButton
            color="primary"
            disabled={histIndex === histStack.length - 1}
            onClick={() => dispatch(nodeDetailsActions.histForward())}>
            <ArrowForwardIcon/>
          </IconButton>
        </Box>}
      </Box>
    </Box>
  )
}

export default Header;
