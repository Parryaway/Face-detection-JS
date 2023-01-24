let webcam = document.querySelector(".video")

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startvideo)

function startvideo(){
    navigator.getUserMedia(
        {video: {}},
            stream => webcam.srcObject = stream,
            err=> console.error(err)
        )
}

webcam.addEventListener("play", ()=> {
    let canvas = faceapi.createCanvasFromMedia(webcam)
    document.body.append(canvas)
    let displaySize = {width: webcam.width, height: webcam.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        let detections = await faceapi.detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        let resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)},100)
    })
