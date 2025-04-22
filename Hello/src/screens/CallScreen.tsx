import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { Feather as Icon } from "@expo/vector-icons";
import socket from "../utils/socket";
import { StatusBar } from "expo-status-bar";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const CallScreen = ({ route, navigation }) => {
  const { user, callType, isVideoCall } = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  const peerConnection = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const startLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: isVideoCall,
      });
      setLocalStream(stream);
    };

    startLocalStream();
  }, []);

  useEffect(() => {
    if (!localStream) return;

    peerConnection.current = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    peerConnection.current.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          to: user.id,
          candidate: event.candidate,
        });
      }
    };

    socket.on("webrtc_offer", async ({ sdp }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("webrtc_answer", {
        to: user.id,
        sdp: peerConnection.current.localDescription,
      });
    });

    socket.on("webrtc_answer", async ({ sdp }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
    });

    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    });

    // Auto-start the call on entering screen
    (async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("webrtc_offer", {
        to: user.id,
        sdp: offer,
      });
    })();

    return () => {
      peerConnection.current?.close();
      socket.off("webrtc_offer");
      socket.off("webrtc_answer");
      socket.off("ice_candidate");
    };
  }, [localStream]);

  const initiateCall = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("webrtc_offer", {
      to: user.id,
      sdp: offer,
    });
  };

  const toggleMicrophone = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !micEnabled;
      setMicEnabled(!micEnabled);
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {callType === "video" && remoteStream && (
        <View style={styles.videoWrapper}>
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.video}
            objectFit="cover"
          />
        </View>
      )}
      {callType === "video" && localStream && (
        <View style={styles.localVideoWrapper}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.video}
            objectFit="cover"
          />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.callStatus}>In Call</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleMicrophone}
        >
          <Icon name={micEnabled ? "mic" : "mic-off"} size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <Icon name="phone" size={28} color="white" />
        </TouchableOpacity>

        {/* Speaker toggle optional - depending on platform */}
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
      <StatusBar style="auto" backgroundColor="transparent" />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // justifyContent: "center",
  },
  videoWrapper: {
    // width: "100%",
    // height: "70%",
    flex: 1,
    // borderRadius: 20,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  localVideoWrapper: {
    width: 150,
    height: 250,
    position: "absolute",
    top: 30,
    right: 10,
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 2,
  },
  infoContainer: {
    position: "absolute",
    bottom: 180,
    alignSelf: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  callStatus: {
    fontSize: 16,
    color: "#ccc",
  },
  controls: {
    position: "absolute",
    bottom: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
  },
  controlButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  endCallButton: {
    backgroundColor: "#e53935",
    padding: 15,
    borderRadius: 50,
    bottom: 20,
  },
});
