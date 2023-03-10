import {
  VideocamOutlined,
  VideocamOffOutlined,
  MicNoneOutlined,
  MicOffOutlined,
  LogoutOutlined,
  PodcastsOutlined,
  StopCircleOutlined,
} from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import {
  selectHLSState,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectLocalPeer,
  selectIsSomeoneScreenSharing,
} from "@100mslive/react-sdk";

function Controls() {
  const hmsActions = useHMSActions();
  const hlsState = useHMSStore(selectHLSState);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const localPeer = useHMSStore(selectLocalPeer);
  const isScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);

  const startHLSStreaming = async () => {
    try {
      await hmsActions.startHLSStreaming();
    } catch (err) {
      alert(`failed to start hls ${err}`);
    }
  };

  const stopHLSStreaming = async () => {
    try {
      await hmsActions.stopHLSStreaming();
    } catch (err) {
      alert(`failed to stop hls ${err}`);
    }
  };
  const startScreenSharing = async () => {
    try {
      await hmsActions.setScreenShareEnabled(true);
    } catch (err) {
      alert(`failed to start hls ${err}`);
    }
  };

  const stopScreenSharing = async () => {
    try {
      await hmsActions.setScreenShareEnabled(false);
    } catch (err) {
      alert(`failed to stop hls ${err}`);
    }
  };

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!audioEnabled);
  };

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!videoEnabled);
  };

  const leaveRoom = async () => {
    if (localPeer.roleName === "broadcaster") {
      localStorage.removeItem("isBroadCasterLoggedIn");
      hmsActions.leave();
      await hmsActions.stopHLSStreaming();
    } else {
      console.log("heloo");
      hmsActions.leave();
    }
  };

  return (
    <div className="controls">
      {localPeer.roleName === "broadcaster" ? (
        <>
          <IconButton onClick={toggleAudio}>
            {audioEnabled ? <MicNoneOutlined /> : <MicOffOutlined />}
          </IconButton>
          <IconButton onClick={toggleVideo}>
            {videoEnabled ? <VideocamOutlined /> : <VideocamOffOutlined />}
          </IconButton>
          <Button
            variant="contained"
            disableElevation
            className="leave"
            onClick={leaveRoom}
          >
            <LogoutOutlined /> Leave Room
          </Button>
          {hlsState.running ? (
            <>
              <Button
                variant="contained"
                disableElevation
                className="leave"
                onClick={stopHLSStreaming}
              >
                <StopCircleOutlined /> Stop Streaming
              </Button>
              {isScreenSharing ? (
                <Button
                  variant="contained"
                  disableElevation
                  className="leave"
                  onClick={stopScreenSharing}
                >
                  <StopCircleOutlined /> Stop Screen Sharing
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disableElevation
                  onClick={startScreenSharing}
                >
                  <PodcastsOutlined /> Share Screen
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="contained"
              disableElevation
              onClick={startHLSStreaming}
            >
              <PodcastsOutlined /> Go Live
            </Button>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          disableElevation
          className="leave"
          onClick={leaveRoom}
        >
          <LogoutOutlined /> Leave Room
        </Button>
      )}
    </div>
  );
}

export default Controls;
