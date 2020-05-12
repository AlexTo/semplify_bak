import React, {useEffect, useState} from "react";
import {TextField, Tooltip} from "@material-ui/core";
import {useDebounce} from "../../../hooks";

function FieldEditor({pred}) {

  const [value, setValue] = useState(pred.to.value)
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
    console.log(debouncedValue)
  }, [debouncedValue])

  return (<>
    <Tooltip title={pred.value} placement="left">
      <TextField
        fullWidth
        label={pred.prefLabel.value}
        value={value}
        onChange={e => setValue(e.target.value)}
        InputProps={{
          disableUnderline: true,
          autoComplete: 'new-password'
        }}/></Tooltip>
  </>)
}

export default FieldEditor;
