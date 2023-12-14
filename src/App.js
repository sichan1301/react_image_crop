import { useState } from "react";
import ImageCropper from "./component/ImageCropper";

 const App = () => {
  const [imgUrl,setImgUrl] = useState("") 
  return (
    <>
      <ImageCropper updateImg={setImgUrl} />
      <img src={imgUrl}/>
    </>
  );
}


export default App