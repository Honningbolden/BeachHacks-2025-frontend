"use client"
import Camera from "@/components/camera";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";

export default function CaptureView() {
    const camRef = useRef(null)
    const [captured, setCaptured] = useState(false)
    const [responseText, setResponseText] = useState("")
    const [src, setSrc] = useState("")

    const handleBackendCall = () => {
        if (src) {
            const base64data = src.split(',')[1]

            fetch('/api', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({image: base64data})
            })
                .then((response) => response.json())
                .then((data) => {
                    setResponseText(data.message || JSON.stringify(data))
                })
                .catch((error) => console.error('Error:', error));
        }
    }

    const handleCapture = () => {
        if (camRef.current) {
            const capturedSrc = camRef.current.capture()
            if (capturedSrc) {
                setSrc(capturedSrc)
                setCaptured(true)
            }
        }
    }

    const handleRetake = () => {
        if (camRef.current) {
            camRef.current.retake()
            setCaptured(false)
        }
    }

    return (
        <div>
            <Camera ref={camRef}/>
            <div className={"flex justify-center w-full mt-4 h-screen"}>
                {captured ? (
                    <>
                        <Button onClick={handleBackendCall} variant={"default"}>Upload</Button>
                        <Button onClick={handleRetake} variant={"outline"}>Retake</Button>
                    </>
                ) : (
                    <Button onClick={handleCapture} variant={"default"}>Capture</Button>
                )}
            </div>
            {responseText && <p>{responseText}</p>}
        </div>
    )
}