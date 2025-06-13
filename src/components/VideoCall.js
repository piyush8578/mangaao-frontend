import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const VideoCall = ({ userId, remoteUserId }) => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideo.current.srcObject = stream;
      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = event => {
        remoteVideo.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: remoteUserId,
            candidate: event.candidate
          });
        }
      };
    });

    socket.emit('register', userId);

    socket.on('call-made', async data => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer-call', { to: data.socket, answer });
    });

    socket.on('call-answered', async data => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', data => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }, [userId, remoteUserId]);

  const callUser = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('call-user', { offer, to: remoteUserId, socket: socket.id });
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-center">Video Call</h2>
      <button
        onClick={callUser}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        Call Runner
      </button>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <video ref={localVideo} autoPlay muted width="300" height="200" className="rounded" />
        <video ref={remoteVideo} autoPlay width="300" height="200" className="rounded" />
      </div>
    </div>
  );
};

export default VideoCall;