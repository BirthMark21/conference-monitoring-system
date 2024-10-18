import React, { useState, useEffect } from "react";

const useScreenRecorder = ({ options, audio = false }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [status, setStatus] = useState("permission-requested");
  const [streams, setStreams] = useState({
    audio: null,
    screen: null,
  });

  useEffect(() => {
    if (!mediaRecorder) return;
    mediaRecorder.ondataavailable = (event) => {
      const url = window.URL.createObjectURL(event.data);
      setBlobUrl(url);
      setBlob(event.data);
    };
  }, [mediaRecorder]);

  const requestMediaStream = async () => {
    try {
      let displayMedia = await navigator.mediaDevices.getDisplayMedia();
      let userMedia;

      if (audio) {
        userMedia = await navigator.mediaDevices.getUserMedia({ audio });
      }

      const tracks = [
        ...(displayMedia?.getTracks() || []),
        ...(userMedia?.getTracks() || []),
      ];
      if (tracks.length) setStatus("idle");
      const stream = new MediaStream(tracks);
      const mediaRecorder = new MediaRecorder(stream, options);
      setMediaRecorder(mediaRecorder);

      setStreams({
        audio:
          userMedia?.getTracks().find((track) => track.kind === "audio") ||
          null,
        screen:
          displayMedia.getTracks().find((track) => track.kind === "video") ||
          null,
      });

      return mediaRecorder;
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.stop();

    setStatus("stopped");

    mediaRecorder.stream.getTracks().map((track) => {
      track.stop();
    });
    setMediaRecorder(null);
  };

  const startRecording = async () => {
    let recorder = mediaRecorder;
    if (!mediaRecorder) {
      recorder = await requestMediaStream();
    }
    recorder.start();
    setStatus("recording");
  };

  const pauseRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.pause();
    setStatus("paused");
  };

  const resumeRecording = () => {
    if (!mediaRecorder) throw Error("No media stream!");
    mediaRecorder?.resume();
    setStatus("recording");
  };

  const resetRecording = () => {
    setBlobUrl(null);
    setError(null);
    setMediaRecorder(null);
    setStatus("idle");
  };

  return {
    blob,
    blobUrl,
    error,
    pauseRecording,
    resetRecording,
    resumeRecording,
    startRecording,
    status,
    stopRecording,
    streams,
  };
};

export default useScreenRecorder;
