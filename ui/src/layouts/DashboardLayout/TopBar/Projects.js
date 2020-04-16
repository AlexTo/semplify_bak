import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Menu,
  MenuItem,
  SvgIcon,
  makeStyles, Typography
} from '@material-ui/core';
import {projectQueries} from "../../../graphql";
import {useQuery} from "@apollo/react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {projectActions} from "../../../actions/projectActions";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    textTransform: "none"
  },
  menu: {}
}));

function Projects() {
  const classes = useStyles();
  const actionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const projectReducer = useSelector(state => state.projectReducer);
  const {projectTitle} = projectReducer;
  const {data} = useQuery(projectQueries.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      setProjects([])
    } else {
      setProjects(data.projects)
    }
  }, [data])

  const handleSelect = (projectId, projectTitle) => {
    dispatch(projectActions.activate(projectId, projectTitle))
    setMenuOpen(false);
  }

  return (
    <>
      <Button
        className={classes.button}
        variant="outlined"
        color="inherit"
        ref={actionRef}
        onClick={() => setMenuOpen(true)}
      >
        {projectTitle ? projectTitle : "Select project"}
      </Button>
      <Menu
        anchorEl={actionRef.current}
        onClose={() => setMenuOpen(false)}
        open={isMenuOpen}
        PaperProps={{className: classes.menu}}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {projects.map((p) => (
          <MenuItem
            key={p.id}
            onClick={() => handleSelect(p.id, p.title)}>
            {p.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Projects;
