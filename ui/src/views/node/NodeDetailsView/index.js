import React, {useEffect, useState} from "react";
import {Avatar, Box, Container, Typography, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import {useLazyQuery} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";
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

function NodeDetailsView({location}) {
  const classes = useStyles();
  const [node, setNode] = useState(null);
  const {search} = location;
  const params = new URLSearchParams(search);
  const uri = params.get('uri');
  const projectId = params.get('projectId');

  const [load] = useLazyQuery(entityHubQueries.node, {
    onCompleted: data => {
      setNode(data.node)
    }
  });

  useEffect(() => {
    if (!uri || !projectId)
      return;
    load({
      variables: {
        projectId, uri
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, projectId])

  if (!uri || !projectId) return null;

  return (
    <Page
      className={classes.root}
      title={uri}>
      <Container maxWidth={false}>
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
                {uri}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Page>
  )
}

export default NodeDetailsView;
