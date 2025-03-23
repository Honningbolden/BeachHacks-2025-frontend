import Camera from "@/components/camera";
import {Button} from "@/components/ui/button";

export default function CaptureView() {
    return (
        <div>
            <Camera/>
            <Button onClick={capture}>Capture</Button>
            <Button onClick={retake}>Retake</Button>
        </div>
    )
}