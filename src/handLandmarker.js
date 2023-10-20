import {
    ObjectDetector,
    FilesetResolver
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
  import vision from "./vision";


  const handLandmarker = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      // modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      modelAssetPath: `https://files.catbox.moe/8fu7x8.tflite`, // new8
      delegate: "GPU"
    },
    runningMode: "IMAGE",
    scoreThreshold: 0.1,
  });
  export default handLandmarker;