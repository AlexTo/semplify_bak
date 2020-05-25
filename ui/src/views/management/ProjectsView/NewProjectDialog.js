import React, {useEffect, useState} from "react";
import {
  Box,
  Button, Dialog,
  FormLabel, FormControlLabel,
  DialogActions,
  DialogContent,
  DialogTitle,
  RadioGroup, Radio,
  makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {projectActions} from "../../../actions";
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {projectService} from "../../../services";
import {useQuery} from "@apollo/react-hooks";
import {projectQueries} from "../../../graphql";

const useStyles = makeStyles((theme) => ({
  root: {},
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

function NewProjectDialog() {
  const classes = useStyles();
  const {newProjectDialogOpen} = useSelector(state => state.projectReducer);
  const [repositoryType, setRepositoryType] = useState("Native")
  const dispatch = useDispatch();
  const {register, handleSubmit, errors, setValue} = useForm();
  const {enqueueSnackbar} = useSnackbar();
  const {refetch} = useQuery(projectQueries.projects, {
    skip: true
  });
  useEffect(() => {
    register({name: "repositoryType"});
    setValue("repositoryType", repositoryType)
  }, [register])

  const handleClose = () => {
    dispatch(projectActions.closeNewProjectDialog())
  }

  const handleOk = (data) => {
    const {title, repositoryType, hostList, username, password} = data;
    projectService.create(title, repositoryType, hostList, username, password)
      .then(_ => {
        enqueueSnackbar("Project has been created", {
          variant: "success"
        });
        refetch().then(() => handleClose());
      })
  }

  return (
    <>
      <Dialog open={newProjectDialogOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              maxWidth="md" fullWidth>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <Box py={1}>
            <TextField
              error={Boolean(errors.title)}
              helperText={errors.title && errors.title.message}
              fullWidth label="Title" name="title"
              inputRef={register({required: "Title is required"})}
            />
          </Box>
          <Box py={1}>
            <FormLabel component="legend">Repository</FormLabel>
            <RadioGroup aria-label="repositoryType" name="repositoryType"
                        value={repositoryType}
                        onChange={(e) => {
                          setRepositoryType(e.target.value)
                          setValue("repositoryType", e.target.value)
                        }} row>
              <FormControlLabel value="Native" control={<Radio/>} label="RDF4J Native Store"/>
              <FormControlLabel value="Virtuoso" control={<Radio/>} label="OpenLink Virtuoso"/>
            </RadioGroup>
          </Box>
          {repositoryType === "Virtuoso" && <>
            <Box py={1}>
              <TextField
                error={Boolean(errors.hostList)}
                helperText={errors.hostList ? errors.hostList.message
                  : "host:port separate by comma for e.g. 192.168.1.10:1111, 192.168.1.11:1111"}
                fullWidth label="Host list" name="hostList"
                inputRef={register({required: "Host is required"})}
              />
            </Box>
            <Box py={1}>
              <TextField
                error={Boolean(errors.username)}
                helperText={errors.username && errors.username.message}
                fullWidth label="Username" name="username" autoComplete="new-password"
                inputRef={register({required: "Username is required"})}/>
            </Box>
            <Box py={1}>
              <TextField
                error={Boolean(errors.password)}
                helperText={errors.password && errors.password.message}
                fullWidth label="Password" name="password"
                type="password" autoComplete="new-password"
                inputRef={register({required: "Password is required"})}
              />
            </Box>
          </>}
        </DialogContent>
        <DialogActions>
          <Button color="secondary"
                  size="small"
                  onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleSubmit(handleOk)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewProjectDialog;
