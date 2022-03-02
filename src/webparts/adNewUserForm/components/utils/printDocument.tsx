// hook for printing attempt
import * as React from "react";


interface IComponentProps {
  printRef: React.RefObject<Document>;
}

const printDocument = (param: string) => {

  const docToPrint = document.getElementById(param);

  if (docToPrint) {
    const newWindow = window.open("", "Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
    if (newWindow)
    
    newWindow.document.body.appendChild(docToPrint);
  }
};

export default printDocument;