import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
} from "react-native";
import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import { Feather as Icon } from "@expo/vector-icons";
import socket, { endCall } from "../utils/socket";
import { StatusBar } from "expo-status-bar";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

const CallScreen = ({ route, navigation }) => {
  const { user, callType, isVideoCall, isIncoming = false } = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState(
    isIncoming ? "Connecting..." : "Calling..."
  );
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  const peerConnection = useRef(null);
  const callTimeout = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const isInitiator = useRef(!isIncoming);
  const isMounted = useRef(true);

  // Request permissions
  useEffect(() => {
    const getPermissions = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          (isVideoCall &&
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] !==
              PermissionsAndroid.RESULTS.GRANTED)
        ) {
          Alert.alert(
            "Permissions required",
            "Audio and camera permissions are needed for calls."
          );
          navigation.goBack();
        }
      }
    };

    getPermissions();

    // Set call timeout (30 seconds)
    if (!isIncoming) {
      callTimeout.current = setTimeout(() => {
        if (!connectionEstablished && isMounted.current) {
          Alert.alert("Call Failed", "No answer");
          handleEndCall();
        }
      }, 30000);
    }

    return () => {
      isMounted.current = false;
      if (callTimeout.current) clearTimeout(callTimeout.current);
    };
  }, []);

  // Get media stream
  useEffect(() => {
    const startLocalStream = async () => {
      try {
        console.log(`Starting local stream, isVideoCall: ${isVideoCall}`);
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: isVideoCall
            ? {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : false,
        });
        console.log("Local stream obtained:", stream.id);
        console.log(
          `Audio tracks: ${stream.getAudioTracks().length}, Video tracks: ${
            stream.getVideoTracks().length
          }`
        );

        if (isMounted.current) {
          setLocalStream(stream);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (isMounted.current) {
          Alert.alert("Media Error", "Could not access camera or microphone");
          navigation.goBack();
        }
      }
    };

    startLocalStream();
  }, []);

  // Process queued ICE candidates
  const processIceCandidates = async () => {
    if (
      peerConnection.current?.remoteDescription &&
      iceCandidatesQueue.current.length > 0
    ) {
      console.log(
        `Processing ${iceCandidatesQueue.current.length} queued ICE candidates`
      );

      try {
        for (const candidate of iceCandidatesQueue.current) {
          console.log(
            `Adding ICE candidate from queue: ${
              candidate.candidate
                ? candidate.candidate.substring(0, 50) + "..."
                : "null"
            }`
          );
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
        iceCandidatesQueue.current = [];
      } catch (err) {
        console.error("Error processing ICE candidates:", err);
      }
    }
  };

  // Set up WebRTC
  useEffect(() => {
    if (!localStream) return;

    const setupPeerConnection = async () => {
      console.log("Setting up peer connection");

      // Create RTCPeerConnection
      peerConnection.current = new RTCPeerConnection(configuration);

      console.log("Adding local stream tracks to connection");
      // Add local tracks to connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log("Received remote track", event.track.kind);
        if (event.streams && event.streams[0]) {
          console.log("Got remote stream!");
          if (isMounted.current) {
            setRemoteStream(event.streams[0]);
            setConnectionEstablished(true);
            setCallStatus("Connected");
            if (callTimeout.current) {
              clearTimeout(callTimeout.current);
              callTimeout.current = null;
            }
          }
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            `Sending ICE candidate: ${event.candidate.candidate.substring(
              0,
              50
            )}...`
          );
          socket.emit("ice_candidate", {
            to: user.id,
            candidate: event.candidate,
          });
        } else {
          console.log("ICE gathering complete");
        }
      };

      peerConnection.current.onicegatheringstatechange = () => {
        console.log(
          "ICE gathering state:",
          peerConnection.current.iceGatheringState
        );
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        if (peerConnection.current) {
          console.log(
            "ICE connection state:",
            peerConnection.current.iceConnectionState
          );

          if (isMounted.current && peerConnection.current) {
            if (
              peerConnection.current.iceConnectionState === "connected" ||
              peerConnection.current.iceConnectionState === "completed"
            ) {
              setConnectionEstablished(true);
              setCallStatus("Connected");
            } else if (
              peerConnection.current.iceConnectionState === "disconnected" ||
              peerConnection.current.iceConnectionState === "failed" ||
              peerConnection.current.iceConnectionState === "closed"
            ) {
              setCallStatus("Connection lost");
              // Consider auto-ending the call after a few seconds if connection is lost
            }
          }
        }
      };

      peerConnection.current.onsignalingstatechange = () => {
        console.log("Signaling state:", peerConnection.current.signalingState);
      };

      // Start signaling if we're the caller, wait for offer if we're the callee
      if (isInitiator.current) {
        console.log("We are the initiator, creating offer");
        initiateOffer();
      } else {
        console.log("We are the receiver, waiting for offer");
      }
    };

    setupPeerConnection();

    // Socket event listeners
    console.log("Setting up socket event listeners");

    // If we're accepting the call, after setting up WebRTC but before handling the offer
    if (isIncoming) {
      console.log("Sending call accepted signal");
      socket.emit("accept_call", { to: user.id });
    }

    const handleWebRTCOffer = async ({ sdp, from }) => {
      console.log("Received offer from:", from);
      if (!peerConnection.current) {
        console.error("No peer connection when receiving offer");
        return;
      }

      try {
        console.log("Setting remote description (offer)");
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );

        // If we're the callee (receiving the call), create an answer
        if (!isInitiator.current) {
          console.log("Creating answer");
          const answer = await peerConnection.current.createAnswer();

          console.log("Setting local description (answer)");
          await peerConnection.current.setLocalDescription(answer);

          console.log("Sending answer");
          socket.emit("webrtc_answer", {
            to: user.id,
            sdp: peerConnection.current.localDescription,
          });
        }

        // Process any queued ICE candidates now that we have the remote description
        await processIceCandidates();
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleWebRTCAnswer = async ({ sdp, from }) => {
      console.log("Received answer from:", from);
      if (!peerConnection.current) {
        console.error("No peer connection when receiving answer");
        return;
      }

      try {
        console.log("Setting remote description (answer)");
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );

        // Process any queued ICE candidates now that we have the remote description
        await processIceCandidates();
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleICECandidate = async ({ candidate, from }) => {
      console.log(
        `Received ICE candidate from ${from}: ${
          candidate.candidate
            ? candidate.candidate.substring(0, 50) + "..."
            : "null"
        }`
      );

      if (!peerConnection.current) {
        console.error("No peer connection when receiving ICE candidate");
        return;
      }

      try {
        // If we already have a remote description, add the candidate immediately
        if (peerConnection.current.remoteDescription) {
          console.log("Adding ICE candidate directly");
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          // Otherwise queue the candidate for later
          console.log("Queueing ICE candidate");
          iceCandidatesQueue.current.push(candidate);
        }
      } catch (err) {
        console.error("Error handling ICE candidate:", err);
      }
    };

    const handleCallEnded = () => {
      console.log("Call ended by remote peer");
      if (isMounted.current) {
        Alert.alert("Call Ended", "The other person ended the call");
        cleanupAndGoBack();
      }
    };

    const handleCallRejected = () => {
      console.log("Call rejected by remote peer");
      if (isMounted.current) {
        Alert.alert("Call Rejected", "The call was rejected");
        cleanupAndGoBack();
      }
    };

    socket.on("webrtc_offer", handleWebRTCOffer);
    socket.on("webrtc_answer", handleWebRTCAnswer);
    socket.on("ice_candidate", handleICECandidate);
    socket.on("call_ended", handleCallEnded);
    socket.on("call_rejected", handleCallRejected);
    socket.on("call_accepted", () => {
      console.log("Call accepted");
      setCallStatus("Connecting...");
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up WebRTC and socket listeners");

      socket.off("webrtc_offer", handleWebRTCOffer);
      socket.off("webrtc_answer", handleWebRTCAnswer);
      socket.off("ice_candidate", handleICECandidate);
      socket.off("call_ended", handleCallEnded);
      socket.off("call_rejected", handleCallRejected);
      socket.off("call_accepted");

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          console.log(`Stopping ${track.kind} track`);
          track.stop();
        });
      }

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [localStream]);

  const initiateOffer = async () => {
    try {
      if (!peerConnection.current) {
        console.error("No peer connection when creating offer");
        return;
      }

      console.log("Creating offer");
      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideoCall,
      });

      console.log("Setting local description (offer)");
      await peerConnection.current.setLocalDescription(offer);

      console.log("Sending offer");
      socket.emit("webrtc_offer", {
        to: user.id,
        sdp: peerConnection.current.localDescription,
      });
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const toggleMicrophone = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !micEnabled;
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCamera = () => {
    if (!isVideoCall) return;

    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !cameraEnabled;
      setCameraEnabled(!cameraEnabled);
    }
  };

  const handleEndCall = () => {
    if (isMounted.current) {
      console.log("Ending call");
      endCall(user.id);
      cleanupAndGoBack();
    }
  };

  const cleanupAndGoBack = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        console.log(`Stopping ${track.kind} track`);
        track.stop();
      });
    }

    setLocalStream(null);
    setRemoteStream(null);

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Navigate back
    if (isMounted.current) {
      navigation.goBack();
    }
  };

  // Add this function to your CallScreen component - it's critical for call connection
  const answerCall = async () => {
    try {
      if (!peerConnection.current) {
        console.error("No peer connection when creating answer");
        return;
      }

      console.log("Creating answer");
      const answer = await peerConnection.current.createAnswer();

      console.log("Setting local description (answer)");
      await peerConnection.current.setLocalDescription(answer);

      console.log("Sending answer");
      socket.emit("webrtc_answer", {
        to: user.id,
        sdp: peerConnection.current.localDescription,
      });
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };

  return (
    <View style={styles.container}>
      {isVideoCall && remoteStream ? (
        <View style={styles.videoWrapper}>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.video}
            objectFit="cover"
            zOrder={0}
          />
        </View>
      ) : (
        <View style={styles.noVideoFallback}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0) || "?"}
              </Text>
            </View>
          )}
        </View>
      )}

      {isVideoCall && localStream && (
        <View style={styles.localVideoWrapper}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            zOrder={1}
            mirror={true}
          />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.callStatus}>{callStatus}</Text>
        <Text style={styles.callTypeInfo}>
          {isVideoCall ? "Video Call" : "Audio Call"}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleMicrophone}
        >
          <Icon name={micEnabled ? "mic" : "mic-off"} size={24} color="white" />
        </TouchableOpacity>

        {isVideoCall && (
          <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
            <Icon
              name={cameraEnabled ? "video" : "video-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Icon name="phone-off" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setSpeakerEnabled(!speakerEnabled)}
        >
          <Icon
            name={speakerEnabled ? "volume-2" : "volume-x"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  videoWrapper: {
    flex: 1,
  },
  noVideoFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "white",
  },
  avatarText: {
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
  },
  video: {
    flex: 1,
  },
  localVideoWrapper: {
    position: "absolute",
    top: 80,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
    zIndex: 2,
  },
  localVideo: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  callStatus: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  callTypeInfo: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(80, 80, 80, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CallScreen;
