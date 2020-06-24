import React from "react";
import {Link, Tooltip} from "@material-ui/core";
import {nodeDetailsActions} from "../../../actions/nodeDetailsActions";
import {useDispatch} from "react-redux";

function Value({obj}) {

  const dispatch = useDispatch();

  let {lang, dataType} = obj;
  dataType = dataType ? dataType.replace("http://www.w3.org/2001/XMLSchema#", "xsd:") : dataType;

  const handleClick = () => {
    dispatch(nodeDetailsActions.setNode(obj, true));
    dispatch(nodeDetailsActions.openNodeDetailsViewDialog());
  }

  if (obj.__typename === "Literal")
    return (
      <>{obj.value}<sup>{lang ? `@${lang}` : (dataType ? `^^${dataType}` : "")}</sup></>
    )
  else if (obj.__typename === "IRI") {
    return (
      <Tooltip title={obj.value} placement="bottom-start">
        <Link
          color="textPrimary"
          onClick={handleClick}
          href="#">
          {obj.prefLabel.value}
        </Link>
      </Tooltip>
    )
  } else return null;
}

export default Value;
