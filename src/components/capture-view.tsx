"use client"
import Camera from "@/components/camera";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function CaptureView() {
    const camRef = useRef(null)
    const [captured, setCaptured] = useState(false)
    const [responseText, setResponseText] = useState("")
    const [src, setSrc] = useState("")
    const [csvFile, setCsvFile] = useState(null);

    const handleCsvUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleBackendCall = () => {
        if (!src) return;
        const imageBase64 = src.split(",")[1];

        // If no CSV is chosen, just send the image
        if (!csvFile) {
            if (!csvFile) {
                fetch("/api", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({image: imageBase64})
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            console.error(data.error);
                            setResponseText(data.error);
                        } else {
                            setResponseText(data.message || JSON.stringify(data));
                            if (data.updatedCsv) {
                                downloadCsv(data.updatedCsv);
                            }
                        }
                    })
                    .catch((error) => console.error("Error:", error));
                return;
            }
        }

        // 2) If CSV is chosen, read it as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvBase64 = e.target.result.split(",")[1];

            // Post both image & CSV
            fetch("/api", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({image: imageBase64, csv: csvBase64})
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        console.error(data.error);
                        setResponseText(data.error);
                    } else {
                        setResponseText(data.message || JSON.stringify(data));
                        if (data.updatedCsv) {
                            downloadCsv(data.updatedCsv);
                        }
                    }
                })
                .catch((error) => console.error("Error:", error));
        };
        reader.readAsDataURL(csvFile);
    };

    const downloadCsv = (csvBase64) => {
        const blob = b64toBlob(csvBase64, "text/csv");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "updated_receipt.csv";
        link.click();
    };

    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {type: contentType});
    };

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
        <div className={"h-svh flex flex-col items-center p-4 bg-background"}>
            <div className={"w-full max-w-md h-auto flex flex-col justify-center"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Capture & Upload</CardTitle>
                        <CardDescription>
                            Capture a receipt, optinally upload your CSV budget, and then send them to the server.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={"flex-grow overflow-hidden flex flex-col items-center justify-center"}>
                        <div className={"w-full h-auto mb-4"}>
                            <Camera ref={camRef}/>
                        </div>

                        <div className={"grid w-full max-w-sm items-center gap-1.5"}>
                            <Label htmlFor={"csvFile"}>Picture</Label>
                            <Input id={"csvFile"} type="file" accept=".csv" onChange={handleCsvUpload}/>
                        </div>
                    </CardContent>

                    <CardFooter className={"flex justify-between"}>
                        {captured ? (
                            <>
                                <Button onClick={handleBackendCall} variant={"default"}>Upload</Button>
                                <Button onClick={handleRetake} variant={"outline"}>Retake</Button>
                            </>
                        ) : (
                            <Button onClick={handleCapture} variant={"default"}>Capture</Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}