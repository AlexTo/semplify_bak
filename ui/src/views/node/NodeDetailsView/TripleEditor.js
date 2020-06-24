import React, {useState} from "react";
import {Box, makeStyles, Input, FormControl, InputLabel, Select, MenuItem, IconButton} from "@material-ui/core";
import {dataTypes} from "../../../utils/dataTypes";
import {langs} from "../../../utils/langs";
import {Save as SaveIcon} from "@material-ui/icons";
import {useMutation} from "@apollo/react-hooks";
import {entityHubQueries} from "../../../graphql";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  input: {
    minWidth: 240,
  }
}))

function TripleEditor({triple, onSave}) {
  const classes = useStyles();
  const [deleteTriple] = useMutation(entityHubQueries.deleteTriple)
  const [insertTriple] = useMutation(entityHubQueries.insertTriple)

  const {subj, pred, obj} = triple;
  let {projectId, graph, value, dataType, lang, __typename} = obj;

  dataType = dataType ? dataType
    .replace("http://www.w3.org/2001/XMLSchema#", "xsd:")
    .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:") : dataType;

  lang = lang ? lang.toLowerCase() : lang;

  const [val, setVal] = useState(value);

  const [dt, setDt] = useState(dataTypes.includes(dataType) ? dataType : "");
  const [language, setLanguage] = useState(langs.includes(lang) ? lang : "");

  const handleSave = () => {
    insertTriple({
      variables: {
        projectId: projectId,
        graph: graph,
        subj: subj.value,
        pred: pred.value,
        objType: "literal",
        objValue: val,
        lang: language ? language : null,
        dataType: dt ? dt.replace("xsd:", )
          .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:") : null
      }
    }).then(() => {
      deleteTriple({
          variables: {
            projectId: projectId,
            graph: graph,
            subj: subj.value,
            pred: pred.value,
            objType: "literal",
            objValue: value,
            lang: lang,
            dataType: dataType
          }
        }
      ).then(() => {
        onSave()
      })
    })
  }

  return (
    <Box>
      <Box
        position="relative"
        display="flex"
        alignItems="top">
        <FormControl className={classes.formControl}>
          <InputLabel>Value</InputLabel>
          <Input className={classes.input}
                 disableUnderline
                 multiline
                 onChange={(e) => setVal(e.target.value)}
                 value={val}/>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Data Type</InputLabel>
          <Select disableUnderline value={dt} onChange={(e) => setDt(e.target.value)}>
            <MenuItem value="">
              None
            </MenuItem>
            {dataTypes.map(d => <MenuItem key={d} value={d}>
              {d}
            </MenuItem>)}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Lang</InputLabel>
          <Select disableUnderline
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}>
            <MenuItem value="">
              None
            </MenuItem>
            {langs.map(d => <MenuItem key={d} value={d}>
              {d}
            </MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box
        position="relative"
        display="flex"
        alignItems="center">
        <Box flexGrow={1}/>
        <Box>
          <IconButton
            color="primary"
            onClick={handleSave} size="small">
            <SaveIcon fontSize="small"/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default TripleEditor;
