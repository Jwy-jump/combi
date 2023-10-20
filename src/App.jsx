import faceLandmarker from "./faceLandmarker";
import poseLandmarker from "./poseLandmarker";
import handLandmarker from "./handLandmarker";
import { FaceLandmarker, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, { useState } from "react";
import Webcam from "react-webcam";

const imageBlendShapes = document.getElementById("image-blend-shapes");

// TODO: problem with html tags on return
const canvas = document.createElement("canvas");
const displayTime = document.createElement("p");
canvas.id = "render";
displayTime.id = "time";
document.body.append(canvas, displayTime);
const ctx = canvas.getContext("2d");

let lastVideoTime = -1;
let results = undefined;
let animation, image;

function App() {
  const [isDetecting, setIsDetecting] = useState(0);
  const [nameModel, setNameModel] = useState("Face");

  const handleclick = () => {
    setIsDetecting(1);
    image = document.getElementById("image");
    image.classList.remove("hidden");
    canvas.setAttribute("class", "canvas");
    canvas.style.left = image.offsetLeft + "px";
    canvas.style.top = image.offsetTop + "px";
    canvas.setAttribute("width", image.videoWidth + "px");
    canvas.setAttribute("height", image.videoHeight + "px");
    canvas.classList.remove("hidden");

    if (nameModel === "Pose") {
      poseDetect();
    } else if (nameModel === "Face") {
      faceDetect();
    } else {
      handDetect();
    }
  };

  const faceDetect = () => {
    // Detect
    let startTimeMs = performance.now();

    // For debug
    displayTime.innerHTML = `
    startTimeMs: ${startTimeMs.toFixed()},
    currentTime: ${image.currentTime.toFixed()};
    lastVideoTime: ${lastVideoTime.toFixed()};
    `;

    if (lastVideoTime !== image.currentTime) {
      results = faceLandmarker.detectForVideo(image, startTimeMs);
      lastVideoTime = image.currentTime;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks on canvas

    const drawingUtils = new DrawingUtils(ctx);

    for (const landmarks of results.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: "#C0C0C070", lineWidth: 1 }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        { color: "#FF3030" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        { color: "#FF3030" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        { color: "#30FF30" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
        { color: "#30FF30" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
        { color: "#E0E0E0" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LIPS,
        {
          color: "#E0E0E0",
        }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
        { color: "#FF3030" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
        { color: "#30FF30" }
      );
    }
    drawBlendShapes(imageBlendShapes, results.faceBlendshapes);

    
    animation = window.requestAnimationFrame(faceDetect);
  };

  const stopDetection = () => {
    cancelAnimationFrame(animation);
    setIsDetecting(0);
    image.classList.add("hidden");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add("hidden");
  };

  const poseDetect = () => {
    const poseLandmarkerResult = poseLandmarker.detect(image);
    console.log(poseLandmarkerResult);
  };

  const handDetect = () => {
    const handLandmarkerResult = handLandmarker.detect(image);
    console.log(handLandmarkerResult);
  };

  const handleNameModelChange = (event) => {
    setNameModel(event.target.value);
  };

  function drawBlendShapes(el, blendShapes) {
    el = document.getElementById("el");
    if (!blendShapes.length) {
      return;
    }

    let htmlMaker = "";
    blendShapes[0].categories.map((shape) => {
      htmlMaker += `
              <li class="blend-shapes-item">
                <span class="blend-shapes-label">${
                  shape.displayName || shape.categoryName
                }</span>
                <span class="blend-shapes-value" style="width: calc(${
                  +shape.score * 100
                }% - 120px)">${(+shape.score).toFixed(4)}</span>
              </li>
            `;
    });

    el.innerHTML = htmlMaker;
  }

  return (
    <div className="App">
      <div>
        <label>Model :</label>
        <select onChange={handleNameModelChange} value={nameModel}>
          <option value={"Pose"}>Pose</option>
          <option value={"Face"}>Face</option>
          <option value={"Hand"}>Hand</option>
        </select>
      </div>
      {isDetecting === 0 ? (
        <button onClick={handleclick}>Start detection</button>
      ) : (
        <button onClick={stopDetection}>Stop detection</button>
      )}

      {/* <Webcam id="image" className="hidden" /> */}
      <img id="image" src="https://files.catbox.moe/fpw4qb.jpg" alt="Fixed Image" crossorigin="anonymous" className="hidden" />
      {nameModel === "Face" ? (
        <div className="blend-shapes">
          <ul className="blend-shapes-list" id="video-blend-shapes"></ul>
        </div>
      ) : (
        <span></span>
      )}
      <span id="el"></span>
    </div>
  );
}

export default App;

