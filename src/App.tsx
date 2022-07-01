import {
  useMeetingManager,
  useLocalVideo,
  Camera,
  VideoTileGrid, Dialer, LeaveMeeting, Clock, Play, Pause, LocalVideo
} from "amazon-chime-sdk-component-library-react";
import {MeetingSessionConfiguration} from 'amazon-chime-sdk-js'
import React, {useState} from "react";
import AppControlBar from "./components/AppControlBar";
import AppModal from "./components/AppModal";
import axiosConfig from "./api/axiosConfig";
import styles from "./styles/styles";


const App = () => {
  const meetingManager = useMeetingManager()
  const { isVideoEnabled, toggleVideo } = useLocalVideo();

  const [isMeetingStarted, setIsMeetingStarted] = useState(false)
  const [idToken, setIdToken] = useState('')
  const [cameraActive, setCameraActive] = useState(false);
  const [enteredMeetingId, setEnteredMeetingId] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [meetingId, setMeetingId] = useState('')

  const [externalMeetingId, setExternalMeetingId] = useState('')

  const toggleCamera = async () => {
    console.log(isVideoEnabled)
    await toggleVideo()
    // isVideoEnabled ? meetingManager.audioVideo?.stop() : meetingManager.audioVideo?.start()
    setCameraActive(!cameraActive)
  }
  const onOpenModal = () => {
    setIsOpenModal(true)
  }

  const onCloseModal = () => {
    setEnteredMeetingId('')
    setIsButtonDisabled(true)
    setIsOpenModal(false)
  }

  const onStartMeeting = async () => {
    setExternalMeetingId(enteredMeetingId)
    const connectUrl = `/start-meeting?meetingId=${enteredMeetingId}`
    try {
      onCloseModal()
      const response = await axiosConfig.post(connectUrl, {}, {
        headers: {
          Authorization: idToken
        }
      });
      const {attendeeResponse, meetingResponse} = response.data
      console.log('attendeeResponse', attendeeResponse)
      console.log('meetingResponse', meetingResponse)
      setMeetingId(meetingResponse.Meeting.MeetingId)
      const meetingSessionConfiguration = new MeetingSessionConfiguration(meetingResponse.Meeting, attendeeResponse.Attendee)

      await meetingManager.join(meetingSessionConfiguration)

      await meetingManager.start()
      setIsMeetingStarted(true)
    } catch (e) {
      console.log(e)
    }
  }
  const onEndMeeting = async () => {
    try {
      if(!meetingId) {
        console.log("Meeting isn't started")
        return
      }
      const result = await axiosConfig.post('/end-meeting', {meetingId});
      meetingManager.audioVideo?.stop()
      console.log(result)
      setIsMeetingStarted(false)
    } catch (e) {
      console.log(e)
    }
  }

  const onInputValueChange =(event: React.FormEvent<HTMLInputElement>) => {
    setEnteredMeetingId(event.currentTarget.value)
    setIsButtonDisabled(false)
  }

  const onSendLoginRequest = async (login: string, password: string) => {
    const result = await axiosConfig.post('/login', {
      "username": login,
      "password": password
    })
    return result.data
  }
  const onStartCapturing = async () => {
    if(!externalMeetingId) {
      console.log("Meeting isn't started")
      return
    }
    const pipelineInfo = await axiosConfig.post('/start-recording', {externalMeetingId})
    console.log('pipelineInfo', pipelineInfo)
  }

  const onStartMeetingTranscription = async () => {
    if(!meetingId) {
      console.log("Meeting isn't started")
      return
    }
    const response = await axiosConfig.post('/start-meeting-transcription', {meetingId})
    console.log(response)
  }

  const onEndMeetingTranscription = async () => {
    if(!meetingId) {
      console.log("Meeting isn't started")
      return
    }
    const response = await axiosConfig.post('/stop-meeting-transcription', {meetingId})
    console.log(response)
  }

  const cameraButtonProps = {
    icon: <Camera disabled={!cameraActive} />,
    onClick: toggleCamera,
    label: 'Camera'
  };
  const startMeetingButtonProps = {
    icon: <Dialer/>,
    onClick: onOpenModal,
    label: 'Start',
  }
  const endMeetingButtonProps = {
    icon: <LeaveMeeting/>,
    onClick: onEndMeeting,
    label: 'End'
  }
  const startCapturingButtonProps = {
    icon: <Clock/>,
    onClick: onStartCapturing,
    label: 'Start capturing'
  }

  const startMeetingTranscribeButtonProps = {
    icon: <Play />,
    onClick: onStartMeetingTranscription,
    label: 'Start transcription'
  }

  const stopMeetingTranscribeButtonProps = {
    icon: <Pause />,
    onClick: onEndMeetingTranscription,
    label: 'Stop transcription'
  }

  return (
      <div>
        <div style={styles.videoGridStyles}>
          <VideoTileGrid/>
          <AppControlBar
              layout='bottom'
              buttonProps={[
                startMeetingButtonProps,
                cameraButtonProps,
                startCapturingButtonProps,
                startMeetingTranscribeButtonProps,
                stopMeetingTranscribeButtonProps,
                endMeetingButtonProps
              ]}/>
        </div>
        {
            isOpenModal &&
            <AppModal
                inputValue={enteredMeetingId}
                onInputValueChange={onInputValueChange}
                onClose={onCloseModal}
                onStartMeeting={onStartMeeting}
                isButtonDisabled={isButtonDisabled}
                onSendLoginRequest={onSendLoginRequest}
                setIdToken={setIdToken}
            />
        }
      </div>
  );
  //   const meetingManager = useMeetingManager();
  //   const { isVideoEnabled, toggleVideo } = useLocalVideo();
  //   const [title, setTitle] = useState('')
  //   const [isRecording, setIsRecording] = useState(false)
  //   const [meetingDetails, setMeetingDetails] = useState('')
  //   const [mediaPipeLine, setMediaPipeLine] = useState('')
  //   const handleChange = (event) => setTitle(event.target.value)
  //
  //   const handleJoinMeeting = async (event) => {
  //       event.preventDefault()
  //       console.log("Joining Meeting")
  //       const joinRequest = {
  //           url: API_URL + '/start-meeting',
  //           method: 'post',
  //           headers: {
  //               'Content-Type': 'applications/json',
  //           },
  //           data: {
  //               'title': title,
  //               'region': region
  //           }
  //       }
  //       console.log(joinRequest)
  //       try {
  //           const meetingInfo = await axios(joinRequest)
  //           console.log(meetingInfo)
  //           const joinInfo = {
  //               meetingInfo: meetingInfo.data.Meeting,
  //               attendeeInfo: meetingInfo.data.Attendee
  //           }
  //           setMeetingDetails(joinInfo)
  //           console.log(joinInfo)
  //
  //           await meetingManager.join(joinInfo)
  //           await meetingManager.start()
  //           console.log('Meeting started')
  //       } catch (err) {
  //           console.log(err)
  //       }
  //   }
  //
  //   const handleRecording = async (event) => {
  //       event.preventDefault()
  //
  //       console.log("Handling Record.  Current state: " + isRecording)
  //       const recordRequest = {
  //           url: API_URL + 'record',
  //           method: 'post',
  //           headers: {
  //               'Content-Type': 'applications/json',
  //           },
  //           data: {
  //               meetingId: '',
  //               setRecording: isRecording,
  //               mediaPipeLine: ''
  //           }
  //       }
  //
  //       if (isRecording) {
  //           console.log("Stopping Record")
  //           recordRequest.data.mediaPipeLine = mediaPipeLine
  //           try {
  //               await axios(recordRequest)
  //           } catch (err) {
  //               console.log(err)
  //           }
  //       } else {
  //           console.log("Starting Record")
  //           recordRequest.data.meetingId = meetingDetails.meetingInfo.MeetingId
  //           try {
  //               const recordingInfo = await axios(recordRequest)
  //               setMediaPipeLine(recordingInfo.data.MediaCapturePipeline.MediaPipelineId)
  //           } catch (err) {
  //               console.log(err)
  //           }
  //       }
  //       setIsRecording(!isRecording)
  //   }

  // return (
  //     <div>
  //         <form onSubmit={onStartMeeting}>
  //             {/*<label>*/}
  //             {/*    Meeting Title: <input type="text" value={title} onChange={handleChange} />*/}
  //             {/*</label>*/}
  //             <input type="submit" value="Submit" />
  //         </form>
  //         <div id="video" style={{width: '1000px', height: '1000px'}}>
  //             <div className = 'gridVideo'>
  //                 <VideoTileGrid
  //                     layout = 'standard'
  //                     noRemoteVideoView = 'No remote video'
  //                 />
  //             </div>
  //         </div>
  //         <button onClick={toggleVideo}>
  //             {isVideoEnabled ? 'Stop Video' : 'Start Video'}
  //         </button>
  //         <button onClick={onEndMeeting}>
  //             {isMeetingStarted ? 'End Meeting' : ''}
  //         </button>
  //     </div>
  // )
}

export default App
