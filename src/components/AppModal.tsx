import {Modal, ModalBody, ModalButton, ModalButtonGroup, ModalHeader} from "amazon-chime-sdk-component-library-react";
import React, {useState} from "react";

interface Props {
    inputValue: string;
    onInputValueChange: (event: React.FormEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onStartMeeting: () => Promise<void>;
    isButtonDisabled: boolean
    onSendLoginRequest: (login: string, password: string) => Promise<any>
    setIdToken: (token: string) => void
}

const AppModal:React.FC<Props> = (props) => {
    const {inputValue, onClose, onStartMeeting, onInputValueChange, isButtonDisabled, onSendLoginRequest, setIdToken} = props
    const [loginInput, setLoginInput] = useState('')
    const [passInput, setPassInput] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const onLoginInputValueChange =(event: React.FormEvent<HTMLInputElement>) => {
        setLoginInput(event.currentTarget.value)
    }
    const onPassInputValueChange =(event: React.FormEvent<HTMLInputElement>) => {
        setPassInput(event.currentTarget.value)
    }
    const onLogin = async () => {
        const {AuthenticationResult} = await onSendLoginRequest(loginInput, passInput)
        setIdToken(`Bearer ${AuthenticationResult.IdToken}`)
        setIsLoggedIn(true)
        console.log(AuthenticationResult.IdToken)
    }
    return (
        <Modal size="md" onClose={onClose} rootId="modal-root">
            <ModalHeader title="Connect to meeting" />
            <ModalBody>
                {!isLoggedIn && <div style={{display: "flex", flexDirection: 'column'}}>
                  <input
                      value={loginInput}
                      onChange={onLoginInputValueChange}
                      placeholder='login'
                  />
                  <input
                      value={passInput}
                      onChange={onPassInputValueChange}
                      placeholder='password'
                  />
                  <button onClick={onLogin}>
                    Login
                  </button>
                </div>}
                {isLoggedIn && <div>
                  <label>
                    Enter meeting Id to connect to existing meeting:
                    <input
                        value={inputValue}
                        onChange={onInputValueChange}
                        placeholder='Enter meeting ID'
                    />
                  </label>
                  <ModalButtonGroup
                      // primaryButtons={[
                      //     <ModalButton onClick={onStartMeeting} label="Start new meeting" variant="primary"/>
                      // ]}
                      primaryButtons={
                          [
                              <ModalButton
                                  onClick={onStartMeeting}
                                  label="Connect"
                                  variant="primary"
                                  disabled={isButtonDisabled}
                              />
                          ]
                      }
                  />
                </div>}
            </ModalBody>
        </Modal>
    )
}

export default AppModal
