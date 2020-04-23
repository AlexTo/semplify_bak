import React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Portal,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  X as XIcon,
} from 'react-feather';
import {webCrawlerActions} from "../../../actions";
import {useForm} from "react-hook-form";
import {webCrawlerService} from "../../../services/webCrawlerService";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: `calc(100% - ${theme.spacing(6)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
    width: 800,
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: theme.spacing(3),
    outline: 'none',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%'
  },
  editor: {
    flexGrow: 1,
    '& .ql-editor': {
      minHeight: 300
    }
  },
  action: {
    marginRight: theme.spacing(1)
  }
}));

function CrawlNew() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {register, handleSubmit, errors} = useForm();
  const {enqueueSnackbar} = useSnackbar();
  const {newCrawlOpen} = useSelector(state => state.webCrawlerReducer);
  const {projectId} = useSelector(state => state.projectReducer);

  const handleStart = (data) => {
    const {seedUrl, depth} = data;

    webCrawlerService
      .crawl(projectId, seedUrl, depth)
      .then(_ => {
          enqueueSnackbar("Web crawl task has been queued.", {
            variant: "success"
          });
        dispatch(webCrawlerActions.closeNewCrawl())
        }
      );
  }

  if (!newCrawlOpen) {
    return null;
  }

  return (
    <Portal>
      <Paper
        className={classes.root}
        elevation={12}
      >
        <Box
          bgcolor="background.dark"
          display="flex"
          alignItems="center"
          py={1}
          px={2}
        >
          <Typography
            variant="h5"
            color="textPrimary"
          >
            New Crawl
          </Typography>
          <Box flexGrow={1}/>
          <IconButton onClick={() => dispatch(webCrawlerActions.closeNewCrawl())}>
            <SvgIcon fontSize="small">
              <XIcon/>
            </SvgIcon>
          </IconButton>
        </Box>
        <Box p={1}>
          <TextField
            error={Boolean(errors.seedUrl)}
            helperText={errors.seedUrl && errors.seedUrl.message}
            fullWidth label="Seed URL" name="seedUrl" variant="outlined"
            inputRef={register({required: "Seed Url is required"})}/>
        </Box>
        <Box p={1}>
          <TextField
            error={Boolean(errors.depth)}
            helperText={errors.depth && errors.depth.message}
            fullWidth
            label="Depth" name="depth" variant="outlined" type="number" defaultValue={1}
            inputRef={register({
              min: {
                value: 1,
                message: "Depth must be greater than 1"
              }
            })}/>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          p={2}>
          <Button
            color="secondary"
            variant="contained"
            className={classes.action}
            onClick={handleSubmit(handleStart)}>
            Start
          </Button>
        </Box>
      </Paper>
    </Portal>
  );
}

export default CrawlNew;
