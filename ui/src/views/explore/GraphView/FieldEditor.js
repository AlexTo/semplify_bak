import React, {useEffect, useState} from "react";
import {TextField, Tooltip} from "@material-ui/core";
import {useDebounce} from "../../../hooks";

function FieldEditor({triple}) {

  const [value, setValue] = useState(triple.obj.value)
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
  }, [debouncedValue])

  return (<>
    <Tooltip title={triple.pred.value} placement="left">
      <TextField
        fullWidth
        label={triple.pred.prefLabel.value}
        value={value}
        onChange={e => setValue(e.target.value)}
        InputProps={{
          disableUnderline: true,
          autoComplete: 'new-password'
        }}/></Tooltip>
  </>)
}

export default FieldEditor;
