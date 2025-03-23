"use client"

import Webcam from "react-webcam";
import {useCallback, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {SwitchCamera} from "lucide-react";

const Camera = ({handleCapture, handleRetake}) => {
    const camRef = useRef(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [facingMode, setFacingMode] = useState("environment");

    const capture = useCallback(() => {
        if (camRef.current) {
            const src = camRef.current.getScreenshot()
            setImgSrc(src)
        }
    }, [camRef])

    const retake = useCallback(() => {
        setImgSrc(null)
    }, [camRef])

    const mirror = useCallback(() => {
        setFacingMode(prev => prev == "environment" ? "user" : "environment")
    }, [facingMode])

    return (
        <div className={"container"}>
            {imgSrc ?
                (
                    <img src={imgSrc}/>
                )
                :
                (
                    <div className={"relative"}>
                        <Webcam
                            ref={camRef}
                            height={600}
                            width={600}
                            videoConstraints={{facingMode: facingMode}}
                            mirrored={facingMode == "user"}
                            screenshotFormat={"image/jpeg"}
                        />
                        <Button className={"absolute bottom-4 right-4"} variant={"secondary"} size={"icon"}
                        onClick={mirror}>
                            <SwitchCamera/>
                        </Button>
                    </div>
                )
            }
            <Button onClick={capture}>Capture</Button>
            <Button onClick={retake}>Retake</Button>
        </div>
    )
}

export default Camera