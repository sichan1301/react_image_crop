const setCanvasPreview = (image,canvas,crop) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;  //선명도를 증가시킴 대신 렌더링 시간이 약간 느려지고 다운로드/업로드할 때 이미지 크기를 다시 줄여야 함. 이미지의 실제 크기에 맞추는 것이 좋음
  const scaleX = image.naturalWidth / image.width;  //     원본크기/보여지는크기
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  //기본적으로 캔버스의 한 단위는 정확히 1픽셀이기 때문에 기본값에 배율을 곱해서 지정하는 것임.



  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  //여기까지가 crop과 canvas의 가로 세로 길이를 배율을 사용하여 만들어주는 작업임 

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,                            //이미지 
    0,                                //이미지 x좌표
    0,                                //이미지 y좌표
    image.naturalWidth,   //이미지 (x,y)로부터 그려질 넓이
    image.naturalHeight,              //이미지 (x,y)로부터 그려질 높이
    0,                                //canvas x좌표
    0,                                //canvas y좌표
    image.naturalWidth,               //canvas 위에 그려질 이미지 넓이
    image.naturalHeight               //canvas 위에 그려질 이미지 높이
  );

  ctx.restore();          //가장 최근 상태로 저장 
};
export default setCanvasPreview;
