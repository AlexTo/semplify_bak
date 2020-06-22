import React from "react";
import {
  Card, Box, Typography,
  Avatar, Link, makeStyles
} from "@material-ui/core";
import clsx from "clsx";
import getInitials from "../../../utils/getInitials";
import {useDispatch, useSelector} from "react-redux";
import {nodeDetailsActions} from "../../../actions/nodeDetailsActions";

const useStyles = makeStyles(() => ({
  root: {},
}));


function SearchHitCard({searchHit}) {
  const classes = useStyles();
  const {node} = searchHit;
  const {projectId} = useSelector(state => state.projectReducer);
  const dispatch = useDispatch();
  const {depiction, prefLabel, value} = node;

  const handleClick = () => {
    dispatch(nodeDetailsActions.setNode(projectId, value));
    dispatch(nodeDetailsActions.openNodeDetailsViewDialog());
  }

  return (
    <Card
      className={clsx(classes.root)}
    >
      <Box p={3}>
        <Box
          display="flex"
          alignItems="center"
          mt={2}>
          {!depiction && <Avatar
            alt={prefLabel.value}>
            {getInitials(prefLabel.value)}
          </Avatar>}
          {depiction && <Avatar
            alt={prefLabel.value}
            src={depiction.value}
          />}
          <Box ml={2}>
            <Link
              color="textPrimary"
              variant="h5"
              onClick={handleClick}
              href="#">
              {prefLabel.value}
            </Link>
            <Typography
              variant="body2"
              color="textSecondary">
              {value}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default SearchHitCard;
