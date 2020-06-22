import React from "react";

function Value({obj}) {
  let {lang, dataType} = obj;
  dataType = dataType ? dataType.replace("http://www.w3.org/2001/XMLSchema#", "xsd:") : dataType;

  return (
    <>{obj.value}<sup>{lang ? `@${lang}` : (dataType ? `^^${dataType}` : "")}</sup></>
  )
}

export default Value;
