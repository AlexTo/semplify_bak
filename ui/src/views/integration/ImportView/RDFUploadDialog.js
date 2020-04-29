import React, {useCallback, useEffect, useState} from "react";
import {
  Box,
  Button, Backdrop,
  CircularProgress, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, IconButton, Link, List, ListItem, ListItemIcon, ListItemText,
  makeStyles, Tooltip,
  Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {importActions} from "../../../actions";
import {useDropzone} from "react-dropzone";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import bytesToSize from "../../../utils/bytesToSize";
import {fileService} from "../../../services/fileService";
import {useQuery} from "@apollo/react-hooks";
import {fileQueries} from "../../../graphql";


const useStyles = makeStyles((theme) => ({
  root: {},
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5
  },
  image: {
    width: 130
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
}));

function RDFUploadDialog() {
  const classes = useStyles();
  const {uploadFormOpen} = useSelector(state => state.importReducer);
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const {projectId} = useSelector(state => state.projectReducer);

  const {refetch} = useQuery(fileQueries.files, {
    variables: {
      projectId
    },
    skip: true
  });

  useEffect(() => {
    if (!uploadFormOpen) {
      setFiles([]);
    }
  }, [uploadFormOpen])

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: [".rdf", ".ttl", ".gz"],
    onDrop: handleDrop
  });

  const handleClose = () => {
    dispatch(importActions.closeUploadForm());
  }

  const handleUpload = async () => {
    setUploading(true)
    let i = 0;
    while (i < files.length) {
      const file = files[i];
      await fileService.upload(projectId, file, 'rdf');
      i++
    }
    setUploading(false);
    refetch().then(() => dispatch(importActions.closeUploadForm()));
  }

  return (
    <>
      <Dialog open={uploadFormOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              maxWidth="md" fullWidth>
        <DialogTitle>Upload</DialogTitle>
        <DialogContent>
          <div
            className={clsx({
              [classes.dropZone]: true,
              [classes.dragActive]: isDragActive
            })}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div>
              <img
                alt="Select file"
                className={classes.image}
                src="/static/images/undraw_add_file2_gvbb.svg"
              />
            </div>
            <div>
              <Typography
                gutterBottom
                variant="h3"
              >
                Select files
              </Typography>
              <Box mt={2}>
                <Typography
                  color="textPrimary"
                  variant="body1"
                >
                  Drop files here or click
                  {' '}
                  <Link underline="always">browse</Link>
                  {' '}
                  thorough your machine
                </Typography>
              </Box>
            </div>
          </div>
          {files.length > 0 && (
            <>
              <PerfectScrollbar options={{suppressScrollX: true}}>
                <List className={classes.list}>
                  {files.map((file, i) => (
                    <ListItem
                      divider={i < files.length - 1}
                      key={i}
                    >
                      <ListItemIcon>
                        <FileCopyIcon/>
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        primaryTypographyProps={{variant: 'h5'}}
                        secondary={bytesToSize(file.size)}/>
                    </ListItem>
                  ))}
                </List>
              </PerfectScrollbar>
              <div className={classes.actions}>
                <Button
                  onClick={handleRemoveAll}
                  size="small"
                >
                  Remove all
                </Button>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary"
                  size="small"
                  onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary"
                  variant="contained"
                  size="small" disabled={files.length === 0}
                  onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={uploading}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    </>
  )
}

export default RDFUploadDialog;
