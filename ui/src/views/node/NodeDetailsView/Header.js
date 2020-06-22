import React from "react";
import {Avatar, Box, makeStyles, Typography} from "@material-ui/core";
import getInitials from "../../../utils/getInitials";

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

  return (
    <Box mt={10}>
      <Box
        position="relative"
        display="flex"
        alignItems="center"
      >
        {node && node.depiction && <Avatar
          className={classes.avatar}
          src={`${node.depiction.value}?type=large`}
        />}
        {node && (!node.depiction || !node.depiction.value) && <Avatar
          className={classes.avatar}
        >{getInitials(node.prefLabel.value)}</Avatar>}
        <Box marginLeft="160px">
          {node && <Typography
            variant="h4"
            color="textPrimary"
          >
            {node.prefLabel.value}
          </Typography>}
          <Typography
            className={classes.uri}
            variant="overline"
            color="textSecondary">
            {node.value}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Header;
