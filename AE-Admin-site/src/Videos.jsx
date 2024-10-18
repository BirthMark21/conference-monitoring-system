import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/videos/');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      setUploading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideos([...videos, response.data]);
      setVideoFile(null);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video');
      setUploading(false);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/videos/${videoId}/`);
      setVideos(videos.filter(video => video.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Failed to delete video');
    }
  };

  return (
    <div className="container">
      <h2> Our Post Conference Contents</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>

      <div className="row">
        {videos.map(video => (
          <div key={video.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <video controls width="100%">
                  <source src={video.video} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <p className="card-text">Uploaded at: {new Date(video.uploaded_at).toLocaleString()}</p>
                <button className="btn btn-danger" onClick={() => handleDelete(video.id)}>
                  Delete Video
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
