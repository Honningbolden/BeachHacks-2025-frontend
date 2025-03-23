"use client"

import Webcam from "react-webcam";
import {forwardRef, useCallback, useImperativeHandle, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {SwitchCamera} from "lucide-react";

const Camera = forwardRef((props, ref) => {
    const webcamRef = useRef(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [facingMode, setFacingMode] = useState("environment");

    useImperativeHandle(ref, () => ({
        capture: () => {
            if (webcamRef.current) {
                const src = webcamRef.current.getScreenshot()
                setImgSrc(src)
                return src
            }
        },
        retake: () => {
            setImgSrc(null)
        },
        imgSrc
    }), [imgSrc]);

    const switchCamera = useCallback(() => {
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
                            ref={webcamRef}
                            videoConstraints={{
                                facingMode: facingMode,
                                width: {ideal: 1920},
                                height: {ideal: 1080},
                            }}
                            mirrored={facingMode == "user"}
                            screenshotFormat={"image/jpeg"}
                            screenshotQuality={1}
                            minScreenshotWidth={1920}
                            style={{
                                width: "100%",
                                height: "auto"
                            }}
                        />
                        <Button
                            className={"absolute bottom-4 right-4"}
                            variant={"secondary"}
                            size={"icon"}
                            onClick={switchCamera}
                        >
                            <SwitchCamera/>
                        </Button>
                    </div>
                )
            }
        </div>
    )
});

Camera.displayName = "Camera";
export default Camera