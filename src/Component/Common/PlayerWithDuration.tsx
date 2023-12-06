import ReactPlayer from "react-player";
import { useEffect, useRef } from "react";
import { Api } from "../../API/api";

const PlayerWithDuration = (props: any) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = () => {
        Api.Sign({ pId: props.pId, data: { content_id: props.cId } });
    };
    const handleStart = ()=>{
        intervalRef.current = setInterval(startRecording,30000);
    }
    const handlePlay = () => {
        intervalRef.current = setInterval(startRecording, 30000);
    };

    const handlePause = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        const cleanup = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        window.addEventListener("beforeunload", cleanup);

        return () => {
            window.removeEventListener("beforeunload", cleanup);
            cleanup();
        };
    }, []);

    return (
        <ReactPlayer
            className="react-player"
            url={props.url}
            controls
            width="100%"
            height="600vh"
            // onStart={handleStart}
            onPause={handlePause}
            onPlay={handlePlay}
        />
    );
};

export default PlayerWithDuration;