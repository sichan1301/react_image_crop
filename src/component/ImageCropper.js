import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../utils/setCanvasPreview";
import 'react-image-crop/dist/ReactCrop.css'

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ updateImg }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef();

  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();


  /**
   * @function onSelectFile
   * @description 사용자가 직접 파일을 선택하여 파일값을 url형태로 state에 저장하는 함수
   */
  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();  // input type="file" or Blob객체를 편리하게 처리하게 도와줌. 객체를 읽고 result 속성에 저장 (비동기로 동작함)
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);  // text, url, 버퍼, 비트 문자열로 읽을 수 있음 (file뿐 아니라 Blob도 가능)
  };


  /**
   * @function onImageLoad
   * @description makeAspectCrop을 사용하여 원하는 면을 만들고 centerCrop으로 crop을 중앙 위치 시키는 함수
   */
  const onImageLoad = (e) => { 
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100; // crop 영역 전체 너비의 몇프로인지

    const crop = makeAspectCrop(  
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
      />
      
      {imgSrc && (
        <div>
          
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            keepSelection  // true전달시 외부를 클릭해도 disabled 처리가 되지 않음 
            aspect ={ASPECT_RATIO}   //자르기 가로 세로 비율. 1로 설정하면 정사각형. undefine이면 자유너비
            minWidth={MIN_DIMENSION} // 최소 가로길이 (px)
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>

          <button
            onClick={() => {
              setCanvasPreview(
                imgRef.current, 
                previewCanvasRef.current, 
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              );
              const dataUrl = previewCanvasRef.current.toDataURL();
              updateImg(dataUrl);
            }}
          >
            Crop Image
          </button>
        </div>
      )}

      {crop && (
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
            border: "10px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default ImageCropper;
